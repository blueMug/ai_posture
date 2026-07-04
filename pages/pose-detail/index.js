const { getPoseById } = require('../../utils/poses')
const { cacheImage, getCachedImagePath } = require('../../utils/imageCache')
const { cdnAssetUrl } = require('../../utils/assets')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const { getShootingGuide } = require('../../utils/shootingGuide')
const { getSceneTopic } = require('../../utils/sceneTopics')
const {
  getFavoritePoseIds,
  recordPoseUsage,
  togglePoseFavorite,
  withFavoriteState
} = require('../../utils/userData')
const {
  cacheFavoritePoseAssets,
  getCachedFavoritePoseAssets,
  unpinFavoritePoseAssets
} = require('../../utils/favoriteAssetCache')
const {
  buildPhotographerTask,
  buildPoseShare,
  buildSceneShare
} = require('../../utils/shareCopy')

const getPose = (poseId) => getPoseById(poseId)
const MAX_ACTION_POINTS = 3
const DETAIL_IMAGE_LOAD_TIMEOUT = 60000
const IMAGE_RETRY_VISIBLE_DURATION = 5000
const DETAIL_PREVIEW_IMAGE_KEY = 'poseDetailPreviewImage'
const DETAIL_PREVIEW_MAX_AGE_MS = 5 * 60 * 1000
const getDisplayImageSource = (pose = {}) => (
  pose.detailImage || pose.thumbnailImage || pose.guideImage || ''
)
const getShareImageSource = (pose = {}) => (
  pose.shareImage || pose.thumbnailImage || pose.detailImage || pose.modelImage || pose.guideImage || ''
)
const isGalleryPreviewImage = (image = '') => String(image).includes('/static/gallery_thumbs/')
const consumeDetailPreviewImage = (poseId) => {
  try {
    const preview = wx.getStorageSync(DETAIL_PREVIEW_IMAGE_KEY) || {}
    wx.removeStorageSync(DETAIL_PREVIEW_IMAGE_KEY)

    if (
      preview.poseId !== poseId ||
      !isGalleryPreviewImage(preview.image) ||
      Date.now() - Number(preview.createdAt || 0) > DETAIL_PREVIEW_MAX_AGE_MS
    ) {
      return ''
    }

    return preview.image
  } catch (error) {
    return ''
  }
}
const appendImageRetryToken = (url = '', retryToken = '') => {
  if (!retryToken || !/^https?:\/\//.test(url)) {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_retry=${retryToken}`
}

const compactText = (text = '') => String(text || '').replace(/\s+/g, ' ').trim()
const trimGuideText = (text = '') => compactText(text)
  .replace(/^[：:，,；;、。.\s]+|[：:，,；;、。.\s]+$/g, '')
const DETAIL_SECTION_TITLES = {
  适合场景与拍摄要点: '场景与拍摄',
  适合场景: '适合场景',
  拍照指导: '拍摄指导',
  关键动作角度: '动作角度',
  关键动作: '关键动作',
  角度要点: '角度要点',
  注意事项: '注意事项',
  核心口诀: '核心口诀'
}
const DETAIL_SECTION_LABELS = Object.keys(DETAIL_SECTION_TITLES)
  .sort((a, b) => b.length - a.length)
const DETAIL_SECTION_PATTERN = new RegExp(`(${DETAIL_SECTION_LABELS.join('|')})[:：]?`, 'g')
const splitGuideLines = (text = '') => {
  const value = trimGuideText(text)

  if (!value) {
    return []
  }

  const semicolonParts = value
    .split(/[；;]/)
    .map((item) => trimGuideText(item))
    .filter(Boolean)

  if (semicolonParts.length > 1) {
    return semicolonParts
  }

  const sentenceParts = value
    .split(/[。.!！?？]/)
    .map((item) => trimGuideText(item))
    .filter(Boolean)

  return sentenceParts.length > 1 ? sentenceParts : [value]
}
const buildDetailSections = (text = '') => {
  const value = compactText(text)
  const matches = []
  let match = DETAIL_SECTION_PATTERN.exec(value)

  while (match) {
    matches.push({
      label: match[1],
      index: match.index,
      endIndex: match.index + match[0].length
    })
    match = DETAIL_SECTION_PATTERN.exec(value)
  }

  DETAIL_SECTION_PATTERN.lastIndex = 0

  if (!matches.length) {
    const lines = splitGuideLines(value)

    return lines.length ? [{ id: 'plain', title: '动作说明', lines }] : []
  }

  const sections = []
  const overviewText = trimGuideText(value.slice(0, matches[0].index))
  const overviewLines = splitGuideLines(overviewText)

  if (overviewLines.length) {
    sections.push({
      id: 'overview',
      title: '姿势概述',
      lines: overviewLines
    })
  }

  matches.forEach((item, index) => {
    const nextItem = matches[index + 1]
    const sectionText = trimGuideText(value.slice(item.endIndex, nextItem ? nextItem.index : value.length))
    const lines = splitGuideLines(sectionText)

    if (!lines.length) {
      return
    }

    sections.push({
      id: `${item.label}-${index}`,
      title: DETAIL_SECTION_TITLES[item.label] || item.label,
      tone: item.label === '核心口诀' ? 'highlight' : '',
      lines
    })
  })

  return sections
}
const getTextAfterLabel = (text = '', label = '') => {
  const index = text.indexOf(label)

  if (index < 0) {
    return ''
  }

  return text.slice(index + label.length).replace(/^[:：]/, '')
}

const getPreferredActionText = (text = '') => {
  const value = compactText(text)
  const coreText = getTextAfterLabel(value, '核心口诀')

  if (coreText) {
    return coreText
  }

  const actionText = getTextAfterLabel(value, '关键动作')

  if (actionText) {
    return actionText
      .split(/角度要点|注意事项|适合场景与拍摄要点|适合场景/)
      .filter(Boolean)[0] || actionText
  }

  return value
}

const trimActionPoint = (text = '') => {
  const value = compactText(text)
    .replace(/^(拍摄时|关键动作|角度要点|注意事项|人物|身体|高处的手|低处的手)[:：]?/, '')
    .replace(/[，,]?适合拍.*$/, '')
    .replace(/^(最适合|适合).*/, '')
    .replace(/\s*\d+°\s*/g, '')
    .replace(/的手臂/g, '手臂')
    .replace(/另一只手/g, '一手')
    .replace(/一只手/g, '一手')
    .replace(/另一条腿/g, '一腿')
    .replace(/向斜上方/g, '斜上方')
    .replace(/自然伸展出/g, '伸出')
    .replace(/伸展出/g, '伸出')
    .trim()

  return value
}
const splitActionPoints = (text = '') => getPreferredActionText(text)
  .split(/[、，,；;。.!！?？]/)
  .map((item) => trimActionPoint(item))
  .filter(Boolean)
  .slice(0, MAX_ACTION_POINTS)
const buildDetailGuide = (pose = {}, shootingGuide = null) => {
  const actionText = compactText(shootingGuide && shootingGuide.actionText) ||
    compactText(pose.description)
  const compositionText = compactText(shootingGuide && shootingGuide.compositionText)
  const imageText = compositionText || compactText(pose.tip)
  const actionPoints = splitActionPoints(actionText)
  const detailItems = [
    { label: '画面', text: compositionText },
    { label: '动作', text: actionText, sections: buildDetailSections(actionText) }
  ].filter((item) => item.text)

  return {
    imageText,
    actionPoints,
    detailItems,
    hasImageText: Boolean(imageText),
    hasActionPoints: actionPoints.length > 0,
    hasDetails: detailItems.length > 0
  }
}

Page({
  data: {
    poseId: '',
    pose: null,
    displayImage: '',
    displayImageSource: '',
    previewImage: '',
    highResImage: '',
    highResImageSource: '',
    highResImageLoading: false,
    highResImageLoadFailed: false,
    highResImageRetryVisible: false,
    highResImageFallbackTried: false,
    cachedShareImage: '',
    imageLoading: false,
    imageLoadFailed: false,
    imageRetryVisible: false,
    displayImageFallbackTried: false,
    preloadedGuideImage: '',
    preloadedCameraImages: [],
    shootingGuide: null,
    detailGuide: null,
    detailExpanded: false,
    sourceTopic: null,
    shareTask: {
      visible: false
    },
    isFavorite: false
  },

  onLoad(options = {}) {
    const pose = getPose(options.poseId)

    if (!pose) {
      wx.showToast({
        title: '姿势不存在',
        icon: 'none'
      })
      this.backToHome()
      return
    }

    const favoritePoseIds = getFavoritePoseIds()
    const poseWithFavorite = withFavoriteState(pose, favoritePoseIds)
    const shootingGuide = getShootingGuide(pose)
    const detailGuide = buildDetailGuide(pose, shootingGuide)
    const sourceTopic = options.topicId ? getSceneTopic(options.topicId) : null
    const previewImage = consumeDetailPreviewImage(pose.id)

    this.setData({
      poseId: pose.id,
      pose: poseWithFavorite,
      displayImage: previewImage,
      displayImageSource: getDisplayImageSource(poseWithFavorite),
      previewImage,
      highResImage: '',
      highResImageSource: '',
      highResImageLoading: false,
      highResImageLoadFailed: false,
      highResImageRetryVisible: false,
      highResImageFallbackTried: false,
      cachedShareImage: '',
      imageLoading: !previewImage,
      imageLoadFailed: false,
      imageRetryVisible: false,
      displayImageFallbackTried: false,
      preloadedGuideImage: '',
      preloadedCameraImages: [],
      shootingGuide,
      detailGuide,
      detailExpanded: false,
      sourceTopic,
      shareTask: buildPhotographerTask(poseWithFavorite),
      isFavorite: poseWithFavorite.isFavorite
    })

    recordPoseUsage('view_pose', pose.id, {
      source: 'pose_detail'
    })

    this.loadDetailImages(poseWithFavorite)
    this.cachePoseShareImage(poseWithFavorite)

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  onShow() {
    const pose = getPose(this.data.poseId)

    if (!pose) {
      return
    }

    const cachedShareImage = this.data.cachedShareImage
    const poseWithFavorite = {
      ...withFavoriteState(pose, getFavoritePoseIds()),
      ...(cachedShareImage ? { cachedShareImage } : {})
    }

    this.setData({
      pose: poseWithFavorite,
      isFavorite: poseWithFavorite.isFavorite,
      shareTask: buildPhotographerTask(poseWithFavorite)
    })

    if (poseWithFavorite.isFavorite) {
      getCachedFavoritePoseAssets(poseWithFavorite).then((localPose) => {
        if (this.data.poseId !== poseWithFavorite.id) {
          return
        }

        this.setData({
          pose: {
            ...withFavoriteState(localPose, getFavoritePoseIds()),
            ...(this.data.cachedShareImage ? { cachedShareImage: this.data.cachedShareImage } : {})
          }
        })
      })
    }
  },

  onUnload() {
    this.clearDetailImageLoadTimer()
    this.clearHighResImageLoadTimer()
    this.clearDetailImageRetryTimer()
    this.clearHighResImageRetryTimer()
  },

  prefetchGuideImage(pose, requestId = this.detailImageRequestId, retryToken = '') {
    if (!pose || !pose.guideImage) {
      return
    }

    const guideImage = appendImageRetryToken(pose.guideImage, retryToken)

    this.setData({
      preloadedGuideImage: guideImage
    })

    cacheImage(guideImage).then((cachedGuideImage) => {
      if (
        this.detailImageRequestId !== requestId ||
        this.data.poseId !== pose.id ||
        this.data.preloadedGuideImage !== guideImage
      ) {
        return
      }

      this.setData({
        preloadedGuideImage: cachedGuideImage
      })
    }).catch(() => {})
  },

  preheatCameraImages(pose) {
    if (!pose) {
      return
    }

    const preloadedCameraImages = Array.from(new Set([
      pose.guideImage,
      pose.modelImage
    ].filter(Boolean)))

    if (preloadedCameraImages.length) {
      this.setData({
        preloadedCameraImages
      })
    }

    preloadedCameraImages.forEach((image) => {
      cacheImage(image).catch(() => {})
    })
  },

  cachePoseShareImage(pose = {}) {
    const shareImage = getShareImageSource(pose)

    if (!shareImage) {
      return
    }

    cacheImage(shareImage).then((cachedShareImage) => {
      if (
        !cachedShareImage ||
        cachedShareImage === shareImage ||
        this.data.poseId !== pose.id
      ) {
        return
      }

      const currentPose = this.data.pose || {}

      this.setData({
        cachedShareImage,
        pose: {
          ...currentPose,
          cachedShareImage
        }
      })
    }).catch(() => {})
  },

  clearDetailImageLoadTimer() {
    if (this.detailImageLoadTimer) {
      clearTimeout(this.detailImageLoadTimer)
      this.detailImageLoadTimer = null
    }
  },

  clearHighResImageLoadTimer() {
    if (this.highResImageLoadTimer) {
      clearTimeout(this.highResImageLoadTimer)
      this.highResImageLoadTimer = null
    }
  },

  clearDetailImageRetryTimer() {
    if (this.detailImageRetryTimer) {
      clearTimeout(this.detailImageRetryTimer)
      this.detailImageRetryTimer = null
    }
  },

  clearHighResImageRetryTimer() {
    if (this.highResImageRetryTimer) {
      clearTimeout(this.highResImageRetryTimer)
      this.highResImageRetryTimer = null
    }
  },

  startDetailImageRetryTimer() {
    this.clearDetailImageRetryTimer()

    this.detailImageRetryTimer = setTimeout(() => {
      this.detailImageRetryTimer = null
      if (!this.data.imageLoadFailed || !this.data.imageRetryVisible) {
        return
      }

      this.setData({
        imageRetryVisible: false
      })
    }, IMAGE_RETRY_VISIBLE_DURATION)
  },

  startHighResImageRetryTimer() {
    this.clearHighResImageRetryTimer()

    this.highResImageRetryTimer = setTimeout(() => {
      this.highResImageRetryTimer = null
      if (!this.data.highResImageLoadFailed || !this.data.highResImageRetryVisible) {
        return
      }

      this.setData({
        highResImageRetryVisible: false
      })
    }, IMAGE_RETRY_VISIBLE_DURATION)
  },

  startDetailImageLoadTimer(requestId) {
    this.clearDetailImageLoadTimer()

    this.detailImageLoadTimer = setTimeout(() => {
      if (this.detailImageRequestId !== requestId || !this.data.imageLoading) {
        return
      }

      this.detailImageLoadTimer = null
      this.setData({
        imageLoading: false,
        imageLoadFailed: true,
        imageRetryVisible: true
      })
      this.startDetailImageRetryTimer()
    }, DETAIL_IMAGE_LOAD_TIMEOUT)
  },

  startHighResImageLoadTimer(requestId) {
    this.clearHighResImageLoadTimer()

    this.highResImageLoadTimer = setTimeout(() => {
      if (this.detailImageRequestId !== requestId || !this.data.highResImageLoading) {
        return
      }

      this.highResImageLoadTimer = null
      this.setData({
        highResImageLoading: false,
        highResImageLoadFailed: true,
        highResImageRetryVisible: true
      })
      this.startHighResImageRetryTimer()
    }, DETAIL_IMAGE_LOAD_TIMEOUT)
  },

  loadDetailImages(pose) {
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId
    const initialDisplayImage = getDisplayImageSource(pose)
    const previewImage = this.data.previewImage

    this.setData({
      displayImageSource: initialDisplayImage,
      highResImage: '',
      highResImageSource: '',
      highResImageLoading: false,
      highResImageLoadFailed: false,
      highResImageRetryVisible: false,
      highResImageFallbackTried: false,
      imageLoading: !previewImage,
      imageLoadFailed: false,
      imageRetryVisible: false,
      displayImageFallbackTried: false
    })
    this.clearDetailImageRetryTimer()
    this.clearHighResImageRetryTimer()
    if (!previewImage) {
      this.startDetailImageLoadTimer(requestId)
    }
    this.prefetchGuideImage(pose, requestId)

    const localPosePromise = pose.isFavorite
      ? getCachedFavoritePoseAssets(pose)
      : Promise.resolve(pose)

    localPosePromise.then((resolvedPose) => {
      if (this.detailImageRequestId !== requestId) {
        return null
      }

      const displayImage = getDisplayImageSource(resolvedPose)

      if (!displayImage) {
        throw new Error('missing detail image')
      }

      this.prefetchGuideImage(resolvedPose, requestId)
      this.preheatCameraImages(resolvedPose)
      if (pose.isFavorite) {
        cacheFavoritePoseAssets(pose).catch(() => {})
      } else {
        getCachedImagePath(displayImage).then((cachedImage) => {
          if (
            this.detailImageRequestId !== requestId ||
            !cachedImage
          ) {
            return
          }

          if (this.data.previewImage) {
            this.setData({
              highResImage: cachedImage
            })
            this.startHighResImageLoadTimer(requestId)
            return
          }

          if (!this.data.imageLoading) {
            return
          }

          this.setData({
            displayImage: cachedImage
          })
          this.startDetailImageLoadTimer(requestId)
        })
        cacheImage(displayImage).catch(() => {})
      }

      const hasPreviewImage = Boolean(this.data.previewImage)
      const nextData = {
        pose: {
          ...withFavoriteState(resolvedPose, getFavoritePoseIds()),
          ...(this.data.cachedShareImage ? { cachedShareImage: this.data.cachedShareImage } : {})
        },
        displayImageSource: initialDisplayImage || displayImage,
        imageLoading: !hasPreviewImage,
        imageLoadFailed: false,
        imageRetryVisible: false,
        displayImageFallbackTried: false
      }

      if (hasPreviewImage) {
        nextData.highResImage = displayImage
        nextData.highResImageSource = displayImage
        nextData.highResImageLoading = true
        nextData.highResImageLoadFailed = false
        nextData.highResImageRetryVisible = false
        nextData.highResImageFallbackTried = false
      } else {
        nextData.displayImage = displayImage
      }

      this.setData(nextData)
      if (hasPreviewImage) {
        this.startHighResImageLoadTimer(requestId)
      } else {
        this.startDetailImageLoadTimer(requestId)
      }
    }).catch(() => {
      if (this.detailImageRequestId !== requestId) {
        return
      }

      this.clearDetailImageLoadTimer()
      this.clearHighResImageLoadTimer()
      const hasPreviewImage = Boolean(this.data.previewImage)

      this.setData({
        displayImageSource: initialDisplayImage,
        imageLoading: false,
        imageLoadFailed: !hasPreviewImage,
        imageRetryVisible: !hasPreviewImage,
        highResImageLoading: false,
        highResImageLoadFailed: hasPreviewImage,
        highResImageRetryVisible: hasPreviewImage
      })
      if (hasPreviewImage) {
        this.startHighResImageRetryTimer()
      } else {
        this.startDetailImageRetryTimer()
      }
      if (!hasPreviewImage) {
        wx.showToast({
          title: '大图加载失败',
          icon: 'none'
        })
      }
    })
  },

  backToHome() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: '/pages/home/index'
        })
      }
    })
  },

  async openCamera() {
    const accepted = await ensurePrivacyNotice('打开相机拍照')

    if (!accepted) {
      return
    }

    this.preheatCameraImages(this.data.pose || getPose(this.data.poseId))

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${this.data.poseId}`
    })
  },

  toggleFavorite() {
    const result = togglePoseFavorite(this.data.poseId)
    const basePose = getPose(this.data.poseId)
    const pose = {
      ...withFavoriteState(basePose, result.favoritePoseIds),
      ...(this.data.cachedShareImage ? { cachedShareImage: this.data.cachedShareImage } : {})
    }

    this.setData({
      pose,
      isFavorite: result.isFavorite
    })

    wx.showToast({
      title: result.isFavorite ? '已收藏，缓存中' : '已取消收藏',
      icon: 'none'
    })

    if (result.isFavorite) {
      cacheFavoritePoseAssets(basePose).catch(() => {})
    } else {
      unpinFavoritePoseAssets(basePose)
    }
  },

  toggleDetailExpanded() {
    this.setData({
      detailExpanded: !this.data.detailExpanded
    })
  },

  onImageError() {
    const displayImage = this.data.displayImage
    const displayImageSource = this.data.displayImageSource

    if (!displayImage) {
      this.clearDetailImageLoadTimer()
      this.setData({
        imageLoading: false,
        imageLoadFailed: true,
        imageRetryVisible: true
      })
      this.startDetailImageRetryTimer()
      return
    }

    const fallbackImage = cdnAssetUrl(displayImageSource || displayImage)

    if (!this.data.displayImageFallbackTried && fallbackImage && fallbackImage !== displayImage) {
      this.setData({
        displayImage: fallbackImage,
        displayImageFallbackTried: true,
        imageLoading: true,
        imageLoadFailed: false,
        imageRetryVisible: false
      })
      this.clearDetailImageRetryTimer()
      this.startDetailImageLoadTimer(this.detailImageRequestId)
      return
    }

    this.clearDetailImageLoadTimer()
    this.setData({
      imageLoading: false,
      imageLoadFailed: true,
      imageRetryVisible: true
    })
    this.startDetailImageRetryTimer()
    wx.showToast({
      title: '大图加载失败',
      icon: 'none'
    })
  },

  onImageLoad() {
    this.clearDetailImageLoadTimer()
    this.setData({
      imageLoading: false,
      imageLoadFailed: false,
      imageRetryVisible: false
    })
    this.clearDetailImageRetryTimer()
  },

  onHighResImageLoad() {
    const highResImage = this.data.highResImage

    if (!highResImage) {
      return
    }

    this.clearHighResImageLoadTimer()
    this.setData({
      displayImage: highResImage,
      highResImageLoading: false,
      highResImageLoadFailed: false,
      highResImageRetryVisible: false,
      highResImageFallbackTried: false
    })
    this.clearHighResImageRetryTimer()
  },

  onHighResImageError() {
    const highResImage = this.data.highResImage
    const sourceImage = this.data.highResImageSource || this.data.displayImageSource || highResImage
    const fallbackImage = cdnAssetUrl(sourceImage)

    if (!this.data.highResImageFallbackTried && fallbackImage && fallbackImage !== highResImage) {
      this.setData({
        highResImage: fallbackImage,
        highResImageFallbackTried: true,
        highResImageLoading: true,
        highResImageLoadFailed: false,
        highResImageRetryVisible: false
      })
      this.clearHighResImageRetryTimer()
      this.startHighResImageLoadTimer(this.detailImageRequestId)
      return
    }

    this.clearHighResImageLoadTimer()
    this.setData({
      highResImageLoading: false,
      highResImageLoadFailed: true,
      highResImageRetryVisible: true
    })
    this.startHighResImageRetryTimer()
  },

  retryHighResImage() {
    const pose = this.data.pose || getPose(this.data.poseId)
    const sourceImage = this.data.displayImageSource || getDisplayImageSource(pose)

    if (!sourceImage) {
      return
    }

    const retryToken = Date.now()
    const retryImage = appendImageRetryToken(sourceImage, retryToken)
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId

    this.setData({
      highResImage: retryImage,
      highResImageSource: sourceImage,
      highResImageLoading: true,
      highResImageLoadFailed: false,
      highResImageRetryVisible: false,
      highResImageFallbackTried: false
    })
    this.clearHighResImageRetryTimer()
    this.startHighResImageLoadTimer(requestId)
    this.prefetchGuideImage(pose, requestId, retryToken)
    cacheImage(retryImage).catch(() => {})
  },

  retryDetailImage() {
    const pose = this.data.pose || getPose(this.data.poseId)
    const sourceImage = this.data.displayImageSource || getDisplayImageSource(pose)

    if (!sourceImage) {
      this.setData({
        imageLoading: false,
        imageLoadFailed: true,
        imageRetryVisible: true
      })
      this.startDetailImageRetryTimer()
      return
    }

    const retryToken = Date.now()
    const retryImage = appendImageRetryToken(sourceImage, retryToken)
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId

    this.setData({
      displayImage: retryImage,
      displayImageSource: sourceImage,
      imageLoading: true,
      imageLoadFailed: false,
      imageRetryVisible: false,
      displayImageFallbackTried: false
    })
    this.clearDetailImageRetryTimer()
    this.startDetailImageLoadTimer(requestId)
    this.prefetchGuideImage(pose, requestId, retryToken)
    cacheImage(retryImage).catch(() => {})
  },

  onShareAppMessage(options = {}) {
    const pose = this.data.pose || {}
    const poseId = this.data.poseId
    const sourceTopic = this.data.sourceTopic
    const preferredImage = this.data.displayImage || this.data.previewImage || ''
    const shareType = options.target && options.target.dataset
      ? options.target.dataset.shareType
      : ''

    if (shareType === 'photographer') {
      return buildPoseShare(pose, {
        poseId,
        role: 'photographer',
        preferredImage,
        path: `/pages/camera/index?poseId=${poseId}`
      })
    }

    if (shareType === 'pose') {
      return buildPoseShare(pose, {
        poseId,
        role: 'detail',
        preferredImage
      })
    }

    if (sourceTopic && sourceTopic.id) {
      return buildSceneShare({
        ...sourceTopic,
        cachedShareImage: pose.cachedShareImage || this.data.cachedShareImage || sourceTopic.cachedShareImage,
        preferredShareImage: preferredImage || sourceTopic.preferredShareImage,
        shareImage: pose.shareImage || sourceTopic.shareImage,
        coverImage: sourceTopic.coverImage || pose.thumbnailImage || pose.detailImage || pose.guideImage
      })
    }

    return buildPoseShare(pose, {
      poseId,
      role: 'detail',
      preferredImage
    })
  }
})
