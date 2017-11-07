import '../img/icon-128.png'
import '../img/icon-34.png'

console.log("in background")

// chrome.browserAction.onClicked.addListener(function() {
  // Fired when a browser action icon is clicked. This event will not fire if the browser action has a popup.
//   console.log('browser action!')
//
// });

var foo = 'bar';

chrome.runtime.onInstalled.addListener(function () {
  console.log('installed!')
});


// main action message handler
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.msg == "hello") {
      test();
      sendResponse({msg: foo});
    }
    return true;
});

function test () {
  console.log('test');
}
