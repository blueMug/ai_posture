const app = getApp()

Page({
  data: {
    photoPath: ''
  },

  onLoad() {
    const photoPath = app.globalData.photoPath

    if (!photoPath) {
      wx.redirectTo({
        url: '/pages/camera/index'
      })
      return
    }

    this.setData({
      photoPath
    })
  },

  retake() {
    wx.navigateBack()
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
