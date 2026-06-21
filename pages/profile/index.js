const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const GUIDE_MODE_STORAGE_KEY = 'cameraGuideMode'
const SHOOTING_TIPS_DEFAULT_STORAGE_KEY = 'cameraShootingTipsDefaultEnabled'
const GUIDE_MODE_OUTLINE = 'outline'
const GUIDE_MODE_PHOTO = 'photo'
const { adSlots } = require('../../utils/adConfig')
const { poseTemplates } = require('../../utils/poses')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const { isFeedbackFormConfigured } = require('../../utils/feedbackConfig')
const {
  getFavoritePoses,
  togglePoseFavorite
} = require('../../utils/userData')
const {
  cacheFavoritePoseAssets,
  unpinFavoritePoseAssets
} = require('../../utils/favoriteAssetCache')

const normalizeGuideMode = (guideMode) => (
  guideMode === GUIDE_MODE_PHOTO ? GUIDE_MODE_PHOTO : GUIDE_MODE_OUTLINE
)

Page({
  data: {
    keepGuideForConfirm: false,
    shootingTipsDefaultEnabled: false,
    guideMode: GUIDE_MODE_OUTLINE,
    favoritePoses: [],
    favoritePoseCount: 0,
    adSlot: adSlots.profileBanner
  },

  onLoad() {
    this.loadGuideConfirmSetting()
    this.loadFavoritePoses()
  },

  onShow() {
    this.loadGuideConfirmSetting()
    this.loadFavoritePoses()
  },

  loadGuideConfirmSetting() {
    this.setData({
      keepGuideForConfirm: Boolean(wx.getStorageSync(GUIDE_CONFIRM_STORAGE_KEY)),
      shootingTipsDefaultEnabled: wx.getStorageSync(SHOOTING_TIPS_DEFAULT_STORAGE_KEY) === true,
      guideMode: normalizeGuideMode(wx.getStorageSync(GUIDE_MODE_STORAGE_KEY))
    })
  },

  loadFavoritePoses() {
    const favoritePoses = getFavoritePoses(poseTemplates)
    const requestId = (this.favoritePoseRequestId || 0) + 1
    this.favoritePoseRequestId = requestId

    this.setData({
      favoritePoses,
      favoritePoseCount: favoritePoses.length
    })

    Promise.all(favoritePoses.map((pose) => cacheFavoritePoseAssets(pose))).then((cachedPoses) => {
      if (this.favoritePoseRequestId !== requestId) {
        return
      }

      this.setData({
        favoritePoses: cachedPoses
      })
    })
  },

  onGuideConfirmChange(event) {
    const keepGuideForConfirm = Boolean(event.detail.value)

    wx.setStorageSync(GUIDE_CONFIRM_STORAGE_KEY, keepGuideForConfirm)
    this.setData({
      keepGuideForConfirm
    })
  },

  onShootingTipsDefaultChange(event) {
    const shootingTipsDefaultEnabled = Boolean(event.detail.value)

    wx.setStorageSync(SHOOTING_TIPS_DEFAULT_STORAGE_KEY, shootingTipsDefaultEnabled)
    this.setData({
      shootingTipsDefaultEnabled
    })
  },

  onGuideModeSelect(event) {
    const guideMode = normalizeGuideMode(event.currentTarget.dataset.mode)

    wx.setStorageSync(GUIDE_MODE_STORAGE_KEY, guideMode)
    this.setData({
      guideMode
    })
  },

  openPoseDetail(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    wx.navigateTo({
      url: `/pages/pose-detail/index?poseId=${poseId}`
    })
  },

  async openCamera(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const accepted = await ensurePrivacyNotice('打开相机拍照')

    if (!accepted) {
      return
    }

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${poseId}`
    })
  },

  openPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/index'
    })
  },

  openFeedback() {
    if (!isFeedbackFormConfigured()) {
      wx.showModal({
        title: '反馈表单未配置',
        content: '请先在 utils/feedbackConfig.js 填入 HTTPS 腾讯问卷链接，再打开意见反馈。',
        confirmText: '知道了',
        showCancel: false
      })
      return
    }

    wx.navigateTo({
      url: '/pages/feedback/index'
    })
  },

  removeFavorite(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const pose = poseTemplates.find((item) => item.id === poseId)

    togglePoseFavorite(poseId)
    unpinFavoritePoseAssets(pose)
    this.loadFavoritePoses()

    wx.showToast({
      title: '已取消收藏',
      icon: 'none'
    })
  }
})
