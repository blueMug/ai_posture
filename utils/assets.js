const USE_REMOTE_ASSETS = true
// Roll back to jsDelivr quickly by changing this value to 'jsdelivr'.
const REMOTE_ASSET_SOURCE = 'gitee'
const JSDELIVR_ASSET_BASE = 'https://cdn.jsdelivr.net/gh/blueMug/posture_assets@main'
const GITEE_ASSET_BASE = 'https://gitee.com/blueMug/posture_assets/raw/main'
const JSDELIVR_ASSET_BASE_V2 = 'https://cdn.jsdelivr.net/gh/blueMug/posture_assets_v2@main'
const GITEE_ASSET_BASE_V2 = 'https://gitee.com/blueMug/posture_assets_v2/raw/main'
const REMOTE_ASSET_VERSION = '02f7e25'
const REMOTE_ASSET_VERSION_V2 = '4828e28'
const V2_POSE_NUMBER_START = 1143
const REMOTE_ASSET_BASES = {
  jsdelivr: JSDELIVR_ASSET_BASE,
  gitee: GITEE_ASSET_BASE
}
const REMOTE_ASSET_BASES_V2 = {
  jsdelivr: JSDELIVR_ASSET_BASE_V2,
  gitee: GITEE_ASSET_BASE_V2
}
const REMOTE_ASSET_BASE = REMOTE_ASSET_BASES[REMOTE_ASSET_SOURCE] || JSDELIVR_ASSET_BASE
const REMOTE_ASSET_BASE_V2 = REMOTE_ASSET_BASES_V2[REMOTE_ASSET_SOURCE] || JSDELIVR_ASSET_BASE_V2
const REMOTE_ASSET_BASE_LIST = Array.from(new Set([
  ...Object.values(REMOTE_ASSET_BASES),
  ...Object.values(REMOTE_ASSET_BASES_V2)
]))
const LOCAL_PACKED_PREFIXES = []
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
  'custom105',
  'custom106',
  'custom107',
  'custom108',
  'custom109',
  'custom110',
  'custom111',
  'custom112',
  'custom113',
  'custom114',
  'custom115',
  'custom116',
  'custom117',
  'custom118',
  'custom119',
  'custom120',
  'custom121',
  'custom122',
  'custom123',
  'custom124',
  'custom125',
  'custom126',
  'custom127',
  'custom128',
  'custom129',
  'custom130',
  'custom131',
])
const isRemoteUrl = (path) => /^https?:\/\//.test(path)
const getPoseNumberFromPath = (path = '') => {
  const match = String(path).match(/\/custom(\d+)\//)

  return match ? Number(match[1]) : 0
}
const usesV2AssetRepo = (path = '') => getPoseNumberFromPath(path) >= V2_POSE_NUMBER_START
const getPoseFolder = (path) => {
  const match = path.match(/^\/static\/(?:pose_(?:pairs|guides|thumbs)|recommend_guides|home_guides)\/([^/]+)\//)
  return match ? match[1] : ''
}
const isPackedLocalAsset = (path) => {
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
  (path.startsWith('/static/pose_pairs/') && /_demo\.jpg$/.test(path))
)
const normalizeRemoteAssetPath = (path = '') => {
  if (isPoseContour(path)) {
    return path
      .replace('/static/pose_guides/', '/static/pose_pairs/')
      .replace('/static/recommend_guides/', '/static/pose_pairs/')
      .replace('/static/home_guides/', '/static/pose_pairs/')
  }

  if (path.startsWith('/static/pose_pairs/') && /_thumb\.jpg$/.test(path)) {
    return path.replace('/static/pose_pairs/', '/static/pose_thumbs/')
  }

  return path
}
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

  const matchedBase = REMOTE_ASSET_BASE_LIST.find((base) => path.startsWith(`${base}/`))

  if (!matchedBase) {
    return path
  }

  const remotePath = path.slice(matchedBase.length + 1)
  const assetPath = remotePath.split(/[?#]/, 1)[0]

  return `/${assetPath}`
}

const cdnAssetUrl = (path) => {
  if (!path || isRemoteUrl(path)) {
    return path
  }

  const remotePath = normalizeRemoteAssetPath(path)
  const useV2Repo = usesV2AssetRepo(remotePath)
  const remoteBase = useV2Repo ? REMOTE_ASSET_BASE_V2 : REMOTE_ASSET_BASE
  const remoteVersion = useV2Repo ? REMOTE_ASSET_VERSION_V2 : REMOTE_ASSET_VERSION
  const url = `${remoteBase}/${remotePath.replace(/^\/+/, '')}`

  return remoteVersion
    ? `${url}${url.includes('?') ? '&' : '?'}v=${remoteVersion}`
    : url
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

  if (!USE_REMOTE_ASSETS) {
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
    const poseThumbPath = localPath
      .replace('/static/pose_pairs/', '/static/pose_thumbs/')
      .replace(/_demo\.jpg$/, '_thumb.jpg')

    return cdnAssetUrl(poseThumbPath)
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
  USE_REMOTE_ASSETS,
  REMOTE_ASSET_SOURCE,
  REMOTE_ASSET_VERSION,
  REMOTE_ASSET_VERSION_V2,
  REMOTE_ASSET_BASE,
  REMOTE_ASSET_BASE_V2,
  GITEE_ASSET_BASE,
  GITEE_ASSET_BASE_V2,
  JSDELIVR_ASSET_BASE,
  JSDELIVR_ASSET_BASE_V2,
  V2_POSE_NUMBER_START
}
