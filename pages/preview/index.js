const app = getApp()
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
  offsetY = 0,
  scale = 1
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
  const left = photoDisplayRect.x + (guideLeftInCamera - cameraFillRect.x) * scaleX
  const top = photoDisplayRect.y + (guideTopInCamera - cameraFillRect.y) * scaleY
  const width = Number(guideRect.width || targetWidth * 0.86) * scaleX
  const height = Number(guideRect.height || targetHeight * 0.48) * scaleY
  const guideScale = Number(scale || 1)
  const scaledWidth = width * guideScale
  const scaledHeight = height * guideScale

  return {
    left: left - (scaledWidth - width) / 2,
    top: top - (scaledHeight - height) / 2,
    width: scaledWidth,
    height: scaledHeight
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
    guideScale: 1,
    guideRect: null,
    guideMode: 'outline',
    poseId: '',
    poseName: '',
    poseShareImage: ''
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
    const previewPose = app.globalData.previewPose || {}

    this.setData({
      photoPath,
      guideImage: previewGuide.image || '',
      guideStyle: previewGuide.style || '',
      guideStyleReady: false,
      confirmWithGuide: Boolean(previewGuide.needsConfirm && previewGuide.image),
      guidePreviewVisible: true,
      guideOffsetX: Number(previewGuide.offsetX || 0),
      guideOffsetY: Number(previewGuide.offsetY || 0),
      guideScale: Number(previewGuide.scale || 1),
      guideRect: previewGuide.rect || null,
      guideMode: previewGuide.guideMode || 'outline',
      poseId: previewPose.id || '',
      poseName: previewPose.name || '',
      poseShareImage: previewPose.thumbnailImage || ''
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
          scale: Number(previewGuide.scale || 1),
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
    app.globalData.previewPose = null
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

  sharePhoto() {
    if (!this.data.photoPath) {
      wx.showToast({
        title: '照片不存在',
        icon: 'none'
      })
      return
    }

    if (typeof wx.showShareImageMenu !== 'function') {
      wx.showToast({
        title: '当前微信版本不支持',
        icon: 'none'
      })
      return
    }

    wx.showShareImageMenu({
      path: this.data.photoPath,
      fail: () => {
        wx.showToast({
          title: '分享取消',
          icon: 'none'
        })
      }
    })
  },

  onShareAppMessage() {
    const poseId = this.data.poseId
    const poseName = this.data.poseName

    return {
      title: poseName
        ? `照着这个姿势拍｜${poseName}`
        : '照着这个姿势拍｜拍照姿势模板',
      path: poseId
        ? `/pages/pose-detail/index?poseId=${poseId}`
        : '/pages/home/index',
      imageUrl: this.data.poseShareImage || ''
    }
  }
})
