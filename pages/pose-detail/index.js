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

    this.prefetchGuideImage(pose)

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  prefetchGuideImage(pose) {
    if (!pose || !pose.guideImage) {
      return
    }

    cacheImage(pose.guideImage)
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
  },

  onShareAppMessage() {
    const pose = this.data.pose || {}
    const poseId = this.data.poseId

    return {
      title: pose.name
        ? `拍姿势相机｜${pose.name} 拍照姿势参考`
        : '拍姿势相机｜自拍穿搭旅行拍照姿势参考',
      path: `/pages/pose-detail/index?poseId=${poseId}`,
      imageUrl: pose.thumbnailImage || pose.detailImage || pose.guideImage || ''
    }
  }
})
