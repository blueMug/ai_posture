const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImageFields } = require('../../utils/imageCache')
const { cdnAssetUrl, homeLocalAssetUrl, JSDELIVR_ASSET_BASE } = require('../../utils/assets')
const { isPoseFavorite, recordPoseUsage } = require('../../utils/userData')
const { ensurePrivacyNotice, hasAcceptedPrivacyNotice } = require('../../utils/privacy')
const { cacheFavoritePoseAssets } = require('../../utils/favoriteAssetCache')
const { SCENE_TOPIC_DETAIL_KEY } = require('../../utils/sceneTopics')
const { getGuideImageSize } = require('../../utils/guideImageSizes')

const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const GUIDE_MODE_STORAGE_KEY = 'cameraGuideMode'
const GUIDE_ROTATE_STORAGE_KEY = 'cameraGuideRotate90'
const CAMERA_ASPECT_STORAGE_KEY = 'cameraAspectRatio'
const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const CACHE_TEMPLATE_SUPPORT_IMAGE_FIELDS = ['thumbnailImage']
const POSE_GALLERY_ROUTE = 'pages/pose-gallery/index'
const POSE_GALLERY_URL = `/${POSE_GALLERY_ROUTE}`
const CAMERA_MIN_ZOOM = 1
const CAMERA_DEFAULT_MAX_ZOOM = 10
const GUIDE_MAX_OFFSET_X = 120
const GUIDE_MAX_OFFSET_Y = 160
const GUIDE_MIN_SCALE = 0.35
const GUIDE_MAX_SCALE = 2.2
const GUIDE_SCALE_STEP = 0.1
const BOTTOM_PANEL_RPX = 330
const CAMERA_VERTICAL_OFFSET_RPX = 36
const CAMERA_ASPECT_3_4 = '3:4'
const CAMERA_ASPECT_9_16 = '9:16'
const CAMERA_ASPECT_OPTIONS = [CAMERA_ASPECT_3_4, CAMERA_ASPECT_9_16]
const CAMERA_ASPECT_HEIGHT_RATIOS = {
  [CAMERA_ASPECT_3_4]: 4 / 3,
  [CAMERA_ASPECT_9_16]: 16 / 9
}
const STAGE_TOP_CAMERA_RATIO = 0.08
const STAGE_BOTTOM_CAMERA_RATIO = 0.04
const GUIDE_LEFT_RATIO = 0.07
const GUIDE_WIDTH_RATIO = 0.86
const GUIDE_TOP_IN_STAGE_RATIO = 0.08
const GUIDE_HEIGHT_IN_STAGE_RATIO = 0.88
const GUIDE_MODE_OUTLINE = 'outline'
const GUIDE_MODE_PHOTO = 'photo'
const COUNTDOWN_SECONDS_OPTIONS = [0, 3, 5, 10]
const CAMERA_GUIDE_TIP_DELAY = 500
const GUIDE_ROTATE_STEP = 90
const GUIDE_ROTATE_FULL_DEGREES = 360

let cameraGuideTipShownInSession = false

const isRemoteImage = (src = '') => /^https?:\/\//.test(src)
const getImageInfo = (src) => new Promise((resolve) => {
  if (!src) {
    resolve(null)
    return
  }

  wx.getImageInfo({
    src,
    success: resolve,
    fail: () => resolve(null)
  })
})

const hideTemplateGuide = (template) => ({
  ...template,
  guideImage: '',
  parts: []
})

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const isModelPose = (template) => Boolean(template && template.modelImage)
const canUseModelPhotoGuide = (template) => Boolean(isModelPose(template) && (template.thumbnailImage || template.modelImage))
const isSelfiePose = (template) => {
  if (!template) {
    return false
  }

  return [
    template.name,
    template.tip,
    template.description,
    template.categoryName
  ].some((text) => String(text || '').includes('自拍'))
}
const getDefaultDevicePosition = (template) => (isSelfiePose(template) ? 'front' : 'back')
const normalizeStoredGuideMode = (guideMode) => {
  if (guideMode === GUIDE_MODE_PHOTO || guideMode === 'yellow-photo') {
    return GUIDE_MODE_PHOTO
  }

  return GUIDE_MODE_OUTLINE
}
const getStoredGuideMode = () => normalizeStoredGuideMode(wx.getStorageSync(GUIDE_MODE_STORAGE_KEY))
const normalizeCameraAspectRatio = (aspectRatio) => (
  CAMERA_ASPECT_OPTIONS.includes(aspectRatio)
    ? aspectRatio
    : CAMERA_ASPECT_3_4
)
const getStoredCameraAspectRatio = () => normalizeCameraAspectRatio(wx.getStorageSync(CAMERA_ASPECT_STORAGE_KEY))
const getNextCameraAspectRatio = (aspectRatio) => (
  normalizeCameraAspectRatio(aspectRatio) === CAMERA_ASPECT_3_4
    ? CAMERA_ASPECT_9_16
    : CAMERA_ASPECT_3_4
)
const getCameraAspectText = (aspectRatio) => `比例 ${normalizeCameraAspectRatio(aspectRatio)}`
const getCameraHeightRatio = (aspectRatio) => CAMERA_ASPECT_HEIGHT_RATIOS[normalizeCameraAspectRatio(aspectRatio)]
const isGuidePhotoMode = (guideMode) => normalizeStoredGuideMode(guideMode) === GUIDE_MODE_PHOTO
const isGuideOutlineMode = (guideMode) => !isGuidePhotoMode(guideMode)
const normalizeGuideMode = (template, guideMode) => {
  const normalizedMode = normalizeStoredGuideMode(guideMode)

  return normalizedMode === GUIDE_MODE_PHOTO && !canUseModelPhotoGuide(template)
    ? GUIDE_MODE_OUTLINE
    : normalizedMode
}
const getNextGuideToggleState = (template, guideVisible, guideMode) => {
  const currentMode = normalizeGuideMode(template, guideMode)

  if (!guideVisible) {
    return {
      visible: true,
      mode: GUIDE_MODE_OUTLINE
    }
  }

  if (currentMode === GUIDE_MODE_OUTLINE && canUseModelPhotoGuide(template)) {
    return {
      visible: true,
      mode: GUIDE_MODE_PHOTO
    }
  }

  return {
    visible: false,
    mode: currentMode
  }
}
const getLocalStaticAssetPath = (src = '') => {
  if (src.startsWith('/static/')) {
    return src
  }

  const cdnStaticPrefix = `${JSDELIVR_ASSET_BASE}/static/`

  return src.startsWith(cdnStaticPrefix)
    ? `/static/${src.slice(cdnStaticPrefix.length)}`
    : ''
}
const toGalleryThumbnailImage = (src = '') => {
  const localStaticPath = getLocalStaticAssetPath(src) || src
  const galleryPath = localStaticPath
    .replace('/static/pose_pairs/', '/static/gallery_thumbs/')
    .replace('/static/pose_thumbs/', '/static/gallery_thumbs/')
    .replace('/static/recommend_thumbs/', '/static/gallery_thumbs/')

  if (/_demo\.jpg$/.test(galleryPath)) {
    return galleryPath.replace(/_demo\.jpg$/, '_gallery_thumb.jpg')
  }

  if (/_thumb\.jpg$/.test(galleryPath)) {
    return galleryPath.replace(/_thumb\.jpg$/, '_gallery_thumb.jpg')
  }

  return galleryPath
}
const getGalleryPhotoImage = (template = {}) => {
  const galleryImage = toGalleryThumbnailImage(template.modelImage || template.detailImage || template.thumbnailImage || '')

  return galleryImage.startsWith('/static/gallery_thumbs/')
    ? cdnAssetUrl(galleryImage)
    : ''
}
const getGuidePhotoImage = (template = {}) => (
  getGalleryPhotoImage(template) ||
  homeLocalAssetUrl(template.thumbnailImage || template.modelImage) ||
  template.thumbnailImage ||
  template.modelImage ||
  ''
)
const getCameraGuideImage = (src = '') => {
  const localStaticPath = getLocalStaticAssetPath(src)

  return localStaticPath || src
}
const getActiveGuideImage = (template, guideMode) => (
  isGuidePhotoMode(normalizeGuideMode(template, guideMode))
    ? getGuidePhotoImage(template)
    : getCameraGuideImage(template.guideImage)
)
const getGuideLayoutImageInfo = (src, imageInfo = null) => (
  imageInfo || getGuideImageSize(src) || null
)
const normalizeGuideRotateAngle = (angle) => {
  if (angle === true) {
    return GUIDE_ROTATE_STEP
  }

  const numericAngle = Number(angle || 0)

  if (!Number.isFinite(numericAngle)) {
    return 0
  }

  return ((Math.round(numericAngle / GUIDE_ROTATE_STEP) * GUIDE_ROTATE_STEP) % GUIDE_ROTATE_FULL_DEGREES + GUIDE_ROTATE_FULL_DEGREES) % GUIDE_ROTATE_FULL_DEGREES
}
const getNextGuideRotateAngle = (angle) => (
  (normalizeGuideRotateAngle(angle) + GUIDE_ROTATE_STEP) % GUIDE_ROTATE_FULL_DEGREES
)
const getTouchCenter = (touches) => ({
  x: (touches[0].pageX + touches[1].pageX) / 2,
  y: (touches[0].pageY + touches[1].pageY) / 2
})
const getTouchDistance = (touches) => {
  const deltaX = touches[0].pageX - touches[1].pageX
  const deltaY = touches[0].pageY - touches[1].pageY

  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}
const getGuideModeState = (template, guideMode) => {
  const nextGuideMode = normalizeGuideMode(template, guideMode)
  const isPhotoMode = isGuidePhotoMode(nextGuideMode)

  return {
    guideMode: nextGuideMode,
    guideModeText: isPhotoMode ? '照片' : '轮廓',
    guideToggleTitle: isPhotoMode ? '照片' : '轮廓',
    guideImageClass: isPhotoMode ? 'photo-guide-image' : 'outline-guide-image',
    guideIsOutline: isGuideOutlineMode(nextGuideMode),
    showModelToggle: Boolean(isModelPose(template) && template.thumbnailImage),
    modelToggleImage: isModelPose(template) ? getGuidePhotoImage(template) : ''
  }
}
const applyGuideMode = (template, guideVisible, guideMode) => {
  const nextGuideMode = normalizeGuideMode(template, guideMode)

  if (!guideVisible) {
    return hideTemplateGuide(template)
  }

  return {
    ...template,
    guideImage: getActiveGuideImage(template, nextGuideMode)
  }
}
const getAspectFitRect = (sourceWidth, sourceHeight, targetWidth, targetHeight) => {
  const sourceRatio = sourceWidth / sourceHeight
  const targetRatio = targetWidth / targetHeight

  if (sourceRatio > targetRatio) {
    const width = targetWidth
    const height = width / sourceRatio

    return {
      x: 0,
      y: (targetHeight - height) / 2,
      width,
      height
    }
  }

  const height = targetHeight
  const width = height * sourceRatio

  return {
    x: (targetWidth - width) / 2,
    y: 0,
    width,
    height
  }
}
const getGuideTransformStyle = (offsetX, offsetY, scale = 1, guideRotateAngle = 0) => (
  [
    `translate3d(${offsetX}px, ${offsetY}px, 0)`,
    `scale(${scale})`,
    `rotate(${normalizeGuideRotateAngle(guideRotateAngle)}deg)`
  ].filter(Boolean).join(' ')
)
const getGuideBoxStyle = (offsetX, offsetY, scale = 1, guideBoxRect = null, guideRotateAngle = 0) => (
  [
    guideBoxRect ? `left: ${guideBoxRect.left}px` : '',
    guideBoxRect ? `top: ${guideBoxRect.top}px` : '',
    guideBoxRect ? `width: ${guideBoxRect.width}px` : '',
    guideBoxRect ? `height: ${guideBoxRect.height}px` : '',
    'transform-origin: center center',
    `transform: ${getGuideTransformStyle(offsetX, offsetY, scale, guideRotateAngle)}`
  ].filter(Boolean).join('; ')
)
const getGuideScaleText = (scale) => `${Math.round(scale * 100)}%`
const getCameraPreviewLayout = (windowWidth, windowHeight, aspectRatio = CAMERA_ASPECT_3_4) => {
  const rpxToPx = windowWidth / 750
  const bottomPanelHeight = BOTTOM_PANEL_RPX * rpxToPx
  const cameraVerticalOffset = CAMERA_VERTICAL_OFFSET_RPX * rpxToPx
  const availableHeight = Math.max(windowHeight - bottomPanelHeight, 1)
  const cameraHeightRatio = getCameraHeightRatio(aspectRatio)
  const nativePhotoHeight = windowWidth * cameraHeightRatio
  const cameraHeight = Math.min(availableHeight, nativePhotoHeight)
  const frameWidth = Math.min(windowWidth, cameraHeight / cameraHeightRatio)
  const frameLeft = Math.max((windowWidth - frameWidth) / 2, 0)
  const maxCameraTop = Math.max(availableHeight - cameraHeight, 0)
  const cameraTop = Math.min(Math.max((availableHeight - cameraHeight) / 2 + cameraVerticalOffset, 0), maxCameraTop)

  return {
    frameLeft,
    frameWidth,
    cameraTop,
    cameraWidth: windowWidth,
    cameraHeight,
    availableHeight
  }
}
const getCameraStyle = (aspectRatio = getStoredCameraAspectRatio()) => {
  const systemInfo = wx.getSystemInfoSync()
  const windowWidth = Number(systemInfo.windowWidth || 375)
  const windowHeight = Number(systemInfo.windowHeight || 667)
  const { cameraTop, cameraWidth, cameraHeight } = getCameraPreviewLayout(windowWidth, windowHeight, aspectRatio)

  return `width: ${cameraWidth}px; height: ${cameraHeight}px; margin-top: ${cameraTop}px`
}
const getGuideStageLayout = (windowWidth, windowHeight, aspectRatio = getStoredCameraAspectRatio()) => {
  const { cameraHeight } = getCameraPreviewLayout(windowWidth, windowHeight, aspectRatio)
  const guideReferenceHeight = Math.min(cameraHeight, windowWidth * getCameraHeightRatio(CAMERA_ASPECT_3_4))
  const stageTop = guideReferenceHeight * STAGE_TOP_CAMERA_RATIO
  const stageBottom = guideReferenceHeight * STAGE_BOTTOM_CAMERA_RATIO
  const stageHeight = Math.max(guideReferenceHeight - stageTop - stageBottom, 1)
  const stageLeft = windowWidth * GUIDE_LEFT_RATIO
  const stageWidth = windowWidth * GUIDE_WIDTH_RATIO

  return {
    stageLeft,
    stageTop,
    stageWidth,
    stageHeight
  }
}
const getPoseStageStyle = (aspectRatio = getStoredCameraAspectRatio()) => {
  const systemInfo = wx.getSystemInfoSync()
  const windowWidth = Number(systemInfo.windowWidth || 375)
  const windowHeight = Number(systemInfo.windowHeight || 667)
  const { stageLeft, stageTop, stageWidth, stageHeight } = getGuideStageLayout(windowWidth, windowHeight, aspectRatio)

  return `left: ${stageLeft}px; top: ${stageTop}px; width: ${stageWidth}px; height: ${stageHeight}px`
}
const getPreviewShareSource = (poseId) => {
  const detail = wx.getStorageSync(SCENE_TOPIC_DETAIL_KEY)

  if (!detail || detail.poseId !== poseId) {
    return null
  }

  return {
    poseId,
    topicId: detail.topicId || '',
    sceneTitle: detail.sceneTitle || '',
    title: detail.title || '',
    badge: detail.badge || '',
    reason: detail.reason || ''
  }
}
const getGuideTransformState = (offsetX, offsetY, scale, guideBoxRect = null, guideRotateAngle = 0) => {
  const normalizedAngle = normalizeGuideRotateAngle(guideRotateAngle)

  return {
    guideOffsetX: offsetX,
    guideOffsetY: offsetY,
    guideScale: scale,
    guideScaleText: getGuideScaleText(scale),
    guideRotateAngle: normalizedAngle,
    guideBoxStyle: getGuideBoxStyle(offsetX, offsetY, scale, guideBoxRect, normalizedAngle),
    ...(guideBoxRect ? { guideBoxRect } : {})
  }
}
const getCameraGuideLayout = (guideImageInfo = null, aspectRatio = getStoredCameraAspectRatio()) => {
  const systemInfo = wx.getSystemInfoSync()
  const windowWidth = Number(systemInfo.windowWidth || 375)
  const windowHeight = Number(systemInfo.windowHeight || 667)
  const { cameraTop, cameraHeight } = getCameraPreviewLayout(windowWidth, windowHeight, aspectRatio)
  const { stageLeft, stageTop, stageWidth, stageHeight } = getGuideStageLayout(windowWidth, windowHeight, aspectRatio)
  const guideAreaTop = stageHeight * GUIDE_TOP_IN_STAGE_RATIO
  const guideAreaWidth = stageWidth
  const guideAreaHeight = stageHeight * GUIDE_HEIGHT_IN_STAGE_RATIO
  const imageWidth = Number(guideImageInfo && guideImageInfo.width)
  const imageHeight = Number(guideImageInfo && guideImageInfo.height)
  const fitRect = imageWidth > 0 && imageHeight > 0
    ? getAspectFitRect(imageWidth, imageHeight, guideAreaWidth, guideAreaHeight)
    : {
        x: 0,
        y: 0,
        width: guideAreaWidth,
        height: guideAreaHeight
      }
  const boxRect = {
    left: fitRect.x,
    top: guideAreaTop + fitRect.y,
    width: fitRect.width,
    height: fitRect.height
  }

  return {
    boxRect,
    previewRect: {
      left: stageLeft + boxRect.left,
      top: cameraTop + stageTop + boxRect.top,
      width: boxRect.width,
      height: boxRect.height
    },
    poseStageStyle: getPoseStageStyle(aspectRatio),
    cameraLeft: 0,
    cameraTop,
    cameraWidth: windowWidth,
    cameraHeight,
    baseWidth: windowWidth,
    baseHeight: windowHeight
  }
}
const getCameraGuideRect = (guideImageInfo = null, aspectRatio = getStoredCameraAspectRatio()) => {
  const { previewRect, ...layout } = getCameraGuideLayout(guideImageInfo, aspectRatio)

  return {
    ...previewRect,
    ...layout
  }
}
const getGuideLayoutState = (guideImageInfo, offsetX = 0, offsetY = 0, scale = 1, guideRotateAngle = 0, aspectRatio = getStoredCameraAspectRatio()) => {
  const layout = getCameraGuideLayout(guideImageInfo, aspectRatio)
  const guidePreviewRect = {
    ...layout.previewRect,
    poseStageStyle: layout.poseStageStyle,
    cameraLeft: layout.cameraLeft,
    cameraTop: layout.cameraTop,
    cameraWidth: layout.cameraWidth,
    cameraHeight: layout.cameraHeight,
    baseWidth: layout.baseWidth,
    baseHeight: layout.baseHeight
  }

  return {
    guidePreviewRect,
    poseStageStyle: layout.poseStageStyle,
    ...getGuideTransformState(offsetX, offsetY, scale, layout.boxRect, guideRotateAngle)
  }
}
const getPreviewGuideStyle = (offsetX, offsetY, guideScale, guideMode, rect = getCameraGuideRect(), guideRotateAngle = 0) => {
  return [
    `left: ${rect.left}px`,
    `top: ${rect.top}px`,
    `width: ${rect.width}px`,
    `height: ${rect.height}px`,
    `opacity: ${isGuidePhotoMode(guideMode) ? 0.42 : 0.92}`,
    'transform-origin: center center',
    `transform: ${getGuideTransformStyle(offsetX, offsetY, guideScale, guideRotateAngle)}`
  ].join('; ')
}
const queryRects = (selectorQuery) => new Promise((resolve) => {
  selectorQuery.exec((res) => {
    resolve(res || [])
  })
})
const withHomeLocalTemplateAssets = (template) => ({
  ...template,
  guideImage: homeLocalAssetUrl(template.guideImage),
  thumbnailImage: homeLocalAssetUrl(template.thumbnailImage),
  shareImage: homeLocalAssetUrl(template.shareImage),
  modelImage: template.modelImage,
  detailImage: template.detailImage
})
const cacheTemplatePrimaryGuide = (template, guideMode) => (
  Promise.resolve({
    ...template,
    guideImage: getActiveGuideImage(template, guideMode)
  })
)
const cacheTemplateSupportImages = (template) => {
  const guidePhotoImage = getGuidePhotoImage(template)

  if (!isRemoteImage(guidePhotoImage)) {
    return
  }

  cacheImageFields({
    ...template,
    thumbnailImage: guidePhotoImage
  }, CACHE_TEMPLATE_SUPPORT_IMAGE_FIELDS).catch(() => {})
}
const resolveTemplateForCamera = (template) => (
  isPoseFavorite(template.id)
    ? cacheFavoritePoseAssets(template)
    : Promise.resolve(template)
)
const getGuideFallbackImages = (guideImage) => {
  if (!guideImage) {
    return []
  }

  const candidates = []
  const addCandidate = (src) => {
    if (src && src !== guideImage && !candidates.includes(src)) {
      candidates.push(src)
    }
  }
  const localStaticPath = getLocalStaticAssetPath(guideImage)

  if (localStaticPath) {
    if (localStaticPath.includes('/static/gallery_thumbs/')) {
      addCandidate(cdnAssetUrl(localStaticPath
        .replace('/static/gallery_thumbs/', '/static/pose_thumbs/')
        .replace(/_gallery_thumb\.jpg$/, '_thumb.jpg')))
      addCandidate(cdnAssetUrl(localStaticPath
        .replace('/static/gallery_thumbs/', '/static/pose_pairs/')
        .replace(/_gallery_thumb\.jpg$/, '_demo.jpg')))
    }

    if (localStaticPath.includes('/static/pose_guides/')) {
      addCandidate(localStaticPath.replace('/static/pose_guides/', '/static/pose_pairs/'))
    }

    if (localStaticPath.includes('/static/pose_pairs/')) {
      addCandidate(localStaticPath.replace('/static/pose_pairs/', '/static/pose_guides/'))
    }

    addCandidate(cdnAssetUrl(localStaticPath))

    if (localStaticPath.includes('/static/pose_guides/')) {
      addCandidate(cdnAssetUrl(localStaticPath.replace('/static/pose_guides/', '/static/pose_pairs/')))
    }

    if (localStaticPath.includes('/static/pose_pairs/')) {
      addCandidate(cdnAssetUrl(localStaticPath.replace('/static/pose_pairs/', '/static/pose_guides/')))
    }
  }

  if (guideImage.includes('/static/pose_guides/')) {
    addCandidate(guideImage.replace('/static/pose_guides/', '/static/pose_pairs/'))
  }

  if (guideImage.includes('/static/pose_pairs/')) {
    addCandidate(guideImage.replace('/static/pose_pairs/', '/static/pose_guides/'))
  }

  if (guideImage.includes('/static/gallery_thumbs/')) {
    addCandidate(guideImage
      .replace('/static/gallery_thumbs/', '/static/pose_thumbs/')
      .replace(/_gallery_thumb\.jpg$/, '_thumb.jpg'))
    addCandidate(guideImage
      .replace('/static/gallery_thumbs/', '/static/pose_pairs/')
      .replace(/_gallery_thumb\.jpg$/, '_demo.jpg'))
  }

  return candidates
}

Page({
  data: {
    devicePosition: 'back',
    cameraStyle: getCameraStyle(),
    cameraAspectRatio: getStoredCameraAspectRatio(),
    cameraAspectText: getCameraAspectText(getStoredCameraAspectRatio()),
    currentIndex: 0,
    currentTemplate: hideTemplateGuide(poseTemplates[0]),
    guideVisible: true,
    cameraZoom: CAMERA_MIN_ZOOM,
    cameraMaxZoom: CAMERA_DEFAULT_MAX_ZOOM,
    cameraZoomText: '1.0x',
    guideToggleTitle: '轮廓',
    guideLoadFailed: false,
    keepGuideForConfirm: false,
    settingsPanelOpen: false,
    currentIsSelfie: false,
    guideMode: GUIDE_MODE_OUTLINE,
    guideModeText: '轮廓',
    guideImageClass: 'outline-guide-image',
    guideIsOutline: true,
    guideDisplayImage: '',
    guideImageRenderVisible: true,
    guideImageLoading: false,
    guideLoadRetryVisible: false,
    guideLoadToken: 0,
    showModelToggle: false,
    modelToggleImage: '',
    guideOffsetX: 0,
    guideOffsetY: 0,
    guideScale: 1,
    guideScaleText: getGuideScaleText(1),
    guideRotateAngle: 0,
    guideBoxStyle: getGuideBoxStyle(0, 0, 1),
    poseStageStyle: getPoseStageStyle(),
    guideBoxRect: null,
    guidePreviewRect: null,
    countdownSeconds: 0,
    countdownText: '倒计时',
    countdownActive: false,
    countdownRemaining: 0,
    guideUsageTipVisible: false,
    homeLocalAssets: false,
    sessionPhotoPaths: [],
    sessionPhotoCount: 0,
    latestPhotoPath: '',
    privacyAccepted: hasAcceptedPrivacyNotice()
  },

  async onLoad(options = {}) {
    const guideSettings = this.loadGuideSettings()
    const templateIndex = findPoseIndex(options.poseId)
    const template = poseTemplates[(templateIndex + poseTemplates.length) % poseTemplates.length]
    const homeLocalAssets = options.homeLocal === '1'

    if (!this.data.privacyAccepted) {
      const accepted = await ensurePrivacyNotice('打开相机拍照')

      if (!accepted) {
        this.backToPoseGallery()
        return
      }

      this.setData({
        privacyAccepted: true
      })
    }

    this.cameraContext = wx.createCameraContext()
    this.setData({
      cameraStyle: getCameraStyle(guideSettings.cameraAspectRatio),
      devicePosition: getDefaultDevicePosition(template),
      currentIsSelfie: isSelfiePose(template),
      homeLocalAssets
    })
    this.setTemplate(templateIndex, guideSettings.guideMode)
    this.scheduleGuideUsageTip()
  },

  onShow() {
    const nextCameraAspectRatio = getStoredCameraAspectRatio()
    const cameraAspectChanged = nextCameraAspectRatio !== this.data.cameraAspectRatio

    const guideSettings = this.loadGuideSettings({ includeGuideMode: !this.hasTemplateLoaded })
    this.setData({
      cameraStyle: getCameraStyle(guideSettings.cameraAspectRatio)
    })

    if (cameraAspectChanged && this.hasTemplateLoaded) {
      this.refreshCurrentGuide()
    }
  },

  onUnload() {
    this.clearCountdownTimer()
    this.stopGuideLoadingTimer()
    this.clearGuideUsageTipTimer()
  },

  onHide() {
    this.clearCountdownTimer()
    this.stopGuideLoadingTimer()
    this.clearGuideUsageTipTimer()
  },

  stopGuideLoadingTimer() {
    if (this.guideLoadingTimer) {
      clearTimeout(this.guideLoadingTimer)
      this.guideLoadingTimer = null
    }
  },

  nextGuideLoadToken() {
    this.guideLoadTokenCounter = (this.guideLoadTokenCounter || 0) + 1
    return this.guideLoadTokenCounter
  },

  getGuideLoadEventData(event) {
    const dataset = event && event.currentTarget && event.currentTarget.dataset
      ? event.currentTarget.dataset
      : {}

    return {
      src: dataset.src || ''
    }
  },

  isCurrentGuideLoadEvent(event) {
    const { src } = this.getGuideLoadEventData(event)
    const currentGuideImage = this.data.guideDisplayImage || (this.data.currentTemplate && this.data.currentTemplate.guideImage) || ''

    return !(src && currentGuideImage && src !== currentGuideImage)
  },

  startGuideLoading(guideImage, guideMode = this.data.guideMode, forceVisible = false) {
    this.stopGuideLoadingTimer()

    if (!guideImage || (!forceVisible && !this.data.guideVisible)) {
      this.setData({
        guideImageLoading: false,
        guideLoadRetryVisible: false,
        guideLoadToken: this.nextGuideLoadToken(),
        guideImageRenderVisible: false
      })
      return
    }

    const guideLoadToken = this.nextGuideLoadToken()

    this.setData({
      guideImageLoading: true,
      guideLoadRetryVisible: false,
      guideLoadFailed: false,
      guideImageRenderVisible: true,
      guideLoadToken
    })
  },

  finishGuideLoading(guideLoadToken = this.data.guideLoadToken) {
    if (this.data.guideLoadToken !== guideLoadToken) {
      return
    }

    this.stopGuideLoadingTimer()

    if (!this.data.guideImageLoading && !this.data.guideLoadFailed) {
      return
    }

    this.setData({
      guideImageLoading: false,
      guideLoadRetryVisible: false,
      guideLoadFailed: false
    })
  },

  setTemplate(index, guideMode = this.data.guideMode) {
    const nextIndex = (index + poseTemplates.length) % poseTemplates.length
    const template = this.data.homeLocalAssets
      ? withHomeLocalTemplateAssets(poseTemplates[nextIndex])
      : poseTemplates[nextIndex]
    const requestId = (this.templateRequestId || 0) + 1
    this.templateRequestId = requestId

    this.setData({
      guideLoadFailed: false
    })

    resolveTemplateForCamera(template).then((resolvedTemplate) => (
      cacheTemplatePrimaryGuide(resolvedTemplate, guideMode)
    )).then(async (cachedTemplate) => {
      if (this.templateRequestId !== requestId) {
        return
      }

      const guideModeState = getGuideModeState(cachedTemplate, guideMode)
      const currentTemplate = applyGuideMode(cachedTemplate, this.data.guideVisible, guideModeState.guideMode)

      this.setData({
        currentTemplate,
        guideDisplayImage: currentTemplate.guideImage,
        guideLoadFailed: false,
        ...getGuideLayoutState(
          getGuideLayoutImageInfo(currentTemplate.guideImage),
          0,
          0,
          1,
          this.data.guideRotateAngle,
          this.data.cameraAspectRatio
        ),
        ...guideModeState
      })
      this.guideFallbackTriedImages = {}
      this.startGuideLoading(currentTemplate.guideImage, guideModeState.guideMode)

      const guideImageInfo = await getImageInfo(currentTemplate.guideImage)

      if (this.templateRequestId !== requestId) {
        return
      }

      const latestTemplate = this.data.currentTemplate && this.data.currentTemplate.id === currentTemplate.id
        ? this.data.currentTemplate
        : currentTemplate

      this.setData({
        currentIndex: nextIndex,
        currentIsSelfie: isSelfiePose(cachedTemplate),
        guideLoadFailed: false,
        currentTemplate: latestTemplate,
        guideDisplayImage: latestTemplate.guideImage,
        ...getGuideLayoutState(
          getGuideLayoutImageInfo(latestTemplate.guideImage, guideImageInfo),
          0,
          0,
          1,
          this.data.guideRotateAngle,
          this.data.cameraAspectRatio
        ),
        ...guideModeState
      }, () => {
        this.hasTemplateLoaded = true
        cacheTemplateSupportImages(template)
      })
    })
  },

  toggleGuide() {
    const currentTemplate = this.data.homeLocalAssets
      ? withHomeLocalTemplateAssets(poseTemplates[this.data.currentIndex])
      : poseTemplates[this.data.currentIndex]
    const nextGuideState = getNextGuideToggleState(
      currentTemplate,
      this.data.guideVisible,
      this.data.guideMode
    )
    const nextVisible = nextGuideState.visible
    const nextGuideMode = nextGuideState.mode

    if (!nextVisible) {
      this.clearGuide(nextGuideMode)
      return
    }

    resolveTemplateForCamera(currentTemplate).then((resolvedTemplate) => (
      cacheTemplatePrimaryGuide(resolvedTemplate, nextGuideMode)
    )).then(async (cachedTemplate) => {
      const guideModeState = getGuideModeState(cachedTemplate, nextGuideMode)
      const nextTemplate = applyGuideMode(cachedTemplate, true, guideModeState.guideMode)

      this.setData({
        guideVisible: true,
        currentTemplate: nextTemplate,
        guideDisplayImage: nextTemplate.guideImage,
        guideLoadFailed: false,
        ...getGuideLayoutState(
          getGuideLayoutImageInfo(nextTemplate.guideImage),
          this.data.guideOffsetX,
          this.data.guideOffsetY,
          this.data.guideScale,
          this.data.guideRotateAngle,
          this.data.cameraAspectRatio
        ),
        ...guideModeState
      })
      this.guideFallbackTriedImages = {}
      this.startGuideLoading(nextTemplate.guideImage, guideModeState.guideMode, true)

      const guideImageInfo = await getImageInfo(nextTemplate.guideImage)
      const latestTemplate = this.data.currentTemplate && this.data.currentTemplate.id === nextTemplate.id
        ? this.data.currentTemplate
        : nextTemplate

      this.setData({
        guideVisible: true,
        currentTemplate: latestTemplate,
        guideDisplayImage: latestTemplate.guideImage,
        ...getGuideLayoutState(
          getGuideLayoutImageInfo(latestTemplate.guideImage, guideImageInfo),
          this.data.guideOffsetX,
          this.data.guideOffsetY,
          this.data.guideScale,
          this.data.guideRotateAngle,
          this.data.cameraAspectRatio
        ),
        ...guideModeState
      }, () => {
        cacheTemplateSupportImages(currentTemplate)
      })
    })
  },

  clearGuide(guideMode = this.data.guideMode) {
    const currentTemplate = this.data.currentTemplate
    const guideModeState = getGuideModeState(currentTemplate, guideMode)

    this.stopGuideLoadingTimer()
    this.setData({
      guideVisible: false,
      currentTemplate: hideTemplateGuide(currentTemplate),
      guideDisplayImage: '',
      guideImageRenderVisible: false,
      guideImageLoading: false,
      guideLoadRetryVisible: false,
      guideLoadToken: this.nextGuideLoadToken(),
      ...guideModeState,
      guideToggleTitle: guideModeState.guideModeText
    })
  },

  refreshCurrentGuide(guideMode = this.data.guideMode) {
    const currentTemplate = this.data.homeLocalAssets
      ? withHomeLocalTemplateAssets(poseTemplates[this.data.currentIndex])
      : poseTemplates[this.data.currentIndex]

    resolveTemplateForCamera(currentTemplate).then((resolvedTemplate) => (
      cacheTemplatePrimaryGuide(resolvedTemplate, guideMode)
    )).then(async (cachedTemplate) => {
      const guideModeState = getGuideModeState(cachedTemplate, guideMode)
      const nextTemplate = applyGuideMode(cachedTemplate, this.data.guideVisible, guideModeState.guideMode)

      this.setData({
        guideLoadFailed: false,
        currentTemplate: nextTemplate,
        guideDisplayImage: nextTemplate.guideImage,
        ...getGuideLayoutState(
          getGuideLayoutImageInfo(nextTemplate.guideImage),
          this.data.guideOffsetX,
          this.data.guideOffsetY,
          this.data.guideScale,
          this.data.guideRotateAngle,
          this.data.cameraAspectRatio
        ),
        ...guideModeState
      })
      this.guideFallbackTriedImages = {}
      this.startGuideLoading(nextTemplate.guideImage, guideModeState.guideMode)

      const guideImageInfo = await getImageInfo(nextTemplate.guideImage)
      const latestTemplate = this.data.currentTemplate && this.data.currentTemplate.id === nextTemplate.id
        ? this.data.currentTemplate
        : nextTemplate

      this.setData({
        guideLoadFailed: false,
        currentTemplate: latestTemplate,
        guideDisplayImage: latestTemplate.guideImage,
        ...getGuideLayoutState(
          getGuideLayoutImageInfo(latestTemplate.guideImage, guideImageInfo),
          this.data.guideOffsetX,
          this.data.guideOffsetY,
          this.data.guideScale,
          this.data.guideRotateAngle,
          this.data.cameraAspectRatio
        ),
        ...guideModeState
      }, () => {
        cacheTemplateSupportImages(currentTemplate)
      })
    })
  },

  onGuideImageLoad(event) {
    if (!this.isCurrentGuideLoadEvent(event)) {
      return
    }

    this.finishGuideLoading()
  },

  onGuideImageError(event) {
    if (!this.isCurrentGuideLoadEvent(event)) {
      return
    }

    const currentTemplate = this.data.currentTemplate || {}
    const currentGuideImage = currentTemplate.guideImage || ''
    const triedImages = this.guideFallbackTriedImages || {}
    triedImages[currentGuideImage] = true
    this.guideFallbackTriedImages = triedImages

    const fallbackGuideImage = getGuideFallbackImages(currentGuideImage)
      .find((guideImage) => !triedImages[guideImage])

    if (fallbackGuideImage && fallbackGuideImage !== currentGuideImage) {
      this.setData({
        guideLoadFailed: false,
        guideDisplayImage: fallbackGuideImage,
        currentTemplate: {
          ...currentTemplate,
          guideImage: fallbackGuideImage
        }
      })
      this.startGuideLoading(fallbackGuideImage, this.data.guideMode, true)
      return
    }

    this.stopGuideLoadingTimer()
    this.setData({
      guideImageLoading: false,
      guideLoadRetryVisible: false,
      guideLoadFailed: false,
      guideImageRenderVisible: false
    })
  },

  onGuideDragStart(event) {
    const touches = event.touches || []

    this.dismissGuideUsageTip()
    this.closeSettingsPanel()

    if (!touches.length || !this.data.currentTemplate.guideImage) {
      this.guideDragState = null
      return
    }

    if (touches.length >= 2) {
      const center = getTouchCenter(touches)

      this.guideDragState = {
        type: 'pinch',
        startDistance: Math.max(getTouchDistance(touches), 1),
        startCenterX: center.x,
        startCenterY: center.y,
        baseScale: this.data.guideScale,
        baseOffsetX: this.data.guideOffsetX,
        baseOffsetY: this.data.guideOffsetY
      }
      return
    }

    this.guideDragState = {
      type: 'drag',
      startX: touches[0].pageX,
      startY: touches[0].pageY,
      baseOffsetX: this.data.guideOffsetX,
      baseOffsetY: this.data.guideOffsetY
    }
  },

  onGuideDragMove(event) {
    const touches = event.touches || []

    if (!touches.length || !this.guideDragState) {
      return
    }

    if (touches.length >= 2) {
      if (this.guideDragState.type !== 'pinch') {
        const center = getTouchCenter(touches)

        this.guideDragState = {
          type: 'pinch',
          startDistance: Math.max(getTouchDistance(touches), 1),
          startCenterX: center.x,
          startCenterY: center.y,
          baseScale: this.data.guideScale,
          baseOffsetX: this.data.guideOffsetX,
          baseOffsetY: this.data.guideOffsetY
        }
      }

      const center = getTouchCenter(touches)
      const startDistance = Math.max(this.guideDragState.startDistance || getTouchDistance(touches), 1)
      const baseScale = this.guideDragState.baseScale || this.data.guideScale
      const guideScale = clamp(
        baseScale * getTouchDistance(touches) / startDistance,
        GUIDE_MIN_SCALE,
        GUIDE_MAX_SCALE
      )
      const guideOffsetX = clamp(
        this.guideDragState.baseOffsetX + center.x - this.guideDragState.startCenterX,
        -GUIDE_MAX_OFFSET_X,
        GUIDE_MAX_OFFSET_X
      )
      const guideOffsetY = clamp(
        this.guideDragState.baseOffsetY + center.y - this.guideDragState.startCenterY,
        -GUIDE_MAX_OFFSET_Y,
        GUIDE_MAX_OFFSET_Y
      )

      this.setData({
        ...getGuideTransformState(guideOffsetX, guideOffsetY, guideScale, this.data.guideBoxRect, this.data.guideRotateAngle)
      })
      return
    }

    if (this.guideDragState.type !== 'drag') {
      this.guideDragState = {
        type: 'drag',
        startX: touches[0].pageX,
        startY: touches[0].pageY,
        baseOffsetX: this.data.guideOffsetX,
        baseOffsetY: this.data.guideOffsetY
      }
    }

    const guideOffsetX = clamp(
      this.guideDragState.baseOffsetX + touches[0].pageX - this.guideDragState.startX,
      -GUIDE_MAX_OFFSET_X,
      GUIDE_MAX_OFFSET_X
    )
    const guideOffsetY = clamp(
      this.guideDragState.baseOffsetY + touches[0].pageY - this.guideDragState.startY,
      -GUIDE_MAX_OFFSET_Y,
      GUIDE_MAX_OFFSET_Y
    )

    this.setData({
      ...getGuideTransformState(guideOffsetX, guideOffsetY, this.data.guideScale, this.data.guideBoxRect, this.data.guideRotateAngle)
    })
  },

  onGuideDragEnd(event) {
    const touches = event.touches || []

    if (touches.length >= 2) {
      this.onGuideDragStart(event)
      return
    }

    if (touches.length === 1) {
      this.guideDragState = {
        type: 'drag',
        startX: touches[0].pageX,
        startY: touches[0].pageY,
        baseOffsetX: this.data.guideOffsetX,
        baseOffsetY: this.data.guideOffsetY
      }
      return
    }

    this.guideDragState = null
  },

  setGuideScale(nextScale) {
    const guideScale = clamp(Number(nextScale || 1), GUIDE_MIN_SCALE, GUIDE_MAX_SCALE)

    this.setData({
      ...getGuideTransformState(
        this.data.guideOffsetX,
        this.data.guideOffsetY,
        guideScale,
        this.data.guideBoxRect,
        this.data.guideRotateAngle
      )
    })
  },

  onGuideScaleChanging(event) {
    this.setGuideScale(event.detail.value)
  },

  onGuideScaleChange(event) {
    this.setGuideScale(event.detail.value)
  },

  toggleSettingsPanel() {
    this.dismissGuideUsageTip()
    this.setData({
      settingsPanelOpen: !this.data.settingsPanelOpen
    })
  },

  closeSettingsPanel() {
    if (!this.data.settingsPanelOpen) {
      return
    }

    this.setData({
      settingsPanelOpen: false
    })
  },

  noop() {},

  decreaseGuideScale() {
    this.setGuideScale(this.data.guideScale - GUIDE_SCALE_STEP)
  },

  increaseGuideScale() {
    this.setGuideScale(this.data.guideScale + GUIDE_SCALE_STEP)
  },

  resetGuideScale() {
    this.setGuideScale(1)
  },

  toggleKeepGuideForConfirm() {
    const keepGuideForConfirm = !this.data.keepGuideForConfirm

    wx.setStorageSync(GUIDE_CONFIRM_STORAGE_KEY, keepGuideForConfirm)
    this.setData({
      keepGuideForConfirm
    })
  },

  toggleGuideRotate() {
    const guideRotateAngle = getNextGuideRotateAngle(this.data.guideRotateAngle)

    wx.setStorageSync(GUIDE_ROTATE_STORAGE_KEY, guideRotateAngle)
    this.setData({
      ...getGuideTransformState(
        this.data.guideOffsetX,
        this.data.guideOffsetY,
        this.data.guideScale,
        this.data.guideBoxRect,
        guideRotateAngle
      )
    })
  },

  async ensureGuideDisplayImage() {
    return this.data.currentTemplate.guideImage || ''
  },

  async toggleCameraAspectRatio() {
    const cameraAspectRatio = getNextCameraAspectRatio(this.data.cameraAspectRatio)
    const currentGuideImage = this.data.currentTemplate.guideImage
    const guideImageInfo = await getImageInfo(currentGuideImage)

    wx.setStorageSync(CAMERA_ASPECT_STORAGE_KEY, cameraAspectRatio)
    this.setData({
      cameraAspectRatio,
      cameraAspectText: getCameraAspectText(cameraAspectRatio),
      cameraStyle: getCameraStyle(cameraAspectRatio),
      ...getGuideLayoutState(
        getGuideLayoutImageInfo(currentGuideImage, guideImageInfo),
        this.data.guideOffsetX,
        this.data.guideOffsetY,
        this.data.guideScale,
        this.data.guideRotateAngle,
        cameraAspectRatio
      )
    })
  },

  switchCamera() {
    this.setData(
      {
        devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
      },
      () => {
        this.setCameraZoom(CAMERA_MIN_ZOOM)
      }
    )
  },

  onCameraInitDone(event) {
    const maxZoom = Number(event.detail && event.detail.maxZoom)

    this.scheduleGuideUsageTip()

    if (maxZoom > CAMERA_MIN_ZOOM) {
      this.setData(
        {
          cameraMaxZoom: maxZoom
        },
        () => {
          this.setCameraZoom(this.data.cameraZoom)
        }
      )
    }
  },

  setNativeCameraZoom(cameraZoom) {
    if (!this.cameraContext) {
      this.cameraContext = wx.createCameraContext()
    }

    if (this.cameraContext && typeof this.cameraContext.setZoom === 'function') {
      this.cameraContext.setZoom({
        zoom: cameraZoom
      })
    }
  },

  setCameraZoom(nextZoom) {
    const cameraZoom = clamp(nextZoom, CAMERA_MIN_ZOOM, this.data.cameraMaxZoom)

    this.setData(
      {
        cameraZoom,
        cameraZoomText: `${cameraZoom.toFixed(1)}x`
      },
      () => {
        this.setNativeCameraZoom(cameraZoom)
      }
    )
  },

  onCameraZoomChanging(event) {
    this.setCameraZoom(Number(event.detail.value))
  },

  onCameraZoomChange(event) {
    this.setCameraZoom(Number(event.detail.value))
  },

  cycleCountdown() {
    if (this.data.countdownActive) {
      return
    }

    const currentIndex = COUNTDOWN_SECONDS_OPTIONS.indexOf(this.data.countdownSeconds)
    const nextIndex = (currentIndex + 1) % COUNTDOWN_SECONDS_OPTIONS.length
    const countdownSeconds = COUNTDOWN_SECONDS_OPTIONS[nextIndex]

    this.setData({
      countdownSeconds,
      countdownText: countdownSeconds > 0 ? `倒计时 ${countdownSeconds}s` : '倒计时'
    })
  },

  clearCountdownTimer() {
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer)
      this.countdownTimer = null
    }

    if (this.data.countdownActive) {
      this.setData({
        countdownActive: false,
        countdownRemaining: 0
      })
    }
  },

  startCountdownTakePhoto() {
    if (this.data.countdownActive) {
      return
    }

    this.setData({
      countdownActive: true,
      countdownRemaining: this.data.countdownSeconds
    })

    const tick = () => {
      const nextRemaining = this.data.countdownRemaining - 1

      if (nextRemaining <= 0) {
        this.clearCountdownTimer()
        this.capturePhoto()
        return
      }

      this.setData({
        countdownRemaining: nextRemaining
      })
      this.countdownTimer = setTimeout(tick, 1000)
    }

    this.countdownTimer = setTimeout(tick, 1000)
  },

  loadGuideSettings(options = {}) {
    const { includeGuideMode = true } = options
    const keepGuideForConfirm = Boolean(wx.getStorageSync(GUIDE_CONFIRM_STORAGE_KEY))
    const guideRotateAngle = normalizeGuideRotateAngle(wx.getStorageSync(GUIDE_ROTATE_STORAGE_KEY))
    const cameraAspectRatio = getStoredCameraAspectRatio()
    const guideSettings = {
      keepGuideForConfirm,
      guideRotateAngle,
      cameraAspectRatio,
      cameraAspectText: getCameraAspectText(cameraAspectRatio),
      guideBoxStyle: getGuideBoxStyle(
        this.data.guideOffsetX,
        this.data.guideOffsetY,
        this.data.guideScale,
        this.data.guideBoxRect,
        guideRotateAngle
      )
    }

    if (includeGuideMode) {
      guideSettings.guideMode = getStoredGuideMode()
    }

    this.setData(guideSettings)
    return guideSettings
  },

  showGuideUsageTipOnce() {
    if (cameraGuideTipShownInSession || !this.data.privacyAccepted) {
      return
    }

    cameraGuideTipShownInSession = true
    this.setData({
      guideUsageTipVisible: true
    })

    this.clearGuideUsageTipTimer()
    this.guideUsageTipTimer = setTimeout(() => {
      this.dismissGuideUsageTip()
    }, 3200)
  },

  scheduleGuideUsageTip() {
    if (cameraGuideTipShownInSession || !this.data.privacyAccepted || this.guideUsageTipPendingTimer) {
      return
    }

    this.guideUsageTipPendingTimer = setTimeout(() => {
      this.guideUsageTipPendingTimer = null
      this.showGuideUsageTipOnce()
    }, CAMERA_GUIDE_TIP_DELAY)
  },

  dismissGuideUsageTip() {
    this.clearGuideUsageTipTimer()

    if (!this.data.guideUsageTipVisible) {
      return
    }

    this.setData({
      guideUsageTipVisible: false
    })
  },

  clearGuideUsageTipTimer() {
    if (this.guideUsageTipPendingTimer) {
      clearTimeout(this.guideUsageTipPendingTimer)
      this.guideUsageTipPendingTimer = null
    }

    if (this.guideUsageTipTimer) {
      clearTimeout(this.guideUsageTipTimer)
      this.guideUsageTipTimer = null
    }
  },

  backToPoseGallery() {
    const currentTemplate = this.data.currentTemplate || poseTemplates[this.data.currentIndex] || {}
    const categoryId = currentTemplate.categoryId || (poseTemplates[this.data.currentIndex] || {}).categoryId

    if (this.hasTemplateLoaded && categoryId) {
      wx.setStorageSync(GALLERY_TARGET_CATEGORY_KEY, categoryId)
    }

    const pages = getCurrentPages()
    const galleryIndex = pages.findIndex((page) => page.route === POSE_GALLERY_ROUTE)

    if (galleryIndex >= 0 && galleryIndex < pages.length - 1) {
      wx.navigateBack({
        delta: pages.length - 1 - galleryIndex
      })
      return
    }

    wx.switchTab({
      url: POSE_GALLERY_URL
    })
  },

  takePhoto() {
    if (this.data.countdownSeconds > 0) {
      this.startCountdownTakePhoto()
      return
    }

    this.capturePhoto()
  },

  async measureCurrentGuidePreviewRect() {
    const guideBoxRect = this.data.guideBoxRect

    if (!guideBoxRect) {
      return null
    }

    const query = wx.createSelectorQuery().in(this)
    query.select('.camera').boundingClientRect()
    query.select('.pose-stage').boundingClientRect()

    const [cameraRect, stageRect] = await queryRects(query)

    if (
      !cameraRect ||
      !stageRect ||
      !cameraRect.width ||
      !cameraRect.height ||
      !stageRect.width ||
      !stageRect.height
    ) {
      return null
    }

    const scale = Number(this.data.guideScale || 1)
    const width = Number(guideBoxRect.width || 0) * scale
    const height = Number(guideBoxRect.height || 0) * scale

    if (!width || !height) {
      return null
    }

    const offsetX = Number(this.data.guideOffsetX || 0)
    const offsetY = Number(this.data.guideOffsetY || 0)
    const left = Number(stageRect.left || 0) +
      Number(guideBoxRect.left || 0) +
      offsetX -
      (width - Number(guideBoxRect.width || 0)) / 2
    const top = Number(stageRect.top || 0) +
      Number(guideBoxRect.top || 0) +
      offsetY -
      (height - Number(guideBoxRect.height || 0)) / 2

    return {
      left,
      top,
      width,
      height,
      cameraLeft: Number(cameraRect.left || 0),
      cameraTop: Number(cameraRect.top || 0),
      cameraWidth: Number(cameraRect.width || 0),
      cameraHeight: Number(cameraRect.height || 0),
      baseWidth: Number(cameraRect.width || wx.getSystemInfoSync().windowWidth || 0),
      baseHeight: Number(cameraRect.height || wx.getSystemInfoSync().windowHeight || 0),
      measured: true
    }
  },

  async capturePhoto() {
    if (!this.cameraContext) {
      this.cameraContext = wx.createCameraContext()
    }

    const shouldConfirmWithGuide = Boolean(
      this.data.keepGuideForConfirm &&
      this.data.guideVisible &&
      this.data.currentTemplate.guideImage
    )
    const measuredGuideRect = shouldConfirmWithGuide
      ? await this.measureCurrentGuidePreviewRect()
      : null
    const previewGuideRect = measuredGuideRect ||
      this.data.guidePreviewRect ||
      getCameraGuideRect()
    const previewGuideOffsetX = measuredGuideRect ? 0 : this.data.guideOffsetX
    const previewGuideOffsetY = measuredGuideRect ? 0 : this.data.guideOffsetY
    const previewGuideScale = measuredGuideRect ? 1 : this.data.guideScale
    const previewGuideImage = shouldConfirmWithGuide
      ? await this.ensureGuideDisplayImage()
      : ''

    this.cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        const poseId = this.data.currentTemplate.id

        app.globalData.photoPath = res.tempImagePath
        app.globalData.previewPose = {
          id: poseId,
          name: this.data.currentTemplate.name,
          shareImage: this.data.currentTemplate.shareImage || '',
          thumbnailImage: this.data.currentTemplate.thumbnailImage || this.data.currentTemplate.modelImage || this.data.currentTemplate.guideImage || ''
        }
        app.globalData.previewShareSource = getPreviewShareSource(poseId)
        app.globalData.previewGuide = shouldConfirmWithGuide
          ? {
              image: previewGuideImage || this.data.currentTemplate.guideImage,
              style: getPreviewGuideStyle(
                previewGuideOffsetX,
                previewGuideOffsetY,
                previewGuideScale,
                this.data.guideMode,
                previewGuideRect,
                this.data.guideRotateAngle
              ),
              offsetX: previewGuideOffsetX,
              offsetY: previewGuideOffsetY,
              scale: previewGuideScale,
              rect: previewGuideRect,
              guideMode: this.data.guideMode,
              guideRotateAngle: this.data.guideRotateAngle,
              needsConfirm: true
            }
          : null

        recordPoseUsage('shoot_pose', poseId, {
          source: 'camera',
          guideMode: this.data.guideMode
        })

        if (!shouldConfirmWithGuide) {
          this.saveCapturedPhoto(res.tempImagePath)
          return
        }

        wx.navigateTo({
          url: '/pages/preview/index'
        })
      },
      fail: () => {
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        })
      }
    })
  },

  async saveCapturedPhoto(filePath) {
    if (!filePath) {
      return
    }

    const accepted = await ensurePrivacyNotice('保存照片到相册')

    if (!accepted) {
      return
    }

    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        app.globalData.photoPath = ''
        app.globalData.previewGuide = null
        app.globalData.previewPose = null
        app.globalData.previewShareSource = null

        const sessionPhotoPaths = [
          ...this.data.sessionPhotoPaths,
          filePath
        ]

        this.setData({
          sessionPhotoPaths,
          sessionPhotoCount: sessionPhotoPaths.length,
          latestPhotoPath: filePath
        })

        wx.showToast({
          title: '已保存，继续拍',
          icon: 'success'
        })
      },
      fail: (error) => {
        const message = error.errMsg && error.errMsg.includes('auth deny')
          ? '请授权保存到相册'
          : '保存失败'

        wx.showModal({
          title: '提示',
          content: message,
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
      }
    })
  },

  previewSessionPhotos() {
    if (!this.data.sessionPhotoPaths.length) {
      wx.showToast({
        title: '还没有本次照片',
        icon: 'none'
      })
      return
    }

    const urls = this.data.sessionPhotoPaths

    wx.previewImage({
      current: urls[0],
      urls,
      fail: () => {
        wx.showToast({
          title: '预览失败',
          icon: 'none'
        })
      }
    })
  },

  onCameraError(event) {
    const message = event.detail && event.detail.errMsg ? event.detail.errMsg : '相机不可用'
    wx.showToast({
      title: message,
      icon: 'none'
    })
  }
})
