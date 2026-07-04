const { poseTemplates } = require('../../utils/poses')
const { cacheImage } = require('../../utils/imageCache')
const { cdnAssetUrl, JSDELIVR_ASSET_BASE } = require('../../utils/assets')
const { getSceneTopic } = require('../../utils/sceneTopics')

const DETAIL_PREVIEW_IMAGE_KEY = 'poseDetailPreviewImage'
const DEFAULT_PAGE_TOP_PX = 52

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const toLocalAssetPath = (assetPath = '') => {
  if (!assetPath) {
    return ''
  }

  return String(assetPath).startsWith(`${JSDELIVR_ASSET_BASE}/`)
    ? `/${String(assetPath).slice(JSDELIVR_ASSET_BASE.length + 1)}`
    : assetPath
}

const toGalleryThumbnailImage = (assetPath = '') => {
  const galleryPath = toLocalAssetPath(assetPath)
    .replace('/static/pose_pairs/', '/static/gallery_thumbs/')
    .replace('/static/pose_thumbs/', '/static/gallery_thumbs/')
    .replace('/static/recommend_thumbs/', '/static/gallery_thumbs/')

  if (/_demo\.jpg$/.test(galleryPath)) {
    return galleryPath.replace(/_demo\.jpg$/, '_gallery_thumb.jpg')
  }

  if (/_thumb\.jpg$/.test(galleryPath)) {
    return galleryPath.replace(/_thumb\.jpg$/, '_gallery_thumb.jpg')
  }

  return galleryPath
}

const toFallbackThumbnailImage = (assetPath = '') => {
  const thumbPath = toLocalAssetPath(assetPath)
    .replace('/static/pose_pairs/', '/static/pose_thumbs/')
    .replace('/static/gallery_thumbs/', '/static/pose_thumbs/')
    .replace('/static/recommend_thumbs/', '/static/pose_thumbs/')

  if (/_demo\.jpg$/.test(thumbPath)) {
    return thumbPath.replace(/_demo\.jpg$/, '_thumb.jpg')
  }

  if (/_gallery_thumb\.jpg$/.test(thumbPath)) {
    return thumbPath.replace(/_gallery_thumb\.jpg$/, '_thumb.jpg')
  }

  return thumbPath
}

const withRetryToken = (url, retryToken = '') => {
  if (!retryToken || !/^https?:\/\//.test(url)) {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_retry=${retryToken}`
}

const getGalleryThumbnailUrl = (pose, retryToken = '') => {
  const localThumbnailImage = toGalleryThumbnailImage(pose.modelImage || pose.detailImage || pose.thumbnailImage || '')

  if (!localThumbnailImage || !localThumbnailImage.startsWith('/static/gallery_thumbs/')) {
    return ''
  }

  return withRetryToken(cdnAssetUrl(localThumbnailImage), retryToken)
}

const getFallbackThumbnailUrl = (pose, retryToken = '') => {
  const localThumbnailImage = toFallbackThumbnailImage(pose.modelImage || pose.detailImage || pose.thumbnailImage || '')

  if (!localThumbnailImage || !localThumbnailImage.startsWith('/static/pose_thumbs/')) {
    return ''
  }

  return withRetryToken(cdnAssetUrl(localThumbnailImage), retryToken)
}

const getGalleryDisplayImage = (pose, retryToken = '', fallbackPoseImages = {}) => (
  fallbackPoseImages[pose.id]
    ? getFallbackThumbnailUrl(pose, retryToken)
    : getGalleryThumbnailUrl(pose, retryToken)
)
const isGalleryPreviewImage = (image = '') => String(image).includes('/static/gallery_thumbs/')

const getShareImage = (pose = {}) => (
  cdnAssetUrl(pose.shareImage || pose.thumbnailImage || pose.detailImage || pose.modelImage || pose.guideImage)
)

const getPageTopStyle = () => {
  if (typeof wx.getMenuButtonBoundingClientRect !== 'function') {
    return `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`
  }

  const menuButtonRect = wx.getMenuButtonBoundingClientRect()
  const menuButtonTop = Number(menuButtonRect && menuButtonRect.top)
  const pageTop = menuButtonTop > 0
    ? menuButtonTop
    : DEFAULT_PAGE_TOP_PX

  return `padding-top: ${pageTop}px;`
}

const stopPullDownRefresh = () => {
  if (typeof wx.stopPullDownRefresh === 'function') {
    wx.stopPullDownRefresh()
  }
}

const buildMoreTopicView = (topicId, retryTokens = {}, fallbackPoseImages = {}) => {
  const topic = getSceneTopic(topicId)
  const coverPose = poseTemplateMap.get(topic.coverPoseId)
  const planPoseIds = new Set((topic.plans || []).map((plan) => plan.poseId))
  const poses = (topic.morePoseIds || [])
    .filter((poseId) => !planPoseIds.has(poseId))
    .map((poseId) => {
      const pose = poseTemplateMap.get(poseId)

      if (!pose) {
        return null
      }

      return {
        id: pose.id,
        name: pose.name,
        tip: pose.tip || '',
        galleryDisplayImage: getGalleryDisplayImage(pose, retryTokens[pose.id], fallbackPoseImages),
        thumbnailMode: pose.thumbnailMode || 'aspectFit',
        gradient: pose.gradient || 'linear-gradient(135deg, #363636, #151515)'
      }
    })
    .filter(Boolean)

  return {
    id: topic.id,
    title: `更多${topic.shortTitle || topic.title}姿势`,
    shareTitle: topic.shareTitle,
    shareImage: coverPose ? getShareImage(coverPose) : '',
    poses
  }
}

Page({
  data: {
    pageTopStyle: `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`,
    topic: null,
    failedPoseImages: {},
    fallbackPoseImages: {},
    imageRetryTokens: {}
  },

  onLoad(options = {}) {
    const topic = buildMoreTopicView(options.topicId)

    this.setData({
      pageTopStyle: getPageTopStyle(),
      topic
    })
    this.cacheMoreShareImage(topic)
  },

  cacheMoreShareImage(topic) {
    if (!topic || !topic.id || !topic.shareImage) {
      return
    }

    cacheImage(topic.shareImage).then((cachedShareImage) => {
      if (
        !cachedShareImage ||
        cachedShareImage === topic.shareImage ||
        !this.data.topic ||
        this.data.topic.id !== topic.id
      ) {
        return
      }

      this.setData({
        'topic.cachedShareImage': cachedShareImage
      })
    }).catch(() => {})
  },

  onPullDownRefresh() {
    this.setData({
      failedPoseImages: {},
      fallbackPoseImages: {},
      imageRetryTokens: {}
    }, () => {
      this.refreshMoreTopic()
      wx.nextTick(() => {
        stopPullDownRefresh()
      })
    })
    setTimeout(stopPullDownRefresh, 120)
  },

  refreshMoreTopic() {
    if (!this.data.topic || !this.data.topic.id) {
      return
    }

    const cachedShareImage = this.data.topic.cachedShareImage
    const nextTopic = buildMoreTopicView(
      this.data.topic.id,
      this.data.imageRetryTokens,
      this.data.fallbackPoseImages
    )

    this.setData({
      topic: {
        ...nextTopic,
        ...(cachedShareImage ? { cachedShareImage } : {})
      }
    })
  },

  backToTopic() {
    wx.navigateBack({
      fail: () => {
        wx.redirectTo({
          url: `/pages/scene-topic/index?topicId=${this.data.topic ? this.data.topic.id : ''}`
        })
      }
    })
  },

  openPoseDetail(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId || !this.data.topic) {
      return
    }

    const pose = (this.data.topic.poses || []).find((item) => item.id === poseId)
    const previewImage = pose && pose.galleryDisplayImage

    if (isGalleryPreviewImage(previewImage)) {
      wx.setStorageSync(DETAIL_PREVIEW_IMAGE_KEY, {
        poseId,
        image: previewImage,
        createdAt: Date.now()
      })
    }

    wx.navigateTo({
      url: `/pages/pose-detail/index?poseId=${poseId}&topicId=${this.data.topic.id}`
    })
  },

  onPoseImageError(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    if (!this.data.fallbackPoseImages[poseId]) {
      this.setData({
        [`fallbackPoseImages.${poseId}`]: true,
        [`failedPoseImages.${poseId}`]: false
      }, () => {
        this.refreshMoreTopic()
      })
      return
    }

    this.setData({
      [`failedPoseImages.${poseId}`]: true
    })
  },

  retryPoseImage(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const retryToken = Date.now()

    this.setData({
      [`fallbackPoseImages.${poseId}`]: false,
      [`failedPoseImages.${poseId}`]: false,
      [`imageRetryTokens.${poseId}`]: retryToken
    }, () => {
      this.refreshMoreTopic()
    })
  },

  onShareAppMessage() {
    const topic = this.data.topic || {}

    return {
      title: topic.shareTitle || topic.title || '更多场景拍照姿势',
      path: `/pages/scene-topic-more/index?topicId=${topic.id || ''}`,
      imageUrl: topic.shareImage || topic.cachedShareImage || ''
    }
  }
})
