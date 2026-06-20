const { poseTemplates, poseCategories } = require('../../utils/poses')
const { cachePoseCategories } = require('../../utils/imageCache')
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
const RECOMMEND_CATEGORY_CONFIGS = [
  {
    sourceId: 'portrait-half',
    name: '半身照',
    subtitle: '半身写真、头像、肩颈线条和近景拍照姿势',
    poseIds: [
      'pair-custom1-r01-g01',
      'pair-custom3-r01-g01',
      'pair-custom19-r01-g01',
      'pair-custom22-r01-g01'
    ]
  },
  {
    sourceId: 'selfie',
    name: '自拍照',
    subtitle: '手机自拍、窗边自然光、咖啡馆自拍和半身参考',
    poseIds: [
      'pair-custom18-r01-g01',
      'pair-custom23-r01-g01',
      'pair-custom24-r01-g01',
      'pair-custom28-r01-g01'
    ]
  },
  {
    sourceId: 'outfit-standing',
    name: '全身照/穿搭',
    subtitle: '全身照、穿搭展示、显比例和户外站姿参考',
    poseIds: [
      'pair-custom25-r01-g01',
      'pair-custom27-r01-g01',
      'pair-custom30-r01-g01',
      'pair-custom36-r01-g01'
    ]
  },
  {
    sourceId: 'travel-back',
    name: '旅行/背影',
    subtitle: '旅行拍照、景点打卡、山海湖畔和回眸背影',
    poseIds: [
      'pair-custom26-r01-g01',
      'pair-custom29-r01-g01',
      'pair-custom31-r01-g01',
      'pair-custom33-r01-g01'
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
        name: config.name,
        subtitle: config.subtitle,
        totalPoseCount: sourceCategory.poses ? sourceCategory.poses.length : 0
      }
      const poses = config.poseIds
        .map((poseId) => poseTemplateMap.get(poseId))
        .filter(Boolean)
        .filter((pose) => !usedPoseIds.has(pose.id))
        .filter((pose) => !query || getPoseSearchText(pose, category).includes(query))
        .slice(0, RECOMMEND_LIMIT_PER_CATEGORY)

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
    poseCategories: [],
    favoritePoseIds: [],
    hasSearchResult: true,
    failedPoseImages: {},
    adSlot: adSlots.homeRecommendBottom
  },

  onLoad() {
    this.setData({
      pageTopStyle: getPageTopStyle(),
      favoritePoseIds: getFavoritePoseIds()
    })
    this.setPoseCategories(buildRecommendCategories(), {
      hasSearchResult: true
    })
  },

  onShow() {
    this.refreshPoseCategories()
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
