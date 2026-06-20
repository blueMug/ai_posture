const AD_ENABLED = false
const MOCK_AD_ENABLED = false

const createAdSlot = (slot) => ({
  ...slot,
  isMock: MOCK_AD_ENABLED,
  visible: Boolean(MOCK_AD_ENABLED || (AD_ENABLED && slot.enabled && slot.unitId))
})

const adInstances = {}

const adSlots = {
  homeRecommendBottom: createAdSlot({
    enabled: false,
    unitId: '',
    adType: 'banner',
    mockTitle: '拍照灵感补给站',
    mockDesc: '更多旅行、穿搭、自拍姿势和拍摄道具推荐',
    mockAction: '模拟广告'
  }),
  profileBanner: createAdSlot({
    enabled: false,
    unitId: '',
    adType: 'banner',
    mockTitle: '旅行拍照灵感包',
    mockDesc: '解锁更多景点、穿搭、自拍姿势参考',
    mockAction: '了解更多'
  }),
  poseGalleryFeed: createAdSlot({
    enabled: false,
    unitId: '',
    adType: 'grid',
    mockTitle: '精选拍照道具',
    mockDesc: '适合街拍、旅行和半身写真场景',
    mockAction: '模拟广告'
  })
}

const preloadAdSlots = () => {
  if (MOCK_AD_ENABLED || !AD_ENABLED || typeof wx === 'undefined') {
    return adInstances
  }

  Object.keys(adSlots).forEach((slotKey) => {
    const slot = adSlots[slotKey]

    if (!slot.enabled || !slot.unitId || adInstances[slotKey]) {
      return
    }

    if (slot.adType === 'interstitial' && typeof wx.createInterstitialAd === 'function') {
      adInstances[slotKey] = wx.createInterstitialAd({
        adUnitId: slot.unitId
      })
    }

    if (slot.adType === 'rewardedVideo' && typeof wx.createRewardedVideoAd === 'function') {
      adInstances[slotKey] = wx.createRewardedVideoAd({
        adUnitId: slot.unitId
      })
    }
  })

  return adInstances
}

module.exports = {
  adSlots,
  preloadAdSlots
}
