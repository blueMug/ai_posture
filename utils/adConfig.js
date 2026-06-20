const AD_ENABLED = false

const createAdSlot = (slot) => ({
  ...slot,
  visible: Boolean(AD_ENABLED && slot.enabled && slot.unitId)
})

const adSlots = {
  profileBanner: createAdSlot({
    enabled: false,
    unitId: '',
    adType: 'banner'
  }),
  poseDetailBanner: createAdSlot({
    enabled: false,
    unitId: '',
    adType: 'banner'
  }),
  poseGalleryFeed: createAdSlot({
    enabled: false,
    unitId: '',
    adType: 'grid'
  })
}

module.exports = {
  adSlots
}
