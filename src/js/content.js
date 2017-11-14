
import util from 'util'

chrome.runtime.sendMessage({'msg': 'contentInit'}, function(response) {
  if (response.error) {
    console.log('contentInit error: '+response.error)
  } else {
    console.log('contentInit response: '+response.msg)
    if (response.loggedIn) {
      console.log('user is logged in: '+response.loggedIn)
    }
  }
})

// var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + util.inspect(event.data.text, {depth: null}));
    window.postMessage(event.data.text, "*");
    var key = event.data.text.key;
    var price = event.data.text.price;
    var arg = event.data.text.arg;
    sendInvoke (key, price, arg)
  }
}, false);



function testInvoke (key, price, arg) {
  // for test invoke
  // var tx = {'operation': 'getprice', 'args': 'test', 'scriptHash': 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a'}
  // for send invoke

 var args = [key, arg]

  var tx = {'operation': 'putvalue', 'args': args, 'scriptHash': 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a', 'amount': price, 'type': 'GAS' }

  // test invoke contract
  chrome.runtime.sendMessage({'msg': 'testInvoke', 'tx': tx}, function(response) {
    if (response.error) {
      console.log('contentInit error: '+response.error)
    } else {
      console.log('contentInit response: '+response.msg)
      // if (response.loggedIn) {
      //   console.log('user is logged in: '+response.loggedIn)
      // }
    }
  })
}

function sendInvoke (key, price, arg) {
  console.log('invoking contract from content script')
  // for test invoke
  // var tx = {'operation': 'getprice', 'args': 'test', 'scriptHash': 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a'}
  // for send invoke
  var args = [key, arg]

   var tx = {'operation': 'putvalue', 'args': args, 'scriptHash': 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a', 'amount': price, 'type': 'GAS' }

  // test invoke contract
  chrome.runtime.sendMessage({'msg': 'sendInvoke', 'tx': tx}, function(response) {
    if (response.error) {
      console.log('contentInit error: '+response.error)
    } else {
      console.log('contentInit response: '+response.msg)
      // if (response.loggedIn) {
      //   console.log('user is logged in: '+response.loggedIn)
      // }
    }
  })
}
