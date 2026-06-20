const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')

const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const HOME_PAGE_ROUTE = 'pages/home/index'
const HOME_PAGE_URL = `/${HOME_PAGE_ROUTE}`
const CAMERA_MIN_ZOOM = 1
const CAMERA_DEFAULT_MAX_ZOOM = 10
const GUIDE_MAX_OFFSET_X = 120
const GUIDE_MAX_OFFSET_Y = 160
const GUIDE_MODE_OUTLINE = 'outline'
const GUIDE_MODE_PHOTO = 'photo'

const hideTemplateGuide = (template) => ({
  ...template,
  guideImage: '',
  parts: []
})

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const isModelPose = (template) => Boolean(template && template.modelImage)
const canUseModelPhotoGuide = (template) => Boolean(isModelPose(template) && template.modelImage)
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
    outlineModeActiveClass: nextGuideMode === GUIDE_MODE_OUTLINE ? 'active' : '',
    photoModeActiveClass: nextGuideMode === GUIDE_MODE_PHOTO ? 'active' : '',
    showGuideModeSwitch: canUseModelPhotoGuide(template),
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
const getPreviewGuideStyle = (offsetX, offsetY, guideMode) => (
  `left: 7vw; top: 13vh; width: 86vw; height: 58vh; opacity: ${guideMode === GUIDE_MODE_PHOTO ? 0.42 : 0.92}; transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
)

Page({
  data: {
    devicePosition: 'back',
    currentIndex: 0,
    currentTemplate: poseTemplates[0],
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
    outlineModeActiveClass: 'active',
    photoModeActiveClass: '',
    showGuideModeSwitch: false,
    showModelToggle: false,
    modelToggleImage: '',
    guideOffsetX: 0,
    guideOffsetY: 0,
    guideBoxStyle: getGuideBoxStyle(0, 0)
  },

  onLoad(options = {}) {
    this.cameraContext = wx.createCameraContext()
    this.loadGuideConfirmSetting()
    this.setTemplate(findPoseIndex(options.poseId))
  },

  setTemplate(index) {
    const nextIndex = (index + poseTemplates.length) % poseTemplates.length
    const template = poseTemplates[nextIndex]
    const guideModeState = getGuideModeState(template, this.data.guideMode)

    this.setData({
      currentIndex: nextIndex,
      guideLoadFailed: false,
      currentTemplate: applyGuideMode(template, this.data.guideVisible, guideModeState.guideMode),
      guideOffsetX: 0,
      guideOffsetY: 0,
      guideBoxStyle: getGuideBoxStyle(0, 0),
      ...guideModeState
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
    const guideModeState = getGuideModeState(currentTemplate, this.data.guideMode)

    this.setData({
      guideVisible: true,
      currentTemplate: applyGuideMode(currentTemplate, true, guideModeState.guideMode),
      guideToggleTitle: '隐藏线条',
      ...guideModeState
    })
  },

  clearGuide() {
    const currentTemplate = poseTemplates[this.data.currentIndex]
    const guideModeState = getGuideModeState(currentTemplate, this.data.guideMode)

    this.setData({
      guideVisible: false,
      currentTemplate: hideTemplateGuide(currentTemplate),
      guideToggleTitle: '显示线条',
      ...guideModeState
    })
  },

  switchGuideMode(event) {
    const mode = event.currentTarget.dataset.mode
    const currentTemplate = poseTemplates[this.data.currentIndex]
    const guideModeState = getGuideModeState(currentTemplate, mode)

    this.setData({
      guideLoadFailed: false,
      currentTemplate: applyGuideMode(currentTemplate, this.data.guideVisible, guideModeState.guideMode),
      ...guideModeState
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

  loadGuideConfirmSetting() {
    const keepGuideForConfirm = Boolean(wx.getStorageSync(GUIDE_CONFIRM_STORAGE_KEY))

    this.setData({
      keepGuideForConfirm
    })
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

        app.globalData.photoPath = res.tempImagePath
        app.globalData.previewGuide = shouldConfirmWithGuide
          ? {
              image: this.data.currentTemplate.guideImage,
              style: getPreviewGuideStyle(
                this.data.guideOffsetX,
                this.data.guideOffsetY,
                this.data.guideMode
              ),
              needsConfirm: true
            }
          : null

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
