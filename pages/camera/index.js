const app = getApp()
const { poseTemplates, findPoseIndex } = require('../../utils/poses')

Page({
  data: {
    devicePosition: 'back',
    currentIndex: 0,
    currentTemplate: poseTemplates[0],
    guideVisible: true
  },

  onLoad(options = {}) {
    this.cameraContext = wx.createCameraContext()
    this.setTemplate(findPoseIndex(options.poseId))
  },

  setTemplate(index) {
    const nextIndex = (index + poseTemplates.length) % poseTemplates.length
    this.setData({
      currentIndex: nextIndex,
      currentTemplate: this.data.guideVisible
        ? poseTemplates[nextIndex]
        : { ...poseTemplates[nextIndex], parts: [] }
    })
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
      currentTemplate: { ...currentTemplate, parts: [] }
    })
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
