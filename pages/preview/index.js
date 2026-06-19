const app = getApp()

Page({
  data: {
    photoPath: '',
    guideImage: '',
    guideStyle: '',
    confirmWithGuide: false
  },

  onLoad() {
    const photoPath = app.globalData.photoPath

    if (!photoPath) {
      wx.redirectTo({
        url: '/pages/camera/index'
      })
      return
    }

    const previewGuide = app.globalData.previewGuide || {}

    this.setData({
      photoPath,
      guideImage: previewGuide.image || '',
      guideStyle: previewGuide.style || '',
      confirmWithGuide: Boolean(previewGuide.needsConfirm && previewGuide.image)
    })
  },

  retake() {
    app.globalData.photoPath = ''
    app.globalData.previewGuide = null
    wx.navigateBack()
  },

  acceptPhoto() {
    app.globalData.previewGuide = null
    this.setData({
      guideImage: '',
      guideStyle: '',
      confirmWithGuide: false
    })
  },

  savePhoto() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.photoPath,
      success: () => {
        wx.showToast({
          title: '已保存',
          icon: 'success'
        })
      },
      fail: (error) => {
        const message = error.errMsg && error.errMsg.includes('auth deny')
          ? '请授权保存到相册'
          : '保存失败'

        wx.showModal({
          title: '提示',
          content: message,
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
      }
    })
  }
})
