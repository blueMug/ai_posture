const { getPrivacySummary } = require('../../utils/privacy')

Page({
  data: {
    privacyItems: getPrivacySummary()
  },

  back() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: '/pages/profile/index'
        })
      }
    })
  }
})
