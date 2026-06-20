const app = getApp()
const { cacheImage } = require('../../utils/imageCache')
const { ensurePrivacyNotice } = require('../../utils/privacy')

const GUIDE_MODE_PHOTO = 'photo'

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

const getAspectFillRect = (sourceWidth, sourceHeight, targetWidth, targetHeight) => {
  const sourceRatio = sourceWidth / sourceHeight
  const targetRatio = targetWidth / targetHeight

  if (sourceRatio > targetRatio) {
    const height = targetHeight
    const width = height * sourceRatio

    return {
      x: (targetWidth - width) / 2,
      y: 0,
      width,
      height
    }
  }

  const width = targetWidth
  const height = width / sourceRatio

  return {
    x: 0,
    y: (targetHeight - height) / 2,
    width,
    height
  }
}

const getGuideDisplayRect = ({
  guideRect = {},
  photoInfo = {},
  targetWidth,
  targetHeight,
  offsetX = 0,
  offsetY = 0
}) => {
  const photoWidth = Number(photoInfo.width || targetWidth)
  const photoHeight = Number(photoInfo.height || targetHeight)
  const photoDisplayRect = getAspectFitRect(photoWidth, photoHeight, targetWidth, targetHeight)
  const cameraWidth = Number(guideRect.cameraWidth || guideRect.baseWidth || targetWidth)
  const cameraHeight = Number(guideRect.cameraHeight || guideRect.baseHeight || targetHeight)
  const cameraLeft = Number(guideRect.cameraLeft || 0)
  const cameraTop = Number(guideRect.cameraTop || 0)
  const cameraFillRect = getAspectFillRect(photoWidth, photoHeight, cameraWidth, cameraHeight)
  const guideLeftInCamera = Number(guideRect.left || targetWidth * 0.07) - cameraLeft + offsetX
  const guideTopInCamera = Number(guideRect.top || targetHeight * 0.17) - cameraTop + offsetY
  const scaleX = photoDisplayRect.width / cameraFillRect.width
  const scaleY = photoDisplayRect.height / cameraFillRect.height

  return {
    left: photoDisplayRect.x + (guideLeftInCamera - cameraFillRect.x) * scaleX,
    top: photoDisplayRect.y + (guideTopInCamera - cameraFillRect.y) * scaleY,
    width: Number(guideRect.width || targetWidth * 0.86) * scaleX,
    height: Number(guideRect.height || targetHeight * 0.48) * scaleY
  }
}

const getGuideDisplayStyle = ({ guideMode, ...options }) => {
  const rect = getGuideDisplayRect(options)

  return [
    `left: ${rect.left}px`,
    `top: ${rect.top}px`,
    `width: ${rect.width}px`,
    `height: ${rect.height}px`,
    `opacity: ${guideMode === GUIDE_MODE_PHOTO ? 0.42 : 0.92}`
  ].join('; ')
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
    guideStyleReady: false,
    confirmWithGuide: false,
    guidePreviewVisible: true,
    guideOffsetX: 0,
    guideOffsetY: 0,
    guideRect: null,
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
      guideStyleReady: false,
      confirmWithGuide: Boolean(previewGuide.needsConfirm && previewGuide.image),
      guidePreviewVisible: true,
      guideOffsetX: Number(previewGuide.offsetX || 0),
      guideOffsetY: Number(previewGuide.offsetY || 0),
      guideRect: previewGuide.rect || null,
      guideMode: previewGuide.guideMode || 'outline'
    })

    if (previewGuide.needsConfirm && previewGuide.image) {
      this.updateGuidePreviewStyle(photoPath, previewGuide)
    }
  },

  async updateGuidePreviewStyle(photoPath, previewGuide) {
    try {
      const [systemInfo, photoInfo] = [
        wx.getSystemInfoSync(),
        await getImageInfo(photoPath)
      ]
      const targetWidth = Number(systemInfo.windowWidth || 375)
      const targetHeight = Number(systemInfo.windowHeight || 667)

      this.setData({
        guideStyle: getGuideDisplayStyle({
          guideRect: previewGuide.rect,
          photoInfo,
          targetWidth,
          targetHeight,
          offsetX: Number(previewGuide.offsetX || 0),
          offsetY: Number(previewGuide.offsetY || 0),
          guideMode: previewGuide.guideMode || 'outline'
        }),
        guideStyleReady: true
      })
    } catch (error) {
      this.setData({
        guideStyleReady: true
      })
    }
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
      confirmWithGuide: false,
      guidePreviewVisible: false
    })
  },

  toggleGuidePreview() {
    this.setData({
      guidePreviewVisible: !this.data.guidePreviewVisible
    })
  },

  async savePhoto() {
    const accepted = await ensurePrivacyNotice('保存照片到相册')

    if (!accepted) {
      return
    }

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
    const { photoPath, guideImage, guideOffsetX, guideOffsetY, guideRect, guideMode } = this.data

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
    const photoWidth = Number(photoInfo.width || canvasWidth)
    const photoHeight = Number(photoInfo.height || canvasHeight)
    const photoRect = getAspectFitRect(
      photoWidth,
      photoHeight,
      canvasWidth,
      canvasHeight
    )
    const guideDisplayRect = getGuideDisplayRect({
      guideRect,
      photoInfo,
      targetWidth: canvasWidth,
      targetHeight: canvasHeight,
      offsetX: guideOffsetX,
      offsetY: guideOffsetY
    })
    const context = wx.createCanvasContext('shareCanvas', this)

    context.setFillStyle('#0d0d0d')
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    context.drawImage(photoPath, photoRect.x, photoRect.y, photoRect.width, photoRect.height)
    context.save()
    context.setGlobalAlpha(guideMode === GUIDE_MODE_PHOTO ? 0.42 : 0.92)
    context.drawImage(
      cachedGuideImage,
      guideDisplayRect.left,
      guideDisplayRect.top,
      guideDisplayRect.width,
      guideDisplayRect.height
    )
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
