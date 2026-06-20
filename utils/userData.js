const FAVORITE_POSE_IDS_KEY = 'favoritePoseIds'
const POSE_USAGE_RECORDS_KEY = 'poseUsageRecords'
const MAX_USAGE_RECORDS = 300

const readStorageArray = (key) => {
  const value = wx.getStorageSync(key)
  return Array.isArray(value) ? value : []
}

const getFavoritePoseIds = () => (
  Array.from(new Set(readStorageArray(FAVORITE_POSE_IDS_KEY).filter(Boolean)))
)

const setFavoritePoseIds = (poseIds) => {
  const nextPoseIds = Array.from(new Set((poseIds || []).filter(Boolean)))
  wx.setStorageSync(FAVORITE_POSE_IDS_KEY, nextPoseIds)
  return nextPoseIds
}

const isPoseFavorite = (poseId, favoritePoseIds = getFavoritePoseIds()) => (
  favoritePoseIds.includes(poseId)
)

const togglePoseFavorite = (poseId) => {
  if (!poseId) {
    return {
      favoritePoseIds: getFavoritePoseIds(),
      isFavorite: false
    }
  }

  const favoritePoseIds = getFavoritePoseIds()
  const isFavorite = !favoritePoseIds.includes(poseId)
  const nextFavoritePoseIds = isFavorite
    ? [poseId, ...favoritePoseIds]
    : favoritePoseIds.filter((item) => item !== poseId)

  return {
    favoritePoseIds: setFavoritePoseIds(nextFavoritePoseIds),
    isFavorite
  }
}

const withFavoriteState = (pose, favoritePoseIds = getFavoritePoseIds()) => ({
  ...pose,
  isFavorite: isPoseFavorite(pose.id, favoritePoseIds)
})

const withFavoriteStateCategories = (categories, favoritePoseIds = getFavoritePoseIds()) => (
  categories.map((category) => ({
    ...category,
    poses: category.poses.map((pose) => withFavoriteState(pose, favoritePoseIds))
  }))
)

const getFavoritePoses = (poseTemplates, favoritePoseIds = getFavoritePoseIds()) => (
  favoritePoseIds
    .map((poseId) => poseTemplates.find((pose) => pose.id === poseId))
    .filter(Boolean)
    .map((pose) => withFavoriteState(pose, favoritePoseIds))
)

const recordPoseUsage = (type, poseId, extra = {}) => {
  if (!type || !poseId) {
    return
  }

  const nextRecord = {
    type,
    poseId,
    time: Date.now(),
    date: new Date().toISOString(),
    ...extra
  }
  const records = readStorageArray(POSE_USAGE_RECORDS_KEY)

  wx.setStorageSync(POSE_USAGE_RECORDS_KEY, [nextRecord, ...records].slice(0, MAX_USAGE_RECORDS))
}

const getPoseUsageRecords = () => readStorageArray(POSE_USAGE_RECORDS_KEY)

module.exports = {
  getFavoritePoseIds,
  getFavoritePoses,
  getPoseUsageRecords,
  recordPoseUsage,
  togglePoseFavorite,
  withFavoriteState,
  withFavoriteStateCategories
}
