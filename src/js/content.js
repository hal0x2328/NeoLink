

chrome.runtime.sendMessage({'msg': 'contentInit'}, function(response) {
  if (response.error) {
    console.log('contentInit error: '+response.error)
  } else {
    console.log('contentInit response: '+response.msg)
  }
})
