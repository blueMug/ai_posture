const { poseTemplates, poseCategories } = require('../../utils/poses')
const { cacheImageFields, cachePoseCategories } = require('../../utils/imageCache')
const { cdnAssetUrl } = require('../../utils/assets')
const { adSlots } = require('../../utils/adConfig')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const {
  getFavoritePoseIds,
  togglePoseFavorite,
  withFavoriteStateCategories
} = require('../../utils/userData')

const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const RECOMMEND_LIMIT_PER_CATEGORY = 4
const DEFAULT_PAGE_TOP_PX = 52
const DAY_MS = 24 * 60 * 60 * 1000
const DAILY_RECOMMEND_CONFIGS = [
  {
    title: '今天拍穿搭',
    subtitle: '想拍全身照，先从这 4 个显比例姿势开始。',
    categoryId: 'outfit-standing',
    poseIds: ['pair-custom25-r01-g01', 'pair-custom27-r01-g01', 'pair-custom30-r01-g01', 'pair-custom36-r01-g01']
  },
  {
    title: '今天试试不露脸',
    subtitle: '不用看镜头，背影和回眸也能很出片。',
    categoryId: 'back-view',
    poseIds: ['pair-custom26-r01-g01', 'pair-custom29-r01-g01', 'pair-custom31-r01-g01', 'pair-custom33-r01-g01']
  },
  {
    title: '今天拍咖啡馆',
    subtitle: '手不知道放哪，就用杯子、相机和书本互动。',
    categoryId: 'props-action',
    poseIds: ['pair-custom19-r01-g01', 'pair-custom22-r01-g01', 'pair-custom27-r01-g01', 'pair-custom30-r01-g01']
  },
  {
    title: '今天自拍不尴尬',
    subtitle: '近景自拍、表情管理和酷一点的姿势都在这里。',
    categoryId: 'selfie',
    poseIds: ['pair-custom18-r01-g01', 'pair-custom21-r01-g01', 'pair-custom23-r01-g01', 'pair-custom28-r01-g01']
  },
  {
    title: '今天出门街拍',
    subtitle: '通勤路上、街角、机车和运动风都能照着拍。',
    categoryId: 'street-commute',
    poseIds: ['pair-custom25-r01-g01', 'pair-custom27-r01-g01', 'pair-custom30-r01-g01', 'pair-custom36-r01-g01']
  },
  {
    title: '今天旅行打卡',
    subtitle: '到景点不用临场想姿势，选一个直接拍。',
    categoryId: 'travel-back',
    poseIds: ['pair-custom26-r01-g01', 'pair-custom29-r01-g01', 'pair-custom31-r01-g01', 'pair-custom33-r01-g01']
  },
  {
    title: '今天坐着也好拍',
    subtitle: '坐姿、蹲姿、野餐和松弛生活照都适合。',
    categoryId: 'sitting-life',
    poseIds: ['pair-custom1-r01-g01', 'pair-custom3-r01-g01', 'pair-custom19-r01-g01', 'pair-custom22-r01-g01']
  }
]
const QUICK_SCENE_CONFIGS = [
  {
    categoryId: 'outfit-standing',
    coverPoseId: 'pair-custom25-r01-g01',
    title: '拍穿搭',
    desc: '显高显比例'
  },
  {
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom26-r01-g01',
    title: '旅行打卡',
    desc: '景点直接照着站'
  },
  {
    categoryId: 'back-view',
    coverPoseId: 'pair-custom29-r01-g01',
    title: '不露脸',
    desc: '背影回眸不尴尬'
  },
  {
    categoryId: 'selfie',
    coverPoseId: 'pair-custom18-r01-g01',
    title: '自拍',
    desc: '近景表情更自然'
  }
]
const RECOMMEND_CATEGORY_CONFIGS = [
  {
    sourceId: 'outfit-standing',
    poseIds: [
      'pair-custom25-r01-g01',
      'pair-custom27-r01-g01',
      'pair-custom30-r01-g01',
      'pair-custom36-r01-g01'
    ]
  },
  {
    sourceId: 'portrait-half',
    poseIds: [
      'pair-custom1-r01-g01',
      'pair-custom3-r01-g01',
      'pair-custom19-r01-g01',
      'pair-custom22-r01-g01'
    ]
  },
  {
    sourceId: 'travel-back',
    poseIds: [
      'pair-custom26-r01-g01',
      'pair-custom29-r01-g01',
      'pair-custom31-r01-g01',
      'pair-custom33-r01-g01'
    ]
  },
  {
    sourceId: 'selfie',
    poseIds: [
      'pair-custom18-r01-g01',
      'pair-custom23-r01-g01',
      'pair-custom24-r01-g01',
      'pair-custom28-r01-g01'
    ]
  }
]

const normalizeKeyword = (value) => String(value || '').trim().toLowerCase()

const getPoseSearchText = (pose, category) => [
  pose.name,
  pose.tip,
  pose.description,
  pose.badge,
  pose.categoryName,
  category.name,
  category.subtitle
].join(' ').toLowerCase()

const withCdnCardAssets = (pose) => ({
  ...pose,
  thumbnailImage: cdnAssetUrl(pose.thumbnailImage),
  guideImage: cdnAssetUrl(pose.guideImage)
})

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const poseCategoryMap = poseCategories.reduce((map, category) => {
  map.set(category.id, category)
  return map
}, new Map())

const buildRecommendCategories = (keyword = '') => {
  const query = normalizeKeyword(keyword)
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
      const poses = config.poseIds
        .map((poseId) => poseTemplateMap.get(poseId))
        .filter(Boolean)
        .filter((pose) => !usedPoseIds.has(pose.id))
        .filter((pose) => !query || getPoseSearchText(pose, category).includes(query))
        .slice(0, RECOMMEND_LIMIT_PER_CATEGORY)
        .map(withCdnCardAssets)

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

const isRealPhotoPose = (pose) => Boolean(pose && pose.modelImage && pose.detailImage)

const filterPoseCategories = (keyword) => {
  return buildRecommendCategories(keyword)
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
    .map((poseId) => poseTemplateMap.get(poseId))
    .filter(Boolean)

  return {
    ...config,
    poses
  }
}

const buildQuickScenes = () => (
  QUICK_SCENE_CONFIGS
    .map((scene) => {
      const category = poseCategoryMap.get(scene.categoryId)
      const coverPose = poseTemplateMap.get(scene.coverPoseId) || (category && category.poses && category.poses[0])

      return {
        ...scene,
        coverImage: coverPose ? coverPose.thumbnailImage || coverPose.guideImage : ''
      }
    })
    .filter((scene) => scene.coverImage)
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

Page({
  data: {
    pageTopStyle: `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`,
    searchKeyword: '',
    dailyRecommend: {
      poses: []
    },
    quickScenes: [],
    poseCategories: [],
    favoritePoseIds: [],
    hasSearchResult: true,
    failedPoseImages: {},
    adSlot: adSlots.homeRecommendBottom
  },

  onLoad() {
    this.setData({
      pageTopStyle: getPageTopStyle(),
      favoritePoseIds: getFavoritePoseIds(),
      quickScenes: buildQuickScenes()
    })
    this.refreshDailyRecommend()
    this.setPoseCategories(buildRecommendCategories(), {
      hasSearchResult: true
    })
  },

  onShow() {
    this.refreshDailyRecommend()
    this.refreshPoseCategories()
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
      })
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
      })
    })
  },

  onSearchInput(event) {
    const searchKeyword = event.detail.value
    const nextCategories = filterPoseCategories(searchKeyword)

    this.setPoseCategories(nextCategories, {
      searchKeyword,
      hasSearchResult: nextCategories.length > 0
    })
  },

  clearSearch() {
    this.setPoseCategories(buildRecommendCategories(), {
      searchKeyword: '',
      favoritePoseIds: getFavoritePoseIds(),
      hasSearchResult: true
    })
  },

  toggleFavorite(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const result = togglePoseFavorite(poseId)

    wx.showToast({
      title: result.isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    })

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
      [`failedPoseImages.${poseId}`]: true
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
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const accepted = await ensurePrivacyNotice('打开相机拍照')

    if (!accepted) {
      return
    }

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${poseId}`
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
