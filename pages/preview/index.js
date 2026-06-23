const app = getApp()
const { cacheImage } = require('../../utils/imageCache')
const { ensurePrivacyNotice } = require('../../utils/privacy')

const GUIDE_MODE_YELLOW_PHOTO = 'yellow-photo'
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
const isGuidePhotoMode = (guideMode) => guideMode === GUIDE_MODE_YELLOW_PHOTO || guideMode === 'photo'

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
    `opacity: ${isGuidePhotoMode(guideMode) ? 0.42 : 0.92}`,
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
    cachedPoseShareImage: '',
    shareCard: {
      visible: false
    },
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
    const previewShareSource = app.globalData.previewShareSource || {}
    const shareCard = this.buildShareCard(previewPose, previewShareSource)

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
      poseShareImage: previewPose.shareImage || previewPose.thumbnailImage || '',
      cachedPoseShareImage: '',
      shareCard
    })

    this.cachePoseShareImage(previewPose)

    if (previewGuide.needsConfirm && previewGuide.image) {
      this.updateGuidePreviewStyle(photoPath, previewGuide)
    }
  },

  cachePoseShareImage(previewPose = {}) {
    const shareImage = previewPose.shareImage || previewPose.thumbnailImage || ''

    if (!shareImage) {
      return
    }

    cacheImage(shareImage).then((cachedShareImage) => {
      if (
        !cachedShareImage ||
        cachedShareImage === shareImage ||
        this.data.poseId !== (previewPose.id || '')
      ) {
        return
      }

      this.setData({
        cachedPoseShareImage: cachedShareImage
      })
    }).catch(() => {})
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

  buildShareCard(previewPose = {}, previewShareSource = {}) {
    const poseName = previewPose.name || ''
    const sceneTitle = previewShareSource.sceneTitle || ''
    const planTitle = previewShareSource.title || poseName
    const topicId = previewShareSource.topicId || ''

    if (topicId) {
      return {
        visible: true,
        kicker: sceneTitle ? `${sceneTitle}拍法` : '场景拍法',
        title: planTitle ? `我刚照着「${planTitle}」拍了一张` : '我刚照着这个场景拍法拍了一张',
        desc: previewShareSource.reason || '不知道怎么拍时，直接选场景照着拍。',
        buttonText: '分享这个拍法',
        path: `/pages/scene-topic/index?topicId=${topicId}`
      }
    }

    if (previewPose.id) {
      return {
        visible: true,
        kicker: '姿势模板',
        title: poseName ? `我刚照着「${poseName}」拍了一张` : '我刚照着这个姿势拍了一张',
        desc: '朋友不知道怎么摆姿势时，可以直接照着这个模板拍。',
        buttonText: '分享这个姿势',
        path: `/pages/pose-detail/index?poseId=${previewPose.id}`
      }
    }

    return {
      visible: false
    }
  },

  retake() {
    app.globalData.photoPath = ''
    app.globalData.previewGuide = null
    app.globalData.previewPose = null
    app.globalData.previewShareSource = null
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
    app.globalData.previewShareSource = null

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
      ctx.setGlobalAlpha(isGuidePhotoMode(this.data.guideMode) ? 0.42 : 0.92)
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

    const outputPhotoPath = await this.composeGuidePhoto()

    wx.showShareImageMenu({
      path: outputPhotoPath,
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
    const shareCard = this.data.shareCard || {}

    if (shareCard.visible && shareCard.path) {
      return {
        title: shareCard.title || '不知道怎么拍？选场景照着拍',
        path: shareCard.path,
        imageUrl: this.data.cachedPoseShareImage || this.data.photoPath || this.data.poseShareImage || ''
      }
    }

    return {
      title: poseName
        ? `照着这个姿势拍｜${poseName}`
        : '照着这个姿势拍｜拍照姿势模板',
      path: poseId
        ? `/pages/pose-detail/index?poseId=${poseId}`
        : '/pages/home/index',
      imageUrl: this.data.cachedPoseShareImage || this.data.photoPath || this.data.poseShareImage || ''
    }
  }
})
