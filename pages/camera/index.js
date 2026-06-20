const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImageFields } = require('../../utils/imageCache')
const { recordPoseUsage } = require('../../utils/userData')
const { ensurePrivacyNotice, hasAcceptedPrivacyNotice } = require('../../utils/privacy')

const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const GUIDE_MODE_STORAGE_KEY = 'cameraGuideMode'
const CACHE_TEMPLATE_IMAGE_FIELDS = ['guideImage', 'thumbnailImage', 'modelImage']
const HOME_PAGE_ROUTE = 'pages/home/index'
const HOME_PAGE_URL = `/${HOME_PAGE_ROUTE}`
const CAMERA_MIN_ZOOM = 1
const CAMERA_DEFAULT_MAX_ZOOM = 10
const GUIDE_MAX_OFFSET_X = 120
const GUIDE_MAX_OFFSET_Y = 160
const BOTTOM_PANEL_RPX = 382
const STAGE_TOP_VIEWPORT_RATIO = 0.13
const STAGE_BOTTOM_VIEWPORT_RATIO = 0.04
const GUIDE_LEFT_RATIO = 0.07
const GUIDE_WIDTH_RATIO = 0.86
const GUIDE_TOP_IN_STAGE_RATIO = 0.08
const GUIDE_HEIGHT_IN_STAGE_RATIO = 0.88
const GUIDE_MODE_OUTLINE = 'outline'
const GUIDE_MODE_PHOTO = 'photo'
const COUNTDOWN_SECONDS_OPTIONS = [0, 3, 5, 10]

const hideTemplateGuide = (template) => ({
  ...template,
  guideImage: '',
  parts: []
})

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const isModelPose = (template) => Boolean(template && template.modelImage)
const canUseModelPhotoGuide = (template) => Boolean(isModelPose(template) && template.modelImage)
const getStoredGuideMode = () => (
  wx.getStorageSync(GUIDE_MODE_STORAGE_KEY) === GUIDE_MODE_PHOTO
    ? GUIDE_MODE_PHOTO
    : GUIDE_MODE_OUTLINE
)
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
const getGuideModeState = (template, guideMode) => {
  const nextGuideMode = normalizeGuideMode(template, guideMode)

  return {
    guideMode: nextGuideMode,
    guideModeText: nextGuideMode === GUIDE_MODE_PHOTO ? '半透明照片' : '轮廓',
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
const getGuideBoxStyle = (offsetX, offsetY) => (
  `transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
)
const getCameraGuideRect = () => {
  const systemInfo = wx.getSystemInfoSync()
  const windowWidth = Number(systemInfo.windowWidth || 375)
  const windowHeight = Number(systemInfo.windowHeight || 667)
  const rpxToPx = windowWidth / 750
  const bottomPanelHeight = BOTTOM_PANEL_RPX * rpxToPx
  const cameraHeight = Math.max(windowHeight - bottomPanelHeight, 1)
  const stageTop = windowHeight * STAGE_TOP_VIEWPORT_RATIO
  const stageBottom = windowHeight * STAGE_BOTTOM_VIEWPORT_RATIO
  const stageHeight = Math.max(cameraHeight - stageTop - stageBottom, 1)

  return {
    left: windowWidth * GUIDE_LEFT_RATIO,
    top: stageTop + stageHeight * GUIDE_TOP_IN_STAGE_RATIO,
    width: windowWidth * GUIDE_WIDTH_RATIO,
    height: stageHeight * GUIDE_HEIGHT_IN_STAGE_RATIO,
    cameraLeft: 0,
    cameraTop: 0,
    cameraWidth: windowWidth,
    cameraHeight,
    baseWidth: windowWidth,
    baseHeight: windowHeight
  }
}
const getPreviewGuideStyle = (offsetX, offsetY, guideMode) => {
  const rect = getCameraGuideRect()

  return [
    `left: ${rect.left}px`,
    `top: ${rect.top}px`,
    `width: ${rect.width}px`,
    `height: ${rect.height}px`,
    `opacity: ${guideMode === GUIDE_MODE_PHOTO ? 0.42 : 0.92}`,
    `transform: translate3d(${offsetX}px, ${offsetY}px, 0)`
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
    guideToggleTitle: '隐藏线条',
    guideLoadFailed: false,
    keepGuideForConfirm: false,
    guideMode: GUIDE_MODE_OUTLINE,
    guideModeText: '轮廓',
    guideImageClass: 'outline-guide-image',
    showModelToggle: false,
    modelToggleImage: '',
    guideOffsetX: 0,
    guideOffsetY: 0,
    guideBoxStyle: getGuideBoxStyle(0, 0),
    countdownSeconds: 0,
    countdownText: '倒计时 关',
    countdownActive: false,
    countdownRemaining: 0,
    privacyAccepted: hasAcceptedPrivacyNotice()
  },

  async onLoad(options = {}) {
    const guideSettings = this.loadGuideSettings()
    const templateIndex = findPoseIndex(options.poseId)

    if (!this.data.privacyAccepted) {
      const accepted = await ensurePrivacyNotice('打开相机拍照')

      if (!accepted) {
        this.backToHome()
        return
      }

      this.setData({
        privacyAccepted: true
      })
    }

    this.cameraContext = wx.createCameraContext()
    this.setTemplate(templateIndex, guideSettings.guideMode)
  },

  onShow() {
    const nextGuideMode = getStoredGuideMode()
    const guideModeChanged = nextGuideMode !== this.data.guideMode

    this.loadGuideSettings()

    if (guideModeChanged && this.hasTemplateLoaded) {
      this.refreshCurrentGuide(nextGuideMode)
    }
  },

  onUnload() {
    this.clearCountdownTimer()
  },

  onHide() {
    this.clearCountdownTimer()
  },

  setTemplate(index, guideMode = this.data.guideMode) {
    const nextIndex = (index + poseTemplates.length) % poseTemplates.length
    const template = poseTemplates[nextIndex]
    const requestId = (this.templateRequestId || 0) + 1
    this.templateRequestId = requestId

    cacheImageFields(template, CACHE_TEMPLATE_IMAGE_FIELDS).then((cachedTemplate) => {
      if (this.templateRequestId !== requestId) {
        return
      }

      const guideModeState = getGuideModeState(cachedTemplate, guideMode)

      this.setData({
        currentIndex: nextIndex,
        guideLoadFailed: false,
        currentTemplate: applyGuideMode(cachedTemplate, this.data.guideVisible, guideModeState.guideMode),
        guideOffsetX: 0,
        guideOffsetY: 0,
        guideBoxStyle: getGuideBoxStyle(0, 0),
        ...guideModeState
      }, () => {
        this.hasTemplateLoaded = true
      })
    })
  },

  toggleGuide() {
    if (this.data.guideVisible) {
      this.clearGuide()
    } else {
      this.showGuide()
    }
  },

  showGuide() {
    const currentTemplate = poseTemplates[this.data.currentIndex]

    cacheImageFields(currentTemplate, CACHE_TEMPLATE_IMAGE_FIELDS).then((cachedTemplate) => {
      const guideModeState = getGuideModeState(cachedTemplate, this.data.guideMode)

      this.setData({
        guideVisible: true,
        currentTemplate: applyGuideMode(cachedTemplate, true, guideModeState.guideMode),
        guideToggleTitle: '隐藏线条',
        ...guideModeState
      })
    })
  },

  clearGuide() {
    const currentTemplate = this.data.currentTemplate
    const guideModeState = getGuideModeState(currentTemplate, this.data.guideMode)

    this.setData({
      guideVisible: false,
      currentTemplate: hideTemplateGuide(currentTemplate),
      guideToggleTitle: '显示线条',
      ...guideModeState
    })
  },

  refreshCurrentGuide(guideMode = this.data.guideMode) {
    const currentTemplate = poseTemplates[this.data.currentIndex]

    cacheImageFields(currentTemplate, CACHE_TEMPLATE_IMAGE_FIELDS).then((cachedTemplate) => {
      const guideModeState = getGuideModeState(cachedTemplate, guideMode)

      this.setData({
        guideLoadFailed: false,
        currentTemplate: applyGuideMode(cachedTemplate, this.data.guideVisible, guideModeState.guideMode),
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
    const touch = event.touches && event.touches[0]

    if (!touch || !this.data.currentTemplate.guideImage) {
      this.guideDragState = null
      return
    }

    this.guideDragState = {
      startX: touch.pageX,
      startY: touch.pageY,
      baseOffsetX: this.data.guideOffsetX,
      baseOffsetY: this.data.guideOffsetY
    }
  },

  onGuideDragMove(event) {
    const touch = event.touches && event.touches[0]

    if (!touch || !this.guideDragState) {
      return
    }

    const guideOffsetX = clamp(
      this.guideDragState.baseOffsetX + touch.pageX - this.guideDragState.startX,
      -GUIDE_MAX_OFFSET_X,
      GUIDE_MAX_OFFSET_X
    )
    const guideOffsetY = clamp(
      this.guideDragState.baseOffsetY + touch.pageY - this.guideDragState.startY,
      -GUIDE_MAX_OFFSET_Y,
      GUIDE_MAX_OFFSET_Y
    )

    this.setData({
      guideOffsetX,
      guideOffsetY,
      guideBoxStyle: getGuideBoxStyle(guideOffsetX, guideOffsetY)
    })
  },

  onGuideDragEnd() {
    this.guideDragState = null
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

  loadGuideSettings() {
    const keepGuideForConfirm = Boolean(wx.getStorageSync(GUIDE_CONFIRM_STORAGE_KEY))
    const guideMode = getStoredGuideMode()
    const guideSettings = {
      keepGuideForConfirm,
      guideMode
    }

    this.setData(guideSettings)
    return guideSettings
  },

  backToHome() {
    const pages = getCurrentPages()
    const homeIndex = pages.findIndex((page) => page.route === HOME_PAGE_ROUTE)

    if (homeIndex >= 0 && homeIndex < pages.length - 1) {
      wx.navigateBack({
        delta: pages.length - 1 - homeIndex
      })
      return
    }

    wx.switchTab({
      url: HOME_PAGE_URL
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
        app.globalData.previewGuide = shouldConfirmWithGuide
          ? {
              image: this.data.currentTemplate.guideImage,
              style: getPreviewGuideStyle(
                this.data.guideOffsetX,
                this.data.guideOffsetY,
                this.data.guideMode
              ),
              offsetX: this.data.guideOffsetX,
              offsetY: this.data.guideOffsetY,
              rect: getCameraGuideRect(),
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
