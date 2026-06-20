const { poseTemplates, poseCategories } = require('../../utils/poses')
const { cachePoseCategories } = require('../../utils/imageCache')

const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const RECOMMEND_LIMIT_PER_CATEGORY = 4
const RECOMMEND_CATEGORY_CONFIGS = [
  {
    sourceId: 'portrait-half',
    name: '半身照',
    subtitle: '精选近景半身、肩颈线条和温柔写真',
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
    subtitle: '适合手机自拍、窗边自然光和亲近感构图',
    poseIds: [
      'pair-custom18-r01-g01',
      'pair-custom20-r01-g01',
      'pair-custom21-r01-g01',
      'pair-custom2-r01-g01'
    ]
  },
  {
    sourceId: 'outfit-standing',
    name: '全身照',
    subtitle: '精选显比例、穿搭展示和自然站姿',
    poseIds: [
      'pair-custom4-r01-g01',
      'pair-custom6-r01-g01',
      'pair-custom8-r01-g01',
      'pair-custom9-r01-g01'
    ]
  },
  {
    sourceId: 'travel-back',
    name: '背影照',
    subtitle: '适合旅行、山海、湖畔和回眸背影',
    poseIds: [
      'pair-custom10-r01-g01',
      'pair-custom13-r01-g01',
      'pair-custom14-r01-g01',
      'pair-custom17-r01-g01'
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

Page({
  data: {
    searchKeyword: '',
    poseCategories: [],
    hasSearchResult: true,
    failedPoseImages: {}
  },

  onLoad() {
    this.setPoseCategories(buildRecommendCategories(), {
      hasSearchResult: true
    })
  },

  setPoseCategories(nextCategories, extraData = {}) {
    const requestId = (this.poseCategoryRequestId || 0) + 1
    this.poseCategoryRequestId = requestId

    if (!nextCategories.length) {
      this.setData({
        ...extraData,
        poseCategories: nextCategories
      })
      return
    }

    cachePoseCategories(nextCategories, ['thumbnailImage']).then((cachedCategories) => {
      if (this.poseCategoryRequestId !== requestId) {
        return
      }

      this.setData({
        ...extraData,
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
      hasSearchResult: true
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

  openCamera(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
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
