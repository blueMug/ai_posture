const { poseTemplates, poseCategories } = require('./poses')
const { cacheImage } = require('./imageCache')
const { cdnAssetUrl } = require('./assets')

let galleryPreloadStarted = false
let homeInspirationPreloadStarted = false

const HOME_INSPIRATION_POSE_IDS = [
  'pair-custom25-r01-g01',
  'pair-custom27-r01-g01',
  'pair-custom30-r01-g01',
  'pair-custom36-r01-g01',
  'pair-custom1-r01-g01',
  'pair-custom3-r01-g01',
  'pair-custom19-r01-g01',
  'pair-custom22-r01-g01',
  'pair-custom26-r01-g01',
  'pair-custom29-r01-g01',
  'pair-custom31-r01-g01',
  'pair-custom33-r01-g01',
  'pair-custom18-r01-g01',
  'pair-custom23-r01-g01',
  'pair-custom24-r01-g01',
  'pair-custom28-r01-g01'
]

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const collectHomeInspirationImageUrls = () => {
  const urls = []
  const seen = new Set()

  HOME_INSPIRATION_POSE_IDS.forEach((poseId) => {
    const pose = poseTemplateMap.get(poseId)
    const url = pose && cdnAssetUrl(pose.thumbnailImage || pose.guideImage)

    if (url && /^https?:\/\//.test(url) && !seen.has(url)) {
      seen.add(url)
      urls.push(url)
    }
  })

  return urls
}

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

  for (const url of urls) {
    await cacheImage(url)
  }
}

const preloadHomeInspirationImagesInOrder = async () => {
  if (homeInspirationPreloadStarted) {
    return
  }

  homeInspirationPreloadStarted = true

  const urls = collectHomeInspirationImageUrls()

  for (const url of urls) {
    await cacheImage(url)
  }
}

const startGalleryImagePreload = () => {
  setTimeout(() => {
    preloadHomeInspirationImagesInOrder().catch(() => {})
  }, 300)

  setTimeout(() => {
    preloadGalleryImagesInOrder().catch(() => {})
  }, 1200)
}

module.exports = {
  startGalleryImagePreload
}
