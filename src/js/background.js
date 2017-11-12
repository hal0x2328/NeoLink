import '../img/icon-128.png'
import '../img/icon-34.png'

import * as neon from 'neon-js'
import util from "util"


// var address='AJXixUHZZsSZTrrP7ZpRqKbY2HzRawf8cB'

var state = {
  loggedIn: false,
  modalContentCache: "",
  network: 'TestNet',
  wif: null,
  useLoginAddress: false,
  address: null,
  curNavLocation: 'Home'
}

const ASSETS = {
  NEO: 'NEO',
  GAS: 'GAS'
}

const ASSETS_LABELS = {
  [ASSETS.NEO]: 'Neo',
  [ASSETS.GAS]: 'Gas'
}

console.log("in background")

// chrome.browserAction.onClicked.addListener(function() {
  // Fired when a browser action icon is clicked. This event will not fire if the browser action has a popup.
//   console.log('browser action!')
//
// });

chrome.runtime.onInstalled.addListener(function () {
  console.log('installed!')
})


// main action message handler

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension")
    console.log('logged in: '+state.loggedIn)
    console.log('bg onMessage: '+request.msg)

    switch(request.msg)
    {
      case "contentInit":
        sendResponse({'msg': 'extension is online', 'loggedIn': state.loggedIn})
      break;
      case "getState":
        // sendResponse({'loggedIn': state.loggedIn, 'modalContentCache': state.modalContentCache})
        sendResponse(state)
        break;
      case "setState":
        state.loggedIn = request.state.loggedIn
        state.modalContentCache = request.state.modalContentCache
        state.useLoginAddress = request.state.useLoginAddress
        state.curNavLocation = request.state.curNavLocation
        // console.log('state: '+state)
        console.log('bg useLoginAddress: '+state.useLoginAddress)

        break;
      case "createWallet":
        break;
      case "exportWallet":
        break;
      case "loginWif":
        loginWif((e, account, loggedIn) => {
          sendResponse({'account': account, 'error': e, 'loggedIn': state.loggedIn})
        }, request.encryptedWif, request.passphrase)
        break;
      case "logout":
        state.loggedIn = false
        state.wif = null
        state.address = null
        break;
      case "send":
        send((e, res, tx) => {
          sendResponse({'msg': res, 'error': e})
        }, request.tx)
        break;
      case "testInvoke": // NOTE: does NOT require extension is logged in
        sendInvokeContract((e, res, tx) => {
          sendResponse({'msg': res, 'error': e})
        }, request.tx)
        break;
      case "sendInvoke": // NOTE: DOES require extension is logged in
        // sendInvokeContract((e, res, tx) => {
        //   sendResponse({'msg': res, 'error': e})
        // }, request.tx)
        break;
      case "claim":
        break;
      case "getBalance":
        getBalance((e, res, address) => {
          sendResponse({'bals': res, 'address': address, 'error': e})
        }, request.address)
        break;
      case "getTransactionHistory":
        getTransactionHistory((e, txs) => {
          sendResponse({'msg': txs, 'error': e})
        }, request.args)
        break;
    }
    console.log('logged in: '+state.loggedIn)
    return true
})

function getTransactionHistory (callback, address) {
  neon.getTransactionHistory(state.network, address)
    .then((transactions) => {
      callback(null, transactions)
    })
    .catch((e) => {
      console.log('caught e:'+e)
      callback(e)
      throw e
    })
}

function getBalance (callback, address) {
  neon.getBalance(state.network, address)
    .then((response) => {
      console.log(address +"\nNEO Balance: " + response.NEO.balance + "\nGas Balance: " + response.GAS.balance);
      callback(null, response, address)
    }).catch((e) => {
      console.log(e)
      callback(e)
      throw e
    })
}

function loginWif (callback, encryptedWif, passphrase) {
  console.log('bg word: '+passphrase)
  neon.decryptWIF(encryptedWif, passphrase)
    .then((wif) => {
      console.log('bg wif: '+wif)
      state.loggedIn = true
      state.wif = wif
      // returns { privateKey, publicKeyEncoded, publicKeyHash, programHash, address }
      var account = neon.getAccountFromWIFKey(wif)
      state.address = account.address
      callback(null, account, state.loggedIn)
    }).catch((e) => {
      console.log(e)
      callback(e)
      throw e
    })
}

function send (callback, tx) {
  // const selfAddress = address
  const assetName = tx.type === ASSETS_LABELS.NEO ? ASSETS.NEO : ASSETS.GAS
  let sendAsset = {}
  sendAsset[assetName] = tx.amount
  console.log('bg send: assetName:' + assetName + ' tx.type:' + tx.type + ' amt:' + tx.amount + ' addr:' + tx.address + ' state:' + state.wif)
  // export const doSendAsset = (net, toAddress, fromWif, assetAmounts) => {
  neon.doSendAsset(state.network, tx.address, state.wif, sendAsset)
    .then((response) => {
      if (response.result === undefined || response.result === false) {
        callback(null, 'Transaction failed: '+response.result)
        console.log('bg send failed: '+ response.result)
      } else {
        callback(null, 'Transaction succeeded: '+response.result)
        console.log('bg send succeeded: '+ response.result)
      }
    }).catch((e) => {
      console.log('bg send caught exception: '+e)
      // console.log('error: '+util.inspect(e, {depth: null}))
      callback(''+e)      // throw e
      // console.log('error: '+util.inspect(e, {depth: null}))
    })
}


function String2Hex(tmp) {
    var str = '';
    for(var i = 0; i < tmp.length; i++) {
        str += tmp[i].charCodeAt(0).toString(16);
    }
    return str;
}

function testInvokeContract(callback, tx) {
  const assetType = tx.type === ASSETS_LABELS.NEO ? ASSETS.NEO : ASSETS.GAS
  console.log('test invoking contract')
  var gasCost = 0.001
  var operation = tx.operation
  var args = [{'type': 7, 'value': tx.args}]

  console.log('invoke wif: ' +state.wif)
  console.log('invoke network: ' +state.network)
  console.log('invoke scriptHash: ' +tx.scriptHash)
  console.log('invoke assetType: ' +assetType)
  console.log('invoke amount: ' +tx.amount)
  console.log('invoke operation: ' +operation)
  console.log('args: '+util.inspect(args,{depth:null}))

  neon.testInvokeContract(state.network, operation, args, tx.scriptHash)
    .then((response) => {
      callback(null, 'Transaction result: '+
        'state: ' + response.result.state +
        ' gas_consumed: ' + response.result.gas_consumed +
        ' stack: ' + util.inspect(response.result, {depth: null}))
      console.log('bg test invoke failed: '+ util.inspect(response.result, {depth: null}))
    }).catch((e) => {
      console.log('bg test invoke caught exception: '+e)
      // console.log('error: '+util.inspect(e, {depth: null}))
      callback(''+e)      // throw e
    })
}

function sendInvokeContract(callback, tx) {
  const assetType = tx.type === ASSETS_LABELS.NEO ? ASSETS.NEO : ASSETS.GAS
  console.log('invoking contract')
  var gasCost = 0.001
  var operation = tx.operation
  var args = [String2Hex(tx.args), String2Hex('1')]

  console.log('invoke wif: ' +state.wif)
  console.log('invoke network: ' +state.network)
  console.log('invoke scriptHash: ' +tx.scriptHash)
  console.log('invoke assetType: ' +assetType)
  console.log('invoke amount: ' +tx.amount)
  console.log('invoke operation: ' +operation)
  console.log('args: '+util.inspect(args,{depth:null}))

  neon.sendInvokeContract(state.network, operation, args, tx.scriptHash, state.wif, assetType, tx.amount, 0)
    .then((response) => {
      console.log('bg send invoke succeeded: '+util.inspect(response,{depth:null}))
      callback('Transaction result: '+util.inspect(response,{depth:null}))
      // callback(null, 'Transaction result: '+
      //   'state: ' + response.result.state +
      //   ' gas_consumed: ' + response.result.gas_consumed +
      //   ' stack: ' + util.inspect(response.result, {depth: null}))
      // console.log('bg invoke failed: '+ util.inspect(response.result, {depth: null}))
    }).catch((e) => {
      console.log('bg send invoke caught exception: '+e)
      // console.log('error: '+util.inspect(e, {depth: null}))
      callback(''+e)      // throw e
    })
}
