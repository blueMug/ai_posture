const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImageFields } = require('../../utils/imageCache')
const { cdnAssetUrl, homeLocalAssetUrl } = require('../../utils/assets')
const { recordPoseUsage } = require('../../utils/userData')
const { ensurePrivacyNotice, hasAcceptedPrivacyNotice } = require('../../utils/privacy')
const { getSimpleShootingGuide } = require('../../utils/shootingGuide')

const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const GUIDE_MODE_STORAGE_KEY = 'cameraGuideMode'
const SHOOTING_TIPS_DEFAULT_STORAGE_KEY = 'cameraShootingTipsDefaultEnabled'
const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const CACHE_TEMPLATE_SUPPORT_IMAGE_FIELDS = ['thumbnailImage', 'modelImage']
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
const STAGE_TOP_VIEWPORT_RATIO = 0.13
const STAGE_BOTTOM_VIEWPORT_RATIO = 0.04
const GUIDE_LEFT_RATIO = 0.07
const GUIDE_WIDTH_RATIO = 0.86
const GUIDE_TOP_IN_STAGE_RATIO = 0.08
const GUIDE_HEIGHT_IN_STAGE_RATIO = 0.88
const GUIDE_MODE_OUTLINE = 'outline'
const GUIDE_MODE_PHOTO = 'photo'
const COUNTDOWN_SECONDS_OPTIONS = [0, 3, 5, 10]
const CAMERA_GUIDE_TIP_DELAY = 500

let cameraGuideTipShownInSession = false

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
const canUseModelPhotoGuide = (template) => Boolean(isModelPose(template) && template.modelImage)
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
const getStoredGuideMode = () => (
  wx.getStorageSync(GUIDE_MODE_STORAGE_KEY) === GUIDE_MODE_PHOTO
    ? GUIDE_MODE_PHOTO
    : GUIDE_MODE_OUTLINE
)
const getStoredShootingTipsDefaultEnabled = () => wx.getStorageSync(SHOOTING_TIPS_DEFAULT_STORAGE_KEY) === true
const normalizeGuideMode = (template, guideMode) => (
  guideMode === GUIDE_MODE_PHOTO && canUseModelPhotoGuide(template)
    ? GUIDE_MODE_PHOTO
    : GUIDE_MODE_OUTLINE
)
const getActiveGuideImage = (template, guideMode) => (
  normalizeGuideMode(template, guideMode) === GUIDE_MODE_PHOTO
    ? template.modelImage
    : template.guideImage
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

  return {
    guideMode: nextGuideMode,
    guideModeText: nextGuideMode === GUIDE_MODE_PHOTO ? '半透明照片' : '轮廓',
    guideToggleTitle: nextGuideMode === GUIDE_MODE_PHOTO ? '显示半透明照片' : '显示轮廓',
    guideImageClass: nextGuideMode === GUIDE_MODE_PHOTO ? 'photo-guide-image' : 'outline-guide-image',
    showModelToggle: Boolean(isModelPose(template) && template.thumbnailImage),
    modelToggleImage: isModelPose(template) ? template.thumbnailImage : ''
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
const getGuideBoxStyle = (offsetX, offsetY, scale = 1, guideBoxRect = null) => (
  [
    guideBoxRect ? `left: ${guideBoxRect.left}px` : '',
    guideBoxRect ? `top: ${guideBoxRect.top}px` : '',
    guideBoxRect ? `width: ${guideBoxRect.width}px` : '',
    guideBoxRect ? `height: ${guideBoxRect.height}px` : '',
    'transform-origin: center center',
    `transform: translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`
  ].filter(Boolean).join('; ')
)
const getGuideScaleText = (scale) => `${Math.round(scale * 100)}%`
const getGuideTransformState = (offsetX, offsetY, scale, guideBoxRect = null) => ({
  guideOffsetX: offsetX,
  guideOffsetY: offsetY,
  guideScale: scale,
  guideScaleText: getGuideScaleText(scale),
  guideBoxStyle: getGuideBoxStyle(offsetX, offsetY, scale, guideBoxRect),
  ...(guideBoxRect ? { guideBoxRect } : {})
})
const getCameraGuideLayout = (guideImageInfo = null) => {
  const systemInfo = wx.getSystemInfoSync()
  const windowWidth = Number(systemInfo.windowWidth || 375)
  const windowHeight = Number(systemInfo.windowHeight || 667)
  const rpxToPx = windowWidth / 750
  const bottomPanelHeight = BOTTOM_PANEL_RPX * rpxToPx
  const cameraHeight = Math.max(windowHeight - bottomPanelHeight, 1)
  const stageTop = windowHeight * STAGE_TOP_VIEWPORT_RATIO
  const stageBottom = windowHeight * STAGE_BOTTOM_VIEWPORT_RATIO
  const stageHeight = Math.max(cameraHeight - stageTop - stageBottom, 1)

  const stageLeft = windowWidth * GUIDE_LEFT_RATIO
  const stageWidth = windowWidth * GUIDE_WIDTH_RATIO
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
      top: stageTop + boxRect.top,
      width: boxRect.width,
      height: boxRect.height
    },
    cameraLeft: 0,
    cameraTop: 0,
    cameraWidth: windowWidth,
    cameraHeight,
    baseWidth: windowWidth,
    baseHeight: windowHeight
  }
}
const getCameraGuideRect = (guideImageInfo = null) => {
  const { previewRect, ...layout } = getCameraGuideLayout(guideImageInfo)

  return {
    ...previewRect,
    ...layout
  }
}
const getGuideLayoutState = (guideImageInfo, offsetX = 0, offsetY = 0, scale = 1) => {
  const layout = getCameraGuideLayout(guideImageInfo)
  const guidePreviewRect = {
    ...layout.previewRect,
    cameraLeft: layout.cameraLeft,
    cameraTop: layout.cameraTop,
    cameraWidth: layout.cameraWidth,
    cameraHeight: layout.cameraHeight,
    baseWidth: layout.baseWidth,
    baseHeight: layout.baseHeight
  }

  return {
    guidePreviewRect,
    ...getGuideTransformState(offsetX, offsetY, scale, layout.boxRect)
  }
}
const getPreviewGuideStyle = (offsetX, offsetY, guideScale, guideMode, rect = getCameraGuideRect()) => {
  return [
    `left: ${rect.left}px`,
    `top: ${rect.top}px`,
    `width: ${rect.width}px`,
    `height: ${rect.height}px`,
    `opacity: ${guideMode === GUIDE_MODE_PHOTO ? 0.42 : 0.92}`,
    'transform-origin: center center',
    `transform: translate3d(${offsetX}px, ${offsetY}px, 0) scale(${guideScale})`
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
  cacheImageFields(template, CACHE_TEMPLATE_SUPPORT_IMAGE_FIELDS).catch(() => {})
}
const getGuideFallbackImage = (guideImage) => {
  if (!guideImage) {
    return ''
  }

  if (guideImage.startsWith('/static/')) {
    return cdnAssetUrl(guideImage)
  }

  if (guideImage.includes('/static/pose_guides/')) {
    return guideImage.replace('/static/pose_guides/', '/static/pose_pairs/')
  }

  return ''
}

Page({
  data: {
    devicePosition: 'back',
    currentIndex: 0,
    currentTemplate: hideTemplateGuide(poseTemplates[0]),
    guideVisible: true,
    cameraZoom: CAMERA_MIN_ZOOM,
    cameraMaxZoom: CAMERA_DEFAULT_MAX_ZOOM,
    cameraZoomText: '1.0x',
    guideToggleTitle: '显示轮廓',
    guideLoadFailed: false,
    keepGuideForConfirm: false,
    settingsPanelOpen: false,
    currentIsSelfie: false,
    guideMode: GUIDE_MODE_OUTLINE,
    guideModeText: '轮廓',
    guideImageClass: 'outline-guide-image',
    showModelToggle: false,
    modelToggleImage: '',
    guideOffsetX: 0,
    guideOffsetY: 0,
    guideScale: 1,
    guideScaleText: getGuideScaleText(1),
    guideBoxStyle: getGuideBoxStyle(0, 0, 1),
    guideBoxRect: null,
    guidePreviewRect: null,
    countdownSeconds: 0,
    countdownText: '倒计时 关',
    countdownActive: false,
    countdownRemaining: 0,
    guideUsageTipVisible: false,
    shootingTipsEnabled: false,
    shootingGuide: null,
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
      devicePosition: getDefaultDevicePosition(template),
      currentIsSelfie: isSelfiePose(template),
      homeLocalAssets
    })
    this.setTemplate(templateIndex, guideSettings.guideMode)
    this.scheduleGuideUsageTip()
  },

  onShow() {
    const nextGuideMode = getStoredGuideMode()
    const guideModeChanged = nextGuideMode !== this.data.guideMode

    this.loadGuideSettings({
      includeShootingTips: false
    })

    if (guideModeChanged && this.hasTemplateLoaded) {
      this.refreshCurrentGuide(nextGuideMode)
    }
  },

  onUnload() {
    this.clearCountdownTimer()
    this.clearGuideUsageTipTimer()
  },

  onHide() {
    this.clearCountdownTimer()
    this.clearGuideUsageTipTimer()
  },

  setTemplate(index, guideMode = this.data.guideMode) {
    const nextIndex = (index + poseTemplates.length) % poseTemplates.length
    const template = this.data.homeLocalAssets
      ? withHomeLocalTemplateAssets(poseTemplates[nextIndex])
      : poseTemplates[nextIndex]
    const requestId = (this.templateRequestId || 0) + 1
    this.templateRequestId = requestId

    cacheTemplatePrimaryGuide(template, guideMode).then(async (cachedTemplate) => {
      if (this.templateRequestId !== requestId) {
        return
      }

      const guideModeState = getGuideModeState(cachedTemplate, guideMode)
      const currentTemplate = applyGuideMode(cachedTemplate, this.data.guideVisible, guideModeState.guideMode)
      const guideImageInfo = await getImageInfo(currentTemplate.guideImage)

      if (this.templateRequestId !== requestId) {
        return
      }

      this.setData({
        currentIndex: nextIndex,
        currentIsSelfie: isSelfiePose(cachedTemplate),
        guideLoadFailed: false,
        currentTemplate,
        shootingGuide: getSimpleShootingGuide(cachedTemplate),
        ...getGuideLayoutState(guideImageInfo, 0, 0, 1),
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
    const canUsePhoto = canUseModelPhotoGuide(currentTemplate)
    const nextVisible = !this.data.guideVisible ||
      (this.data.guideMode === GUIDE_MODE_OUTLINE && canUsePhoto)
    const nextGuideMode = !this.data.guideVisible
      ? GUIDE_MODE_OUTLINE
      : this.data.guideMode === GUIDE_MODE_OUTLINE && canUsePhoto
        ? GUIDE_MODE_PHOTO
        : GUIDE_MODE_OUTLINE

    wx.setStorageSync(GUIDE_MODE_STORAGE_KEY, nextGuideMode)

    if (!nextVisible) {
      this.clearGuide(nextGuideMode)
      return
    }

    cacheTemplatePrimaryGuide(currentTemplate, nextGuideMode).then(async (cachedTemplate) => {
      const guideModeState = getGuideModeState(cachedTemplate, nextGuideMode)
      const nextTemplate = applyGuideMode(cachedTemplate, true, guideModeState.guideMode)
      const guideImageInfo = await getImageInfo(nextTemplate.guideImage)

      this.setData({
        guideVisible: true,
        currentTemplate: nextTemplate,
        ...getGuideLayoutState(
          guideImageInfo,
          this.data.guideOffsetX,
          this.data.guideOffsetY,
          this.data.guideScale
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

    this.setData({
      guideVisible: false,
      currentTemplate: hideTemplateGuide(currentTemplate),
      ...guideModeState,
      guideToggleTitle: '引导关'
    })
  },

  refreshCurrentGuide(guideMode = this.data.guideMode) {
    const currentTemplate = this.data.homeLocalAssets
      ? withHomeLocalTemplateAssets(poseTemplates[this.data.currentIndex])
      : poseTemplates[this.data.currentIndex]

    cacheTemplatePrimaryGuide(currentTemplate, guideMode).then(async (cachedTemplate) => {
      const guideModeState = getGuideModeState(cachedTemplate, guideMode)
      const nextTemplate = applyGuideMode(cachedTemplate, this.data.guideVisible, guideModeState.guideMode)
      const guideImageInfo = await getImageInfo(nextTemplate.guideImage)

      this.setData({
        guideLoadFailed: false,
        currentTemplate: nextTemplate,
        ...getGuideLayoutState(
          guideImageInfo,
          this.data.guideOffsetX,
          this.data.guideOffsetY,
          this.data.guideScale
        ),
        ...guideModeState
      }, () => {
        cacheTemplateSupportImages(currentTemplate)
      })
    })
  },

  onGuideImageError() {
    const currentTemplate = this.data.currentTemplate || {}
    const currentGuideImage = currentTemplate.guideImage || ''
    const fallbackGuideImage = getGuideFallbackImage(currentGuideImage)

    if (fallbackGuideImage && fallbackGuideImage !== currentGuideImage) {
      this.setData({
        guideLoadFailed: false,
        currentTemplate: {
          ...currentTemplate,
          guideImage: fallbackGuideImage
        }
      })
      return
    }

    this.setData({
      guideLoadFailed: true
    })

    wx.showToast({
      title: '轮廓图加载失败',
      icon: 'none'
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
        ...getGuideTransformState(guideOffsetX, guideOffsetY, guideScale, this.data.guideBoxRect)
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
      ...getGuideTransformState(guideOffsetX, guideOffsetY, this.data.guideScale, this.data.guideBoxRect)
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
        this.data.guideBoxRect
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
      countdownText: countdownSeconds > 0 ? `倒计时 ${countdownSeconds}s` : '倒计时 关'
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
    const includeShootingTips = options.includeShootingTips !== false
    const keepGuideForConfirm = Boolean(wx.getStorageSync(GUIDE_CONFIRM_STORAGE_KEY))
    const guideMode = getStoredGuideMode()
    const guideSettings = {
      keepGuideForConfirm,
      guideMode
    }

    if (includeShootingTips) {
      guideSettings.shootingTipsEnabled = getStoredShootingTipsDefaultEnabled()
    }

    this.setData(guideSettings)
    return guideSettings
  },

  toggleShootingTips() {
    const shootingTipsEnabled = !this.data.shootingTipsEnabled

    this.setData({
      shootingTipsEnabled
    })
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

    this.cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        const poseId = this.data.currentTemplate.id

        app.globalData.photoPath = res.tempImagePath
        app.globalData.previewPose = {
          id: poseId,
          name: this.data.currentTemplate.name,
          thumbnailImage: this.data.currentTemplate.thumbnailImage || this.data.currentTemplate.modelImage || this.data.currentTemplate.guideImage || ''
        }
        app.globalData.previewGuide = shouldConfirmWithGuide
          ? {
              image: this.data.currentTemplate.guideImage,
              style: getPreviewGuideStyle(
                previewGuideOffsetX,
                previewGuideOffsetY,
                previewGuideScale,
                this.data.guideMode,
                previewGuideRect
              ),
              offsetX: previewGuideOffsetX,
              offsetY: previewGuideOffsetY,
              scale: previewGuideScale,
              rect: previewGuideRect,
              guideMode: this.data.guideMode,
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
