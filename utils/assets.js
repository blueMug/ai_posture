const USE_JSDELIVR_ASSETS = true
const JSDELIVR_ASSET_BASE = 'https://cdn.jsdelivr.net/gh/blueMug/ai_posture@main'
const LOCAL_PACKED_PREFIXES = ['/static/pose_guides/', '/static/pose_thumbs/']

const isRemoteUrl = (path) => /^https?:\/\//.test(path)
const isPackedLocalAsset = (path) => LOCAL_PACKED_PREFIXES.some((prefix) => path.startsWith(prefix))
const isPoseContour = (path) => path.startsWith('/static/pose_pairs/') && /_contour\.png$/.test(path)

const assetUrl = (path) => {
  if (!path || isRemoteUrl(path)) {
    return path
  }

  if (isPoseContour(path)) {
    return path.replace('/static/pose_pairs/', '/static/pose_guides/')
  }

  if (isPackedLocalAsset(path)) {
    return path
  }

  if (!USE_JSDELIVR_ASSETS) {
    return path
  }

  return `${JSDELIVR_ASSET_BASE}/${path.replace(/^\/+/, '')}`
}

module.exports = {
  assetUrl,
  JSDELIVR_ASSET_BASE
}
