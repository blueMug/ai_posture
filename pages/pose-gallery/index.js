const { poseCategories } = require('../../utils/poses')
const { cachePoseCategories } = require('../../utils/imageCache')
const { adSlots } = require('../../utils/adConfig')

const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const DEFAULT_PAGE_TOP_PX = 90
const MENU_BUTTON_GAP_PX = 40

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

const getPageTopStyle = () => {
  if (typeof wx.getMenuButtonBoundingClientRect !== 'function') {
    return `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`
  }

  const menuButtonRect = wx.getMenuButtonBoundingClientRect()
  const menuButtonBottom = Number(menuButtonRect && menuButtonRect.bottom)
  const pageTop = menuButtonBottom > 0
    ? menuButtonBottom + MENU_BUTTON_GAP_PX
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
    hasSearchResult: true,
    failedPoseImages: {},
    adSlot: adSlots.poseGalleryFeed
  },

  onLoad() {
    this.setData({
      pageTopStyle: getPageTopStyle()
    })
    this.setPoseCategories(poseCategories, {
      hasSearchResult: true
    })
  },

  onShow() {
    const targetCategoryId = wx.getStorageSync(GALLERY_TARGET_CATEGORY_KEY)

    if (!targetCategoryId) {
      return
    }

    wx.removeStorageSync(GALLERY_TARGET_CATEGORY_KEY)
    this.setPoseCategories(poseCategories, {
      searchKeyword: '',
      hasSearchResult: true
    }, targetCategoryId)
  },

  setPoseCategories(nextCategories, extraData = {}, targetCategoryId = '') {
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

      const activeCategoryId = cachedCategories.some((category) => category.id === targetCategoryId)
        ? targetCategoryId
        : cachedCategories[0].id

      this.setData({
        ...extraData,
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
