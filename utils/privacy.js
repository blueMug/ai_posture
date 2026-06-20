const PRIVACY_NOTICE_ACCEPTED_KEY = 'privacyNoticeAccepted'

const PRIVACY_SUMMARY = [
  '相机：用于拍摄带姿势参考的照片。',
  '保存相册：仅在你点击保存时，将照片保存到手机相册。',
  '本地收藏：保存你收藏的姿势，方便下次查找。',
  '本地使用记录：记录浏览和拍照次数，用于在个人中心展示。',
  '以上收藏和使用记录仅保存在本机，不上传服务器。'
]

const getPrivacySummary = () => PRIVACY_SUMMARY.slice()

const hasAcceptedPrivacyNotice = () => Boolean(wx.getStorageSync(PRIVACY_NOTICE_ACCEPTED_KEY))

const acceptPrivacyNotice = () => {
  wx.setStorageSync(PRIVACY_NOTICE_ACCEPTED_KEY, true)
}

const requestWechatPrivacyAuthorization = () => new Promise((resolve) => {
  if (typeof wx.getPrivacySetting !== 'function') {
    resolve(true)
    return
  }

  wx.getPrivacySetting({
    success: (res) => {
      if (!res.needAuthorization || typeof wx.requirePrivacyAuthorize !== 'function') {
        resolve(true)
        return
      }

      wx.requirePrivacyAuthorize({
        success: () => resolve(true),
        fail: () => resolve(false)
      })
    },
    fail: () => resolve(true)
  })
})

const showPrivacyNoticeModal = (scene = '使用相关功能') => new Promise((resolve) => {
  wx.showModal({
    title: '隐私与权限说明',
    content: `${scene}前，请先了解：\n${PRIVACY_SUMMARY.join('\n')}`,
    confirmText: '同意继续',
    cancelText: '暂不使用',
    success: (res) => resolve(Boolean(res.confirm)),
    fail: () => resolve(false)
  })
})

const ensurePrivacyNotice = async (scene) => {
  const wechatAuthorized = await requestWechatPrivacyAuthorization()

  if (!wechatAuthorized) {
    wx.showToast({
      title: '需要同意隐私授权',
      icon: 'none'
    })
    return false
  }

  if (hasAcceptedPrivacyNotice()) {
    return true
  }

  const accepted = await showPrivacyNoticeModal(scene)

  if (accepted) {
    acceptPrivacyNotice()
  }

  return accepted
}

module.exports = {
  acceptPrivacyNotice,
  ensurePrivacyNotice,
  getPrivacySummary,
  hasAcceptedPrivacyNotice
}
