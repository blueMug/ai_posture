const USE_JSDELIVR_ASSETS = true
const JSDELIVR_ASSET_BASE = 'https://cdn.jsdelivr.net/gh/blueMug/ai_posture@main'

const isRemoteUrl = (path) => /^https?:\/\//.test(path)

const assetUrl = (path) => {
  if (!path || isRemoteUrl(path)) {
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
