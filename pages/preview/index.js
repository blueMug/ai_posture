const app = getApp()
const { ensurePrivacyNotice } = require('../../utils/privacy')

const GUIDE_MODE_PHOTO = 'photo'
const MAX_COMPOSE_CANVAS_SIZE = 1600
const GUIDE_ROTATE_STEP = 90
const GUIDE_ROTATE_FULL_DEGREES = 360

const normalizeGuideRotateAngle = (angle) => {
  if (angle === true) {
    return GUIDE_ROTATE_STEP
  }

  const numericAngle = Number(angle || 0)

  if (!Number.isFinite(numericAngle)) {
    return 0
  }

  return ((Math.round(numericAngle / GUIDE_ROTATE_STEP) * GUIDE_ROTATE_STEP) % GUIDE_ROTATE_FULL_DEGREES + GUIDE_ROTATE_FULL_DEGREES) % GUIDE_ROTATE_FULL_DEGREES
}

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

const getGuideDisplayStyle = ({ guideMode, guideRotateAngle = 0, ...options }) => {
  const rect = getGuideDisplayRect(options)

  return [
    `left: ${rect.left}px`,
    `top: ${rect.top}px`,
    `width: ${rect.width}px`,
    `height: ${rect.height}px`,
    `opacity: ${guideMode === GUIDE_MODE_PHOTO ? 0.42 : 0.92}`,
    'transform-origin: center center',
    `transform: rotate(${normalizeGuideRotateAngle(guideRotateAngle)}deg)`
  ].join('; ')
}

const getImageInfo = (src) => new Promise((resolve, reject) => {
  wx.getImageInfo({
    src,
    success: resolve,
    fail: reject
  })
})

const getComposeCanvasSize = (width, height) => {
  const sourceWidth = Number(width || 0)
  const sourceHeight = Number(height || 0)

  if (!sourceWidth || !sourceHeight) {
    return {
      width: 1,
      height: 1
    }
  }

  const scale = Math.min(1, MAX_COMPOSE_CANVAS_SIZE / Math.max(sourceWidth, sourceHeight))

  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale)
  }
}

Page({
  data: {
    photoPath: '',
    outputPhotoPath: '',
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
    guideRotateAngle: 0,
    poseId: '',
    poseName: '',
    poseShareImage: '',
    canvasWidth: 1,
    canvasHeight: 1
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
      outputPhotoPath: '',
      guideImage: previewGuide.image || '',
      guideStyle: '',
      guideStyleReady: false,
      confirmWithGuide: Boolean(previewGuide.needsConfirm && previewGuide.image),
      guidePreviewVisible: true,
      guideOffsetX: Number(previewGuide.offsetX || 0),
      guideOffsetY: Number(previewGuide.offsetY || 0),
      guideScale: Number(previewGuide.scale || 1),
      guideRect: previewGuide.rect || null,
      guideMode: previewGuide.guideMode || 'outline',
      guideRotateAngle: normalizeGuideRotateAngle(previewGuide.guideRotateAngle || previewGuide.guideRotated),
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
          guideMode: previewGuide.guideMode || 'outline',
          guideRotateAngle: normalizeGuideRotateAngle(previewGuide.guideRotateAngle || previewGuide.guideRotated)
        }),
        guideStyleReady: true
      })
    } catch (error) {
      this.setData({
        guideStyleReady: false
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
      guidePreviewVisible: false,
      outputPhotoPath: ''
    })
  },

  returnToCamera() {
    app.globalData.photoPath = ''
    app.globalData.previewGuide = null
    app.globalData.previewPose = null

    wx.navigateBack({
      fail: () => {
        wx.redirectTo({
          url: '/pages/camera/index'
        })
      }
    })
  },

  toggleGuidePreview() {
    this.setData({
      guidePreviewVisible: !this.data.guidePreviewVisible,
      outputPhotoPath: ''
    })
  },

  onGuidePreviewError() {
    wx.showToast({
      title: '轮廓加载失败',
      icon: 'none'
    })
  },

  drawImageToCanvas(ctx, imagePath, rect) {
    ctx.drawImage(
      imagePath,
      rect.left,
      rect.top,
      rect.width,
      rect.height
    )
  },

  drawGuideImageToCanvas(ctx, imagePath, rect) {
    const guideRotateAngle = normalizeGuideRotateAngle(this.data.guideRotateAngle)

    if (!guideRotateAngle) {
      this.drawImageToCanvas(ctx, imagePath, rect)
      return
    }

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(guideRotateAngle * Math.PI / 180)
    ctx.drawImage(
      imagePath,
      -rect.width / 2,
      -rect.height / 2,
      rect.width,
      rect.height
    )
    ctx.restore()
  },

  setDataAsync(data) {
    return new Promise((resolve) => {
      this.setData(data, resolve)
    })
  },

  async composeGuidePhoto() {
    if (
      !this.data.confirmWithGuide ||
      !this.data.guidePreviewVisible ||
      !this.data.guideImage
    ) {
      return this.data.photoPath
    }

    if (this.data.outputPhotoPath) {
      return this.data.outputPhotoPath
    }

    let photoInfo
    let guideInfo

    try {
      [photoInfo, guideInfo] = await Promise.all([
        getImageInfo(this.data.photoPath),
        getImageInfo(this.data.guideImage)
      ])
    } catch (error) {
      return this.data.photoPath
    }

    const canvasSize = getComposeCanvasSize(photoInfo.width, photoInfo.height)
    const canvasWidth = canvasSize.width
    const canvasHeight = canvasSize.height

    if (!canvasWidth || !canvasHeight || !photoInfo.path || !guideInfo.path) {
      return this.data.photoPath
    }

    const guideRect = getGuideDisplayRect({
      guideRect: this.data.guideRect,
      photoInfo,
      targetWidth: canvasWidth,
      targetHeight: canvasHeight,
      offsetX: this.data.guideOffsetX,
      offsetY: this.data.guideOffsetY,
      scale: this.data.guideScale
    })

    await this.setDataAsync({
      canvasWidth,
      canvasHeight
    })

    return new Promise((resolve) => {
      const ctx = wx.createCanvasContext('guideComposer', this)
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      this.drawImageToCanvas(ctx, photoInfo.path, {
        left: 0,
        top: 0,
        width: canvasWidth,
        height: canvasHeight
      })
      ctx.setGlobalAlpha(this.data.guideMode === GUIDE_MODE_PHOTO ? 0.42 : 0.92)
      this.drawGuideImageToCanvas(ctx, guideInfo.path, guideRect)
      ctx.setGlobalAlpha(1)
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'guideComposer',
          width: canvasWidth,
          height: canvasHeight,
          destWidth: canvasWidth,
          destHeight: canvasHeight,
          success: (res) => {
            this.setData({
              outputPhotoPath: res.tempFilePath
            })
            resolve(res.tempFilePath)
          },
          fail: () => {
            wx.showToast({
              title: '合成轮廓失败',
              icon: 'none'
            })
            resolve(this.data.photoPath)
          }
        }, this)
      })
    })
  },

  async savePhoto() {
    const accepted = await ensurePrivacyNotice('保存照片到相册')

    if (!accepted) {
      return
    }

    const outputPhotoPath = await this.composeGuidePhoto()

    wx.saveImageToPhotosAlbum({
      filePath: outputPhotoPath,
      success: () => {
        wx.showToast({
          title: '已保存',
          icon: 'success'
        })
        setTimeout(() => {
          this.returnToCamera()
        }, 500)
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

  async sharePhoto() {
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
      success: () => {
        wx.showToast({
          title: '已分享',
          icon: 'success'
        })
      },
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
