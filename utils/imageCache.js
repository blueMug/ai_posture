const CACHE_STORAGE_KEY = 'imageFileCacheV1'
const PINNED_CACHE_URLS_KEY = 'pinnedImageCacheUrlsV1'
const MAX_CACHE_BYTES = 8 * 1024 * 1024

const pendingTasks = {}

const isRemoteUrl = (url) => /^https?:\/\//.test(url || '')

const readCache = () => {
  try {
    return wx.getStorageSync(CACHE_STORAGE_KEY) || {}
  } catch (error) {
    return {}
  }
}

const writeCache = (cache) => {
  try {
    wx.setStorageSync(CACHE_STORAGE_KEY, cache)
  } catch (error) {
    // Cache writes are best effort; image loading should still continue.
  }
}

const getPinnedCacheUrls = () => {
  try {
    const urls = wx.getStorageSync(PINNED_CACHE_URLS_KEY)
    return Array.isArray(urls) ? Array.from(new Set(urls.filter(Boolean))) : []
  } catch (error) {
    return []
  }
}

const setPinnedCacheUrls = (urls) => {
  const nextUrls = Array.from(new Set((urls || []).filter(Boolean)))

  try {
    wx.setStorageSync(PINNED_CACHE_URLS_KEY, nextUrls)
  } catch (error) {
    // Pin writes are best effort; cached files can still be re-downloaded.
  }

  return nextUrls
}

const getSavedFileInfo = (filePath) => new Promise((resolve) => {
  wx.getSavedFileInfo({
    filePath,
    success: resolve,
    fail: () => resolve(null)
  })
})

const getFileInfo = (filePath) => new Promise((resolve) => {
  wx.getFileInfo({
    filePath,
    success: resolve,
    fail: () => resolve(null)
  })
})

const removeSavedFile = (filePath) => {
  wx.removeSavedFile({
    filePath,
    fail: () => {}
  })
}

const pruneCache = (cache, keepUrl) => {
  const entries = Object.entries(cache)
  let totalBytes = entries.reduce((sum, [, entry]) => sum + Number(entry.size || 0), 0)
  const pinnedUrls = new Set(getPinnedCacheUrls())

  if (totalBytes <= MAX_CACHE_BYTES) {
    return cache
  }

  entries
    .filter(([url]) => url !== keepUrl && !pinnedUrls.has(url))
    .sort(([, a], [, b]) => Number(a.lastAccessAt || 0) - Number(b.lastAccessAt || 0))
    .some(([url, entry]) => {
      removeSavedFile(entry.filePath)
      totalBytes -= Number(entry.size || 0)
      delete cache[url]
      return totalBytes <= MAX_CACHE_BYTES
    })

  return cache
}

const pinCachedImages = async (urls = []) => {
  const remoteUrls = Array.from(new Set(urls.filter(isRemoteUrl)))

  if (!remoteUrls.length) {
    return []
  }

  setPinnedCacheUrls([
    ...getPinnedCacheUrls(),
    ...remoteUrls
  ])

  return Promise.all(remoteUrls.map((url) => cacheImage(url)))
}

const unpinCachedImages = (urls = []) => {
  const removeUrls = new Set(urls.filter(isRemoteUrl))

  if (!removeUrls.size) {
    return getPinnedCacheUrls()
  }

  return setPinnedCacheUrls(getPinnedCacheUrls().filter((url) => !removeUrls.has(url)))
}

const downloadImage = (url) => new Promise((resolve) => {
  wx.downloadFile({
    url,
    success: async (downloadResult) => {
      if (downloadResult.statusCode < 200 || downloadResult.statusCode >= 300) {
        resolve(url)
        return
      }

      const tempFilePath = downloadResult.tempFilePath
      const tempFileInfo = await getFileInfo(tempFilePath)

      wx.saveFile({
        tempFilePath,
        success: (saveResult) => {
          const now = Date.now()
          const cache = readCache()

          cache[url] = {
            filePath: saveResult.savedFilePath,
            size: Number(tempFileInfo && tempFileInfo.size) || 0,
            lastAccessAt: now
          }

          writeCache(pruneCache(cache, url))
          resolve(saveResult.savedFilePath)
        },
        fail: () => {
          resolve(tempFilePath)
        }
      })
    },
    fail: () => {
      resolve(url)
    }
  })
})

const cacheImage = async (url) => {
  if (!isRemoteUrl(url)) {
    return url
  }

  const cache = readCache()
  const cached = cache[url]

  if (cached && cached.filePath) {
    const fileInfo = await getSavedFileInfo(cached.filePath)

    if (fileInfo) {
      cached.lastAccessAt = Date.now()
      cached.size = Number(fileInfo.size || cached.size || 0)
      cache[url] = cached
      writeCache(cache)
      return cached.filePath
    }

    delete cache[url]
    writeCache(cache)
  }

  if (!pendingTasks[url]) {
    pendingTasks[url] = downloadImage(url).finally(() => {
      delete pendingTasks[url]
    })
  }

  return pendingTasks[url]
}

const cacheImageFields = async (item, fields) => {
  const cachedItem = { ...item }

  await Promise.all(fields.map(async (field) => {
    if (cachedItem[field]) {
      cachedItem[field] = await cacheImage(cachedItem[field])
    }
  }))

  return cachedItem
}

const cachePoseCategories = async (categories, fields) => Promise.all(categories.map(async (category) => ({
  ...category,
  poses: await Promise.all(category.poses.map((pose) => cacheImageFields(pose, fields)))
})))

module.exports = {
  cacheImage,
  cacheImageFields,
  cachePoseCategories,
  pinCachedImages,
  unpinCachedImages
}
