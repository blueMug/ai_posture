const AD_ENABLED = false
const MOCK_AD_ENABLED = true

const createAdSlot = (slot) => ({
  ...slot,
  isMock: MOCK_AD_ENABLED,
  visible: Boolean(MOCK_AD_ENABLED || (AD_ENABLED && slot.enabled && slot.unitId))
})

const adSlots = {
  profileBanner: createAdSlot({
    enabled: false,
    unitId: '',
    adType: 'banner',
    mockTitle: '旅行拍照灵感包',
    mockDesc: '解锁更多景点、穿搭、自拍姿势参考',
    mockAction: '了解更多'
  }),
  poseDetailBanner: createAdSlot({
    enabled: false,
    unitId: '',
    adType: 'banner',
    mockTitle: '今日推荐姿势',
    mockDesc: '根据当前姿势延展更多拍照模板',
    mockAction: '查看推荐'
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

module.exports = {
  adSlots
}
