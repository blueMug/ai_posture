const app = getApp()
const { cacheImage } = require('../../utils/imageCache')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const {
  buildPoseShare,
  buildResultShareCard
} = require('../../utils/shareCopy')

const GUIDE_MODE_YELLOW_PHOTO = 'yellow-photo'
const GUIDE_ROTATE_STEP = 90
const GUIDE_ROTATE_FULL_DEGREES = 360
const SHARE_BRAND_LOGO = '/static/brand/logo_ai_posture.png'

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
    guideRotateAngle: 0,
    poseId: '',
    poseName: '',
    poseShareImage: '',
    cachedPoseShareImage: '',
    shareBrandLogo: SHARE_BRAND_LOGO,
    shareCard: {
      visible: false
    }
  },

  onLoad() {
    const photoPath = app.globalData.photoPath
    const previewPose = app.globalData.previewPose || {}

    if (!photoPath) {
      if (previewPose.id) {
        wx.redirectTo({
          url: `/pages/camera/index?poseId=${previewPose.id}`
        })
        return
      }

      wx.switchTab({
        url: '/pages/pose-gallery/index'
      })
      return
    }

    const previewGuide = app.globalData.previewGuide || {}
    const previewShareSource = app.globalData.previewShareSource || {}
    const shareCard = this.buildShareCard(previewPose, previewShareSource)

    this.setData({
      photoPath,
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

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
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
    return buildResultShareCard(previewPose, previewShareSource)
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
      guidePreviewVisible: false
    })
  },

  returnToCamera() {
    const poseParam = this.data.poseId ? `?poseId=${this.data.poseId}` : ''

    app.globalData.photoPath = ''
    app.globalData.previewGuide = null
    app.globalData.previewPose = null
    app.globalData.previewShareSource = null

    wx.navigateBack({
      fail: () => {
        if (!this.data.poseId) {
          wx.switchTab({
            url: '/pages/pose-gallery/index'
          })
          return
        }

        wx.redirectTo({
          url: `/pages/camera/index${poseParam}`
        })
      }
    })
  },

  syncSavedPhotoToCamera(filePath) {
    if (!filePath) {
      return
    }

    const pages = getCurrentPages()
    const cameraPage = pages
      .slice()
      .reverse()
      .find((page) => page.route === 'pages/camera/index')

    if (!cameraPage || typeof cameraPage.setData !== 'function') {
      return
    }

    const sessionPhotoPaths = [
      ...(cameraPage.data.sessionPhotoPaths || []),
      filePath
    ]

    cameraPage.setData({
      sessionPhotoPaths,
      sessionPhotoCount: sessionPhotoPaths.length,
      latestPhotoPath: filePath
    })
  },

  toggleGuidePreview() {
    this.setData({
      guidePreviewVisible: !this.data.guidePreviewVisible
    })
  },

  onGuidePreviewError() {
    wx.showToast({
      title: '轮廓加载失败',
      icon: 'none'
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
        this.syncSavedPhotoToCamera(this.data.photoPath)
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
    const shareCard = this.data.shareCard || {}
    const shareImage = this.data.cachedPoseShareImage ||
      this.data.poseShareImage ||
      this.data.photoPath ||
      ''

    if (shareCard.visible && shareCard.path) {
      return {
        title: shareCard.title || '不知道怎么拍？选场景照着拍',
        path: shareCard.path,
        imageUrl: shareImage
      }
    }

    return {
      ...buildPoseShare({
        id: poseId,
        name: poseName,
        shareImage
      }, {
        poseId,
        role: 'result',
        fallbackImage: this.data.photoPath
      }),
      path: poseId
        ? `/pages/pose-detail/index?poseId=${poseId}`
        : '/pages/home/index',
    }
  }
})
