import "../css/popup.css";

//import neon from "neon-js"
import * as neon from 'neon-js'
var address='AJXixUHZZsSZTrrP7ZpRqKbY2HzRawf8cB';

neon.getTransactionHistory('MainNet', address)
  .then((transactions) => {
    let txs = [];
    for (let i = 0; i < transactions.length; i++){
      if (transactions[i].neo_sent === true){
        console.log("NEO: " + transactions[i].txid);
      }
      if (transactions[i].gas_sent === true){
        console.log("GAS: " + transactions[i].txid);
      }
    }}).catch((e) => {
        console.log(e)
        throw e
      })

neon.getBalance('MainNet', address)
      .then((response) => {
        document.getElementById("content").innerHTML = "<h3>" +
		address + "</h3><br>NEO Balance: " + response.NEO.balance +
		"<br>GAS: " + response.GAS.balance;
	console.log(address +"\nNEO Balance: " + response.NEO.balance + "\nGas Balance: " + response.GAS.balance);
      }).catch((e) => {
        console.log(e)
        throw e
      })
//hello();
