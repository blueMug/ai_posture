const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImageFields } = require('../../utils/imageCache')
const { recordPoseUsage } = require('../../utils/userData')
const { ensurePrivacyNotice, hasAcceptedPrivacyNotice } = require('../../utils/privacy')
const { getShootingGuide } = require('../../utils/shootingGuide')

const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const GUIDE_MODE_STORAGE_KEY = 'cameraGuideMode'
const SHOOTING_TIPS_DEFAULT_STORAGE_KEY = 'cameraShootingTipsDefaultEnabled'
const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const CACHE_TEMPLATE_IMAGE_FIELDS = ['guideImage', 'thumbnailImage', 'modelImage']
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
    privacyAccepted: hasAcceptedPrivacyNotice()
  },

  async onLoad(options = {}) {
    const guideSettings = this.loadGuideSettings()
    const templateIndex = findPoseIndex(options.poseId)
    const template = poseTemplates[(templateIndex + poseTemplates.length) % poseTemplates.length]

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
      currentIsSelfie: isSelfiePose(template)
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
    const template = poseTemplates[nextIndex]
    const requestId = (this.templateRequestId || 0) + 1
    this.templateRequestId = requestId

    cacheImageFields(template, CACHE_TEMPLATE_IMAGE_FIELDS).then(async (cachedTemplate) => {
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
        shootingGuide: getShootingGuide(cachedTemplate),
        ...getGuideLayoutState(guideImageInfo, 0, 0, 1),
        ...guideModeState
      }, () => {
        this.hasTemplateLoaded = true
      })
    })
  },

  toggleGuide() {
    const currentTemplate = poseTemplates[this.data.currentIndex]
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

    cacheImageFields(currentTemplate, CACHE_TEMPLATE_IMAGE_FIELDS).then(async (cachedTemplate) => {
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
    const currentTemplate = poseTemplates[this.data.currentIndex]

    cacheImageFields(currentTemplate, CACHE_TEMPLATE_IMAGE_FIELDS).then(async (cachedTemplate) => {
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
      })
    })
  },

  onGuideImageError() {
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

  capturePhoto() {
    if (!this.cameraContext) {
      this.cameraContext = wx.createCameraContext()
    }

    this.cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        const shouldConfirmWithGuide = Boolean(
          this.data.keepGuideForConfirm &&
          this.data.guideVisible &&
          this.data.currentTemplate.guideImage
        )
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
                this.data.guideOffsetX,
                this.data.guideOffsetY,
                this.data.guideScale,
                this.data.guideMode,
                this.data.guidePreviewRect || getCameraGuideRect()
              ),
              offsetX: this.data.guideOffsetX,
              offsetY: this.data.guideOffsetY,
              scale: this.data.guideScale,
              rect: this.data.guidePreviewRect || getCameraGuideRect(),
              guideMode: this.data.guideMode,
              needsConfirm: true
            }
          : null

        recordPoseUsage('shoot_pose', poseId, {
          source: 'camera',
          guideMode: this.data.guideMode
        })

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

  onCameraError(event) {
    const message = event.detail && event.detail.errMsg ? event.detail.errMsg : '相机不可用'
    wx.showToast({
      title: message,
      icon: 'none'
    })
  }
})
