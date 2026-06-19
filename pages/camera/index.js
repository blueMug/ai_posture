const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')

const GUIDE_MIN_SCALE = 0.55
const GUIDE_MAX_SCALE = 1.8
const GUIDE_SCALE_STEP = 0.1

const hideTemplateGuide = (template) => ({
  ...template,
  guideImage: '',
  thumbnailImage: '',
  parts: []
})

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getTouchDistance = (touches) => {
  const x = touches[0].clientX - touches[1].clientX
  const y = touches[0].clientY - touches[1].clientY
  return Math.sqrt(x * x + y * y)
}

const getTouchCenter = (touches) => ({
  x: (touches[0].clientX + touches[1].clientX) / 2,
  y: (touches[0].clientY + touches[1].clientY) / 2
})

Page({
  data: {
    devicePosition: 'back',
    currentIndex: 0,
    currentTemplate: poseTemplates[0],
    guideVisible: true,
    guidePlacement: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      scale: 1
    },
    guideBoxStyle: ''
  },

  onLoad(options = {}) {
    this.cameraContext = wx.createCameraContext()
    this.initGuideStage()
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
    this.resetGuidePlacement()
  },

  prevTemplate() {
    this.setTemplate(this.data.currentIndex - 1)
  },

  nextTemplate() {
    this.setTemplate(this.data.currentIndex + 1)
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

  initGuideStage() {
    const systemInfo = wx.getSystemInfoSync()
    this.guideStage = {
      width: systemInfo.windowWidth * 0.86,
      height: systemInfo.windowHeight * 0.66
    }
  },

  getDefaultGuidePlacement() {
    if (!this.guideStage) {
      this.initGuideStage()
    }

    return {
      x: 0,
      y: this.guideStage.height * 0.06,
      width: this.guideStage.width,
      height: this.guideStage.height * 0.88,
      scale: 1
    }
  },

  makeGuideBoxStyle(placement) {
    const width = placement.width * placement.scale
    const height = placement.height * placement.scale

    return [
      `left: ${placement.x}px`,
      `top: ${placement.y}px`,
      `width: ${width}px`,
      `height: ${height}px`
    ].join(';')
  },

  updateGuidePlacement(nextPlacement) {
    const placement = {
      ...this.data.guidePlacement,
      ...nextPlacement
    }

    placement.scale = clamp(placement.scale, GUIDE_MIN_SCALE, GUIDE_MAX_SCALE)

    this.setData({
      guidePlacement: placement,
      guideBoxStyle: this.makeGuideBoxStyle(placement)
    })
  },

  resetGuidePlacement() {
    const placement = this.getDefaultGuidePlacement()
    this.setData({
      guidePlacement: placement,
      guideBoxStyle: this.makeGuideBoxStyle(placement)
    })
  },

  zoomGuideIn() {
    this.setGuideScale(this.data.guidePlacement.scale + GUIDE_SCALE_STEP)
  },

  zoomGuideOut() {
    this.setGuideScale(this.data.guidePlacement.scale - GUIDE_SCALE_STEP)
  },

  setGuideScale(nextScale) {
    const placement = this.data.guidePlacement
    const scale = clamp(nextScale, GUIDE_MIN_SCALE, GUIDE_MAX_SCALE)
    const currentWidth = placement.width * placement.scale
    const currentHeight = placement.height * placement.scale
    const nextWidth = placement.width * scale
    const nextHeight = placement.height * scale

    this.updateGuidePlacement({
      x: placement.x - (nextWidth - currentWidth) / 2,
      y: placement.y - (nextHeight - currentHeight) / 2,
      scale
    })
  },

  onGuideTouchStart(event) {
    const touches = event.touches || []
    const placement = this.data.guidePlacement

    if (touches.length >= 2) {
      this.guideGesture = {
        type: 'pinch',
        startDistance: Math.max(getTouchDistance(touches), 1),
        startCenter: getTouchCenter(touches),
        startX: placement.x,
        startY: placement.y,
        startScale: placement.scale
      }
      return
    }

    if (touches.length === 1) {
      this.guideGesture = {
        type: 'drag',
        startTouchX: touches[0].clientX,
        startTouchY: touches[0].clientY,
        startX: placement.x,
        startY: placement.y
      }
    }
  },

  onGuideTouchMove(event) {
    const touches = event.touches || []

    if (!this.guideGesture || touches.length === 0) {
      return
    }

    if (touches.length >= 2 && this.guideGesture.type === 'pinch') {
      const currentDistance = getTouchDistance(touches)
      const currentCenter = getTouchCenter(touches)
      const scaleRatio = currentDistance / this.guideGesture.startDistance

      this.updateGuidePlacement({
        x: this.guideGesture.startX + currentCenter.x - this.guideGesture.startCenter.x,
        y: this.guideGesture.startY + currentCenter.y - this.guideGesture.startCenter.y,
        scale: this.guideGesture.startScale * scaleRatio
      })
      return
    }

    if (touches.length === 1 && this.guideGesture.type === 'drag') {
      this.updateGuidePlacement({
        x: this.guideGesture.startX + touches[0].clientX - this.guideGesture.startTouchX,
        y: this.guideGesture.startY + touches[0].clientY - this.guideGesture.startTouchY
      })
    }
  },

  onGuideTouchEnd() {
    this.guideGesture = null
  },

  switchCamera() {
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
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
        app.globalData.photoPath = res.tempImagePath
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
