
import "../css/popup.css"
import util from "util"

import * as mainNav from "../html/mainNav.html"
import * as sendHtml from "../html/send.html"
import * as invokeContractHtml from "../html/invokeContract.html"
import * as txsHtml from "../html/transactions.html"
import * as balanceHtml from "../html/balance.html"
import * as loginHtml from "../html/login.html"
import * as loggedInHtml from "../html/loggedIn.html"
import * as createWalletHtml from "../html/createWallet.html"
import * as importWalletHtml from "../html/importWallet.html"
import * as exportWalletHtml from "../html/exportWallet.html"
import * as configHtml from "../html/config.html"

var curNavHtml = mainNav
var curNavLocation = 'Home'
var loggedIn = false
var modalContentCache = ""
var network = ""
var useLoginAddress = false
var address = null

getBackgroundState()

document.getElementById("nav").innerHTML = curNavHtml

if (network) document.getElementById("networkStatus").innerHTML = network

if(!loggedIn) {
    // document.getElementById("loginNav").innerHTML = 'Login'
    document.getElementById("content").innerHTML = loginHtml
    addLoginButtonEvent()
} else {
    // document.getElementById("loginNav").innerHTML = 'Log Out'
    document.getElementById("content").innerHTML = loggedInHtml
    document.getElementById("loginModalContent").innerHTML = modalContentCache
    addLogoutButtonEvent()
}


function getBackgroundState () {
  chrome.runtime.sendMessage({'msg': 'getState'}, function(response) {
    loggedIn = response.loggedIn
    console.log('popup loggedIn: '+loggedIn)

    modalContentCache = response.modalContentCache
    console.log('popup modalContentCache: '+modalContentCache)

    network = response.network
    console.log('popup network: '+network)
    document.getElementById("networkStatus").innerHTML = network

    useLoginAddress = response.useLoginAddress
    console.log('popup useLoginAddress: '+useLoginAddress)
    // document.getElementById("useLoginAddress").innerHTML = useLoginAddress

    address = response.address
    console.log('popup address: '+address)

    curNavLocation = response.curNavLocation
    console.log('popup curNavLocation: '+curNavLocation)

    if (curNavLocation === 'Home') {
      if(!loggedIn) {
        // document.getElementById("loginNav").innerHTML = 'Login'
        document.getElementById("content").innerHTML = loginHtml
        addLoginButtonEvent()
      } else {
        // document.getElementById("loginNav").innerHTML = 'Log Out'
        document.getElementById("content").innerHTML = loggedInHtml
        document.getElementById("loginModalContent").innerHTML = modalContentCache
        addLogoutButtonEvent()
      }
    } else if (curNavLocation === 'Config') {
      if (useLoginAddress) document.getElementById('configUseLoggedInAddress').checked = true
      else document.getElementById('configUseLoggedInAddress').checked = false
    }
    // callback()
  })
}

function setBackgroundState () {
  var state = {
    loggedIn: loggedIn,
    modalContentCache: modalContentCache,
    useLoginAddress: useLoginAddress,
    address: address,
    curNavLocation: curNavLocation
  }
  chrome.runtime.sendMessage({'msg': 'setState', 'state': state}, function(response) {
    console.log('setting state')
  })
}

function setCurNavLocation (nav) {
  curNavLocation = nav
  setBackgroundState()
}

document.getElementById('homeNav').addEventListener('click', () => {
  setCurNavLocation('Home')

  if(!loggedIn) {
    // document.getElementById("loginNav").innerHTML = 'Login'
    document.getElementById("content").innerHTML = loginHtml
    addLoginButtonEvent()
  } else {
    // document.getElementById("loginNav").innerHTML = 'Log Out'
    document.getElementById("content").innerHTML = loggedInHtml
    document.getElementById("loginModalContent").innerHTML = modalContentCache
    addLogoutButtonEvent()
  }
})


document.getElementById('sendNav').addEventListener('click', () => {
  setCurNavLocation('Send')

  if (!loggedIn) {
    document.getElementById("content").innerHTML = "<div class='content'><h3>Please login</h3></div>"
  }
  else {
    document.getElementById("content").innerHTML = sendHtml

    document.getElementById('sendButton').addEventListener('click', () => {
      var address = document.getElementById("sendAddress").value
      console.log('address:'+address)

      var amount = document.getElementById("sendAmount").value
      console.log('amount:'+amount)

      var type = document.getElementById("sendType").value
      console.log('type:'+type)

      var tx = {'address': address, 'amount': amount, 'type': type }

      chrome.runtime.sendMessage({'msg': 'send', 'tx': tx}, function(response) {
        if(response.error) {
          console.log('error: '+response.error)
          document.getElementById("modalContent").innerHTML = '<br>error: ' + response.error
        } else {
          console.log(response.msg)

          var content = response.msg
          document.getElementById('modalContent').innerHTML = content
          // document.getElementById("modalContent").innerHTML = "<ul>" + content + "</ul>"
        }
      })
    })
  }
})

document.getElementById('invokeNav').addEventListener('click', () => {
  setCurNavLocation('Invoke Contract')

  if (!loggedIn) {
    document.getElementById("content").innerHTML = "<div class='content'><h3>Please login</h3></div>"
  }
  else {
    document.getElementById("content").innerHTML = invokeContractHtml

    document.getElementById('invokeContractButton').addEventListener('click', () => {
      var operation = document.getElementById("operation").value
      console.log('operation:'+operation)

      var args = document.getElementById("args").value
      console.log('args:'+args)

      var scriptHash = document.getElementById("scriptHash").value
      console.log('scriptHash:'+scriptHash)

      var amount = document.getElementById("sendAmount").value
      console.log('amount:'+amount)

      var type = document.getElementById("assetType").value
      console.log('type:'+type)

      var tx = {'operation': operation, 'args': args, 'scriptHash': scriptHash, 'amount': amount, 'type': type }

      chrome.runtime.sendMessage({'msg': 'invoke', 'tx': tx}, function(response) {
        if(response.error) {
          console.log('error: '+response.error)
          document.getElementById("modalContent").innerHTML = '<br>error: ' + response.error
        } else {
          console.log(response.msg)

          var content = response.msg
          document.getElementById('modalContent').innerHTML = content
          // document.getElementById("modalContent").innerHTML = "<ul>" + content + "</ul>"
        }
      })
    })
  }
})

document.getElementById('txsNav').addEventListener('click', () => {
  setCurNavLocation('Transactions')

  document.getElementById("content").innerHTML = txsHtml

  getBackgroundState()

  if (useLoginAddress) document.getElementById('txsAddress').value = address

  document.getElementById('getTxsButton').addEventListener('click', () => {
    var address = document.getElementById("txsAddress").value
    console.log('add:'+address)

    chrome.runtime.sendMessage({'msg': 'getTransactionHistory', 'args': address}, function(response) {
      if(response.error) {
        console.log('error: '+util.inspect(response.error, {depth: null}))
        document.getElementById("modalContent").innerHTML = '<br>Address not found'
      } else {
        console.log(response.msg)
        var txs = response.msg
        var content = "";
        for (let i = 0; i < txs.length; i++){
          if (txs[i].neo_sent === true){
            console.log("NEO: " + txs[i].txid)
            content += "<li>NEO: "+txs[i].txid+"</li>"
          }
          if (txs[i].gas_sent === true){
            console.log("GAS: " + txs[i].txid)
            content += "<li>GAS: "+txs[i].txid+"</li>"
          }
        }
        if (!content) content = "There are no transactions for this address"
        document.getElementById("modalContent").innerHTML = "<ul>" + content + "</ul>"
      }
    })
  })
})

document.getElementById('balanceNav').addEventListener('click', () => {
  setCurNavLocation('Balance')

  document.getElementById("content").innerHTML = balanceHtml

  getBackgroundState()

  if (useLoginAddress) document.getElementById('balanceAddress').value = address

  document.getElementById('getBalanceButton').addEventListener('click', () => {
    var address = document.getElementById("balanceAddress").value
    console.log('add:'+address)

    chrome.runtime.sendMessage({'msg': 'getBalance', 'address': address}, function(response) {
      if(response.error) {
        console.log('error: '+util.inspect(response.error, {depth: null}))
        document.getElementById("modalContent").innerHTML = '<br>Address not found'
      } else {
        console.log(response)
        // document.getElementById("content").innerHTML = "<h3>" + response.msg + "</h3>";
        document.getElementById("modalContent").innerHTML = "<b>" +
    		response.address + "</b><br>NEO Balance: " + response.bals.NEO.balance +
    		"<br>GAS: " + response.bals.GAS.balance
      }
    })
  })
})

function addLogoutButtonEvent () {
  document.getElementById('logoutButton').addEventListener('click', () => {
    getBackgroundState()

    if(loggedIn) {
    //   document.getElementById("loginNav").innerHTML = 'Login'
    //   document.getElementById("content").innerHTML = loginHtml
    //   addLoginButtonEvent()
    // } else {
      chrome.runtime.sendMessage({'msg': 'logout'}, function(response) {
        console.log('logged out')
        loggedIn = false
        // document.getElementById("loginNav").innerHTML = 'Login'
        document.getElementById("content").innerHTML = loginHtml
        addLoginButtonEvent()
      })
    }
    // chrome.webNavigation.onCompleted.addListener(() => {
    // })
  })
}

function addLoginButtonEvent () {
  document.getElementById('loginButton').addEventListener('click', () => {
    var wif = document.getElementById("loginWif").value
    console.log('wif:'+wif)

    var passphrase = document.getElementById("loginWifPassphrase").value
    console.log('wif:'+passphrase)

    chrome.runtime.sendMessage({'msg': 'loginWif', 'encryptedWif': wif, 'passphrase': passphrase}, function(response) {
      if(response.error) {
        console.log('error: '+util.inspect(response.error, {depth: null}))
        // document.getElementById("modalContent").innerHTML = '<br>Address not found'
      } else {
        console.log(response)
        console.log('loggedIn:'+response.loggedIn)
        loggedIn = response.loggedIn
        // document.getElementById("loginNav").innerHTML = 'Log Out'
        document.getElementById("content").innerHTML = loggedInHtml

        modalContentCache = "<b>Address:</b><br>" + response.account.address + "<br>" +
          "<b>Public Key Encoded: </b><br>" + response.account.publicKeyEncoded + "<br>" +
          "<b>Public Key Hash: </b><br>" + response.account.publicKeyHash + "<br>"
        // returns { privateKey, publicKeyEncoded, publicKeyHash, programHash, address }
        document.getElementById("loginModalContent").innerHTML = modalContentCache
        // document.getElementById("loginModalContent").innerHTML = "<b>Address:</b><br>" + response.account.address + "<br>" +
        //   "<b>Public Key Encoded: </b><br>" + response.account.publicKeyEncoded + "<br>" +
        //   "<b>Public Key Hash: </b><br>" + response.account.publicKeyHash + "<br>"
        setBackgroundState()
      }
    })
  })
}

document.getElementById('createWalletNav').addEventListener('click', () => {
  setCurNavLocation('Create Wallet')
  document.getElementById("content").innerHTML = createWalletHtml

})

document.getElementById('importWalletNav').addEventListener('click', () => {
  setCurNavLocation('Import Wallet')
  document.getElementById("content").innerHTML = importWalletHtml

})

document.getElementById('exportWalletNav').addEventListener('click', () => {
  setCurNavLocation('Export Wallet')

  document.getElementById("content").innerHTML = exportWalletHtml

})


document.getElementById('configNav').addEventListener('click', () => {
  setCurNavLocation('Config')
  getBackgroundState()

  document.getElementById("content").innerHTML = configHtml

  document.getElementById('configUseLoggedInAddress').addEventListener('change', () => {
    console.log('configUseLoggedInAddress: '+configUseLoggedInAddress.checked)
    useLoginAddress = configUseLoggedInAddress.checked
    console.log('useLoginAddress: '+useLoginAddress)
    setBackgroundState()
  })

  document.getElementById('updateConfigButton').addEventListener('click', () => {
    setBackgroundState()
  })
})
