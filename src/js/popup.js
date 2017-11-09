
import "../css/popup.css"
import util from "util"

import * as mainNav from "../html/main_nav.html"
import * as txsHtml from "../html/transactions.html"
import * as balanceHtml from "../html/balance.html"
import * as loginHtml from "../html/login.html"
import * as loggedInHtml from "../html/loggedIn.html"
import * as createWalletHtml from "../html/create_wallet.html"
import * as importWalletHtml from "../html/import_wallet.html"
import * as exportWalletHtml from "../html/export_wallet.html"

var curNav = mainNav


var loggedIn = false

document.getElementById("nav").innerHTML = curNav


chrome.runtime.sendMessage({'msg': 'getState'}, function(response) {
  loggedIn = response.loggedIn
  console.log('loggedIn: '+loggedIn)
});


document.getElementById('txsNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = txsHtml

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
        document.getElementById("modalContent").innerHTML = "<ul>" + content + "</ul>"
      }
    })
  })
})

document.getElementById('balanceNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = balanceHtml

  document.getElementById('getBalanceButton').addEventListener('click', () => {
    var address = document.getElementById("balanceAddress").value
    console.log('add:'+address)

    chrome.runtime.sendMessage({'msg': 'getBalance', 'args': address}, function(response) {
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

document.getElementById('loginNav').addEventListener('click', () => {
  if(!loggedIn) document.getElementById("loginNav").innerHTML = 'Login'

  document.getElementById("content").innerHTML = loginHtml

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
        document.getElementById("loginNav").innerHTML = 'Log Out'
        document.getElementById("content").innerHTML = loggedInHtml

        // returns { privateKey, publicKeyEncoded, publicKeyHash, programHash, address }
        document.getElementById("modalContent").innerHTML = "<b>Address:</b><br>" + response.account.address + "<br>" +
          "<b>Public Key Encoded: </b><br>" + response.account.publicKeyEncoded + "<br>" +
          "<b>Public Key Hash: </b><br>" + response.account.publicKeyHash + "<br>"
      }
    })
  })
})

document.getElementById('createWalletNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = createWalletHtml

});

document.getElementById('importWalletNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = importWalletHtml

});

document.getElementById('exportWalletNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = exportWalletHtml

});
