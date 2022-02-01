const storageAreaName = 'local'
const storage = browser.storage[storageAreaName]

export async function getAllowedUrls () {
  const { allowedUrls } = await storage.get('allowedUrls')
  return allowedUrls
}

export async function setAllowedUrls (allowedUrls) {
  await storage.set({ allowedUrls })
}

export async function getCommentTemplates () {
  const { commentTemplates } = await storage.get('commentTemplates')
  return commentTemplates
}

export async function setCommentTemplates (commentTemplates) {
  await storage.set({ commentTemplates })
}

export async function get () {
  const { allowedUrls, commentTemplates } = await storage.get([
    'allowedUrls',
    'commentTemplates'
  ])
  return { allowedUrls, commentTemplates }
}

export async function set ({ allowedUrls, commentTemplates }) {
  await storage.set({ allowedUrls, commentTemplates })
}

export const onChanged = new (class {
  #listeners = []

  addListener (callback) {
    const callbackWrapper = (changes, areaName) => {
      if (areaName === storageAreaName) {
        return callback(changes, areaName)
      }
    }

    browser.storage.onChanged.addListener(callbackWrapper)
    this.#listeners[callback] = callbackWrapper
  }

  removeListener (callback) {
    const callbackWrapper = this.#listeners[callback]
    browser.storage.onChanged.removeListener(callbackWrapper)
    delete this.#listeners[callback]
  }
})()
