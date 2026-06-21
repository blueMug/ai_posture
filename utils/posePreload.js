const { poseCategories } = require('./poses')
const { queueImagePreload } = require('./imageCache')

let galleryPreloadStarted = false

const collectGalleryImageUrls = () => {
  const urls = []
  const seen = new Set()

  poseCategories.forEach((category) => {
    category.poses.forEach((pose) => {
      const url = pose.modelImage || pose.detailImage

      if (url && /^https?:\/\//.test(url) && !seen.has(url)) {
        seen.add(url)
        urls.push(url)
      }
    })
  })

  return urls
}

const preloadGalleryImagesInOrder = async () => {
  if (galleryPreloadStarted) {
    return
  }

  galleryPreloadStarted = true

  const urls = collectGalleryImageUrls()

  await queueImagePreload(urls)
}

const startGalleryImagePreload = () => {
  setTimeout(() => {
    preloadGalleryImagesInOrder().catch(() => {})
  }, 10000)
}

module.exports = {
  startGalleryImagePreload
}
