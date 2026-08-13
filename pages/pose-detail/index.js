const { getPoseById } = require('../../utils/poses')
const { cacheImage, getCachedImagePath } = require('../../utils/imageCache')
const { cdnAssetUrl } = require('../../utils/assets')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const { getShootingGuide } = require('../../utils/shootingGuide')
const { getSceneTopic } = require('../../utils/sceneTopics')
const {
  getFavoritePoseIds,
  recordPoseUsage,
  togglePoseFavorite,
  withFavoriteState
} = require('../../utils/userData')
const {
  cacheFavoritePoseAssets,
  getCachedFavoritePoseAssets,
  unpinFavoritePoseAssets
} = require('../../utils/favoriteAssetCache')
const {
  buildPhotographerTask,
  buildPoseShare,
  buildSceneShare
} = require('../../utils/shareCopy')

const getPose = (poseId) => getPoseById(poseId)
const MAX_ACTION_POINTS = 3
const DETAIL_IMAGE_LOAD_TIMEOUT = 60000
const IMAGE_RETRY_VISIBLE_DURATION = 5000
const BOTTOM_SWITCH_PULL_THRESHOLD = 120
const BOTTOM_SWITCH_ARM_DURATION = 3600
const DETAIL_PREVIEW_IMAGE_KEY = 'poseDetailPreviewImage'
const DETAIL_PREVIEW_MAX_AGE_MS = 5 * 60 * 1000
const getDisplayImageSource = (pose = {}) => (
  pose.detailImage || pose.thumbnailImage || pose.guideImage || ''
)
const getShareImageSource = (pose = {}) => (
  pose.shareImage || pose.thumbnailImage || pose.detailImage || pose.modelImage || pose.guideImage || ''
)
const buildTopicPoseIds = (topic = {}) => {
  const poseIds = [
    ...(topic.plans || []).map((plan) => plan.poseId),
    ...(topic.morePoseIds || [])
  ].filter(Boolean)

  return Array.from(new Set(poseIds)).filter((poseId) => getPose(poseId))
}
const isGalleryPreviewImage = (image = '') => String(image).includes('/static/gallery_thumbs/')
const consumeDetailPreviewImage = (poseId) => {
  try {
    const preview = wx.getStorageSync(DETAIL_PREVIEW_IMAGE_KEY) || {}
    wx.removeStorageSync(DETAIL_PREVIEW_IMAGE_KEY)

    if (
      preview.poseId !== poseId ||
      !isGalleryPreviewImage(preview.image) ||
      Date.now() - Number(preview.createdAt || 0) > DETAIL_PREVIEW_MAX_AGE_MS
    ) {
      return ''
    }

    return preview.image
  } catch (error) {
    return ''
  }
}
const appendImageRetryToken = (url = '', retryToken = '') => {
  if (!retryToken || !/^https?:\/\//.test(url)) {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_retry=${retryToken}`
}

const compactText = (text = '') => String(text || '').replace(/\s+/g, ' ').trim()
const trimGuideText = (text = '') => compactText(text)
  .replace(/^[：:，,；;、。.\s]+|[：:，,；;、。.\s]+$/g, '')
const DETAIL_SECTION_TITLES = {
  适合场景与拍摄要点: '场景与拍摄',
  适合场景: '适合场景',
  拍照指导: '拍摄指导',
  关键动作角度: '动作角度',
  关键动作: '关键动作',
  角度要点: '角度要点',
  注意事项: '注意事项',
  核心口诀: '核心口诀'
}
const DETAIL_SECTION_LABELS = Object.keys(DETAIL_SECTION_TITLES)
  .sort((a, b) => b.length - a.length)
const DETAIL_SECTION_PATTERN = new RegExp(`(${DETAIL_SECTION_LABELS.join('|')})[:：]?`, 'g')
const splitGuideLines = (text = '') => {
  const value = trimGuideText(text)

  if (!value) {
    return []
  }

  const semicolonParts = value
    .split(/[；;]/)
    .map((item) => trimGuideText(item))
    .filter(Boolean)

  if (semicolonParts.length > 1) {
    return semicolonParts
  }

  const sentenceParts = value
    .split(/[。.!！?？]/)
    .map((item) => trimGuideText(item))
    .filter(Boolean)

  return sentenceParts.length > 1 ? sentenceParts : [value]
}
const buildDetailSections = (text = '') => {
  const value = compactText(text)
  const matches = []
  let match = DETAIL_SECTION_PATTERN.exec(value)

  while (match) {
    matches.push({
      label: match[1],
      index: match.index,
      endIndex: match.index + match[0].length
    })
    match = DETAIL_SECTION_PATTERN.exec(value)
  }

  DETAIL_SECTION_PATTERN.lastIndex = 0

  if (!matches.length) {
    const lines = splitGuideLines(value)

    return lines.length ? [{ id: 'plain', title: '动作说明', lines }] : []
  }

  const sections = []
  const overviewText = trimGuideText(value.slice(0, matches[0].index))
  const overviewLines = splitGuideLines(overviewText)

  if (overviewLines.length) {
    sections.push({
      id: 'overview',
      title: '姿势概述',
      lines: overviewLines
    })
  }

  matches.forEach((item, index) => {
    const nextItem = matches[index + 1]
    const sectionText = trimGuideText(value.slice(item.endIndex, nextItem ? nextItem.index : value.length))
    const lines = splitGuideLines(sectionText)

    if (!lines.length) {
      return
    }

    sections.push({
      id: `${item.label}-${index}`,
      title: DETAIL_SECTION_TITLES[item.label] || item.label,
      tone: item.label === '核心口诀' ? 'highlight' : '',
      lines
    })
  })

  return sections
}
const getTextAfterLabel = (text = '', label = '') => {
  const index = text.indexOf(label)

  if (index < 0) {
    return ''
  }

  return text.slice(index + label.length).replace(/^[:：]/, '')
}

const getPreferredActionText = (text = '') => {
  const value = compactText(text)
  const coreText = getTextAfterLabel(value, '核心口诀')

  if (coreText) {
    return coreText
  }

  const actionText = getTextAfterLabel(value, '关键动作')

  if (actionText) {
    return actionText
      .split(/角度要点|注意事项|适合场景与拍摄要点|适合场景/)
      .filter(Boolean)[0] || actionText
  }

  return value
}

const TEMPLATE_GUIDE_PATTERNS = [
  /参考轮廓完成画面中的站姿和手部动作/,
  /按轮廓对齐(?:坐姿、站姿和手部动作|姿势和构图)/,
  /人物在.+场景中完成[“"][^”"]+[”"]动作/,
  /在.+完成[“"][^”"]+[”"].*(?:适合拍|旅行|打卡|专题)/,
  /让(?:人物)?姿态、手部动作和背景(?:地标)?同时入镜/,
  /拍摄时保留.+环境特征/,
  /拍摄时.*适合拍/,
  /适合作为.+专题里.*参考/,
  /推荐.+景点旅行打卡/
]
const isTemplateGuideText = (text = '') => {
  const value = compactText(text)

  if (!value) {
    return false
  }

  return TEMPLATE_GUIDE_PATTERNS.some((pattern) => pattern.test(value))
}
const isSceneOnlyActionPoint = (text = '') => {
  const value = compactText(text)

  return /^(人物|画面中.*人物)?(?:站|坐|蹲|行走|置身)?在.+(?:前|中|旁|边|里|下|上)$/.test(value) ||
    /完成[“"][^”"]+[”"]动作|动作重点包括/.test(value) ||
    /背景|古建|地标|环境特征|旅行打卡氛围|适合作为|专题/.test(value) ||
    /^(黑色|白色|红色|蓝色|绿色|黄色|米色|灰色|芥末黄|身着|佩戴|长发|短发|裙|西装|衬衫|项链|耳环|帽子)/.test(value)
}
const hasActionSignal = (text = '') => /手|臂|肘|身体|侧身|背对|正面|回眸|回头|头部|侧头|低头|仰头|眼神|视线|表情|嘴|肩|腰|腿|脚|坐|蹲|站|走|靠|扶|倚|举|抬|托|捧|持|拿|握|插兜|叉腰|提裙|转身|前倾|后仰|踮脚/.test(text)
const dedupeActionPoints = (points = []) => {
  const seen = new Set()

  return points.filter((point) => {
    const key = compactText(point)

    if (!key || seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}
const removePoseNamePrefix = (text = '', pose = {}) => {
  let value = compactText(text)

  ;[
    pose.landmarkName,
    pose.cityName,
    pose.categoryName,
    '北京',
    '芒市',
    '腾冲',
    '和顺古镇',
    '天坛',
    '长城',
    '鼓楼',
    '银塔',
    '金塔',
    '杭州',
    '西湖',
    '城市街头',
    '街头',
    '咖啡馆',
    '咖啡店',
    '海边夕阳',
    '夕阳',
    '秋天落叶',
    '银杏',
    '景点',
    '姿势'
  ].filter(Boolean).forEach((word) => {
    value = value.replace(new RegExp(word, 'g'), '')
  })

  return value.replace(/^\d+|^\s+|\s+$/g, '')
}
const buildActionPointsFromName = (pose = {}) => {
  const phrase = removePoseNamePrefix(pose.name || '', pose)
  const points = []

  if (!phrase) {
    return points
  }

  if (/侧身/.test(phrase)) {
    points.push('身体侧向镜头，肩膀打开，保留侧身线条')
  } else if (/背对|背影/.test(phrase)) {
    points.push('身体背对镜头，肩膀放松，头部不要僵硬')
  } else if (/正面|正站|正对/.test(phrase)) {
    points.push('身体正面站稳，双肩放松，重心保持稳定')
  } else if (/站|站姿|站立/.test(phrase)) {
    points.push('身体站稳后把肩膀放松，重心不要左右晃')
  } else if (/半身|近景/.test(phrase)) {
    points.push('上半身微微挺住，肩颈放松，脸和手都留在画面里')
  }

  if (/回眸|回头/.test(phrase)) {
    points.push('头部回看镜头，眼神先到位，身体不要完全转正')
  } else if (/低头/.test(phrase)) {
    points.push('头部自然低下，视线落在手部或地面附近')
  } else if (/仰头|望远|眺望/.test(phrase)) {
    points.push('头部微微上扬，视线看向远处或画面外')
  } else if (/侧头/.test(phrase)) {
    points.push('头部轻轻侧向一边，脖颈保持舒展')
  }

  if (/电话|手机/.test(phrase) && !/自拍/.test(phrase)) {
    points.push('一手把手机贴近耳边，手肘自然抬起')
  }
  if (/自拍/.test(phrase)) {
    points.push('手臂向外举起手机，镜头略高于眼睛，脸部放松看向屏幕')
  }
  if (/比耶|比心|爱心/.test(phrase)) {
    points.push('手指做出清晰手势，手腕放松，手不要挡住脸')
  }
  if (/插兜/.test(phrase)) {
    points.push('手自然插入口袋，手肘微微外打开，肩膀不要耸起')
  }
  if (/抱臂|双手交叉/.test(phrase)) {
    points.push('双臂轻轻交叠在身前，肩膀放松，身体保持打开')
  }
  if (/手背身后/.test(phrase)) {
    points.push('双手放到身后，肩膀向后打开，背部线条保持舒展')
  }
  if (/叉腰/.test(phrase)) {
    points.push('一手叉腰留出腰部空隙，另一手自然放松')
  }
  if (/趴/.test(phrase)) {
    points.push('身体轻趴在桌面或栏杆上，手臂垫出层次，脸不要压变形')
  }
  if (/撑/.test(phrase)) {
    points.push('手掌轻撑栏杆或桌面，手臂有支点但不要把身体压塌')
  }
  if (/扶|靠|倚/.test(phrase)) {
    points.push('身体轻靠支撑物，手扶边缘但不要用力压住')
  }
  if (/招手|打招呼/.test(phrase)) {
    points.push('手掌抬到肩膀以上轻轻招手，手肘留出弧度')
  }
  if (/举|抬|指向上/.test(phrase)) {
    points.push('手臂向上抬起，手指放松，避免贴住头发或脸')
  }
  if (/张开双臂|双臂舒展|手臂打开|张开双手/.test(phrase)) {
    points.push('双臂向两侧打开，手肘微弯，肩膀下沉不要耸肩')
  }
  if (/坐/.test(phrase)) {
    points.push('坐在边缘位置，上半身挺住，腿部留出延伸感')
  }
  if (/蹲/.test(phrase)) {
    points.push('身体蹲低但背部别塌，膝盖和手部形成稳定三角')
  }
  if (/仰躺|躺/.test(phrase)) {
    points.push('身体顺着地面放松躺下，头部微抬看向镜头，手脚不要僵直')
  }
  if (/抱膝/.test(phrase)) {
    points.push('双手轻抱膝盖，上半身向前收一点，背部仍然保持挺直')
  }
  if (/提裙/.test(phrase)) {
    points.push('手指轻提裙摆，手腕放松，裙摆保留自然弧度')
  }
  if (/撩发|扶头发|摸头发|握住头发/.test(phrase)) {
    points.push('手指轻碰头发或发尾，手肘向外打开，动作像随手整理')
  }
  if (/扶帽|帽檐|戴渔夫帽/.test(phrase)) {
    points.push('指尖轻扶帽檐，手肘自然外开，头部顺着手势微侧')
  }
  if (/托腮|托脸|捧脸|托下巴|撑脸/.test(phrase)) {
    points.push('手掌轻托脸侧或下巴，手指放松，脸不要压变形')
  }
  if (/捧(?!脸)|托(?!腮|脸|下巴)/.test(phrase)) {
    points.push('双手轻捧或托住道具，手指自然散开不要并拢')
  }
  if (/拿包|手扶包|购物袋|圆包|草编包/.test(phrase)) {
    points.push('手自然拿住包或购物袋，手臂和身体之间留出空隙')
  }
  if (/奶茶|举杯|叉子|蛋糕|甜点|盘|花|鲜花|捧书|看书|持伞|撑伞|抓树枝|捡落叶|拿叶|展示/.test(phrase)) {
    points.push('道具拿到画面看得清的位置，手指放松，动作不要挡脸')
  }
  if (/假装拍|假装拍照|拍夕阳/.test(phrase)) {
    points.push('双手举到眼前做拍照动作，视线跟着手部看向远处')
  }
  if (/走|行走|迈步|奔跑/.test(phrase)) {
    points.push('真的迈步连拍，前脚落地，后脚脚尖自然带起')
  }
  if (/笑|微笑|甜笑|欢笑/.test(phrase)) {
    points.push('表情放松自然，嘴角轻轻带笑，不要用力挤表情')
  }

  if (points.length > 0 && points.length < MAX_ACTION_POINTS) {
    points.push('手部按轮廓找到落点，手指自然放松不要并拢')
    points.push(/坐|蹲|盘腿/.test(phrase)
      ? '腿部按轮廓摆出层次，上半身不要塌下去'
      : '腿脚和身体重心先站稳，再调整头部和眼神方向')
  }

  if (!points.length) {
    points.push(`照着“${phrase}”这个动作摆，先对齐身体轮廓`)
    points.push('手部不要空垂，按轮廓找到清晰落点')
    points.push('头部和眼神跟随动作方向，避免僵硬看镜头')
  }

  return dedupeActionPoints(points).slice(0, MAX_ACTION_POINTS)
}
const trimActionPoint = (text = '') => {
  const value = compactText(text)
    .replace(/^(拍摄时|关键动作|角度要点|注意事项|人物|身体|高处的手|低处的手)[:：]?/, '')
    .replace(/[，,]?适合拍.*$/, '')
    .replace(/^(最适合|适合).*/, '')
    .replace(/\s*\d+°\s*/g, '')
    .replace(/的手臂/g, '手臂')
    .replace(/另一只手/g, '一手')
    .replace(/一只手/g, '一手')
    .replace(/另一条腿/g, '一腿')
    .replace(/向斜上方/g, '斜上方')
    .replace(/自然伸展出/g, '伸出')
    .replace(/伸展出/g, '伸出')
    .trim()

  return value
}
const splitActionPoints = (text = '') => {
  const value = getPreferredActionText(text)
  const points = value
    .split(/[、，,；;。.!！?？]/)
    .map((item) => trimActionPoint(item))
    .filter((item) => item && hasActionSignal(item) && !isSceneOnlyActionPoint(item))

  return dedupeActionPoints(points).slice(0, MAX_ACTION_POINTS)
}
const buildDetailGuide = (pose = {}, shootingGuide = null) => {
  const actionText = compactText(shootingGuide && shootingGuide.actionText) ||
    compactText(pose.description)
  const compositionText = compactText(shootingGuide && shootingGuide.compositionText)
  const imageText = compositionText || compactText(pose.tip)
  const hasTemplateGuideText = isTemplateGuideText(actionText)
  const parsedActionPoints = splitActionPoints(actionText)
  const fallbackActionPoints = buildActionPointsFromName(pose)
  const actionPoints = (
    hasTemplateGuideText
      ? fallbackActionPoints
      : parsedActionPoints.length < MAX_ACTION_POINTS
        ? dedupeActionPoints([...parsedActionPoints, ...fallbackActionPoints])
        : parsedActionPoints
  ).slice(0, MAX_ACTION_POINTS)
  const displayActionText = hasTemplateGuideText ? actionPoints.join('；') : actionText
  const detailItems = [
    { label: '画面', text: compositionText },
    { label: '动作', text: displayActionText, sections: buildDetailSections(displayActionText) }
  ].filter((item) => item.text)

  return {
    imageText,
    actionPoints,
    detailItems,
    hasImageText: Boolean(imageText),
    hasActionPoints: actionPoints.length > 0,
    hasDetails: detailItems.length > 0
  }
}

Page({
  data: {
    poseId: '',
    pose: null,
    displayImage: '',
    displayImageSource: '',
    previewImage: '',
    highResImage: '',
    highResImageSource: '',
    highResImageLoading: false,
    highResImageLoadFailed: false,
    highResImageRetryVisible: false,
    highResImageFallbackTried: false,
    cachedShareImage: '',
    imageLoading: false,
    imageLoadFailed: false,
    imageRetryVisible: false,
    displayImageFallbackTried: false,
    preloadedGuideImage: '',
    preloadedCameraImages: [],
    shootingGuide: null,
    detailGuide: null,
    detailExpanded: false,
    sourceTopic: null,
    topicPoseIds: [],
    topicPoseIndex: -1,
    bottomSwitchHintVisible: false,
    shareTask: {
      visible: false
    },
    isFavorite: false
  },

  onLoad(options = {}) {
    this.loadPoseDetail(options)
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  loadPoseDetail(options = {}) {
    const pose = getPose(options.poseId)

    if (!pose) {
      wx.showToast({
        title: '姿势不存在',
        icon: 'none'
      })
      this.backToHome()
      return
    }

    const favoritePoseIds = getFavoritePoseIds()
    const poseWithFavorite = withFavoriteState(pose, favoritePoseIds)
    const shootingGuide = getShootingGuide(pose)
    const detailGuide = buildDetailGuide(pose, shootingGuide)
    const sourceTopic = options.topicId ? getSceneTopic(options.topicId) : null
    const topicPoseIds = sourceTopic ? buildTopicPoseIds(sourceTopic) : []
    const topicPoseIndex = topicPoseIds.indexOf(pose.id)
    const previewImage = consumeDetailPreviewImage(pose.id)

    this.clearDetailImageLoadTimer()
    this.clearHighResImageLoadTimer()
    this.clearDetailImageRetryTimer()
    this.clearHighResImageRetryTimer()

    this.setData({
      poseId: pose.id,
      pose: poseWithFavorite,
      displayImage: previewImage,
      displayImageSource: getDisplayImageSource(poseWithFavorite),
      previewImage,
      highResImage: '',
      highResImageSource: '',
      highResImageLoading: false,
      highResImageLoadFailed: false,
      highResImageRetryVisible: false,
      highResImageFallbackTried: false,
      cachedShareImage: '',
      imageLoading: !previewImage,
      imageLoadFailed: false,
      imageRetryVisible: false,
      displayImageFallbackTried: false,
      preloadedGuideImage: '',
      preloadedCameraImages: [],
      shootingGuide,
      detailGuide,
      detailExpanded: false,
      sourceTopic,
      topicPoseIds,
      topicPoseIndex,
      shareTask: buildPhotographerTask(poseWithFavorite),
      isFavorite: poseWithFavorite.isFavorite
    })

    recordPoseUsage('view_pose', pose.id, {
      source: 'pose_detail'
    })

    this.loadDetailImages(poseWithFavorite)
    this.cachePoseShareImage(poseWithFavorite)
  },

  stopPullDownRefresh() {
    if (typeof wx.stopPullDownRefresh === 'function') {
      wx.stopPullDownRefresh()
    }
  },

  clearBottomSwitchReady() {
    if (this.bottomSwitchReadyTimer) {
      clearTimeout(this.bottomSwitchReadyTimer)
      this.bottomSwitchReadyTimer = null
    }

    this.bottomSwitchReady = false
    this.bottomSwitchStartY = 0
    this.bottomSwitchArmedGestureId = 0

    if (this.data.bottomSwitchHintVisible) {
      this.setData({
        bottomSwitchHintVisible: false
      })
    }
  },

  armBottomSwitch() {
    const topicPoseIds = this.data.topicPoseIds || []
    const topicPoseIndex = this.data.topicPoseIndex
    const sourceTopic = this.data.sourceTopic
    const hasNextPose = topicPoseIndex >= 0 && topicPoseIndex < topicPoseIds.length - 1

    if (!sourceTopic || !topicPoseIds.length || topicPoseIndex < 0) {
      this.clearBottomSwitchReady()
      return
    }

    if (!hasNextPose) {
      this.clearBottomSwitchReady()
      this.showTopicBoundaryToast(1)
      return
    }

    this.bottomSwitchReady = true
    this.bottomSwitchStartY = this.lastTouchY || 0
    this.bottomSwitchArmedGestureId = this.touchGestureId || 0

    if (!this.data.bottomSwitchHintVisible) {
      this.setData({
        bottomSwitchHintVisible: true
      })
    }

    if (this.bottomSwitchReadyTimer) {
      clearTimeout(this.bottomSwitchReadyTimer)
    }

    this.bottomSwitchReadyTimer = setTimeout(() => {
      this.clearBottomSwitchReady()
    }, BOTTOM_SWITCH_ARM_DURATION)
  },

  showTopicBoundaryToast(direction) {
    wx.showToast({
      title: direction < 0 ? '已经是第一个姿势' : '已经是最后一个姿势',
      icon: 'none'
    })
  },

  switchTopicPose(direction) {
    if (this.topicPoseSwitching) {
      return
    }

    const topicPoseIds = this.data.topicPoseIds || []
    const topicPoseIndex = this.data.topicPoseIndex
    const sourceTopic = this.data.sourceTopic

    if (!sourceTopic || !topicPoseIds.length || topicPoseIndex < 0) {
      wx.showToast({
        title: '当前没有专题上下张',
        icon: 'none'
      })
      return
    }

    const nextIndex = topicPoseIndex + direction

    if (nextIndex < 0 || nextIndex >= topicPoseIds.length) {
      this.showTopicBoundaryToast(direction)
      return
    }

    const nextPoseId = topicPoseIds[nextIndex]

    this.topicPoseSwitching = true
    this.clearBottomSwitchReady()
    this.loadPoseDetail({
      poseId: nextPoseId,
      topicId: sourceTopic.id
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    setTimeout(() => {
      this.topicPoseSwitching = false
    }, 300)
  },

  onReachBottom() {
    this.armBottomSwitch()
  },

  onPageTouchStart(event) {
    const touch = event.touches && event.touches[0]

    this.touchGestureId = (this.touchGestureId || 0) + 1
    this.touchStartY = touch ? touch.clientY : 0
    this.lastTouchY = this.touchStartY
    if (this.bottomSwitchReady) {
      this.bottomSwitchStartY = this.touchStartY
    }
  },

  onPageTouchMove(event) {
    const touch = event.touches && event.touches[0]

    if (!touch) {
      return
    }

    this.lastTouchY = touch.clientY
  },

  onPageTouchEnd(event) {
    const changedTouch = event.changedTouches && event.changedTouches[0]
    const endY = changedTouch ? changedTouch.clientY : this.lastTouchY
    const isGestureAfterBottomArmed = this.bottomSwitchReady &&
      this.touchGestureId !== this.bottomSwitchArmedGestureId
    const pulledAfterBottom = this.bottomSwitchStartY
      ? this.bottomSwitchStartY - endY
      : 0

    if (isGestureAfterBottomArmed && pulledAfterBottom >= BOTTOM_SWITCH_PULL_THRESHOLD) {
      this.switchTopicPose(1)
      return
    }

    if (this.bottomSwitchReady) {
      this.armBottomSwitch()
    }
  },

  onPageTouchCancel() {
    this.touchStartY = 0
    this.lastTouchY = 0
  },

  onPullDownRefresh() {
    this.switchTopicPose(-1)
    wx.nextTick(() => {
      this.stopPullDownRefresh()
    })
    setTimeout(() => {
      this.stopPullDownRefresh()
    }, 120)
  },

  onShow() {
    const pose = getPose(this.data.poseId)

    if (!pose) {
      return
    }

    const cachedShareImage = this.data.cachedShareImage
    const poseWithFavorite = {
      ...withFavoriteState(pose, getFavoritePoseIds()),
      ...(cachedShareImage ? { cachedShareImage } : {})
    }

    this.setData({
      pose: poseWithFavorite,
      isFavorite: poseWithFavorite.isFavorite,
      shareTask: buildPhotographerTask(poseWithFavorite)
    })

    if (poseWithFavorite.isFavorite) {
      getCachedFavoritePoseAssets(poseWithFavorite).then((localPose) => {
        if (this.data.poseId !== poseWithFavorite.id) {
          return
        }

        this.setData({
          pose: {
            ...withFavoriteState(localPose, getFavoritePoseIds()),
            ...(this.data.cachedShareImage ? { cachedShareImage: this.data.cachedShareImage } : {})
          }
        })
      })
    }
  },

  onUnload() {
    this.clearDetailImageLoadTimer()
    this.clearHighResImageLoadTimer()
    this.clearDetailImageRetryTimer()
    this.clearHighResImageRetryTimer()
    this.clearBottomSwitchReady()
  },

  prefetchGuideImage(pose, requestId = this.detailImageRequestId, retryToken = '') {
    if (!pose || !pose.guideImage) {
      return
    }

    const guideImage = appendImageRetryToken(pose.guideImage, retryToken)

    this.setData({
      preloadedGuideImage: guideImage
    })

    cacheImage(guideImage).then((cachedGuideImage) => {
      if (
        this.detailImageRequestId !== requestId ||
        this.data.poseId !== pose.id ||
        this.data.preloadedGuideImage !== guideImage
      ) {
        return
      }

      this.setData({
        preloadedGuideImage: cachedGuideImage
      })
    }).catch(() => {})
  },

  preheatCameraImages(pose) {
    if (!pose) {
      return
    }

    const preloadedCameraImages = Array.from(new Set([
      pose.guideImage,
      pose.modelImage
    ].filter(Boolean)))

    if (preloadedCameraImages.length) {
      this.setData({
        preloadedCameraImages
      })
    }

    preloadedCameraImages.forEach((image) => {
      cacheImage(image).catch(() => {})
    })
  },

  cachePoseShareImage(pose = {}) {
    const shareImage = getShareImageSource(pose)

    if (!shareImage) {
      return
    }

    cacheImage(shareImage).then((cachedShareImage) => {
      if (
        !cachedShareImage ||
        cachedShareImage === shareImage ||
        this.data.poseId !== pose.id
      ) {
        return
      }

      const currentPose = this.data.pose || {}

      this.setData({
        cachedShareImage,
        pose: {
          ...currentPose,
          cachedShareImage
        }
      })
    }).catch(() => {})
  },

  clearDetailImageLoadTimer() {
    if (this.detailImageLoadTimer) {
      clearTimeout(this.detailImageLoadTimer)
      this.detailImageLoadTimer = null
    }
  },

  clearHighResImageLoadTimer() {
    if (this.highResImageLoadTimer) {
      clearTimeout(this.highResImageLoadTimer)
      this.highResImageLoadTimer = null
    }
  },

  clearDetailImageRetryTimer() {
    if (this.detailImageRetryTimer) {
      clearTimeout(this.detailImageRetryTimer)
      this.detailImageRetryTimer = null
    }
  },

  clearHighResImageRetryTimer() {
    if (this.highResImageRetryTimer) {
      clearTimeout(this.highResImageRetryTimer)
      this.highResImageRetryTimer = null
    }
  },

  startDetailImageRetryTimer() {
    this.clearDetailImageRetryTimer()

    this.detailImageRetryTimer = setTimeout(() => {
      this.detailImageRetryTimer = null
      if (!this.data.imageLoadFailed || !this.data.imageRetryVisible) {
        return
      }

      this.setData({
        imageRetryVisible: false
      })
    }, IMAGE_RETRY_VISIBLE_DURATION)
  },

  startHighResImageRetryTimer() {
    this.clearHighResImageRetryTimer()

    this.highResImageRetryTimer = setTimeout(() => {
      this.highResImageRetryTimer = null
      if (!this.data.highResImageLoadFailed || !this.data.highResImageRetryVisible) {
        return
      }

      this.setData({
        highResImageRetryVisible: false
      })
    }, IMAGE_RETRY_VISIBLE_DURATION)
  },

  startDetailImageLoadTimer(requestId) {
    this.clearDetailImageLoadTimer()

    this.detailImageLoadTimer = setTimeout(() => {
      if (this.detailImageRequestId !== requestId || !this.data.imageLoading) {
        return
      }

      this.detailImageLoadTimer = null
      this.setData({
        imageLoading: false,
        imageLoadFailed: true,
        imageRetryVisible: true
      })
      this.startDetailImageRetryTimer()
    }, DETAIL_IMAGE_LOAD_TIMEOUT)
  },

  startHighResImageLoadTimer(requestId) {
    this.clearHighResImageLoadTimer()

    this.highResImageLoadTimer = setTimeout(() => {
      if (this.detailImageRequestId !== requestId || !this.data.highResImageLoading) {
        return
      }

      this.highResImageLoadTimer = null
      this.setData({
        highResImageLoading: false,
        highResImageLoadFailed: true,
        highResImageRetryVisible: true
      })
      this.startHighResImageRetryTimer()
    }, DETAIL_IMAGE_LOAD_TIMEOUT)
  },

  loadDetailImages(pose) {
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId
    const initialDisplayImage = getDisplayImageSource(pose)
    const previewImage = this.data.previewImage

    this.setData({
      displayImageSource: initialDisplayImage,
      highResImage: '',
      highResImageSource: '',
      highResImageLoading: false,
      highResImageLoadFailed: false,
      highResImageRetryVisible: false,
      highResImageFallbackTried: false,
      imageLoading: !previewImage,
      imageLoadFailed: false,
      imageRetryVisible: false,
      displayImageFallbackTried: false
    })
    this.clearDetailImageRetryTimer()
    this.clearHighResImageRetryTimer()
    if (!previewImage) {
      this.startDetailImageLoadTimer(requestId)
    }
    this.prefetchGuideImage(pose, requestId)

    const localPosePromise = pose.isFavorite
      ? getCachedFavoritePoseAssets(pose)
      : Promise.resolve(pose)

    localPosePromise.then((resolvedPose) => {
      if (this.detailImageRequestId !== requestId) {
        return null
      }

      const displayImage = getDisplayImageSource(resolvedPose)

      if (!displayImage) {
        throw new Error('missing detail image')
      }

      this.prefetchGuideImage(resolvedPose, requestId)
      this.preheatCameraImages(resolvedPose)
      if (pose.isFavorite) {
        cacheFavoritePoseAssets(pose).catch(() => {})
      } else {
        getCachedImagePath(displayImage).then((cachedImage) => {
          if (
            this.detailImageRequestId !== requestId ||
            !cachedImage
          ) {
            return
          }

          if (this.data.previewImage) {
            this.setData({
              highResImage: cachedImage
            })
            this.startHighResImageLoadTimer(requestId)
            return
          }

          if (!this.data.imageLoading) {
            return
          }

          this.setData({
            displayImage: cachedImage
          })
          this.startDetailImageLoadTimer(requestId)
        })
        cacheImage(displayImage).catch(() => {})
      }

      const hasPreviewImage = Boolean(this.data.previewImage)
      const nextData = {
        pose: {
          ...withFavoriteState(resolvedPose, getFavoritePoseIds()),
          ...(this.data.cachedShareImage ? { cachedShareImage: this.data.cachedShareImage } : {})
        },
        displayImage: this.data.displayImage || '',
        displayImageSource: initialDisplayImage || displayImage,
        highResImage: '',
        highResImageSource: '',
        highResImageLoading: false,
        highResImageLoadFailed: false,
        highResImageRetryVisible: false,
        highResImageFallbackTried: false,
        imageLoading: !hasPreviewImage,
        imageLoadFailed: false,
        imageRetryVisible: false,
        displayImageFallbackTried: false
      }

      if (hasPreviewImage) {
        nextData.highResImage = displayImage
        nextData.highResImageSource = displayImage
        nextData.highResImageLoading = true
        nextData.highResImageLoadFailed = false
        nextData.highResImageRetryVisible = false
        nextData.highResImageFallbackTried = false
      } else {
        nextData.displayImage = displayImage
      }

      this.setData(nextData)
      if (hasPreviewImage) {
        this.startHighResImageLoadTimer(requestId)
      } else {
        this.startDetailImageLoadTimer(requestId)
      }
    }).catch(() => {
      if (this.detailImageRequestId !== requestId) {
        return
      }

      this.clearDetailImageLoadTimer()
      this.clearHighResImageLoadTimer()
      const hasPreviewImage = Boolean(this.data.previewImage)

      this.setData({
        displayImageSource: initialDisplayImage,
        imageLoading: false,
        imageLoadFailed: !hasPreviewImage,
        imageRetryVisible: !hasPreviewImage,
        highResImageLoading: false,
        highResImageLoadFailed: hasPreviewImage,
        highResImageRetryVisible: hasPreviewImage
      })
      if (hasPreviewImage) {
        this.startHighResImageRetryTimer()
      } else {
        this.startDetailImageRetryTimer()
      }
      if (!hasPreviewImage) {
        wx.showToast({
          title: '大图加载失败',
          icon: 'none'
        })
      }
    })
  },

  backToHome() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: '/pages/home/index'
        })
      }
    })
  },

  async openCamera() {
    const accepted = await ensurePrivacyNotice('打开相机拍照')

    if (!accepted) {
      return
    }

    this.preheatCameraImages(this.data.pose || getPose(this.data.poseId))

    const topicQuery = this.data.sourceTopic && this.data.sourceTopic.id
      ? `&topicId=${this.data.sourceTopic.id}`
      : ''

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${this.data.poseId}${topicQuery}`
    })
  },

  toggleFavorite() {
    const result = togglePoseFavorite(this.data.poseId)
    const basePose = getPose(this.data.poseId)
    const pose = {
      ...withFavoriteState(basePose, result.favoritePoseIds),
      ...(this.data.cachedShareImage ? { cachedShareImage: this.data.cachedShareImage } : {})
    }

    this.setData({
      pose,
      isFavorite: result.isFavorite
    })

    wx.showToast({
      title: result.isFavorite ? '已收藏，缓存中' : '已取消收藏',
      icon: 'none'
    })

    if (result.isFavorite) {
      cacheFavoritePoseAssets(basePose).catch(() => {})
    } else {
      unpinFavoritePoseAssets(basePose)
    }
  },

  toggleDetailExpanded() {
    this.setData({
      detailExpanded: !this.data.detailExpanded
    })
  },

  onImageError() {
    const displayImage = this.data.displayImage
    const displayImageSource = this.data.displayImageSource

    if (!displayImage) {
      this.clearDetailImageLoadTimer()
      this.setData({
        imageLoading: false,
        imageLoadFailed: true,
        imageRetryVisible: true
      })
      this.startDetailImageRetryTimer()
      return
    }

    const fallbackImage = cdnAssetUrl(displayImageSource || displayImage)

    if (!this.data.displayImageFallbackTried && fallbackImage && fallbackImage !== displayImage) {
      this.setData({
        displayImage: fallbackImage,
        displayImageFallbackTried: true,
        imageLoading: true,
        imageLoadFailed: false,
        imageRetryVisible: false
      })
      this.clearDetailImageRetryTimer()
      this.startDetailImageLoadTimer(this.detailImageRequestId)
      return
    }

    this.clearDetailImageLoadTimer()
    this.setData({
      imageLoading: false,
      imageLoadFailed: true,
      imageRetryVisible: true
    })
    this.startDetailImageRetryTimer()
    wx.showToast({
      title: '大图加载失败',
      icon: 'none'
    })
  },

  onImageLoad() {
    this.clearDetailImageLoadTimer()
    this.setData({
      imageLoading: false,
      imageLoadFailed: false,
      imageRetryVisible: false
    })
    this.clearDetailImageRetryTimer()
  },

  onHighResImageLoad() {
    const highResImage = this.data.highResImage

    if (!highResImage) {
      return
    }

    this.clearHighResImageLoadTimer()
    this.setData({
      displayImage: highResImage,
      highResImageLoading: false,
      highResImageLoadFailed: false,
      highResImageRetryVisible: false,
      highResImageFallbackTried: false
    })
    this.clearHighResImageRetryTimer()
  },

  onHighResImageError() {
    const highResImage = this.data.highResImage
    const sourceImage = this.data.highResImageSource || this.data.displayImageSource || highResImage
    const fallbackImage = cdnAssetUrl(sourceImage)

    if (!this.data.highResImageFallbackTried && fallbackImage && fallbackImage !== highResImage) {
      this.setData({
        highResImage: fallbackImage,
        highResImageFallbackTried: true,
        highResImageLoading: true,
        highResImageLoadFailed: false,
        highResImageRetryVisible: false
      })
      this.clearHighResImageRetryTimer()
      this.startHighResImageLoadTimer(this.detailImageRequestId)
      return
    }

    this.clearHighResImageLoadTimer()
    this.setData({
      highResImageLoading: false,
      highResImageLoadFailed: true,
      highResImageRetryVisible: true
    })
    this.startHighResImageRetryTimer()
  },

  retryHighResImage() {
    const pose = this.data.pose || getPose(this.data.poseId)
    const sourceImage = this.data.displayImageSource || getDisplayImageSource(pose)

    if (!sourceImage) {
      return
    }

    const retryToken = Date.now()
    const retryImage = appendImageRetryToken(sourceImage, retryToken)
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId

    this.setData({
      highResImage: retryImage,
      highResImageSource: sourceImage,
      highResImageLoading: true,
      highResImageLoadFailed: false,
      highResImageRetryVisible: false,
      highResImageFallbackTried: false
    })
    this.clearHighResImageRetryTimer()
    this.startHighResImageLoadTimer(requestId)
    this.prefetchGuideImage(pose, requestId, retryToken)
    cacheImage(retryImage).catch(() => {})
  },

  retryDetailImage() {
    const pose = this.data.pose || getPose(this.data.poseId)
    const sourceImage = this.data.displayImageSource || getDisplayImageSource(pose)

    if (!sourceImage) {
      this.setData({
        imageLoading: false,
        imageLoadFailed: true,
        imageRetryVisible: true
      })
      this.startDetailImageRetryTimer()
      return
    }

    const retryToken = Date.now()
    const retryImage = appendImageRetryToken(sourceImage, retryToken)
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId

    this.setData({
      displayImage: retryImage,
      displayImageSource: sourceImage,
      imageLoading: true,
      imageLoadFailed: false,
      imageRetryVisible: false,
      displayImageFallbackTried: false
    })
    this.clearDetailImageRetryTimer()
    this.startDetailImageLoadTimer(requestId)
    this.prefetchGuideImage(pose, requestId, retryToken)
    cacheImage(retryImage).catch(() => {})
  },

  onShareAppMessage(options = {}) {
    const pose = this.data.pose || {}
    const poseId = this.data.poseId
    const sourceTopic = this.data.sourceTopic
    const preferredImage = this.data.displayImage || this.data.previewImage || ''
    const shareType = options.target && options.target.dataset
      ? options.target.dataset.shareType
      : ''

    if (shareType === 'photographer') {
      return buildPoseShare(pose, {
        poseId,
        role: 'photographer',
        preferredImage,
        path: `/pages/camera/index?poseId=${poseId}`
      })
    }

    if (shareType === 'pose') {
      return buildPoseShare(pose, {
        poseId,
        role: 'detail',
        preferredImage
      })
    }

    if (sourceTopic && sourceTopic.id) {
      return buildSceneShare({
        ...sourceTopic,
        cachedShareImage: pose.cachedShareImage || this.data.cachedShareImage || sourceTopic.cachedShareImage,
        preferredShareImage: preferredImage || sourceTopic.preferredShareImage,
        shareImage: pose.shareImage || sourceTopic.shareImage,
        coverImage: sourceTopic.coverImage || pose.thumbnailImage || pose.detailImage || pose.guideImage
      })
    }

    return buildPoseShare(pose, {
      poseId,
      role: 'detail',
      preferredImage
    })
  }
})
