const { poseTemplates, findPoseIndex } = require('../../utils/poses')
const { cacheImageFields } = require('../../utils/imageCache')
const { cdnAssetUrl, homeLocalAssetUrl, HOME_LOCAL_ASSET_FOLDERS } = require('../../utils/assets')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const {
  SCENE_TOPIC_DETAIL_KEY,
  getSceneTopic
} = require('../../utils/sceneTopics')

const DEFAULT_PAGE_TOP_PX = 52

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const getPoseFolderFromId = (poseId = '') => {
  const match = String(poseId).match(/custom(\d+)/)

  return match ? `custom${match[1]}` : ''
}

const isHomeLocalPose = (pose = {}) => HOME_LOCAL_ASSET_FOLDERS.has(getPoseFolderFromId(pose.id))

const getDisplayImage = (pose = {}) => (
  homeLocalAssetUrl(pose.thumbnailImage) ||
  cdnAssetUrl(pose.detailImage || pose.modelImage || pose.thumbnailImage || pose.guideImage)
)

const isRealPhotoPose = (pose) => Boolean(pose && pose.modelImage && pose.detailImage)

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

const buildTopicView = (topicId) => {
  const topic = getSceneTopic(topicId)
  const coverPose = poseTemplateMap.get(topic.coverPoseId)
  const plans = topic.plans
    .map((plan) => {
      const pose = poseTemplateMap.get(plan.poseId)

      if (!pose) {
        return null
      }

      return {
        ...plan,
        poseName: pose.name,
        poseDescription: pose.description,
        thumbnailImage: getDisplayImage(pose),
        gradient: pose.gradient || 'linear-gradient(135deg, #363636, #151515)'
      }
    })
    .filter(Boolean)

  return {
    ...topic,
    coverImage: coverPose ? getDisplayImage(coverPose) : '',
    plans
  }
}

Page({
  data: {
    pageTopStyle: `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`,
    topic: null,
    failedPoseImages: {}
  },

  onLoad(options = {}) {
    const topic = buildTopicView(options.topicId)

    this.setData({
      pageTopStyle: getPageTopStyle(),
      topic
    })

    this.cacheTopicImages(topic)

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  cacheTopicImages(topic) {
    if (!topic || !topic.plans || !topic.plans.length) {
      return
    }

    Promise.all(topic.plans.map((plan) => cacheImageFields(plan, ['thumbnailImage']))).then((cachedPlans) => {
      if (!this.data.topic || this.data.topic.id !== topic.id) {
        return
      }

      this.setData({
        topic: {
          ...this.data.topic,
          plans: cachedPlans
        }
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

  setTopicPlanDetail(plan) {
    if (!plan || !this.data.topic) {
      return
    }

    wx.setStorageSync(SCENE_TOPIC_DETAIL_KEY, {
      poseId: plan.poseId,
      topicId: this.data.topic.id,
      sceneTitle: this.data.topic.shortTitle || this.data.topic.title,
      title: plan.title,
      badge: plan.badge,
      reason: plan.reason,
      composition: plan.composition,
      camera: plan.camera,
      poseDescription: plan.poseDescription || '',
      poseCue: '',
      avoid: plan.avoid
    })
  },

  openPoseDetail(event) {
    const { poseId, planIndex } = event.currentTarget.dataset
    const plan = this.data.topic && this.data.topic.plans[Number(planIndex)]
    const pose = poseTemplateMap.get(poseId)

    if (!poseId || !plan) {
      return
    }

    this.setTopicPlanDetail(plan)

    if (!isRealPhotoPose(pose)) {
      this.openCamera(event)
      return
    }

    wx.navigateTo({
      url: `/pages/pose-detail/index?poseId=${poseId}&topicId=${this.data.topic.id}`
    })
  },

  async openCamera(event) {
    const { poseId, planIndex } = event.currentTarget.dataset
    const plan = this.data.topic && this.data.topic.plans[Number(planIndex)]

    if (!poseId) {
      return
    }

    if (plan) {
      this.setTopicPlanDetail(plan)
    }

    const accepted = await ensurePrivacyNotice('打开相机拍照')

    if (!accepted) {
      return
    }

    const shouldUseHomeLocalAssets = isHomeLocalPose({ id: poseId })

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${poseId}${shouldUseHomeLocalAssets ? '&homeLocal=1' : ''}`
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
      title: topic.shareTitle || `${topic.title || '场景拍照'}，照着姿势拍`,
      path: `/pages/scene-topic/index?topicId=${topic.id || ''}`,
      imageUrl: topic.coverImage || ''
    }
  }
})
