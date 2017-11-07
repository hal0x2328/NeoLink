// var bgpage = chrome.extension.getBackgroundPage();
//
// import util from "util"
//
// // console.log('bgpage: '+util.inspect(bgpage, {depth: null}))
//
// if(bgpage) {
//   console.log('foo:'+bgpage.foo);
//   // bgpage.foo());
// }
// else console.log('bgpage notfound')

chrome.extension.getBackgroundPage(function (backgroundPage) {
    console.log(backgroundPage.foo); // Displays "mooh".
});

// import "../css/popup.css";
//
// //import neon from "neon-js"
// import * as neon from 'neon-js'
// var address='AJXixUHZZsSZTrrP7ZpRqKbY2HzRawf8cB';
//
// neon.getTransactionHistory('MainNet', address)
//   .then((transactions) => {
//     let txs = [];
//     for (let i = 0; i < transactions.length; i++){
//       if (transactions[i].neo_sent === true){
//         console.log("NEO: " + transactions[i].txid);
//       }
//       if (transactions[i].gas_sent === true){
//         console.log("GAS: " + transactions[i].txid);
//       }
//     }}).catch((e) => {
//         console.log(e)
//         throw e
//       })
//
// neon.getBalance('MainNet', address)
//       .then((response) => {
//         document.getElementById("content").innerHTML = "<h3>" +
// 		address + "</h3><br>NEO Balance: " + response.NEO.balance +
// 		"<br>GAS: " + response.GAS.balance;
// 	console.log(address +"\nNEO Balance: " + response.NEO.balance + "\nGas Balance: " + response.GAS.balance);
//       }).catch((e) => {
//         console.log(e)
//         throw e
//       })
//hello();

// var bgWin = chrome.extension.getBackgroundPage();
// console.log(bgWin.backgroundFunction());

// function onGot(page) {
//   page.foo();
// }
//
// function onError(error) {
//   console.log(`Error: ${error}`);
// }
//
// var getting = chrome.extension.getBackgroundPage();
// // getting.then(onGot, onError);
// getting.foo();
