const GUIDE_CONFIRM_STORAGE_KEY = 'keepGuideForConfirm'
const GUIDE_MODE_STORAGE_KEY = 'cameraGuideMode'
const GUIDE_MODE_OUTLINE = 'outline'
const GUIDE_MODE_PHOTO = 'photo'
const { adSlots } = require('../../utils/adConfig')
const { poseTemplates } = require('../../utils/poses')
const { ensurePrivacyNotice } = require('../../utils/privacy')
const { isFeedbackFormConfigured } = require('../../utils/feedbackConfig')
const {
  getFavoritePoses,
  togglePoseFavorite
} = require('../../utils/userData')
const {
  cacheFavoritePoseAssets,
  getCachedFavoritePoseAssets,
  unpinFavoritePoseAssets
} = require('../../utils/favoriteAssetCache')

const DEFAULT_PAGE_TOP_PX = 52
const DEFAULT_TOP_BAR_HEIGHT_PX = 32

const normalizeGuideMode = (guideMode) => (
  guideMode === GUIDE_MODE_PHOTO ? GUIDE_MODE_PHOTO : GUIDE_MODE_OUTLINE
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

const getFavoriteDisplayImage = (pose, retryToken = '') => {
  const imageUrl = pose.thumbnailImage || pose.modelImage || pose.detailImage || ''

  if (!retryToken || !/^https?:\/\//.test(imageUrl)) {
    return imageUrl
  }

  const separator = imageUrl.includes('?') ? '&' : '?'
  return `${imageUrl}${separator}_retry=${retryToken}`
}

const withFavoriteDisplayImages = (poses, retryTokens = {}) => (
  poses.map((pose) => ({
    ...pose,
    favoriteDisplayImage: getFavoriteDisplayImage(pose, retryTokens[pose.id])
  }))
)

const getFavoriteImageUrls = (poses) => (
  poses.reduce((map, pose) => {
    if (pose.favoriteDisplayImage) {
      map[pose.id] = pose.favoriteDisplayImage
    }

    return map
  }, {})
)

const getFavoriteImageLoadingState = (poses, previousImageUrls = {}, previousLoading = {}) => {
  const nextLoading = {}

  poses.forEach((pose) => {
    if (!pose.favoriteDisplayImage) {
      return
    }

    const previousUrl = previousImageUrls[pose.id]
    const wasLoaded = previousUrl === pose.favoriteDisplayImage && previousLoading[pose.id] === false
    nextLoading[pose.id] = !wasLoaded
  })

  return nextLoading
}

const getFavoriteImageFailedState = (poses, previousImageUrls = {}, previousFailed = {}) => {
  const nextFailed = {}

  poses.forEach((pose) => {
    if (!pose.favoriteDisplayImage) {
      return
    }

    const previousUrl = previousImageUrls[pose.id]
    nextFailed[pose.id] = previousUrl === pose.favoriteDisplayImage && previousFailed[pose.id] === true
  })

  return nextFailed
}

Page({
  data: {
    pageTopStyle: `padding-top: ${DEFAULT_PAGE_TOP_PX}px;`,
    topBarStyle: `height: ${DEFAULT_TOP_BAR_HEIGHT_PX}px;`,
    keepGuideForConfirm: false,
    guideMode: GUIDE_MODE_OUTLINE,
    favoritePoses: [],
    favoritePoseCount: 0,
    failedFavoriteImages: {},
    loadingFavoriteImages: {},
    favoriteImageUrls: {},
    favoriteImageRetryTokens: {},
    adSlot: adSlots.profileBanner
  },

  onLoad() {
    this.setData({
      pageTopStyle: getPageTopStyle(),
      topBarStyle: getTopBarStyle()
    })
    this.loadGuideConfirmSetting()
    this.loadFavoritePoses()
  },

  onShow() {
    this.loadGuideConfirmSetting()
    this.loadFavoritePoses()
  },

  onPullDownRefresh() {
    this.loadGuideConfirmSetting()
    this.retryFailedFavoriteImages()
  },

  loadGuideConfirmSetting() {
    this.setData({
      keepGuideForConfirm: Boolean(wx.getStorageSync(GUIDE_CONFIRM_STORAGE_KEY)),
      guideMode: normalizeGuideMode(wx.getStorageSync(GUIDE_MODE_STORAGE_KEY))
    })
  },

  loadFavoritePoses() {
    const favoritePoses = getFavoritePoses(poseTemplates)
    const requestId = (this.favoritePoseRequestId || 0) + 1
    this.favoritePoseRequestId = requestId

    Promise.all(favoritePoses.map((pose) => getCachedFavoritePoseAssets(pose))).then((localPoses) => {
      if (this.favoritePoseRequestId !== requestId) {
        return
      }

      this.setFavoritePoses(localPoses)
    })

    this.setData({
      favoritePoseCount: favoritePoses.length
    })

    Promise.all(favoritePoses.map((pose) => cacheFavoritePoseAssets(pose))).then((cachedPoses) => {
      if (this.favoritePoseRequestId !== requestId) {
        return
      }

      this.setFavoritePoses(cachedPoses)
    })
  },

  setFavoritePoses(favoritePoses) {
    const favoritePosesWithImages = withFavoriteDisplayImages(
      favoritePoses,
      this.data.favoriteImageRetryTokens
    )
    const favoriteImageUrls = getFavoriteImageUrls(favoritePosesWithImages)
    const loadingFavoriteImages = getFavoriteImageLoadingState(
      favoritePosesWithImages,
      this.data.favoriteImageUrls,
      this.data.loadingFavoriteImages
    )
    const failedFavoriteImages = getFavoriteImageFailedState(
      favoritePosesWithImages,
      this.data.favoriteImageUrls,
      this.data.failedFavoriteImages
    )

    this.setData({
      favoritePoses: favoritePosesWithImages,
      favoritePoseCount: favoritePoses.length,
      favoriteImageUrls,
      loadingFavoriteImages,
      failedFavoriteImages
    })
  },

  onGuideConfirmChange(event) {
    const keepGuideForConfirm = Boolean(event.detail.value)

    wx.setStorageSync(GUIDE_CONFIRM_STORAGE_KEY, keepGuideForConfirm)
    this.setData({
      keepGuideForConfirm
    })
  },

  onGuideModeSelect(event) {
    const guideMode = normalizeGuideMode(event.currentTarget.dataset.mode)

    wx.setStorageSync(GUIDE_MODE_STORAGE_KEY, guideMode)
    this.setData({
      guideMode
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

  openPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/index'
    })
  },

  openFeedback() {
    if (!isFeedbackFormConfigured()) {
      wx.showModal({
        title: '反馈表单未配置',
        content: '请先在 utils/feedbackConfig.js 填入 HTTPS 腾讯问卷链接，再打开意见反馈。',
        confirmText: '知道了',
        showCancel: false
      })
      return
    }

    wx.navigateTo({
      url: '/pages/feedback/index'
    })
  },

  onFavoriteImageLoad(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    this.setData({
      [`loadingFavoriteImages.${poseId}`]: false,
      [`failedFavoriteImages.${poseId}`]: false
    })
  },

  onFavoriteImageError(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    this.setData({
      [`failedFavoriteImages.${poseId}`]: true,
      [`loadingFavoriteImages.${poseId}`]: false
    })
  },

  retryFavoriteImage(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    this.retryFavoriteImages([poseId])
  },

  retryFailedFavoriteImages() {
    const failedFavoriteImages = this.data.failedFavoriteImages || {}
    const failedPoseIds = Object.keys(failedFavoriteImages).filter((poseId) => failedFavoriteImages[poseId])

    if (!failedPoseIds.length) {
      this.loadFavoritePoses()
      if (typeof wx.stopPullDownRefresh === 'function') {
        wx.stopPullDownRefresh()
      }
      return
    }

    this.retryFavoriteImages(failedPoseIds, true)
  },

  retryFavoriteImages(poseIds, shouldStopPullDown = false) {
    const retryToken = Date.now()
    const retryState = poseIds.reduce((map, poseId) => {
      map[`failedFavoriteImages.${poseId}`] = false
      map[`loadingFavoriteImages.${poseId}`] = true
      map[`favoriteImageRetryTokens.${poseId}`] = retryToken
      return map
    }, {})

    this.setData(retryState, () => {
      this.loadFavoritePoses()

      if (shouldStopPullDown && typeof wx.stopPullDownRefresh === 'function') {
        wx.stopPullDownRefresh()
      }
    })
  },

  removeFavorite(event) {
    const { poseId } = event.currentTarget.dataset

    if (!poseId) {
      return
    }

    const pose = poseTemplates.find((item) => item.id === poseId)

    togglePoseFavorite(poseId)
    unpinFavoritePoseAssets(pose)
    this.loadFavoritePoses()

    wx.showToast({
      title: '已取消收藏',
      icon: 'none'
    })
  }
})
