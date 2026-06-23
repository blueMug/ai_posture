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
const DETAIL_IMAGE_LOAD_TIMEOUT = 12000
const getDisplayImageSource = (pose = {}) => (
  pose.detailImage || pose.thumbnailImage || pose.guideImage || ''
)
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
    imageLoading: false,
    imageLoadFailed: false,
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

    this.setData({
      poseId: pose.id,
      pose: poseWithFavorite,
      displayImage: '',
      displayImageSource: getDisplayImageSource(poseWithFavorite),
      imageLoading: true,
      imageLoadFailed: false,
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

    const poseWithFavorite = withFavoriteState(pose, getFavoritePoseIds())

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
          pose: withFavoriteState(localPose, getFavoritePoseIds())
        })
      })
    }
  },

  onUnload() {
    this.clearDetailImageLoadTimer()
  },

  prefetchGuideImage(pose) {
    if (!pose || !pose.guideImage) {
      return
    }

    cacheImage(pose.guideImage).then((cachedGuideImage) => {
      if (this.data.poseId !== pose.id) {
        return
      }

      this.setData({
        preloadedGuideImage: cachedGuideImage
      })
    })
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

  clearDetailImageLoadTimer() {
    if (this.detailImageLoadTimer) {
      clearTimeout(this.detailImageLoadTimer)
      this.detailImageLoadTimer = null
    }
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
        imageLoadFailed: true
      })
    }, DETAIL_IMAGE_LOAD_TIMEOUT)
  },

  loadDetailImages(pose) {
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId
    const initialDisplayImage = getDisplayImageSource(pose)

    this.setData({
      displayImageSource: initialDisplayImage,
      imageLoading: true,
      imageLoadFailed: false,
      displayImageFallbackTried: false
    })
    this.startDetailImageLoadTimer(requestId)

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

      this.preheatCameraImages(resolvedPose)
      if (pose.isFavorite) {
        cacheFavoritePoseAssets(pose).catch(() => {})
      } else {
        getCachedImagePath(displayImage).then((cachedImage) => {
          if (
            this.detailImageRequestId !== requestId ||
            !cachedImage ||
            !this.data.imageLoading
          ) {
            return
          }

          this.setData({
            displayImage: cachedImage
          })
          this.startDetailImageLoadTimer(requestId)
        })
        cacheImage(displayImage).catch(() => {})
      }

      this.setData({
        pose: withFavoriteState(resolvedPose, getFavoritePoseIds()),
        displayImageSource: initialDisplayImage || displayImage,
        displayImage,
        imageLoading: true,
        imageLoadFailed: false,
        displayImageFallbackTried: false,
        preloadedGuideImage: resolvedPose.guideImage || ''
      })
      this.startDetailImageLoadTimer(requestId)
    }).catch(() => {
      if (this.detailImageRequestId !== requestId) {
        return
      }

      this.clearDetailImageLoadTimer()
      this.setData({
        displayImageSource: initialDisplayImage,
        imageLoading: false,
        imageLoadFailed: true
      })
      wx.showToast({
        title: '大图加载失败',
        icon: 'none'
      })
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
    const pose = withFavoriteState(basePose, result.favoritePoseIds)

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
        imageLoadFailed: true
      })
      return
    }

    const fallbackImage = cdnAssetUrl(displayImageSource || displayImage)

    if (!this.data.displayImageFallbackTried && fallbackImage && fallbackImage !== displayImage) {
      this.setData({
        displayImage: fallbackImage,
        displayImageFallbackTried: true,
        imageLoading: true,
        imageLoadFailed: false
      })
      this.startDetailImageLoadTimer(this.detailImageRequestId)
      return
    }

    this.clearDetailImageLoadTimer()
    this.setData({
      imageLoading: false,
      imageLoadFailed: true
    })
    wx.showToast({
      title: '大图加载失败',
      icon: 'none'
    })
  },

  onImageLoad() {
    this.clearDetailImageLoadTimer()
    this.setData({
      imageLoading: false,
      imageLoadFailed: false
    })
  },

  retryDetailImage() {
    const pose = this.data.pose || getPose(this.data.poseId)
    const sourceImage = this.data.displayImageSource || getDisplayImageSource(pose)

    if (!sourceImage) {
      this.setData({
        imageLoading: false,
        imageLoadFailed: true
      })
      return
    }

    const retryImage = appendImageRetryToken(sourceImage, Date.now())
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId

    this.setData({
      displayImage: retryImage,
      displayImageSource: sourceImage,
      imageLoading: true,
      imageLoadFailed: false,
      displayImageFallbackTried: false
    })
    this.startDetailImageLoadTimer(requestId)
    cacheImage(retryImage).catch(() => {})
  },

  onShareAppMessage(options = {}) {
    const pose = this.data.pose || {}
    const poseId = this.data.poseId
    const sourceTopic = this.data.sourceTopic
    const shareType = options.target && options.target.dataset
      ? options.target.dataset.shareType
      : ''

    if (shareType === 'photographer') {
      return buildPoseShare(pose, {
        poseId,
        role: 'photographer',
        path: `/pages/camera/index?poseId=${poseId}`
      })
    }

    if (shareType === 'pose') {
      return buildPoseShare(pose, {
        poseId,
        role: 'detail'
      })
    }

    if (sourceTopic && sourceTopic.id) {
      return buildSceneShare({
        ...sourceTopic,
        shareImage: pose.shareImage || sourceTopic.shareImage,
        coverImage: sourceTopic.coverImage || pose.thumbnailImage || pose.detailImage || pose.guideImage
      })
    }

    return buildPoseShare(pose, {
      poseId,
      role: 'detail'
    })
  }
})
