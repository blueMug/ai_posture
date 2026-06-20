const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const GUIDE_MODE_STORAGE_KEY = 'cameraGuideMode'
const GUIDE_MODE_OUTLINE = 'outline'
const GUIDE_MODE_PHOTO = 'photo'
const { adSlots } = require('../../utils/adConfig')
const { poseTemplates } = require('../../utils/poses')
const { cacheImageFields } = require('../../utils/imageCache')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const {
  getFavoritePoses,
  getPoseUsageRecords,
  togglePoseFavorite
} = require('../../utils/userData')

const normalizeGuideMode = (guideMode) => (
  guideMode === GUIDE_MODE_PHOTO ? GUIDE_MODE_PHOTO : GUIDE_MODE_OUTLINE
)

Page({
  data: {
    keepGuideForConfirm: false,
    guideMode: GUIDE_MODE_OUTLINE,
    favoritePoses: [],
    favoritePoseCount: 0,
    usageRecordCount: 0,
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
      guideMode: normalizeGuideMode(wx.getStorageSync(GUIDE_MODE_STORAGE_KEY))
    })
  },

  loadFavoritePoses() {
    const favoritePoses = getFavoritePoses(poseTemplates)
    const requestId = (this.favoritePoseRequestId || 0) + 1
    this.favoritePoseRequestId = requestId

    this.setData({
      favoritePoses,
      favoritePoseCount: favoritePoses.length,
      usageRecordCount: getPoseUsageRecords().length
    })

    Promise.all(favoritePoses.map((pose) => cacheImageFields(pose, ['thumbnailImage']))).then((cachedPoses) => {
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

  removeFavorite(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    togglePoseFavorite(poseId)
    this.loadFavoritePoses()

    wx.showToast({
      title: '已取消收藏',
      icon: 'none'
    })
  }
})
