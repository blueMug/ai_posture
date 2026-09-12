const { getFeedbackFormUrl, isFeedbackFormConfigured } = require('../../utils/feedbackConfig')

Page({
  data: {
    formUrl: ''
  },

  onLoad() {
    const formUrl = getFeedbackFormUrl()

    if (!isFeedbackFormConfigured()) {
      wx.showModal({
        title: '反馈表单未配置',
        content: '请先在 utils/feedbackConfig.js 填入 HTTPS 腾讯问卷链接。',
        confirmText: '返回',
        showCancel: false,
        success: () => this.back()
      })
      return
    }

    this.setData({
      formUrl
    })
  },

  copyFeedbackLink() {
    if (!this.data.formUrl) {
      wx.showToast({
        title: '反馈链接未配置',
        icon: 'none'
      })
      return
    }

    wx.setClipboardData({
      data: this.data.formUrl,
      success: () => {
        wx.showModal({
          title: '链接已复制',
          content: '请在微信或浏览器中粘贴打开，填写后反馈会提交到腾讯问卷。',
          confirmText: '知道了',
          showCancel: false
        })
      },
      fail: () => {
        wx.showToast({
          title: '复制失败，请稍后重试',
          icon: 'none'
        })
      }
    })
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
