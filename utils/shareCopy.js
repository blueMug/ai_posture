const DEFAULT_HOME_SHARE_IMAGE = '/assets/brand/logo_pose_custom5_contour.png'

const compactText = (text = '') => String(text || '').replace(/\s+/g, ' ').trim()
const getPoseName = (pose = {}) => compactText(pose.name) || '这个姿势'
const getSceneName = (topic = {}) => compactText(topic.shortTitle || topic.title) || '这个场景'
const pickRandom = (items = []) => {
  const validItems = items.filter(Boolean)

  if (!validItems.length) {
    return ''
  }

  return validItems[Math.floor(Math.random() * validItems.length)]
}
const fillTemplate = (template = '', values = {}) => Object.keys(values).reduce((text, key) => (
  text.replace(new RegExp(`\\{${key}\\}`, 'g'), values[key])
), template)
const getPoseShareImage = (pose = {}, fallbackImage = '') => (
  pose.shareImage ||
  pose.thumbnailImage ||
  pose.detailImage ||
  pose.modelImage ||
  pose.guideImage ||
  fallbackImage ||
  DEFAULT_HOME_SHARE_IMAGE
)

const HOME_SHARE_TITLES = [
  '拍照搭子作业：选场景，打开就能照着拍',
  '出门拍照前先把这个发给搭子',
  '到了现场不用想动作，按场景直接抄姿势',
  '拍照不知道摆什么？这份出片作业先存好',
  '下次拍照别只比耶，直接照着轮廓拍'
]

const GALLERY_SHARE_TITLES = [
  '不尴尬、显比例、好出片的拍照姿势都在这里',
  '显腿长、不露脸、街拍旅行姿势，一次找齐',
  '拍照没动作？这里都是能直接照着拍的姿势',
  '收藏这份姿势大全，下次拍照直接抄作业',
  '从自拍到旅行打卡，出片姿势都给你分好了'
]

const POSE_SHARE_TITLES = {
  detail: [
    '这个「{poseName}」很出片，下次拍照照着来',
    '下次拍照试试「{poseName}」，不尴尬还显比例',
    '发现一个好拍的姿势：「{poseName}」',
    '这个姿势可以收藏，拍照时直接照着来',
    '想拍同款效果？这个「{poseName}」可以试试'
  ],
  photographer: [
    '帮我照着「{poseName}」拍一张',
    '拍照搭子作业：按「{poseName}」帮我拍',
    '下次见面照这个拍，姿势和轮廓都给你了',
    '不用想怎么拍，打开照着「{poseName}」对齐',
    '这张想拍同款，帮我按模板拍一下'
  ],
  result: [
    '我刚照着「{poseName}」拍了一张，点开试同款',
    '这个姿势真的好抄，照着「{poseName}」拍就行',
    '拍照不知道摆什么？我刚试了「{poseName}」',
    '同款姿势在这里，打开就能照着拍',
    '今天这张是照着「{poseName}」拍的'
  ],
  favorite: [
    '这个「{poseName}」姿势可以先收藏',
    '下次拍照想试这个：「{poseName}」',
    '发现一个值得收藏的出片姿势',
    '这个姿势留着，下次拍照直接用'
  ],
  scene: [
    '{sceneTitle}不知道怎么拍？这个姿势直接照着来',
    '{sceneTitle}拍照可以试试「{poseName}」',
    '到了{sceneTitle}，这个姿势比站着拍自然',
    '{sceneTitle}出片姿势，打开直接照着拍'
  ]
}

const PHOTOGRAPHER_TASK_TITLES = [
  '帮我照着「{poseName}」拍一张',
  '下次帮我拍这个「{poseName}」',
  '拍照搭子作业：照着「{poseName}」拍',
  '这个姿势想拍同款，帮我按模板拍',
  '不用现场想动作，照这个轮廓帮我拍'
]

const RESULT_CARD_TITLES = [
  '我刚照着「{poseName}」拍了一张，同款可以直接抄',
  '这个「{poseName}」姿势还挺出片，发给拍照搭子',
  '刚试了「{poseName}」，下次拍照照这个来',
  '拍照不知道摆什么时，这个姿势能救场',
  '同款姿势在这里，打开相机就能照着拍'
]

const SCENE_RESULT_CARD_TITLES = [
  '我刚照着「{planTitle}」拍了一张',
  '这个「{planTitle}」拍法还挺适合{sceneTitle}',
  '{sceneTitle}不知道怎么拍？我刚试了这个拍法',
  '下次去{sceneTitle}，可以照这个拍',
  '这个场景拍法能直接抄：{planTitle}'
]

const SCENE_SHARE_TITLES = [
  '{sceneName}不知道怎么拍？照着这 3 个姿势来',
  '把这份{sceneName}拍照方案发给一起拍照的人',
  '{sceneName}拍照不用现场想，打开直接照着拍',
  '下次去{sceneName}，这 3 个拍法可以先存',
  '{sceneName}想拍出片？先看这组姿势'
]

const buildHomeShare = () => ({
  title: pickRandom(HOME_SHARE_TITLES),
  path: '/pages/home/index',
  imageUrl: DEFAULT_HOME_SHARE_IMAGE
})

const buildGalleryShare = () => ({
  title: pickRandom(GALLERY_SHARE_TITLES),
  path: '/pages/pose-gallery/index',
  imageUrl: DEFAULT_HOME_SHARE_IMAGE
})

const buildPoseShare = (pose = {}, options = {}) => {
  const poseName = getPoseName(pose)
  const poseId = options.poseId || pose.id || ''
  const sceneTitle = compactText(options.sceneTitle)
  const path = options.path || (poseId ? `/pages/pose-detail/index?poseId=${poseId}` : '/pages/pose-gallery/index')
  const roleTemplates = POSE_SHARE_TITLES[options.role] || POSE_SHARE_TITLES.detail
  const title = options.title || fillTemplate(pickRandom(roleTemplates), {
    poseName,
    sceneTitle: sceneTitle || '这个场景'
  })

  return {
    title,
    path,
    imageUrl: getPoseShareImage(pose, options.fallbackImage)
  }
}

const buildPhotographerTask = (pose = {}, options = {}) => {
  const poseName = getPoseName(pose)
  const poseId = options.poseId || pose.id || ''

  return {
    visible: Boolean(poseId),
    kicker: '帮拍任务',
    title: fillTemplate(pickRandom(PHOTOGRAPHER_TASK_TITLES), { poseName }),
    desc: '发给拍照搭子，对方点开相机就能按轮廓对齐。',
    buttonText: '发搭子',
    path: poseId ? `/pages/camera/index?poseId=${poseId}` : '/pages/pose-gallery/index'
  }
}

const buildSceneShare = (topic = {}) => {
  const sceneName = getSceneName(topic)
  const title = pickRandom([
    topic.shareTitle,
    ...SCENE_SHARE_TITLES.map((template) => fillTemplate(template, { sceneName }))
  ])

  return {
    title,
    path: `/pages/scene-topic/index?topicId=${topic.id || ''}`,
    imageUrl: topic.cachedShareImage || topic.shareImage || topic.coverImage || DEFAULT_HOME_SHARE_IMAGE
  }
}

const buildResultShareCard = (previewPose = {}, previewShareSource = {}) => {
  const poseName = getPoseName(previewPose)
  const poseId = compactText(previewPose.id)
  const sceneTitle = compactText(previewShareSource.sceneTitle)
  const planTitle = compactText(previewShareSource.title) || poseName
  const topicId = compactText(previewShareSource.topicId)

  if (topicId) {
    return {
      visible: true,
      kicker: sceneTitle ? `${sceneTitle}拍法` : '场景拍法',
      title: fillTemplate(pickRandom(SCENE_RESULT_CARD_TITLES), {
        planTitle,
        sceneTitle: sceneTitle || '这个场景'
      }),
      desc: previewShareSource.reason || '不知道怎么拍时，直接选场景照着拍。',
      buttonText: '分享拍法',
      path: poseId
        ? `/pages/pose-detail/index?poseId=${poseId}&topicId=${topicId}`
        : `/pages/scene-topic/index?topicId=${topicId}`
    }
  }

  if (poseId) {
    return {
      visible: true,
      kicker: '同款姿势',
      title: fillTemplate(pickRandom(RESULT_CARD_TITLES), { poseName }),
      desc: '想要同款效果，点开直接照着姿势拍。',
      buttonText: '分享同款',
      path: `/pages/pose-detail/index?poseId=${poseId}`
    }
  }

  return {
    visible: false
  }
}

module.exports = {
  buildGalleryShare,
  buildHomeShare,
  buildPhotographerTask,
  buildPoseShare,
  buildResultShareCard,
  buildSceneShare,
  getPoseShareImage
}
