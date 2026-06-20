const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'

Page({
  data: {
    keepGuideForConfirm: false
  },

  onLoad() {
    this.loadGuideConfirmSetting()
  },

  onShow() {
    this.loadGuideConfirmSetting()
  },

  loadGuideConfirmSetting() {
    this.setData({
      keepGuideForConfirm: Boolean(wx.getStorageSync(GUIDE_CONFIRM_STORAGE_KEY))
    })
  },

  onGuideConfirmChange(event) {
    const keepGuideForConfirm = Boolean(event.detail.value)

    wx.setStorageSync(GUIDE_CONFIRM_STORAGE_KEY, keepGuideForConfirm)
    this.setData({
      keepGuideForConfirm
    })
  }
})
