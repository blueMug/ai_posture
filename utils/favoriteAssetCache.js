const {
  cacheImageFields,
  pinCachedImages,
  unpinCachedImages
} = require('./imageCache')

const FAVORITE_ASSET_FIELDS = [
  'guideImage',
  'thumbnailImage',
  'modelImage',
  'detailImage'
]

const getFavoriteAssetUrls = (pose = {}) => (
  FAVORITE_ASSET_FIELDS
    .map((field) => pose[field])
    .filter(Boolean)
)

const cacheFavoritePoseAssets = async (pose) => {
  if (!pose) {
    return pose
  }

  await pinCachedImages(getFavoriteAssetUrls(pose))
  return cacheImageFields(pose, FAVORITE_ASSET_FIELDS)
}

const unpinFavoritePoseAssets = (pose) => {
  if (!pose) {
    return []
  }

  return unpinCachedImages(getFavoriteAssetUrls(pose))
}

module.exports = {
  cacheFavoritePoseAssets,
  FAVORITE_ASSET_FIELDS,
  unpinFavoritePoseAssets
}
