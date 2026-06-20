const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const GUIDE_MODE_STORAGE_KEY = 'cameraGuideMode'
const GUIDE_MODE_OUTLINE = 'outline'
const GUIDE_MODE_PHOTO = 'photo'

const normalizeGuideMode = (guideMode) => (
  guideMode === GUIDE_MODE_PHOTO ? GUIDE_MODE_PHOTO : GUIDE_MODE_OUTLINE
)

Page({
  data: {
    keepGuideForConfirm: false,
    guideMode: GUIDE_MODE_OUTLINE
  },

  onLoad() {
    this.loadGuideConfirmSetting()
  },

  onShow() {
    this.loadGuideConfirmSetting()
  },

  loadGuideConfirmSetting() {
    this.setData({
      keepGuideForConfirm: Boolean(wx.getStorageSync(GUIDE_CONFIRM_STORAGE_KEY)),
      guideMode: normalizeGuideMode(wx.getStorageSync(GUIDE_MODE_STORAGE_KEY))
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
  }
})
