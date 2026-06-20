const { poseTemplates, findPoseIndex } = require('../../utils/poses')

const getPose = (poseId) => poseTemplates[findPoseIndex(poseId)]

Page({
  data: {
    poseId: '',
    pose: null,
    displayImage: ''
  },

  onLoad(options = {}) {
    const pose = getPose(options.poseId)

    this.setData({
      poseId: pose.id,
      pose,
      displayImage: pose.detailImage || pose.thumbnailImage || pose.guideImage
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
