
import "../css/popup.css";

import * as mainNav from "../html/main_nav.html"
import * as txsHtml from "../html/transactions.html"
import * as balanceHtml from "../html/balance.html"
import * as loginHtml from "../html/login.html"
import * as createWalletHtml from "../html/create_wallet.html"
import * as importWalletHtml from "../html/import_wallet.html"
import * as exportWalletHtml from "../html/export_wallet.html"

var curNav = mainNav

document.getElementById("nav").innerHTML = curNav

// chrome.runtime.sendMessage({msg: "getTransactionHistory"}, function(response) {
//   console.log(response.msg);
// });

// chrome.runtime.sendMessage({msg: "getBalance"}, function(response) {
//   console.log(response.msg);
// });

document.getElementById('txsNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = txsHtml

  document.getElementById('getTxs').addEventListener('click', () => {
    chrome.runtime.sendMessage({msg: "getTransactionHistory"}, function(response) {
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
    });
  });
});

document.getElementById('balanceNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = balanceHtml

  document.getElementById('getBalance').addEventListener('click', () => {
    chrome.runtime.sendMessage({msg: "getBalance"}, function(response) {
      console.log(response)
      // document.getElementById("content").innerHTML = "<h3>" + response.msg + "</h3>";
      document.getElementById("modalContent").innerHTML = "<b>" +
  		response.address + "</b><br>NEO Balance: " + response.bals.NEO.balance +
  		"<br>GAS: " + response.bals.GAS.balance
    });
  });
});

document.getElementById('loginNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = loginHtml

});

document.getElementById('createWalletNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = createWalletHtml

});

document.getElementById('importWalletNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = importWalletHtml

});

document.getElementById('exportWalletNav').addEventListener('click', () => {
  document.getElementById("content").innerHTML = exportWalletHtml

});
