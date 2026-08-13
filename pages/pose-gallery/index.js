const { poseCategories } = require('../../utils/poses')
const { adSlots } = require('../../utils/adConfig')
const { cdnAssetUrl, normalizeAssetPath } = require('../../utils/assets')
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
const { buildGalleryShare } = require('../../utils/shareCopy')

const GALLERY_TARGET_CATEGORY_KEY = 'galleryTargetCategoryId'
const GALLERY_SCROLL_TOP_KEY = 'galleryScrollTopOnShow'
const DETAIL_PREVIEW_IMAGE_KEY = 'poseDetailPreviewImage'
const DEFAULT_PAGE_TOP_PX = 52
const DEFAULT_TOP_BAR_HEIGHT_PX = 32
const CATEGORY_ANCHOR_PREFIX = 'gallery-category-'
const CATEGORY_PANEL_ANCHOR_PREFIX = 'category-panel-'
const CATEGORY_ACTIVE_VIEWPORT_TOP_PX = 180
const CATEGORY_SCROLL_SYNC_INTERVAL_MS = 120

const toLocalAssetPath = (assetPath = '') => {
  if (!assetPath) {
    return ''
  }

  return normalizeAssetPath(String(assetPath))
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
const isGalleryPreviewImage = (image = '') => String(image).includes('/static/gallery_thumbs/')

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

const findDisplayPoseById = (categories, poseId) => {
  for (const category of categories) {
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
    activeCategoryPanelAnchor: '',
    favoritePoseIds: [],
    hasSearchResult: true,
    isCategoryPanelVisible: false,
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

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  onShow() {
    const shouldScrollTop = wx.getStorageSync(GALLERY_SCROLL_TOP_KEY)
    const targetCategoryId = wx.getStorageSync(GALLERY_TARGET_CATEGORY_KEY)

    if (shouldScrollTop) {
      wx.removeStorageSync(GALLERY_SCROLL_TOP_KEY)
      wx.removeStorageSync(GALLERY_TARGET_CATEGORY_KEY)
      this.setPoseCategories(poseCategories, {
        searchKeyword: '',
        favoritePoseIds: getFavoritePoseIds(),
        hasSearchResult: true
      })
      wx.nextTick(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      })
      return
    }

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
        activeCategoryId: '',
        activeCategoryPanelAnchor: '',
        isCategoryPanelVisible: false
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
      activeCategoryId,
      activeCategoryPanelAnchor: `${CATEGORY_PANEL_ANCHOR_PREFIX}${activeCategoryId}`
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
      selector: `#${CATEGORY_ANCHOR_PREFIX}${categoryId}`,
      offsetTop: 16,
      duration: 240
    })
  },

  updateActiveCategoryFromViewport(callback) {
    if (!this.data.hasSearchResult || !this.data.categoryNavs.length) {
      if (typeof callback === 'function') {
        callback()
      }
      return
    }

    wx.createSelectorQuery()
      .in(this)
      .selectAll('.category')
      .boundingClientRect((rects = []) => {
        const visibleRects = rects
          .filter((rect) => rect && rect.id && rect.bottom > CATEGORY_ACTIVE_VIEWPORT_TOP_PX)
          .sort((left, right) => left.top - right.top)

        if (!visibleRects.length) {
          if (typeof callback === 'function') {
            callback()
          }
          return
        }

        const activeRect = visibleRects
          .filter((rect) => rect.top <= CATEGORY_ACTIVE_VIEWPORT_TOP_PX)
          .pop() || visibleRects[0]
        const activeCategoryId = String(activeRect.id).replace(CATEGORY_ANCHOR_PREFIX, '')

        if (activeCategoryId && activeCategoryId !== this.data.activeCategoryId) {
          this.setData({
            activeCategoryId,
            activeCategoryPanelAnchor: `${CATEGORY_PANEL_ANCHOR_PREFIX}${activeCategoryId}`
          }, callback)
          return
        }

        if (typeof callback === 'function') {
          callback()
        }
      })
      .exec()
  },

  onPageScroll() {
    const now = Date.now()

    if (this.lastCategoryScrollSyncAt && now - this.lastCategoryScrollSyncAt < CATEGORY_SCROLL_SYNC_INTERVAL_MS) {
      return
    }

    this.lastCategoryScrollSyncAt = now
    this.updateActiveCategoryFromViewport()
  },

  scrollToCategory(event) {
    const { categoryId } = event.currentTarget.dataset

    if (!categoryId) {
      return
    }

    this.setData({
      activeCategoryId: categoryId,
      activeCategoryPanelAnchor: `${CATEGORY_PANEL_ANCHOR_PREFIX}${categoryId}`
    })

    this.scrollToCategoryId(categoryId)
  },

  openCategoryPanel() {
    if (!this.data.hasSearchResult || !this.data.categoryNavs.length) {
      return
    }

    this.updateActiveCategoryFromViewport(() => {
      this.setData({
        isCategoryPanelVisible: true
      })
    })
  },

  closeCategoryPanel() {
    this.setData({
      isCategoryPanelVisible: false
    })
  },

  selectCategoryFromPanel(event) {
    const { categoryId } = event.currentTarget.dataset

    if (!categoryId) {
      return
    }

    this.setData({
      activeCategoryId: categoryId,
      activeCategoryPanelAnchor: `${CATEGORY_PANEL_ANCHOR_PREFIX}${categoryId}`,
      isCategoryPanelVisible: false
    })

    wx.nextTick(() => {
      this.scrollToCategoryId(categoryId)
    })
  },

  noop() {},

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

    const pose = findDisplayPoseById(this.data.poseCategories, poseId)
    const previewImage = pose && pose.galleryDisplayImage

    if (isGalleryPreviewImage(previewImage)) {
      wx.setStorageSync(DETAIL_PREVIEW_IMAGE_KEY, {
        poseId,
        image: previewImage,
        createdAt: Date.now()
      })
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
  },

  onShareAppMessage() {
    return buildGalleryShare()
  }
})
