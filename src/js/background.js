import '../img/icon-128.png'
import '../img/icon-34.png'

import * as neon from 'neon-js'

// var address='AJXixUHZZsSZTrrP7ZpRqKbY2HzRawf8cB'
var network = 'MainNet'
var loggedIn = false

console.log("in background")

// chrome.browserAction.onClicked.addListener(function() {
  // Fired when a browser action icon is clicked. This event will not fire if the browser action has a popup.
//   console.log('browser action!')
//
// });

chrome.runtime.onInstalled.addListener(function () {
  console.log('installed!')
});


// main action message handler

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    switch(request.msg)
    {
      case "getState":
        sendResponse({'loggedIn': loggedIn})
        break;
      case "createWallet":
        break;
      case "exportWallet":
        break;
      case "loginWif":
        loginWif((e, account, loggedIn) => {
          sendResponse({'account': account, 'error': e, 'loggedIn': loggedIn})
        }, request.encryptedWif, request.passphrase)
        break;
      case "send":
        break;
      case "claim":
        break;
      case "getBalance":
        getBalance((e, res, address) => {
          sendResponse({'bals': res, 'address': address, 'error': e})
        }, request.args)
        break;
      case "getTransactionHistory":
        getTransactionHistory((e, txs) => {
          sendResponse({'msg': txs, 'error': e})
        }, request.args)
        break;
    }
    return true;
});



function getTransactionHistory (callback, address) {
  neon.getTransactionHistory(network, address)
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
  neon.getBalance(network, address)
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
      loggedIn = true
      // returns { privateKey, publicKeyEncoded, publicKeyHash, programHash, address }
      var account = neon.getAccountFromWIFKey(wif)
      callback(null, account, loggedIn)
    }).catch((e) => {
      console.log(e)
      callback(e)
      throw e
    })
  // neon.getBalance(network, address)
  //   .then((response) => {
  //     console.log(address +"\nNEO Balance: " + response.NEO.balance + "\nGas Balance: " + response.GAS.balance);
  //     callback(null, response, address)
  //   }).catch((e) => {
  //     console.log(e)
  //     callback(e, null)
  //     throw e
  //   })
  }
