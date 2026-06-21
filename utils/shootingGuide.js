const SCENE_PLAN_DETAIL_KEY = 'sceneAdvisorPlanDetail'
const CAMERA_GUIDE_MAX_LENGTH = 18

const compactGuideItems = (items) => items.filter((item) => item && item.text)
const compactText = (text = '') => String(text || '').replace(/\s+/g, ' ').trim()
const trimTextEdge = (text = '') => compactText(text).replace(/^[，,；;、\s]+|[，,；;、\s]+$/g, '')
const splitTextParts = (text = '') => compactText(text)
  .split(/[。.!！?？；;]/)
  .map((item) => compactText(item))
  .filter(Boolean)
const truncateText = (text = '', maxLength = CAMERA_GUIDE_MAX_LENGTH) => {
  const value = trimTextEdge(text)

  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength)}...`
}
const simplifyGuideText = (text = '') => {
  const normalized = compactText(text)
    .replace(/^人物呈[^，,；;]*构图[，,；;]?/, '')
    .replace(/^[^，,；;]*竖幅构图[，,；;]?/, '')
    .replace(/^(动作|构图|画面|拍照指导|关键动作|角度要点|注意事项|核心口诀)[:：]/, '')
  const beforeSuitable = normalized.split(/适合/)[0]
  const parts = splitTextParts(beforeSuitable || normalized)

  return truncateText(trimTextEdge(parts[0] || normalized))
}
const simplifyTipText = (text = '') => {
  const normalized = compactText(text).replace(/^推荐/, '')
  const parts = normalized
    .split(/[、,，]/)
    .map((item) => compactText(item))
    .filter(Boolean)

  return truncateText(parts.slice(0, 2).join('、') || normalized)
}
const simplifyCompositionText = (text = '') => {
  const normalized = compactText(text)
    .replace(/^人物呈/, '')
    .replace(/3:4\s*竖幅构图/g, '3:4竖拍')
    .replace(/竖幅构图/g, '竖拍')
    .replace(/构图/g, '')
  const parts = normalized
    .split(/[，,；;]/)
    .map((item) => compactText(item))
    .filter(Boolean)

  return truncateText(trimTextEdge(parts.slice(0, 2).join('，') || normalized))
}
const pickActionText = (pose = {}, fallback = '') => {
  const parts = splitTextParts(pose.description)
  const handActionPart = parts.find((part) => /一手|双手|左手|右手/.test(part))
  const bodyActionPart = parts.find((part) => !/构图/.test(part) && /手|身体|侧身|背对|正面|站立|坐|蹲|头部|视线|眼神|脚|腿/.test(part))

  return simplifyGuideText(handActionPart || bodyActionPart || fallback || pose.description || pose.tip)
}
const pickCompositionText = (pose = {}, fallback = '') => {
  const parts = splitTextParts(pose.description)
  const compositionPart = parts.find((part) => /构图|竖幅|横幅|留白|裁切/.test(part))

  return compositionPart
    ? simplifyCompositionText(compositionPart)
    : simplifyTipText(fallback || pose.tip)
}
const buildGuide = ({
  sceneTitle = '',
  badge = '',
  title = '',
  reason = '',
  actionText = '',
  compositionText = ''
} = {}) => {
  const items = compactGuideItems([
    { label: '动作', text: actionText },
    { label: '构图', text: compositionText }
  ])

  return {
    sceneTitle,
    badge,
    title,
    reason,
    actionText,
    compositionText,
    hasText: Boolean(actionText || compositionText),
    items
  }
}

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

const getSimpleSceneShootingGuide = (pose = {}) => {
  try {
    const guide = wx.getStorageSync(SCENE_PLAN_DETAIL_KEY)

    if (!guide || guide.poseId !== pose.id) {
      return null
    }

    const actionText = simplifyGuideText(guide.poseCue || pickActionText(pose))
    const compositionText = simplifyCompositionText(guide.composition || pickCompositionText(pose) || guide.reason)

    return buildGuide({
      actionText,
      compositionText
    })
  } catch (error) {
    return null
  }
}

const getSimplePoseShootingGuide = (pose = {}) => {
  const actionText = pickActionText(pose)
  const compositionText = pickCompositionText(pose) || simplifyTipText(pose.tip)

  if (!actionText && !compositionText) {
    return null
  }

  return buildGuide({
    actionText,
    compositionText
  })
}

const getSimpleShootingGuide = (pose = {}) => (
  getSimpleSceneShootingGuide(pose) || getSimplePoseShootingGuide(pose)
)

module.exports = {
  getShootingGuide,
  getSimpleShootingGuide
}
