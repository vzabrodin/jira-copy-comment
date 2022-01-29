browser.browserAction.onClicked.addListener(function (tab) {
  console.log('Hello from the background')

  browser.tabs.executeScript({
    file: 'js/content-script.js'
  })
})
