const USE_JSDELIVR_ASSETS = true
const JSDELIVR_ASSET_BASE = 'https://cdn.jsdelivr.net/gh/blueMug/ai_posture@main'
const LOCAL_PACKED_PREFIXES = ['/static/recommend_guides/', '/static/recommend_thumbs/']
const REMOTE_ONLY_FOLDERS = new Set([
  'custom74'
])
const LOCAL_HOME_RECOMMEND_FOLDERS = new Set([
  'custom1',
  'custom3',
  'custom18',
  'custom19',
  'custom22',
  'custom23',
  'custom24',
  'custom25',
  'custom26',
  'custom27',
  'custom28',
  'custom29',
  'custom30',
  'custom31',
  'custom33',
  'custom36'
])

const isRemoteUrl = (path) => /^https?:\/\//.test(path)
const isPackedLocalAsset = (path) => LOCAL_PACKED_PREFIXES.some((prefix) => path.startsWith(prefix))
const isPoseContour = (path) => (
  (path.startsWith('/static/pose_pairs/') || path.startsWith('/static/pose_guides/')) &&
  /_contour\.png$/.test(path)
)
const isPoseThumb = (path) => path.startsWith('/static/pose_thumbs/') && /_thumb\.jpg$/.test(path)
const getPoseFolder = (path) => {
  const match = path.match(/^\/static\/pose_(?:pairs|guides|thumbs)\/([^/]+)\//)
  return match ? match[1] : ''
}

const cdnAssetUrl = (path) => {
  if (!path || isRemoteUrl(path)) {
    return path
  }

  const remotePath = path
    .replace('/static/recommend_thumbs/', '/static/pose_thumbs/')
    .replace('/static/recommend_guides/', '/static/pose_guides/')

  return `${JSDELIVR_ASSET_BASE}/${remotePath.replace(/^\/+/, '')}`
}

const assetUrl = (path) => {
  if (!path || isRemoteUrl(path)) {
    return path
  }

  if (isPoseContour(path) && LOCAL_HOME_RECOMMEND_FOLDERS.has(getPoseFolder(path))) {
    return path
      .replace('/static/pose_pairs/', '/static/recommend_guides/')
      .replace('/static/pose_guides/', '/static/recommend_guides/')
  }

  if (isPoseThumb(path) && LOCAL_HOME_RECOMMEND_FOLDERS.has(getPoseFolder(path))) {
    return path.replace('/static/pose_thumbs/', '/static/recommend_thumbs/')
  }

  if (REMOTE_ONLY_FOLDERS.has(getPoseFolder(path))) {
    return `${JSDELIVR_ASSET_BASE}/${path.replace(/^\/+/, '')}`
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
  cdnAssetUrl,
  JSDELIVR_ASSET_BASE
}
