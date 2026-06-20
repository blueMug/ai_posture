const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImage } = require('../../utils/imageCache')

const getPose = (poseId) => poseTemplates[findPoseIndex(poseId)]

Page({
  data: {
    poseId: '',
    pose: null,
    displayImage: ''
  },

  onLoad(options = {}) {
    const pose = getPose(options.poseId)
    const displayImage = pose.detailImage || pose.thumbnailImage || pose.guideImage

    this.setData({
      poseId: pose.id,
      pose,
      displayImage: ''
    })

    cacheImage(displayImage).then((cachedImage) => {
      this.setData({
        displayImage: cachedImage
      })
    })
  },

  backToHome() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: '/pages/home/index'
        })
      }
    })
  },

  openCamera() {
    wx.navigateTo({
      url: `/pages/camera/index?poseId=${this.data.poseId}`
    })
  },

  onImageError() {
    wx.showToast({
      title: '大图加载失败',
      icon: 'none'
    })
  }
})
