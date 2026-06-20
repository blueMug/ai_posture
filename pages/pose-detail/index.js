const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImage } = require('../../utils/imageCache')
const { adSlots } = require('../../utils/adConfig')

const getPose = (poseId) => poseTemplates[findPoseIndex(poseId)]

Page({
  data: {
    poseId: '',
    pose: null,
    displayImage: '',
    adSlot: adSlots.poseDetailBanner
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
      title: pose.name ? `试试这个拍照姿势：${pose.name}` : '试试这个拍照姿势',
      path: `/pages/pose-detail/index?poseId=${poseId}`,
      imageUrl: pose.thumbnailImage || pose.detailImage || pose.guideImage || ''
    }
  }
})
