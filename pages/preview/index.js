const app = getApp()
const { cacheImage } = require('../../utils/imageCache')

const GUIDE_MODE_PHOTO = 'photo'
const SHARE_GUIDE_LEFT_RATIO = 0.07
const SHARE_GUIDE_TOP_RATIO = 0.13
const SHARE_GUIDE_WIDTH_RATIO = 0.86
const SHARE_GUIDE_HEIGHT_RATIO = 0.58

const getAspectFitRect = (sourceWidth, sourceHeight, targetWidth, targetHeight) => {
  const sourceRatio = sourceWidth / sourceHeight
  const targetRatio = targetWidth / targetHeight

  if (sourceRatio > targetRatio) {
    const width = targetWidth
    const height = width / sourceRatio

    return {
      x: 0,
      y: (targetHeight - height) / 2,
      width,
      height
    }
  }

  const height = targetHeight
  const width = height * sourceRatio

  return {
    x: (targetWidth - width) / 2,
    y: 0,
    width,
    height
  }
}

const getImageInfo = (src) => new Promise((resolve, reject) => {
  wx.getImageInfo({
    src,
    success: resolve,
    fail: reject
  })
})

const canvasToTempFilePath = (options, page) => new Promise((resolve, reject) => {
  wx.canvasToTempFilePath({
    ...options,
    success: (res) => resolve(res.tempFilePath),
    fail: reject
  }, page)
})

Page({
  data: {
    photoPath: '',
    guideImage: '',
    guideStyle: '',
    confirmWithGuide: false,
    guideOffsetX: 0,
    guideOffsetY: 0,
    guideMode: 'outline',
    shareGenerating: false,
    shareCanvasWidth: 1,
    shareCanvasHeight: 1
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
      confirmWithGuide: Boolean(previewGuide.needsConfirm && previewGuide.image),
      guideOffsetX: Number(previewGuide.offsetX || 0),
      guideOffsetY: Number(previewGuide.offsetY || 0),
      guideMode: previewGuide.guideMode || 'outline'
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
  },

  async createPhotoWithGuide() {
    const { photoPath, guideImage, guideOffsetX, guideOffsetY, guideMode } = this.data

    if (!photoPath || !guideImage) {
      throw new Error('missing photo or guide')
    }

    const systemInfo = wx.getSystemInfoSync()
    const canvasWidth = Number(systemInfo.windowWidth || 375)
    const canvasHeight = Number(systemInfo.windowHeight || 667)

    await new Promise((resolve) => {
      this.setData({
        shareCanvasWidth: canvasWidth,
        shareCanvasHeight: canvasHeight
      }, resolve)
    })

    const [photoInfo, cachedGuideImage] = await Promise.all([
      getImageInfo(photoPath),
      cacheImage(guideImage)
    ])
    const photoRect = getAspectFitRect(
      Number(photoInfo.width || canvasWidth),
      Number(photoInfo.height || canvasHeight),
      canvasWidth,
      canvasHeight
    )
    const guideLeft = canvasWidth * SHARE_GUIDE_LEFT_RATIO + guideOffsetX
    const guideTop = canvasHeight * SHARE_GUIDE_TOP_RATIO + guideOffsetY
    const guideWidth = canvasWidth * SHARE_GUIDE_WIDTH_RATIO
    const guideHeight = canvasHeight * SHARE_GUIDE_HEIGHT_RATIO
    const context = wx.createCanvasContext('shareCanvas', this)

    context.setFillStyle('#0d0d0d')
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    context.drawImage(photoPath, photoRect.x, photoRect.y, photoRect.width, photoRect.height)
    context.save()
    context.setGlobalAlpha(guideMode === GUIDE_MODE_PHOTO ? 0.42 : 0.92)
    context.drawImage(cachedGuideImage, guideLeft, guideTop, guideWidth, guideHeight)
    context.restore()

    return new Promise((resolve, reject) => {
      context.draw(false, async () => {
        try {
          const shareImagePath = await canvasToTempFilePath({
            canvasId: 'shareCanvas',
            width: canvasWidth,
            height: canvasHeight,
            destWidth: canvasWidth * 2,
            destHeight: canvasHeight * 2,
            fileType: 'jpg',
            quality: 0.92
          }, this)
          resolve(shareImagePath)
        } catch (error) {
          reject(error)
        }
      })
    })
  },

  async sharePhotoWithGuide() {
    if (this.data.shareGenerating) {
      return
    }

    this.setData({
      shareGenerating: true
    })

    try {
      const shareImagePath = await this.createPhotoWithGuide()

      if (typeof wx.showShareImageMenu !== 'function') {
        wx.showToast({
          title: '当前微信版本不支持',
          icon: 'none'
        })
        return
      }

      wx.showShareImageMenu({
        path: shareImagePath,
        fail: () => {
          wx.showToast({
            title: '分享取消',
            icon: 'none'
          })
        }
      })
    } catch (error) {
      wx.showToast({
        title: '生成分享图失败',
        icon: 'none'
      })
    } finally {
      this.setData({
        shareGenerating: false
      })
    }
  }
})
