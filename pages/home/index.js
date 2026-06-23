const { poseTemplates, poseCategories } = require('../../utils/poses')
const { cacheImageFields, cachePoseCategories, queueImagePreload } = require('../../utils/imageCache')
const {
  cdnAssetUrl,
  homeLocalAssetUrl,
  HOME_LOCAL_ASSET_FOLDERS
} = require('../../utils/assets')
const { adSlots } = require('../../utils/adConfig')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const {
  getFavoritePoseIds,
  togglePoseFavorite,
  withFavoriteStateCategories
} = require('../../utils/userData')
const {
  cacheFavoritePoseAssets,
  unpinFavoritePoseAssets
} = require('../../utils/favoriteAssetCache')
const {
  isPoseMatchedSearch,
  normalizeSearchText
} = require('../../utils/poseSearch')
const { sceneTopics } = require('../../utils/sceneTopics')

const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const RECOMMEND_LIMIT_PER_CATEGORY = 4
const SCENE_ADVISOR_PLAN_LIMIT = 3
const DEFAULT_PAGE_TOP_PX = 52
const DAY_MS = 24 * 60 * 60 * 1000
const DAILY_RECOMMEND_CONFIGS = [
  {
    title: '穿搭显比例',
    subtitle: '想拍全身照，先从这 4 个显比例姿势开始。',
    categoryId: 'outfit-standing'
  },
  {
    title: '不露脸也出片',
    subtitle: '不用看镜头，背影和回眸也能很出片。',
    categoryId: 'back-view'
  },
  {
    title: '咖啡馆拍法',
    subtitle: '只推荐带咖啡杯、窗边或店外街拍的动作。',
    categoryId: 'props-action',
    poseIds: [
      'pair-custom84-r01-g01',
      'pair-custom40-r01-g01',
      'pair-custom76-r01-g01',
      'pair-custom78-r01-g01'
    ]
  },
  {
    title: '自拍不尴尬',
    subtitle: '近景自拍、表情管理和酷一点的姿势都在这里。',
    categoryId: 'selfie'
  },
  {
    title: '出门街拍',
    subtitle: '通勤路上、街角、机车和运动风都能照着拍。',
    categoryId: 'street-commute'
  },
  {
    title: '旅行打卡',
    subtitle: '到景点不用临场想姿势，选一个直接拍。',
    categoryId: 'travel-back'
  },
  {
    title: '坐着也好拍',
    subtitle: '坐姿、蹲姿、野餐和松弛生活照都适合。',
    categoryId: 'sitting-life'
  }
]
const SCENE_ADVISOR_CONFIGS = [
  {
    id: 'cafe',
    title: '咖啡店',
    desc: '手不知道放哪，就让杯子、窗户和桌面帮你完成动作。',
    categoryId: 'props-action',
    coverPoseId: 'pair-custom84-r01-g01',
    keywords: ['咖啡馆', '咖啡厅', '咖啡店', '窗边', '书店'],
    candidatePoseIds: [
      'pair-custom84-r01-g01',
      'pair-custom76-r01-g01',
      'pair-custom78-r01-g01',
      'pair-custom88-r01-g01',
      'pair-custom75-r01-g01',
      'pair-custom51-r01-g01',
      'pair-custom40-r01-g01',
      'pair-custom79-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom84-r01-g01',
        title: '咖啡馆捧杯近景',
        badge: '生活感',
        reason: '图里是捧杯近景，适合咖啡馆桌边、窗边和书店角落。',
        composition: '半身入镜，保留杯子和上半身动作。',
        camera: '手机放在胸口到眼睛之间，竖拍半身。',
        poseCue: '双手捧杯靠近胸前，脸微微侧向镜头。',
        avoid: '不要让杯子完全挡住下巴和嘴部。'
      },
      {
        poseId: 'pair-custom40-r01-g01',
        title: '牛仔咖啡台阶',
        badge: '休闲全身',
        reason: '图里是咖啡杯加台阶站姿，适合店外或街边咖啡场景。',
        composition: '全身入镜，把台阶和脚部姿态拍完整。',
        camera: '手机略低，保持人物从头到脚完整。',
        poseCue: '一手拿咖啡，另一手勾住裤袋，一腿屈膝搭台阶。',
        avoid: '不要裁掉脚，台阶动作会看不出来。'
      },
      {
        poseId: 'pair-custom76-r01-g01',
        title: '窗边侧身相机',
        badge: '文艺窗边',
        reason: '图里是窗边侧身和相机道具，适合咖啡馆靠窗位置。',
        composition: '半身或七分身入镜，保留窗边光线和手部道具。',
        camera: '手机平视，人物侧身比正面对镜头更松弛。',
        poseCue: '身体微侧，一手扶相机或道具，头部轻轻转向镜头。',
        avoid: '不要让窗户高光把脸压暗。'
      }
    ]
  },
  {
    id: 'travel',
    title: '旅行景点',
    desc: '先决定人和景的关系，再选背影、回眸或远景动作。',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom97-r01-g01',
    keywords: ['旅行', '景点', '古镇', '海边', '山顶', '湖边', '花田'],
    candidatePoseIds: [
      'pair-custom105-r01-g01',
      'pair-custom104-r01-g01',
      'pair-custom97-r01-g01',
      'pair-custom99-r01-g01',
      'pair-custom100-r01-g01',
      'pair-custom26-r01-g01',
      'pair-custom31-r01-g01',
      'pair-custom33-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom26-r01-g01',
        title: '溪涧提裤行走',
        badge: '自然背影',
        reason: '图里是溪涧行走背影，适合森林、溪边和自然景点。',
        composition: '全身背影入镜，把水面和脚部动作拍出来。',
        camera: '手机平视或略低，保留人物前方环境。',
        poseCue: '背对镜头低头看水，一手触枝叶，一手提裤脚。',
        avoid: '不要裁掉脚下水面，否则场景感会弱。'
      },
      {
        poseId: 'pair-custom31-r01-g01',
        title: '庭园踮脚展臂',
        badge: '轻盈动态',
        reason: '图里是庭园踏石上的背影动态，适合庭园、步道和安静景点。',
        composition: '全身入镜，保留脚下踏石或地面线条。',
        camera: '手机平视，别离太近，给双臂展开留空间。',
        poseCue: '背对镜头踮脚站稳，双臂向两侧展开，一脚向后抬起。',
        avoid: '不要把手臂裁出画面。'
      },
      {
        poseId: 'pair-custom33-r01-g01',
        title: '山脊望远镜眺望',
        badge: '探索感',
        reason: '图里是山脊眺望姿态，适合登山、徒步和开阔景点。',
        composition: '全身入镜，把岩石和远处空间留出来。',
        camera: '手机平视或略低，突出站在高处的力量感。',
        poseCue: '一脚踩高屈膝，一手举望远镜，另一手叉腰。',
        avoid: '不要拍得太近，否则看不出山脊和探索感。'
      }
    ]
  },
  {
    id: 'street',
    title: '街边路口',
    desc: '把马路、墙面、店招当背景，先做出行走感。',
    categoryId: 'street-commute',
    coverPoseId: 'pair-custom91-r01-g01',
    keywords: ['街边', '街头', '街拍', '路口', '城市', '通勤', '公园'],
    candidatePoseIds: [
      'pair-custom91-r01-g01',
      'pair-custom49-r01-g01',
      'pair-custom46-r01-g01',
      'pair-custom50-r01-g01',
      'pair-custom60-r01-g01',
      'pair-custom64-r01-g01',
      'pair-custom68-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom46-r01-g01',
        title: '职场西装领口',
        badge: '利落街拍',
        reason: '图里是整理西装领口的站姿，更适合街边路口和通勤建筑背景。',
        composition: '全身入镜，保留腿部跨步和手部整理领口动作。',
        camera: '手机略低，镜头保持垂直，突出干练比例。',
        poseCue: '一手整理西装领口，另一手背在身后，前腿微屈向前跨出。',
        avoid: '不要裁掉脚，西装街拍的比例会被破坏。'
      },
      {
        poseId: 'pair-custom49-r01-g01',
        title: '风衣拢发行走',
        badge: '通勤动态',
        reason: '图里是风衣行走和拢发动作，适合路口、斑马线和街边墙面。',
        composition: '全身入镜，人物前方留一点行走方向。',
        camera: '手机略低，连续拍几张抓自然步伐。',
        poseCue: '一手自然前摆，另一手轻拢耳后发丝，前腿迈出脚跟落地。',
        avoid: '不要站定硬摆，保留行走感更像街拍。'
      },
      {
        poseId: 'pair-custom50-r01-g01',
        title: '街边蹲姿互动',
        badge: '道具互动',
        reason: '蹲姿能避开路口杂乱背景，让街边照片更有动作。',
        composition: '全身或七分身入镜，保留腿部姿态和手部动作。',
        camera: '手机略低，保持人物重心稳定。',
        poseCue: '一腿屈膝下蹲，手自然搭在膝盖或道具上。',
        avoid: '不要从小腿中间裁切。'
      }
    ]
  },
  {
    id: 'outfit',
    title: '穿搭全身',
    desc: '重点不是姿势多，而是把比例、衣服轮廓和背景拍清楚。',
    categoryId: 'outfit-standing',
    coverPoseId: 'pair-custom92-r01-g01',
    keywords: ['全身照', '穿搭', 'ootd', '显比例', '站姿', '楼梯', '天台'],
    candidatePoseIds: [
      'pair-custom92-r01-g01',
      'pair-custom101-r01-g01',
      'pair-custom94-r01-g01',
      'pair-custom91-r01-g01',
      'pair-custom97-r01-g01',
      'pair-custom99-r01-g01',
      'pair-custom45-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom92-r01-g01',
        title: '天台倚栏穿搭',
        badge: '都市全身',
        reason: '图里有栏杆和城市背景，适合拍穿搭比例和外套轮廓。',
        composition: '半身或七分身入镜，保留栏杆和身体线条。',
        camera: '手机平视或略低，镜头保持垂直。',
        poseCue: '身体微侧靠近栏杆，一只手自然搭在栏杆上。',
        avoid: '不要让栏杆横线压在脖子位置。'
      },
      {
        poseId: 'pair-custom101-r01-g01',
        title: '楼梯扶手全身',
        badge: '建筑线条',
        reason: '楼梯线条能拉出比例，适合通勤、外套和城市穿搭。',
        composition: '全身入镜，顺着楼梯线条构图。',
        camera: '手机略低，保持墙线和楼梯线条端正。',
        poseCue: '一手扶栏杆，身体微微前倾，腿部自然错开。',
        avoid: '不要斜拍到建筑线条歪掉。'
      },
      {
        poseId: 'pair-custom94-r01-g01',
        title: '展馆白墙穿搭',
        badge: '干净背景',
        reason: '白墙和室内空间能突出衣服轮廓，适合干净穿搭照。',
        composition: '全身或七分身入镜，背景保持简洁。',
        camera: '手机平视，人物略偏一侧更有留白。',
        poseCue: '身体微侧，一手自然垂下，另一手轻放腰侧或包上。',
        avoid: '不要让背景元素穿过头部。'
      }
    ]
  },
  {
    id: 'selfie',
    title: '自拍近景',
    desc: '近景先处理脸、手和视线，别急着套全身姿势。',
    categoryId: 'selfie',
    coverPoseId: 'pair-custom75-r01-g01',
    keywords: ['自拍', '前置自拍', '半身自拍', '近景', '朋友圈'],
    candidatePoseIds: [
      'pair-custom75-r01-g01',
      'pair-custom77-r01-g01',
      'pair-custom82-r01-g01',
      'pair-custom86-r01-g01',
      'pair-custom87-r01-g01',
      'pair-custom18-r01-g01',
      'pair-custom24-r01-g01',
      'pair-custom34-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom18-r01-g01',
        title: '自拍侧身撩发',
        badge: '自然半身',
        reason: '图里是侧身撩发自拍，适合半身自拍和头像。',
        composition: '半身入镜，保留手肘形成的三角构图。',
        camera: '手机略高于眼睛，竖拍半身。',
        poseCue: '身体微侧，头部自然倾斜，一手轻触耳侧发丝。',
        avoid: '不要把手肘裁得太紧。'
      },
      {
        poseId: 'pair-custom75-r01-g01',
        title: '镜前半身自拍',
        badge: '稳定自拍',
        reason: '镜前半身更容易控制手机位置，适合头像和日常分享。',
        composition: '半身入镜，手机不要遮住全部脸。',
        camera: '手机略低于眼睛，镜子保持干净。',
        poseCue: '身体微侧，一手拿手机，另一手自然整理头发或衣领。',
        avoid: '背景杂物先移出画面。'
      },
      {
        poseId: 'pair-custom77-r01-g01',
        title: '暖光情绪自拍',
        badge: '氛围近景',
        reason: '暖光和半身动作适合夜晚、房间和清吧自拍。',
        composition: '胸上或半身入镜，保留肩颈线条。',
        camera: '手机略高，脸部靠近柔和光线。',
        poseCue: '头部轻轻偏向一侧，手自然靠近脸颊或发尾。',
        avoid: '不要让手机阴影挡住眼睛。'
      }
    ]
  }
]
const SCENE_ADVISOR_COVER_POSE_IDS = new Set(
  SCENE_ADVISOR_CONFIGS.map((scene) => scene.coverPoseId).filter(Boolean)
)
const SCENE_ADVISOR_POSE_OWNER_MAP = SCENE_ADVISOR_CONFIGS.reduce((map, scene) => {
  const candidatePoseIds = scene.candidatePoseIds || []

  candidatePoseIds.forEach((poseId) => {
    if (!map.has(poseId)) {
      map.set(poseId, scene.id)
    }
  })

  return map
}, new Map())
const RECOMMEND_CATEGORY_CONFIGS = [
  {
    sourceId: 'outfit-standing',
    name: '穿搭全身',
    subtitle: '显高显比例'
  },
  {
    sourceId: 'portrait-half',
    name: '半身人像',
    subtitle: '表情和手部更自然'
  },
  {
    sourceId: 'back-view',
    name: '不露脸背影',
    subtitle: '不看镜头也出片'
  },
  {
    sourceId: 'selfie',
    name: '自拍近景',
    subtitle: '近景表情不尴尬'
  }
]

const withHomeCardAssets = (pose) => ({
  ...pose,
  thumbnailImage: getHomeDisplayImage(pose),
  guideImage: homeLocalAssetUrl(pose.guideImage)
})
const getPoseFolderFromId = (poseId = '') => {
  const match = String(poseId).match(/custom(\d+)/)

  return match ? `custom${match[1]}` : ''
}
const isHomeLocalPose = (pose = {}) => HOME_LOCAL_ASSET_FOLDERS.has(getPoseFolderFromId(pose.id))
const withHomeLocalAssets = (pose) => ({
  ...pose,
  guideImage: homeLocalAssetUrl(pose.guideImage),
  thumbnailImage: homeLocalAssetUrl(pose.thumbnailImage),
  modelImage: cdnAssetUrl(pose.modelImage),
  detailImage: cdnAssetUrl(pose.detailImage)
})

const getHomeDisplayImage = (pose) => {
  if (!pose) {
    return ''
  }

  const thumbnailImage = pose.thumbnailImage || ''
  const localThumbnailImage = homeLocalAssetUrl(thumbnailImage)

  if (localThumbnailImage && localThumbnailImage.startsWith('/static/recommend_thumbs/')) {
    return localThumbnailImage
  }

  return ''
}
const buildSceneTopicCards = () => (
  sceneTopics
    .map((topic) => {
      const coverPose = poseTemplateMap.get(topic.coverPoseId)

      return {
        id: topic.id,
        title: topic.shortTitle || topic.title,
        fullTitle: topic.title,
        painPoint: topic.painPoint,
        promise: topic.promise,
        coverImage: getHomeDisplayImage(coverPose)
      }
    })
    .filter((topic) => topic.coverImage)
)
const compactText = (text = '') => String(text || '').replace(/\s+/g, ' ').trim()
const splitTextParts = (text = '') => compactText(text)
  .split(/[。.!！?？；;]/)
  .map((item) => compactText(item))
  .filter(Boolean)
const truncateText = (text = '', maxLength = 36) => {
  const value = compactText(text)

  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength)}...`
}
const getPoseRichnessScore = (pose = {}) => {
  const description = compactText(pose.description)
  const richSectionScore = [
    '适合场景',
    '拍照指导',
    '关键动作',
    '角度要点',
    '注意事项',
    '核心口诀'
  ].reduce((score, keyword) => (
    description.includes(keyword) ? score + 80 : score
  ), 0)

  return description.length + richSectionScore + (pose.searchKeywords || []).length * 4
}
const getSceneKeywords = (scene = {}) => [
  scene.title,
  scene.desc,
  ...(scene.keywords || [])
].filter(Boolean)
const isSceneMatchedPose = (scene, pose) => {
  const category = poseCategoryMap.get(pose.categoryId) || {}

  return getSceneKeywords(scene).some((keyword) => isPoseMatchedSearch(pose, category, keyword))
}
const getScenePlanReason = (pose = {}, fallback = '') => {
  const tip = compactText(pose.tip).replace(/^推荐/, '')
  const firstDescription = splitTextParts(pose.description)[0]

  return truncateText(tip || firstDescription || fallback, 38)
}
const getScenePlanCue = (pose = {}, fallback = '') => {
  const cue = splitTextParts(pose.description)
    .find((part) => /一手|双手|身体|背对|侧身|正对|眼神|头部|脚|腿/.test(part))

  return truncateText(cue || fallback || compactText(pose.description), 42)
}
const getAutoScenePlan = (scene, pose, manualPlan = {}) => ({
  ...manualPlan,
  poseId: pose.id,
  title: manualPlan.title || pose.name,
  badge: manualPlan.badge || pose.badge || pose.categoryName || scene.title,
  reason: manualPlan.reason || getScenePlanReason(pose, scene.desc),
  composition: manualPlan.composition || getScenePlanReason(pose, scene.desc),
  camera: manualPlan.camera || '优先竖拍，人物和关键动作都保留完整。',
  poseCue: manualPlan.poseCue || getScenePlanCue(pose),
  avoid: manualPlan.avoid || '不要把手部动作和脚部姿态裁掉。'
})

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const poseCategoryMap = poseCategories.reduce((map, category) => {
  map.set(category.id, category)
  return map
}, new Map())

const getRichCategoryPoses = (categoryId, {
  query = '',
  usedPoseIds = new Set(),
  limit = RECOMMEND_LIMIT_PER_CATEGORY
} = {}) => {
  const category = poseCategoryMap.get(categoryId)

  if (!category || !category.poses) {
    return []
  }

  return category.poses
    .filter((pose) => !usedPoseIds.has(pose.id))
    .filter((pose) => isPoseMatchedSearch(pose, category, query))
    .slice(0, limit)
}

const buildRecommendCategories = (keyword = '') => {
  const query = normalizeSearchText(keyword)
  const usedPoseIds = new Set()

  return RECOMMEND_CATEGORY_CONFIGS
    .map((config) => {
      const sourceCategory = poseCategoryMap.get(config.sourceId) || {}
      const category = {
        ...sourceCategory,
        id: config.sourceId,
        name: sourceCategory.name || '',
        subtitle: sourceCategory.subtitle || '',
        totalPoseCount: sourceCategory.poses ? sourceCategory.poses.length : 0
      }
      const poses = getRichCategoryPoses(config.sourceId, {
        query,
        usedPoseIds
      })
        .map(withHomeCardAssets)
        .filter((pose) => pose.thumbnailImage)

      poses.forEach((pose) => {
        usedPoseIds.add(pose.id)
      })

      return {
        ...category,
        poses
      }
    })
    .filter((category) => category.poses.length > 0)
}

const buildTypeEntries = () => (
  RECOMMEND_CATEGORY_CONFIGS
    .map((config) => {
      const sourceCategory = poseCategoryMap.get(config.sourceId) || {}
      const coverPose = (sourceCategory.poses || [])
        .find((pose) => pose.detailImage || pose.modelImage || pose.thumbnailImage || pose.guideImage)

      return {
        id: config.sourceId,
        name: config.name || sourceCategory.name || '',
        subtitle: config.subtitle || sourceCategory.subtitle || '',
        coverImage: getHomeDisplayImage(coverPose),
        totalPoseCount: sourceCategory.poses ? sourceCategory.poses.length : 0
      }
    })
    .filter((entry) => entry.totalPoseCount > 0 && entry.coverImage)
)

const buildSearchResultCategories = (keyword = '') => {
  const query = normalizeSearchText(keyword)

  if (!query) {
    return []
  }

  return poseCategories
    .map((category) => {
      const matchedPoses = category.poses
        .filter((pose) => isPoseMatchedSearch(pose, category, query))
        .map(withHomeCardAssets)
        .filter((pose) => pose.thumbnailImage)

      return {
        ...category,
        totalPoseCount: matchedPoses.length,
        poses: matchedPoses
      }
    })
    .filter((category) => category.poses.length > 0)
}

const isRealPhotoPose = (pose) => Boolean(pose && pose.modelImage && pose.detailImage)

const filterPoseCategories = (keyword) => {
  return buildSearchResultCategories(keyword)
}

const getLocalDayIndex = () => {
  const now = new Date()
  const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  return Math.floor(localMidnight / DAY_MS)
}

const getDailyRecommendConfig = () => {
  const dayIndex = getLocalDayIndex()
  return DAILY_RECOMMEND_CONFIGS[dayIndex % DAILY_RECOMMEND_CONFIGS.length]
}

const buildDailyRecommend = () => {
  const config = getDailyRecommendConfig()
  const poses = config.poseIds
    ? config.poseIds
      .map((poseId) => poseTemplateMap.get(poseId))
      .filter(Boolean)
      .slice(0, RECOMMEND_LIMIT_PER_CATEGORY)
      .map(withHomeLocalAssets)
    : getRichCategoryPoses(config.categoryId, {
      limit: Number.MAX_SAFE_INTEGER
    })
      .filter(isHomeLocalPose)
      .slice(0, RECOMMEND_LIMIT_PER_CATEGORY)
      .map(withHomeLocalAssets)

  return {
    ...config,
    poses
  }
}

const buildSceneTabs = (selectedSceneId = SCENE_ADVISOR_CONFIGS[0].id) => (
  SCENE_ADVISOR_CONFIGS
    .map((scene) => {
      const coverPose = poseTemplateMap.get(scene.coverPoseId)

      return {
        id: scene.id,
        title: scene.title,
        desc: scene.desc,
        active: scene.id === selectedSceneId,
        coverImage: getHomeDisplayImage(coverPose)
      }
    })
)

const buildSceneAdvisor = (sceneId) => {
  const scene = SCENE_ADVISOR_CONFIGS.find((item) => item.id === sceneId) || SCENE_ADVISOR_CONFIGS[0]
  const manualPlanMap = (scene.plans || []).reduce((map, plan) => {
    map.set(plan.poseId, plan)
    return map
  }, new Map())
  const matchedPoseIds = new Set()
  const sourcePoses = scene.candidatePoseIds
    ? scene.candidatePoseIds
      .map((poseId) => poseTemplateMap.get(poseId))
      .filter(Boolean)
    : poseTemplates.filter((pose) => isSceneMatchedPose(scene, pose))
  const matchedPoses = sourcePoses
    .filter((pose) => {
      const ownerSceneId = SCENE_ADVISOR_POSE_OWNER_MAP.get(pose.id)

      return !ownerSceneId || ownerSceneId === scene.id
    })
    .filter(isHomeLocalPose)
    .filter(isRealPhotoPose)
    .sort((left, right) => getPoseRichnessScore(right) - getPoseRichnessScore(left))

  const plans = [
    ...matchedPoses,
    ...(scene.plans || [])
      .map((plan) => poseTemplateMap.get(plan.poseId))
      .filter(Boolean)
  ]
    .filter((pose) => !SCENE_ADVISOR_COVER_POSE_IDS.has(pose.id))
    .filter((pose) => {
      if (matchedPoseIds.has(pose.id)) {
        return false
      }

      matchedPoseIds.add(pose.id)
      return true
    })
    .slice(0, SCENE_ADVISOR_PLAN_LIMIT)
    .map((plan) => {
      const pose = poseTemplateMap.get(plan.id)
      const scenePlan = getAutoScenePlan(scene, plan, manualPlanMap.get(plan.id))
      const localPose = withHomeLocalAssets(pose)

      return {
        ...scenePlan,
        poseName: pose ? pose.name : '',
        guideImage: localPose.guideImage,
        thumbnailImage: getHomeDisplayImage(localPose),
        gradient: pose ? pose.gradient : 'linear-gradient(135deg, #353535, #151515)'
      }
    })

  return {
    id: scene.id,
    title: scene.title,
    desc: scene.desc,
    categoryId: scene.categoryId,
    plans
  }
}

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

const getDetailPreloadUrl = (pose) => {
  if (!pose) {
    return ''
  }

  return getHomeDisplayImage(pose)
}

const getGuidePreloadUrl = (pose) => {
  if (!pose) {
    return ''
  }

  return getHomeDisplayImage(pose)
}

Page({
  data: {
    pageTopStyle: `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`,
    searchKeyword: '',
    dailyRecommend: {
      poses: []
    },
    sceneTopics: [],
    typeEntries: [],
    poseCategories: [],
    favoritePoseIds: [],
    hasSearchResult: true,
    failedPoseImages: {},
    loadedPoseImages: {},
    retryingPoseImages: {},
    adSlot: adSlots.homeRecommendBottom
  },

  onLoad() {
    this.setData({
      pageTopStyle: getPageTopStyle(),
      favoritePoseIds: getFavoritePoseIds(),
      sceneTopics: buildSceneTopicCards(),
      typeEntries: buildTypeEntries()
    })
    this.refreshDailyRecommend()
    this.setData({
      poseCategories: [],
      hasSearchResult: true
    })
  },

  onShow() {
    this.refreshDailyRecommend()
    if (this.data.searchKeyword) {
      this.refreshPoseCategories()
    }
  },

  onUnload() {
    if (this.failedImageRetryTimer) {
      clearTimeout(this.failedImageRetryTimer)
      this.failedImageRetryTimer = null
    }
  },

  onPullDownRefresh() {
    this.retryFailedPoseImages()
  },

  refreshDailyRecommend() {
    const requestId = (this.dailyRecommendRequestId || 0) + 1
    this.dailyRecommendRequestId = requestId
    const dailyRecommend = buildDailyRecommend()

    Promise.all(dailyRecommend.poses.map((pose) => cacheImageFields(pose, ['thumbnailImage']))).then((cachedPoses) => {
      if (this.dailyRecommendRequestId !== requestId) {
        return
      }

      this.setData({
        dailyRecommend: {
          ...dailyRecommend,
          poses: cachedPoses
        }
      }, () => this.queueHomeImagePreload())
    })
  },

  refreshPoseCategories(extraData = {}) {
    const nextCategories = filterPoseCategories(this.data.searchKeyword)

    this.setPoseCategories(nextCategories, {
      favoritePoseIds: getFavoritePoseIds(),
      hasSearchResult: nextCategories.length > 0,
      ...extraData
    })
  },

  setPoseCategories(nextCategories, extraData = {}) {
    const requestId = (this.poseCategoryRequestId || 0) + 1
    this.poseCategoryRequestId = requestId
    const favoritePoseIds = extraData.favoritePoseIds || getFavoritePoseIds()
    const nextCategoriesWithFavorites = withFavoriteStateCategories(nextCategories, favoritePoseIds)

    if (!nextCategoriesWithFavorites.length) {
      this.setData({
        ...extraData,
        favoritePoseIds,
        poseCategories: nextCategoriesWithFavorites
      })
      return
    }

    cachePoseCategories(nextCategoriesWithFavorites, ['thumbnailImage']).then((cachedCategories) => {
      if (this.poseCategoryRequestId !== requestId) {
        return
      }

      this.setData({
        ...extraData,
        favoritePoseIds,
        poseCategories: cachedCategories
      }, () => this.queueHomeImagePreload())
    })
  },

  queueHomeImagePreload() {
    if (this.homeGuidePreloadTimer) {
      clearTimeout(this.homeGuidePreloadTimer)
    }

    if (this.homeDetailPreloadTimer) {
      clearTimeout(this.homeDetailPreloadTimer)
    }

    this.homeGuidePreloadTimer = setTimeout(() => {
      this.preloadHomeImages('guide')
    }, 200)

    this.homeDetailPreloadTimer = setTimeout(() => {
      this.preloadHomeImages('detail')
    }, 1800)
  },

  getHomeVisiblePoses() {
    const poses = []
    const appendPose = (pose) => {
      if (pose && pose.id) {
        poses.push(pose)
      }
    }

    ;(this.data.dailyRecommend.poses || []).forEach(appendPose)
    ;(this.data.poseCategories || []).forEach((category) => {
      ;(category.poses || []).forEach(appendPose)
    })

    return poses
  },

  preloadHomeImages(type = 'detail') {
    const seenKey = type === 'guide' ? 'homeGuidePreloadSeen' : 'homeDetailPreloadSeen'
    const chainKey = type === 'guide' ? 'homeGuidePreloadChain' : 'homeDetailPreloadChain'
    const getUrl = type === 'guide' ? getGuidePreloadUrl : getDetailPreloadUrl
    const seen = this[seenKey] || new Set()
    this[seenKey] = seen
    const urls = []
    const queued = new Set()

    this.getHomeVisiblePoses().forEach((pose) => {
      const url = getUrl(pose)

      if (!url || !/^https?:\/\//.test(url) || seen.has(url) || queued.has(url)) {
        return
      }

      queued.add(url)
      urls.push(url)
    })

    if (!urls.length) {
      return
    }

    urls.forEach((url) => {
      seen.add(url)
    })
    this[chainKey] = queueImagePreload(urls)
  },

  onSearchInput(event) {
    const searchKeyword = event.detail.value

    if (!normalizeSearchText(searchKeyword)) {
      this.setData({
        poseCategories: [],
        searchKeyword,
        hasSearchResult: true
      })
      return
    }

    const nextCategories = filterPoseCategories(searchKeyword)

    this.setPoseCategories(nextCategories, {
      searchKeyword,
      hasSearchResult: nextCategories.length > 0
    })
  },

  clearSearch() {
    this.setData({
      poseCategories: [],
      searchKeyword: '',
      favoritePoseIds: getFavoritePoseIds(),
      hasSearchResult: true
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

  toggleFavorite(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const result = togglePoseFavorite(poseId)
    const pose = poseTemplates.find((item) => item.id === poseId)

    wx.showToast({
      title: result.isFavorite ? '已收藏，缓存中' : '已取消收藏',
      icon: 'none'
    })

    if (result.isFavorite) {
      cacheFavoritePoseAssets(pose).catch(() => {})
    } else {
      unpinFavoritePoseAssets(pose)
    }

    this.refreshPoseCategories({
      favoritePoseIds: result.favoritePoseIds
    })
  },

  onPoseImageError(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    this.setData({
      [`failedPoseImages.${poseId}`]: true,
      [`loadedPoseImages.${poseId}`]: false
    })
  },

  onPoseImageLoad(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    this.setData({
      [`failedPoseImages.${poseId}`]: false,
      [`loadedPoseImages.${poseId}`]: true
    })
  },

  retryFailedPoseImages() {
    const failedPoseImages = this.data.failedPoseImages || {}
    const failedPoseIds = Object.keys(failedPoseImages).filter((poseId) => failedPoseImages[poseId])

    if (!failedPoseIds.length) {
      if (typeof wx.stopPullDownRefresh === 'function') {
        wx.stopPullDownRefresh()
      }
      return
    }

    if (this.failedImageRetryTimer) {
      clearTimeout(this.failedImageRetryTimer)
    }

    const retryingPoseImages = failedPoseIds.reduce((map, poseId) => {
      map[poseId] = true
      return map
    }, {})
    const resetFailedImages = failedPoseIds.reduce((map, poseId) => {
      map[`failedPoseImages.${poseId}`] = false
      map[`loadedPoseImages.${poseId}`] = false
      return map
    }, {})

    this.setData({
      retryingPoseImages,
      ...resetFailedImages
    }, () => {
      this.failedImageRetryTimer = setTimeout(() => {
        this.failedImageRetryTimer = null
        this.setData({
          retryingPoseImages: {}
        })

        if (typeof wx.stopPullDownRefresh === 'function') {
          wx.stopPullDownRefresh()
        }
      }, 80)
    })
  },

  openPoseDetail(event) {
    const { poseId } = event.currentTarget.dataset
    const pose = poseTemplates.find((item) => item.id === poseId)

    if (!poseId) {
      return
    }

    if (!isRealPhotoPose(pose)) {
      this.openCamera(event)
      return
    }

    wx.navigateTo({
      url: `/pages/pose-detail/index?poseId=${poseId}`
    })
  },

  async openCamera(event) {
    const { poseId, homeLocal } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const accepted = await ensurePrivacyNotice('打开相机拍照')

    if (!accepted) {
      return
    }

    const shouldUseHomeLocalAssets = homeLocal === '1' && isHomeLocalPose({ id: poseId })

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${poseId}${shouldUseHomeLocalAssets ? '&homeLocal=1' : ''}`
    })
  },

  openCategory(event) {
    const { categoryId } = event.currentTarget.dataset

    if (!categoryId) {
      return
    }

    wx.setStorageSync(GALLERY_TARGET_CATEGORY_KEY, categoryId)
    wx.switchTab({
      url: '/pages/pose-gallery/index'
    })
  }
})
