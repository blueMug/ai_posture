const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImage } = require('../../utils/imageCache')
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

const getPose = (poseId) => poseTemplates[findPoseIndex(poseId)]
const MAX_ACTION_POINTS = 3

const compactText = (text = '') => String(text || '').replace(/\s+/g, ' ').trim()
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
    { label: '动作', text: actionText },
    { label: '画面', text: compositionText }
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
    imageLoading: false,
    displayImageFallbackTried: false,
    preloadedGuideImage: '',
    shootingGuide: null,
    detailGuide: null,
    detailExpanded: false,
    sourceTopic: null,
    isFavorite: false
  },

  onLoad(options = {}) {
    const pose = getPose(options.poseId)
    const favoritePoseIds = getFavoritePoseIds()
    const poseWithFavorite = withFavoriteState(pose, favoritePoseIds)
    const shootingGuide = getShootingGuide(pose)
    const detailGuide = buildDetailGuide(pose, shootingGuide)
    const sourceTopic = options.topicId ? getSceneTopic(options.topicId) : null

    this.setData({
      poseId: pose.id,
      pose: poseWithFavorite,
      displayImage: '',
      imageLoading: true,
      displayImageFallbackTried: false,
      preloadedGuideImage: '',
      shootingGuide,
      detailGuide,
      detailExpanded: false,
      sourceTopic,
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
    const poseWithFavorite = withFavoriteState(pose, getFavoritePoseIds())

    this.setData({
      pose: poseWithFavorite,
      isFavorite: poseWithFavorite.isFavorite
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

  loadDetailImages(pose) {
    const requestId = (this.detailImageRequestId || 0) + 1
    this.detailImageRequestId = requestId
    const localPosePromise = pose.isFavorite
      ? cacheFavoritePoseAssets(pose)
      : Promise.resolve(pose)

    localPosePromise.then((resolvedPose) => {
      if (this.detailImageRequestId !== requestId) {
        return null
      }

      const displayImage = resolvedPose.detailImage || resolvedPose.thumbnailImage || resolvedPose.guideImage
      const displayImagePromise = pose.isFavorite
        ? Promise.resolve(displayImage)
        : cacheImage(displayImage)

      return displayImagePromise.then((cachedImage) => {
        if (this.detailImageRequestId !== requestId) {
          return
        }

        this.setData({
          pose: withFavoriteState(resolvedPose, getFavoritePoseIds()),
          displayImage: cachedImage,
          imageLoading: true,
          preloadedGuideImage: resolvedPose.guideImage || ''
        })
      })
    }).catch(() => {
      if (this.detailImageRequestId !== requestId) {
        return
      }

      this.setData({
        imageLoading: false
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

    if (!displayImage) {
      return
    }

    const fallbackImage = cdnAssetUrl(displayImage)

    if (!this.data.displayImageFallbackTried && fallbackImage && fallbackImage !== displayImage) {
      this.setData({
        displayImage: fallbackImage,
        displayImageFallbackTried: true,
        imageLoading: true
      })
      return
    }

    this.setData({
      imageLoading: false
    })
    wx.showToast({
      title: '大图加载失败',
      icon: 'none'
    })
  },

  onImageLoad() {
    this.setData({
      imageLoading: false
    })
  },

  onShareAppMessage() {
    const pose = this.data.pose || {}
    const poseId = this.data.poseId
    const sourceTopic = this.data.sourceTopic

    if (sourceTopic && sourceTopic.id) {
      return {
        title: sourceTopic.shareTitle || `${sourceTopic.title}，照着姿势拍`,
        path: `/pages/scene-topic/index?topicId=${sourceTopic.id}`,
        imageUrl: pose.thumbnailImage || pose.detailImage || pose.guideImage || ''
      }
    }

    return {
      title: pose.name
        ? `照着这个姿势拍｜${pose.name}`
        : '照着这个姿势拍｜拍照姿势模板',
      path: `/pages/pose-detail/index?poseId=${poseId}`,
      imageUrl: pose.thumbnailImage || pose.detailImage || pose.guideImage || ''
    }
  }
})
