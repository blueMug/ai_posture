const { poseTemplates, poseCategories } = require('../../utils/poses')
const { cachePoseCategories } = require('../../utils/imageCache')

const RECOMMEND_LIMIT_PER_CATEGORY = 4

const normalizeKeyword = (value) => String(value || '').trim().toLowerCase()
const takeRecommendPoses = (categories) => categories
  .map((category) => ({
    ...category,
    poses: category.poses.slice(0, RECOMMEND_LIMIT_PER_CATEGORY)
  }))
  .filter((category) => category.poses.length > 0)

const getPoseSearchText = (pose, category) => [
  pose.name,
  pose.tip,
  pose.description,
  pose.badge,
  pose.categoryName,
  category.name,
  category.subtitle
].join(' ').toLowerCase()

const isRealPhotoPose = (pose) => Boolean(pose && pose.modelImage && pose.detailImage)

const filterPoseCategories = (keyword) => {
  const query = normalizeKeyword(keyword)

  if (!query) {
    return takeRecommendPoses(poseCategories)
  }

  return takeRecommendPoses(poseCategories
    .map((category) => ({
      ...category,
      poses: category.poses.filter((pose) => getPoseSearchText(pose, category).includes(query))
    }))
    .filter((category) => category.poses.length > 0))
}

Page({
  data: {
    searchKeyword: '',
    poseCategories: [],
    hasSearchResult: true,
    failedPoseImages: {}
  },

  onLoad() {
    this.setPoseCategories(takeRecommendPoses(poseCategories), {
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
    this.setPoseCategories(takeRecommendPoses(poseCategories), {
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
  }
})
