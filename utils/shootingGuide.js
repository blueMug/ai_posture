const SCENE_PLAN_DETAIL_KEY = 'sceneAdvisorPlanDetail'

const compactGuideItems = (items) => items.filter((item) => item && item.text)
const compactText = (text = '') => String(text || '').replace(/\s+/g, ' ').trim()

const getSceneShootingGuide = (poseId) => {
  try {
    const guide = wx.getStorageSync(SCENE_PLAN_DETAIL_KEY)

    if (!guide || guide.poseId !== poseId) {
      return null
    }

    const actionText = compactText(guide.poseDescription || guide.poseCue)
    const compositionText = compactText(guide.composition)

    return {
      ...guide,
      actionText,
      compositionText,
      sceneTitle: '',
      badge: '',
      title: '',
      reason: '',
      hasText: Boolean(actionText || compositionText),
      items: compactGuideItems([
        { label: '动作', text: actionText },
        { label: '构图', text: compositionText }
      ])
    }
  } catch (error) {
    return null
  }
}

const getPoseShootingGuide = (pose = {}) => {
  const actionText = compactText(pose.description)
  const items = compactGuideItems([
    { label: '动作', text: actionText }
  ])

  if (!pose.tip && !items.length) {
    return null
  }

  return {
    sceneTitle: '',
    badge: '',
    title: '',
    reason: '',
    actionText,
    compositionText: '',
    hasText: Boolean(actionText),
    items
  }
}

const getShootingGuide = (pose = {}) => (
  getSceneShootingGuide(pose.id) || getPoseShootingGuide(pose)
)

module.exports = {
  getShootingGuide
}
