const app = getApp()

const makeLine = (id, left, top, width, rotate, color = 'rgba(255, 233, 92, 0.92)') => ({
  id,
  type: 'line',
  style: `left:${left}%;top:${top}%;width:${width}%;transform:rotate(${rotate}deg);background:${color};`
})

const makeJoint = (id, left, top, size = 4) => ({
  id,
  type: 'joint',
  style: `left:${left}%;top:${top}%;width:${size}%;height:${size}%;`
})

const makeHead = (id, left, top, size = 12) => ({
  id,
  type: 'head',
  style: `left:${left}%;top:${top}%;width:${size}%;height:${size}%;`
})

const poseTemplates = [
  {
    id: 'front',
    name: '正面站姿',
    tip: '适合景点正面打卡',
    parts: [
      makeHead('head', 44, 18),
      makeLine('neck', 50, 31, 8, 90),
      makeLine('shoulder', 38, 35, 24, 0),
      makeLine('body', 50, 35, 18, 90),
      makeLine('left-arm', 39, 36, 25, 116),
      makeLine('right-arm', 61, 36, 25, 64),
      makeLine('hip', 42, 54, 16, 0),
      makeLine('left-leg', 45, 55, 26, 102),
      makeLine('right-leg', 55, 55, 26, 78),
      makeJoint('face-dot', 49, 23, 3)
    ]
  },
  {
    id: 'side',
    name: '侧身回头',
    tip: '适合穿搭和街拍',
    parts: [
      makeHead('head', 48, 17),
      makeLine('gaze', 46, 23, 14, 180, 'rgba(255, 255, 255, 0.82)'),
      makeLine('neck', 53, 31, 8, 105),
      makeLine('shoulder', 44, 36, 20, -16),
      makeLine('body', 53, 36, 20, 84),
      makeLine('front-arm', 45, 38, 21, 82),
      makeLine('back-arm', 58, 38, 20, 118),
      makeLine('hip', 47, 56, 15, -10),
      makeLine('front-leg', 51, 57, 26, 82),
      makeLine('back-leg', 57, 57, 23, 108),
      makeJoint('turn-dot', 50, 22, 3)
    ]
  },
  {
    id: 'walk',
    name: '走路抓拍',
    tip: '适合自然动态出片',
    parts: [
      makeHead('head', 44, 16),
      makeLine('neck', 50, 30, 7, 95),
      makeLine('shoulder', 39, 34, 23, -8),
      makeLine('body', 51, 35, 19, 82),
      makeLine('left-arm', 40, 36, 25, 128),
      makeLine('right-arm', 61, 34, 24, 52),
      makeLine('hip', 43, 54, 18, -8),
      makeLine('front-thigh', 51, 55, 24, 62),
      makeLine('front-calf', 63, 65, 20, 112),
      makeLine('back-leg', 48, 56, 31, 116),
      makeJoint('step-dot', 61, 64, 3)
    ]
  },
  {
    id: 'sit',
    name: '坐姿',
    tip: '适合长椅、台阶、咖啡店',
    parts: [
      makeHead('head', 45, 17),
      makeLine('neck', 51, 31, 7, 90),
      makeLine('shoulder', 39, 35, 24, 0),
      makeLine('body', 51, 35, 18, 92),
      makeLine('left-arm', 40, 37, 21, 110),
      makeLine('right-arm', 61, 37, 21, 70),
      makeLine('hip', 42, 54, 18, 0),
      makeLine('left-thigh', 43, 56, 24, 18),
      makeLine('right-thigh', 55, 56, 24, -18),
      makeLine('left-calf', 64, 63, 19, 92),
      makeLine('right-calf', 36, 63, 19, 88)
    ]
  }
]

Page({
  data: {
    devicePosition: 'back',
    currentIndex: 0,
    currentTemplate: poseTemplates[0],
    guideVisible: true
  },

  onLoad() {
    this.cameraContext = wx.createCameraContext()
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
