const USE_JSDELIVR_ASSETS = true
const JSDELIVR_ASSET_BASE = 'https://cdn.jsdelivr.net/gh/blueMug/ai_posture@main'
const LOCAL_PACKED_PREFIXES = ['/static/recommend_thumbs/']
const REMOTE_ONLY_FOLDERS = new Set([
  'custom74'
])
const HOME_LOCAL_ASSET_FOLDERS = new Set([
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
  'custom36',
  'custom75',
  'custom76',
  'custom77',
  'custom78',
  'custom79',
  'custom80',
  'custom81',
  'custom82',
  'custom83',
  'custom84',
  'custom85',
  'custom86',
  'custom87',
  'custom88',
  'custom89',
  'custom90',
  'custom91',
  'custom92',
  'custom93',
  'custom94',
  'custom95',
  'custom96',
  'custom97',
  'custom98',
  'custom99',
  'custom100',
  'custom101',
  'custom102',
  'custom103',
  'custom104',
  'custom105'
])

const isRemoteUrl = (path) => /^https?:\/\//.test(path)
const isPackedLocalAsset = (path) => LOCAL_PACKED_PREFIXES.some((prefix) => path.startsWith(prefix))
const isPoseContour = (path) => (
  (
    path.startsWith('/static/pose_pairs/') ||
    path.startsWith('/static/pose_guides/') ||
    path.startsWith('/static/recommend_guides/')
  ) &&
  /_contour\.png$/.test(path)
)
const isPoseThumb = (path) => (
  (path.startsWith('/static/pose_thumbs/') && /_thumb\.jpg$/.test(path)) ||
  (path.startsWith('/static/recommend_thumbs/') && /_thumb\.jpg$/.test(path)) ||
  (path.startsWith('/static/pose_pairs/') && /_demo\.jpg$/.test(path))
)
const getPoseFolder = (path) => {
  const match = path.match(/^\/static\/(?:pose_(?:pairs|guides|thumbs)|recommend_(?:guides|thumbs))\/([^/]+)\//)
  return match ? match[1] : ''
}
const normalizeAssetPath = (path) => {
  if (!path || !isRemoteUrl(path)) {
    return path
  }

  return path.startsWith(`${JSDELIVR_ASSET_BASE}/`)
    ? `/${path.slice(JSDELIVR_ASSET_BASE.length + 1)}`
    : path
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

const homeLocalAssetUrl = (path) => {
  const localPath = normalizeAssetPath(path)

  if (!localPath || isRemoteUrl(localPath)) {
    return path
  }

  const folder = getPoseFolder(localPath)

  if (!HOME_LOCAL_ASSET_FOLDERS.has(folder)) {
    return cdnAssetUrl(localPath)
  }

  if (isPoseContour(localPath)) {
    return cdnAssetUrl(localPath)
  }

  if (isPoseThumb(localPath)) {
    return localPath
      .replace('/static/pose_pairs/', '/static/recommend_thumbs/')
      .replace('/static/pose_thumbs/', '/static/recommend_thumbs/')
      .replace(/_demo\.jpg$/, '_thumb.jpg')
  }

  return cdnAssetUrl(localPath)
}

module.exports = {
  assetUrl,
  cdnAssetUrl,
  homeLocalAssetUrl,
  HOME_LOCAL_ASSET_FOLDERS,
  JSDELIVR_ASSET_BASE
}
