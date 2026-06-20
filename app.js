const { preloadAdSlots } = require('./utils/adConfig')
const { startGalleryImagePreload } = require('./utils/posePreload')

App({
  onLaunch() {
    preloadAdSlots()
    startGalleryImagePreload()
  },

  globalData: {
    photoPath: '',
    previewGuide: null,
    previewPose: null
  }
})
