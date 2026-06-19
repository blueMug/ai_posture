const { poseCategories } = require('../../utils/poses')

Page({
  data: {
    poseCategories
  },

  openCamera(event) {
    const { poseId } = event.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${poseId}`
    })
  }
})
