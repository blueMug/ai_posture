const { poseCategories } = require('../../utils/poses')
const { cachePoseCategories } = require('../../utils/imageCache')

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

const filterPoseCategories = (keyword) => {
  const query = normalizeKeyword(keyword)

  if (!query) {
    return poseCategories
  }

  return poseCategories
    .map((category) => ({
      ...category,
      poses: category.poses.filter((pose) => getPoseSearchText(pose, category).includes(query))
    }))
    .filter((category) => category.poses.length > 0)
}

Page({
  data: {
    searchKeyword: '',
    poseCategories: [],
    categoryNavs: [],
    activeCategoryId: '',
    hasSearchResult: true,
    failedPoseImages: {}
  },

  onLoad() {
    this.setPoseCategories(poseCategories, {
      hasSearchResult: true
    })
  },

  setPoseCategories(nextCategories, extraData = {}) {
    const requestId = (this.poseCategoryRequestId || 0) + 1
    this.poseCategoryRequestId = requestId

    if (!nextCategories.length) {
      this.setData({
        ...extraData,
        poseCategories: nextCategories,
        categoryNavs: [],
        activeCategoryId: ''
      })
      return
    }

    cachePoseCategories(nextCategories, ['thumbnailImage']).then((cachedCategories) => {
      if (this.poseCategoryRequestId !== requestId) {
        return
      }

      this.setData({
        ...extraData,
        poseCategories: cachedCategories,
        categoryNavs: cachedCategories.map((category) => ({
          id: category.id,
          name: category.name,
          count: category.poses.length
        })),
        activeCategoryId: cachedCategories[0].id
      })
    })
  },

  scrollToCategory(event) {
    const { categoryId } = event.currentTarget.dataset

    if (!categoryId) {
      return
    }

    this.setData({
      activeCategoryId: categoryId
    })

    wx.pageScrollTo({
      selector: `#gallery-category-${categoryId}`,
      offsetTop: 16,
      duration: 240
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
    this.setPoseCategories(poseCategories, {
      searchKeyword: '',
      hasSearchResult: true
    })
  },

  openPoseDetail(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
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

  onPoseImageError(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    this.setData({
      [`failedPoseImages.${poseId}`]: true
    })
  }
})
