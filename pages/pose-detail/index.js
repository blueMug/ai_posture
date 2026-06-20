const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImage } = require('../../utils/imageCache')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const {
  getFavoritePoseIds,
  recordPoseUsage,
  togglePoseFavorite,
  withFavoriteState
} = require('../../utils/userData')

const getPose = (poseId) => poseTemplates[findPoseIndex(poseId)]

Page({
  data: {
    poseId: '',
    pose: null,
    displayImage: '',
    preloadedGuideImage: '',
    isFavorite: false
  },

  onLoad(options = {}) {
    const pose = getPose(options.poseId)
    const displayImage = pose.detailImage || pose.thumbnailImage || pose.guideImage
    const favoritePoseIds = getFavoritePoseIds()
    const poseWithFavorite = withFavoriteState(pose, favoritePoseIds)

    this.setData({
      poseId: pose.id,
      pose: poseWithFavorite,
      displayImage: '',
      preloadedGuideImage: '',
      isFavorite: poseWithFavorite.isFavorite
    })

    recordPoseUsage('view_pose', pose.id, {
      source: 'pose_detail'
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

  onShow() {
    const pose = getPose(this.data.poseId)
    const poseWithFavorite = withFavoriteState(pose, getFavoritePoseIds())

    this.setData({
      pose: poseWithFavorite,
      isFavorite: poseWithFavorite.isFavorite
    })
  },

  prefetchGuideImage(pose) {
    if (!pose || !pose.guideImage) {
      return
    }

    cacheImage(pose.guideImage).then((cachedGuideImage) => {
      if (this.data.poseId !== pose.id) {
        return
      }

      this.setData({
        preloadedGuideImage: cachedGuideImage
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

  async openCamera() {
    const accepted = await ensurePrivacyNotice('打开相机拍照')

    if (!accepted) {
      return
    }

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${this.data.poseId}`
    })
  },

  toggleFavorite() {
    const result = togglePoseFavorite(this.data.poseId)
    const pose = withFavoriteState(getPose(this.data.poseId), result.favoritePoseIds)

    this.setData({
      pose,
      isFavorite: result.isFavorite
    })

    wx.showToast({
      title: result.isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
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
