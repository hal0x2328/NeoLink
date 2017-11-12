

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

// for test invoke
// var tx = {'operation': 'getprice', 'args': 'test', 'scriptHash': 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a'}
// for send invoke
var tx = {'operation': 'putvalue', 'args': 'test', 'scriptHash': 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a', 'amount': '.00025', 'type': 'GAS' }

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
