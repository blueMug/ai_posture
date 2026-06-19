const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')

const CAMERA_MIN_ZOOM = 1
const CAMERA_DEFAULT_MAX_ZOOM = 10
const ZOOM_SLIDER_WIDTH_RPX = 430

const hideTemplateGuide = (template) => ({
  ...template,
  guideImage: '',
  thumbnailImage: '',
  parts: []
})

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getPrimaryTouch = (event) => {
  const touches = event.touches || []
  const changedTouches = event.changedTouches || []
  return touches[0] || changedTouches[0]
}

Page({
  data: {
    devicePosition: 'back',
    currentIndex: 0,
    currentTemplate: poseTemplates[0],
    guideVisible: true,
    cameraZoom: CAMERA_MIN_ZOOM,
    cameraMaxZoom: CAMERA_DEFAULT_MAX_ZOOM,
    cameraZoomText: '1.0x',
    cameraZoomPercent: 0,
    keepGuideForConfirm: false
  },

  onLoad(options = {}) {
    this.cameraContext = wx.createCameraContext()
    this.initZoomSliderMetrics()
    this.setTemplate(findPoseIndex(options.poseId))
  },

  setTemplate(index) {
    const nextIndex = (index + poseTemplates.length) % poseTemplates.length
    this.setData({
      currentIndex: nextIndex,
      currentTemplate: this.data.guideVisible
        ? poseTemplates[nextIndex]
        : hideTemplateGuide(poseTemplates[nextIndex])
    })
  },

  showGuide() {
    this.setData({
      guideVisible: true,
      currentTemplate: poseTemplates[this.data.currentIndex]
    })
  },

  clearGuide() {
    const currentTemplate = poseTemplates[this.data.currentIndex]
    this.setData({
      guideVisible: false,
      currentTemplate: hideTemplateGuide(currentTemplate)
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

  initZoomSliderMetrics() {
    const systemInfo = wx.getSystemInfoSync()
    const sliderWidth = systemInfo.windowWidth * (ZOOM_SLIDER_WIDTH_RPX / 750)

    this.zoomSliderMetrics = {
      left: (systemInfo.windowWidth - sliderWidth) / 2,
      width: sliderWidth
    }
  },

  getCameraZoomPercent(cameraZoom) {
    const range = this.data.cameraMaxZoom - CAMERA_MIN_ZOOM

    if (range <= 0) {
      return 0
    }

    return ((cameraZoom - CAMERA_MIN_ZOOM) / range) * 100
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
        cameraZoomText: `${cameraZoom.toFixed(1)}x`,
        cameraZoomPercent: this.getCameraZoomPercent(cameraZoom)
      },
      () => {
        this.setNativeCameraZoom(cameraZoom)
      }
    )
  },

  updateCameraZoomFromTouch(event) {
    const touch = getPrimaryTouch(event)

    if (!touch) {
      return
    }

    if (!this.zoomSliderMetrics) {
      this.initZoomSliderMetrics()
    }

    const { left, width } = this.zoomSliderMetrics
    const ratio = clamp((touch.clientX - left) / width, 0, 1)
    const nextZoom = CAMERA_MIN_ZOOM + (this.data.cameraMaxZoom - CAMERA_MIN_ZOOM) * ratio

    this.setCameraZoom(nextZoom)
  },

  onZoomSliderTouchStart(event) {
    this.updateCameraZoomFromTouch(event)
  },

  onZoomSliderTouchMove(event) {
    this.updateCameraZoomFromTouch(event)
  },

  toggleKeepGuideForConfirm() {
    this.setData({
      keepGuideForConfirm: !this.data.keepGuideForConfirm
    })
  },

  backToHome() {
    wx.navigateBack({
      fail: () => {
        wx.redirectTo({
          url: '/pages/home/index'
        })
      }
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
              style: 'left: 7vw; top: 13vh; width: 86vw; height: 58vh',
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
