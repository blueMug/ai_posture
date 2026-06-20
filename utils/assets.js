const USE_JSDELIVR_ASSETS = true
const JSDELIVR_ASSET_BASE = 'https://cdn.jsdelivr.net/gh/blueMug/ai_posture@main'
const LOCAL_PACKED_PREFIXES = ['/static/pose_pairs/']

const isRemoteUrl = (path) => /^https?:\/\//.test(path)
const isPackedLocalAsset = (path) => LOCAL_PACKED_PREFIXES.some((prefix) => path.startsWith(prefix))

const assetUrl = (path) => {
  if (!path || isRemoteUrl(path)) {
    return path
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
