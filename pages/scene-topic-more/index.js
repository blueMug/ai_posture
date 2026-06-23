const { poseTemplates } = require('../../utils/poses')
const { queueCachePoseCategories } = require('../../utils/imageCache')
const { cdnAssetUrl, homeLocalAssetUrl } = require('../../utils/assets')
const { getSceneTopic } = require('../../utils/sceneTopics')

const DEFAULT_PAGE_TOP_PX = 52

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const getDisplayImage = (pose = {}) => (
  homeLocalAssetUrl(pose.thumbnailImage) ||
  cdnAssetUrl(pose.detailImage || pose.modelImage || pose.thumbnailImage || pose.guideImage)
)

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

const buildMoreTopicView = (topicId) => {
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
        thumbnailImage: getDisplayImage(pose),
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
    failedPoseImages: {}
  },

  onLoad(options = {}) {
    const topic = buildMoreTopicView(options.topicId)

    this.setData({
      pageTopStyle: getPageTopStyle(),
      topic
    })

    this.cacheMoreImages(topic)
  },

  cacheMoreImages(topic) {
    if (!topic || !topic.poses || !topic.poses.length) {
      return
    }

    queueCachePoseCategories([{ poses: topic.poses }], ['thumbnailImage'], { priority: true }).then((cachedCategories) => {
      if (!this.data.topic || this.data.topic.id !== topic.id) {
        return
      }

      this.setData({
        topic: {
          ...this.data.topic,
          poses: (cachedCategories[0] && cachedCategories[0].poses) || topic.poses
        }
      })
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

    wx.navigateTo({
      url: `/pages/pose-detail/index?poseId=${poseId}&topicId=${this.data.topic.id}`
    })
  },

  onPoseImageError(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    this.setData({
      [`failedPoseImages.${poseId}`]: true
    })
  },

  onShareAppMessage() {
    const topic = this.data.topic || {}

    return {
      title: topic.shareTitle || topic.title || '更多场景拍照姿势',
      path: `/pages/scene-topic-more/index?topicId=${topic.id || ''}`,
      imageUrl: topic.shareImage || ''
    }
  }
})
