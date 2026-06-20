const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')

const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const HOME_PAGE_ROUTE = 'pages/home/index'
const HOME_PAGE_URL = `/${HOME_PAGE_ROUTE}`
const CAMERA_MIN_ZOOM = 1
const CAMERA_DEFAULT_MAX_ZOOM = 10
const GUIDE_MAX_OFFSET_X = 120
const GUIDE_MAX_OFFSET_Y = 160

const hideTemplateGuide = (template) => ({
  ...template,
  guideImage: '',
  parts: []
})

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const isModelPose = (template) => template && template.categoryId === 'model-pairs'
const getGuideToggleState = (template) => ({
  showModelToggle: Boolean(isModelPose(template) && template.thumbnailImage),
  modelToggleImage: isModelPose(template) ? template.thumbnailImage : ''
})
const getGuideBoxStyle = (offsetX, offsetY) => (
  `transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
)
const getPreviewGuideStyle = (offsetX, offsetY) => (
  `left: 7vw; top: 13vh; width: 86vw; height: 58vh; transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
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

    this.setData({
      currentIndex: nextIndex,
      guideLoadFailed: false,
      currentTemplate: this.data.guideVisible ? template : hideTemplateGuide(template),
      guideOffsetX: 0,
      guideOffsetY: 0,
      guideBoxStyle: getGuideBoxStyle(0, 0),
      ...getGuideToggleState(template)
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

    this.setData({
      guideVisible: true,
      currentTemplate,
      guideToggleTitle: '隐藏线条',
      ...getGuideToggleState(currentTemplate)
    })
  },

  clearGuide() {
    const currentTemplate = poseTemplates[this.data.currentIndex]
    this.setData({
      guideVisible: false,
      currentTemplate: hideTemplateGuide(currentTemplate),
      guideToggleTitle: '显示线条',
      ...getGuideToggleState(currentTemplate)
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

    wx.redirectTo({
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
              style: getPreviewGuideStyle(this.data.guideOffsetX, this.data.guideOffsetY),
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
