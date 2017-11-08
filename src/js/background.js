import '../img/icon-128.png'
import '../img/icon-34.png'

import * as neon from 'neon-js'

var address='AJXixUHZZsSZTrrP7ZpRqKbY2HzRawf8cB'
var network='MainNet'

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
      case "createWallet":
        break;
      case "exportWallet":
        break;
      case "login":
        break;
      case "send":
        break;
      case "claim":
        break;
      case "getBalance":
        getBalance((e, res, address) => {
          if(e) console.log(e)
          else
            sendResponse({bals: res, address: address})
        })
        break;
      case "getTransactionHistory":
        getTransactionHistory((e, txs) => {
          if(e) console.log(e)
          else sendResponse({msg: txs})
        })
        break;
    }
    return true;
});



function getTransactionHistory (callback) {
  neon.getTransactionHistory(network, address)
    .then((transactions) => {
      // for (let i = 0; i < transactions.length; i++){
      //   if (transactions[i].neo_sent === true){
      //     console.log("NEO: " + transactions[i].txid)
      //   }
      //   if (transactions[i].gas_sent === true){
      //     console.log("GAS: " + transactions[i].txid)
      //   }
      // }
      callback(null, transactions)
    }).catch((e) => {
      console.log(e)
      callback(e, null)
      throw e
    })
}

function getBalance (callback) {
  neon.getBalance(network, address)
    .then((response) => {
      console.log(address +"\nNEO Balance: " + response.NEO.balance + "\nGas Balance: " + response.GAS.balance);
      callback(null, response, address)
    }).catch((e) => {
      console.log(e)
      callback(e, null)
      throw e
    })
  }
