const { poseCategories } = require('../../utils/poses')
const { adSlots } = require('../../utils/adConfig')
const { cdnAssetUrl, JSDELIVR_ASSET_BASE } = require('../../utils/assets')
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

const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const DEFAULT_PAGE_TOP_PX = 52
const DEFAULT_TOP_BAR_HEIGHT_PX = 32

const toLocalAssetPath = (assetPath = '') => {
  if (!assetPath) {
    return ''
  }

  return String(assetPath).startsWith(`${JSDELIVR_ASSET_BASE}/`)
    ? `/${String(assetPath).slice(JSDELIVR_ASSET_BASE.length + 1)}`
    : assetPath
}

const toGalleryThumbnailImage = (assetPath = '') => {
  const galleryPath = toLocalAssetPath(assetPath)
    .replace('/static/pose_pairs/', '/static/gallery_thumbs/')
    .replace('/static/pose_thumbs/', '/static/gallery_thumbs/')
    .replace('/static/recommend_thumbs/', '/static/gallery_thumbs/')

  if (/_demo\.jpg$/.test(galleryPath)) {
    return galleryPath.replace(/_demo\.jpg$/, '_gallery_thumb.jpg')
  }

  if (/_thumb\.jpg$/.test(galleryPath)) {
    return galleryPath.replace(/_thumb\.jpg$/, '_gallery_thumb.jpg')
  }

  return galleryPath
}

const toFallbackThumbnailImage = (assetPath = '') => {
  const thumbPath = toLocalAssetPath(assetPath)
    .replace('/static/pose_pairs/', '/static/pose_thumbs/')
    .replace('/static/gallery_thumbs/', '/static/pose_thumbs/')
    .replace('/static/recommend_thumbs/', '/static/pose_thumbs/')

  if (/_demo\.jpg$/.test(thumbPath)) {
    return thumbPath.replace(/_demo\.jpg$/, '_thumb.jpg')
  }

  if (/_gallery_thumb\.jpg$/.test(thumbPath)) {
    return thumbPath.replace(/_gallery_thumb\.jpg$/, '_thumb.jpg')
  }

  return thumbPath
}

const withRetryToken = (url, retryToken = '') => {
  if (!retryToken || !/^https?:\/\//.test(url)) {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_retry=${retryToken}`
}

const getGalleryThumbnailUrl = (pose, retryToken = '') => {
  const localThumbnailImage = toGalleryThumbnailImage(pose.modelImage || pose.detailImage || pose.thumbnailImage || '')

  if (!localThumbnailImage || !localThumbnailImage.startsWith('/static/gallery_thumbs/')) {
    return ''
  }

  return withRetryToken(cdnAssetUrl(localThumbnailImage), retryToken)
}

const getFallbackThumbnailUrl = (pose, retryToken = '') => {
  const localThumbnailImage = toFallbackThumbnailImage(pose.modelImage || pose.detailImage || pose.thumbnailImage || '')

  if (!localThumbnailImage || !localThumbnailImage.startsWith('/static/pose_thumbs/')) {
    return ''
  }

  return withRetryToken(cdnAssetUrl(localThumbnailImage), retryToken)
}

const getGalleryDisplayImage = (pose, retryToken = '', fallbackPoseImages = {}) => (
  fallbackPoseImages[pose.id]
    ? getFallbackThumbnailUrl(pose, retryToken)
    : getGalleryThumbnailUrl(pose, retryToken)
)

const stopPullDownRefresh = () => {
  if (typeof wx.stopPullDownRefresh === 'function') {
    wx.stopPullDownRefresh()
  }
}

const findPoseById = (poseId) => {
  for (const category of poseCategories) {
    const pose = category.poses.find((item) => item.id === poseId)

    if (pose) {
      return pose
    }
  }

  return null
}

const withGalleryDisplayImages = (categories, retryTokens = {}, fallbackPoseImages = {}) => (
  categories.map((category) => ({
    ...category,
    poses: category.poses.map((pose) => ({
      ...pose,
      galleryDisplayImage: getGalleryDisplayImage(pose, retryTokens[pose.id], fallbackPoseImages)
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

const getTopBarStyle = () => {
  if (typeof wx.getMenuButtonBoundingClientRect !== 'function') {
    return `height: ${DEFAULT_TOP_BAR_HEIGHT_PX}px;`
  }

  const menuButtonRect = wx.getMenuButtonBoundingClientRect()
  const menuButtonHeight = Number(menuButtonRect && menuButtonRect.height)
  const topBarHeight = menuButtonHeight > 0
    ? menuButtonHeight
    : DEFAULT_TOP_BAR_HEIGHT_PX

  return `height: ${topBarHeight}px;`
}

Page({
  data: {
    pageTopStyle: `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`,
    topBarStyle: `height: ${DEFAULT_TOP_BAR_HEIGHT_PX}px;`,
    searchKeyword: '',
    poseCategories: [],
    categoryNavs: [],
    activeCategoryId: '',
    favoritePoseIds: [],
    hasSearchResult: true,
    failedPoseImages: {},
    fallbackPoseImages: {},
    imageRetryTokens: {},
    adSlot: adSlots.poseGalleryFeed
  },

  onLoad() {
    this.setData({
      pageTopStyle: getPageTopStyle(),
      topBarStyle: getTopBarStyle(),
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

  onPullDownRefresh() {
    this.refreshPoseCategories({
      failedPoseImages: {},
      fallbackPoseImages: {},
      imageRetryTokens: {}
    })
    wx.nextTick(() => {
      stopPullDownRefresh()
    })
    setTimeout(stopPullDownRefresh, 120)
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
      this.data.imageRetryTokens,
      this.data.fallbackPoseImages
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
    const pose = findPoseById(poseId)

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

    if (!this.data.fallbackPoseImages[poseId]) {
      this.setData({
        [`fallbackPoseImages.${poseId}`]: true,
        [`failedPoseImages.${poseId}`]: false
      }, () => {
        this.refreshPoseCategories()
      })
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
      [`fallbackPoseImages.${poseId}`]: false,
      [`failedPoseImages.${poseId}`]: false,
      [`imageRetryTokens.${poseId}`]: retryToken
    }, () => {
      this.refreshPoseCategories()
    })
  }
})
