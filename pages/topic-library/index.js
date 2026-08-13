const { poseTemplates } = require('../../utils/poses')
const { homeLocalAssetUrl } = require('../../utils/assets')
const { sceneTopics, isLandmarkTopic } = require('../../utils/sceneTopics')

const DEFAULT_PAGE_TOP_PX = 52

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

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

const getTopicCoverImage = (topic) => {
  const coverPose = poseTemplateMap.get(topic.coverPoseId)

  if (!coverPose) {
    return ''
  }

  const sourceImage = coverPose.thumbnailImage ||
    coverPose.modelImage ||
    coverPose.detailImage ||
    coverPose.guideImage ||
    ''

  return homeLocalAssetUrl(sourceImage)
}

const getTopicPoseCount = (topic) => {
  const poseIds = [
    ...(topic.plans || []).map((plan) => plan.poseId),
    ...(topic.morePoseIds || [])
  ].filter(Boolean)

  return new Set(poseIds.filter((poseId) => poseTemplateMap.has(poseId))).size
}

const buildTopicCards = (type = 'scene') => {
  const shouldUseLandmark = type === 'landmark'

  return sceneTopics
    .filter((topic) => isLandmarkTopic(topic.id) === shouldUseLandmark)
    .map((topic) => ({
      id: topic.id,
      title: topic.shortTitle || topic.title,
      fullTitle: topic.title,
      promise: topic.promise,
      coverImage: getTopicCoverImage(topic),
      moreCount: getTopicPoseCount(topic)
    }))
    .filter((topic) => topic.coverImage)
}

Page({
  data: {
    pageTopStyle: `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`,
    type: 'scene',
    title: '更多日常场景',
    kicker: '日常场景',
    subtitle: '按拍摄场景整理好的拍照作业，到现场直接照着拍。',
    topics: [],
    failedTopicImages: {}
  },

  onLoad(options = {}) {
    const type = options.type === 'landmark' ? 'landmark' : 'scene'

    this.setData({
      pageTopStyle: getPageTopStyle(),
      type,
      title: type === 'landmark' ? '更多旅行景点' : '更多日常场景',
      kicker: type === 'landmark' ? '旅行景点' : '日常场景',
      subtitle: type === 'landmark'
        ? '按地标整理好的拍照作业，旅行打卡不用临时想动作。'
        : '按拍摄场景整理好的拍照作业，到现场直接照着拍。',
      topics: buildTopicCards(type)
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

  openSceneTopic(event) {
    const { topicId } = event.currentTarget.dataset

    if (!topicId) {
      return
    }

    wx.navigateTo({
      url: `/pages/scene-topic/index?topicId=${topicId}`
    })
  },

  onTopicImageError(event) {
    const { topicId } = event.currentTarget.dataset

    if (!topicId) {
      return
    }

    this.setData({
      [`failedTopicImages.${topicId}`]: true
    })
  }
})
