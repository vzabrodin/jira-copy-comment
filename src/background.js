import { getAllowedUrls, onChanged as onConfigurationChanged } from './configuration'

function onWebNavigationCompleted (details) {
  if (details.frameId !== 0) return
  browser.tabs.executeScript(details.tabId, {
    file: 'js/content-script.js'
  })
}

async function subscribeOnWebNavigationCompleted () {
  browser.webNavigation.onCompleted.removeListener(onWebNavigationCompleted)

  const allowedUrls = (await getAllowedUrls()) ?? []
  const eventFilter = {
    url: allowedUrls
      .filter((item) => item.enabled)
      .map((item) => ({ urlMatches: item.value }))
  }

  if (!eventFilter.url.length) return

  browser.webNavigation.onCompleted.addListener(
    onWebNavigationCompleted,
    eventFilter
  )
}

onConfigurationChanged.addListener(subscribeOnWebNavigationCompleted)
subscribeOnWebNavigationCompleted()
