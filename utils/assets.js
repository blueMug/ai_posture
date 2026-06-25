const USE_JSDELIVR_ASSETS = true
const JSDELIVR_ASSET_BASE = 'https://cdn.jsdelivr.net/gh/blueMug/posture_assets@main'
const LOCAL_PACKED_PREFIXES = ['/static/recommend_thumbs/']
const REMOTE_ONLY_ASSET_PATHS = new Set([
  '/static/pose_pairs/custom74/custom74_r01_g01_demo.jpg',
  '/static/pose_thumbs/custom74/custom74_r01_g01_thumb.jpg'
])
const HOME_LOCAL_GUIDE_FOLDERS = new Set()
const HOME_LOCAL_ASSET_FOLDERS = new Set([
  'custom4',
  'custom5',
  'custom11',
  'custom13',
  'custom14',
  'custom15',
  'custom16',
  'custom17',
  'custom18',
  'custom19',
  'custom20',
  'custom24',
  'custom26',
  'custom29',
  'custom31',
  'custom33',
  'custom34',
  'custom35',
  'custom38',
  'custom39',
  'custom40',
  'custom41',
  'custom42',
  'custom43',
  'custom44',
  'custom45',
  'custom46',
  'custom47',
  'custom48',
  'custom49',
  'custom50',
  'custom51',
  'custom52',
  'custom53',
  'custom54',
  'custom55',
  'custom56',
  'custom57',
  'custom58',
  'custom59',
  'custom60',
  'custom61',
  'custom62',
  'custom63',
  'custom64',
  'custom65',
  'custom66',
  'custom67',
  'custom68',
  'custom69',
  'custom70',
  'custom71',
  'custom72',
  'custom73',
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
const getPoseFolder = (path) => {
  const match = path.match(/^\/static\/(?:pose_(?:pairs|guides|thumbs)|recommend_(?:guides|thumbs)|home_guides)\/([^/]+)\//)
  return match ? match[1] : ''
}
const isPackedLocalAsset = (path) => {
  const folder = getPoseFolder(path)

  if (path.startsWith('/static/recommend_thumbs/')) {
    return HOME_LOCAL_ASSET_FOLDERS.has(folder)
  }

  return LOCAL_PACKED_PREFIXES.some((prefix) => path.startsWith(prefix))
}
const isPoseContour = (path) => (
  (
    path.startsWith('/static/pose_pairs/') ||
    path.startsWith('/static/pose_guides/') ||
    path.startsWith('/static/recommend_guides/') ||
    path.startsWith('/static/home_guides/')
  ) &&
  /_contour\.png$/.test(path)
)
const isPoseThumb = (path) => (
  (path.startsWith('/static/pose_thumbs/') && /_thumb\.jpg$/.test(path)) ||
  (path.startsWith('/static/recommend_thumbs/') && /_thumb\.jpg$/.test(path)) ||
  (path.startsWith('/static/pose_pairs/') && /_demo\.jpg$/.test(path))
)
const toHomeGuidePath = (path = '') => (
  path
    .replace('/static/pose_pairs/', '/static/home_guides/')
    .replace('/static/pose_guides/', '/static/home_guides/')
    .replace('/static/recommend_guides/', '/static/home_guides/')
)
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
    .replace('/static/home_guides/', '/static/pose_guides/')

  return `${JSDELIVR_ASSET_BASE}/${remotePath.replace(/^\/+/, '')}`
}

const assetUrl = (path) => {
  const localPath = normalizeAssetPath(path)

  if (!localPath || isRemoteUrl(localPath)) {
    return path
  }

  if (REMOTE_ONLY_ASSET_PATHS.has(localPath)) {
    return cdnAssetUrl(localPath)
  }

  if (isPackedLocalAsset(localPath)) {
    return localPath
  }

  if (!USE_JSDELIVR_ASSETS) {
    return localPath
  }

  return isPackedLocalAsset(localPath) ? localPath : cdnAssetUrl(localPath)
}

const homeLocalAssetUrl = (path) => {
  const localPath = normalizeAssetPath(path)

  if (!localPath || isRemoteUrl(localPath)) {
    return path
  }

  const folder = getPoseFolder(localPath)

  if (!HOME_LOCAL_ASSET_FOLDERS.has(folder)) {
    return assetUrl(localPath)
  }

  if (isPoseContour(localPath)) {
    const homeGuidePath = toHomeGuidePath(localPath)

    return isPackedLocalAsset(homeGuidePath) ? homeGuidePath : cdnAssetUrl(localPath)
  }

  if (isPoseThumb(localPath)) {
    return localPath
      .replace('/static/pose_pairs/', '/static/recommend_thumbs/')
      .replace('/static/pose_thumbs/', '/static/recommend_thumbs/')
      .replace(/_demo\.jpg$/, '_thumb.jpg')
  }

  return assetUrl(localPath)
}

module.exports = {
  assetUrl,
  cdnAssetUrl,
  homeLocalAssetUrl,
  HOME_LOCAL_ASSET_FOLDERS,
  HOME_LOCAL_GUIDE_FOLDERS,
  normalizeAssetPath,
  JSDELIVR_ASSET_BASE
}
