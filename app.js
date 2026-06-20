const { preloadAdSlots } = require('./utils/adConfig')

App({
  onLaunch() {
    preloadAdSlots()
  },

  globalData: {
    photoPath: '',
    previewGuide: null
  }
})
