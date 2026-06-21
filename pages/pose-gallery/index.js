const { poseCategories } = require('../../utils/poses')
const { adSlots } = require('../../utils/adConfig')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const {
  getFavoritePoseIds,
  togglePoseFavorite,
  withFavoriteStateCategories
} = require('../../utils/userData')
const {
  isPoseMatchedSearch,
  normalizeSearchText
} = require('../../utils/poseSearch')

const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const DEFAULT_PAGE_TOP_PX = 52

const getGalleryDisplayImage = (pose, retryToken = '') => {
  const imageUrl = pose.modelImage || pose.detailImage || pose.thumbnailImage || ''

  if (!retryToken || !/^https?:\/\//.test(imageUrl)) {
    return imageUrl
  }

  const separator = imageUrl.includes('?') ? '&' : '?'
  return `${imageUrl}${separator}_retry=${retryToken}`
}

const withGalleryDisplayImages = (categories, retryTokens = {}) => (
  categories.map((category) => ({
    ...category,
    poses: category.poses.map((pose) => ({
      ...pose,
      galleryDisplayImage: getGalleryDisplayImage(pose, retryTokens[pose.id])
    }))
  }))
)

const filterPoseCategories = (keyword) => {
  const query = normalizeSearchText(keyword)

  if (!query) {
    return poseCategories
  }

  return poseCategories
    .map((category) => ({
      ...category,
      poses: category.poses.filter((pose) => isPoseMatchedSearch(pose, category, query))
    }))
    .filter((category) => category.poses.length > 0)
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
    categoryNavs: [],
    activeCategoryId: '',
    favoritePoseIds: [],
    hasSearchResult: true,
    failedPoseImages: {},
    imageRetryTokens: {},
    adSlot: adSlots.poseGalleryFeed
  },

  onLoad() {
    this.setData({
      pageTopStyle: getPageTopStyle(),
      favoritePoseIds: getFavoritePoseIds()
    })
    this.setPoseCategories(poseCategories, {
      hasSearchResult: true
    })
  },

  onShow() {
    const targetCategoryId = wx.getStorageSync(GALLERY_TARGET_CATEGORY_KEY)

    if (!targetCategoryId) {
      this.refreshPoseCategories()
      return
    }

    wx.removeStorageSync(GALLERY_TARGET_CATEGORY_KEY)
    this.setPoseCategories(poseCategories, {
      searchKeyword: '',
      favoritePoseIds: getFavoritePoseIds(),
      hasSearchResult: true
    }, targetCategoryId)
  },

  refreshPoseCategories(extraData = {}) {
    const nextCategories = filterPoseCategories(this.data.searchKeyword)

    this.setPoseCategories(nextCategories, {
      favoritePoseIds: getFavoritePoseIds(),
      hasSearchResult: nextCategories.length > 0,
      ...extraData
    })
  },

  setPoseCategories(nextCategories, extraData = {}, targetCategoryId = '') {
    const requestId = (this.poseCategoryRequestId || 0) + 1
    this.poseCategoryRequestId = requestId
    const favoritePoseIds = extraData.favoritePoseIds || getFavoritePoseIds()
    const nextCategoriesWithFavorites = withGalleryDisplayImages(
      withFavoriteStateCategories(nextCategories, favoritePoseIds),
      this.data.imageRetryTokens
    )

    if (!nextCategoriesWithFavorites.length) {
      this.setData({
        ...extraData,
        favoritePoseIds,
        poseCategories: nextCategoriesWithFavorites,
        categoryNavs: [],
        activeCategoryId: ''
      })
      return
    }

    const cachedCategories = nextCategoriesWithFavorites
    const activeCategoryId = cachedCategories.some((category) => category.id === targetCategoryId)
      ? targetCategoryId
      : cachedCategories[0].id

    this.setData({
      ...extraData,
      favoritePoseIds,
      poseCategories: cachedCategories,
      categoryNavs: cachedCategories.map((category) => ({
        id: category.id,
        name: category.name,
        count: category.poses.length
      })),
      activeCategoryId
    }, () => {
      if (targetCategoryId) {
        wx.nextTick(() => {
          this.scrollToCategoryId(activeCategoryId)
        })
      }
    })
  },

  scrollToCategoryId(categoryId) {
    if (!categoryId) {
      return
    }

    wx.pageScrollTo({
      selector: `#gallery-category-${categoryId}`,
      offsetTop: 16,
      duration: 240
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

    this.scrollToCategoryId(categoryId)
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

  openPoseDetail(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
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

  onPoseImageError(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    this.setData({
      [`failedPoseImages.${poseId}`]: true
    })
  },

  retryPoseImage(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const retryToken = Date.now()

    this.setData({
      [`failedPoseImages.${poseId}`]: false,
      [`imageRetryTokens.${poseId}`]: retryToken
    }, () => {
      this.refreshPoseCategories()
    })
  }
})
