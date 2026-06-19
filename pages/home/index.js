const { poseCategories } = require('../../utils/poses')

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
    poseCategories,
    hasSearchResult: true
  },

  onSearchInput(event) {
    const searchKeyword = event.detail.value
    const nextCategories = filterPoseCategories(searchKeyword)

    this.setData({
      searchKeyword,
      poseCategories: nextCategories,
      hasSearchResult: nextCategories.length > 0
    })
  },

  clearSearch() {
    this.setData({
      searchKeyword: '',
      poseCategories,
      hasSearchResult: true
    })
  },

  openCamera(event) {
    const { poseId } = event.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/camera/index?poseId=${poseId}`
    })
  }
})
