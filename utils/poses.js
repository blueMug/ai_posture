const { assetUrl } = require('./assets')
const { combinePairPoses } = require('./combinePairPoses')
const { sortPosesByRichness } = require('./poseRanking')

const customPoseId = (number) => `pair-custom${number}-r01-g01`
const removedPoseNumbers = new Set([1, 2, 3, 6, 7, 8, 9, 10, 12, 21, 22, 23, 25, 27, 28, 30, 32, 36, 37])
const getPoseNumber = (poseId = '') => {
  const match = String(poseId).match(/custom(\d+)/)

  return match ? Number(match[1]) : 0
}
const keepActivePoseNumber = (number) => !removedPoseNumbers.has(number)

const poseTemplates = combinePairPoses
  .filter((pose) => keepActivePoseNumber(getPoseNumber(pose.id)))
  .map((pose) => ({
    ...pose,
    guideImage: assetUrl(pose.guideImage),
    thumbnailImage: assetUrl(pose.thumbnailImage),
    shareImage: assetUrl(pose.shareImage),
    modelImage: assetUrl(pose.modelImage),
    detailImage: assetUrl(pose.detailImage)
  }))

const categoryDefinitions = [
  {
    id: 'outfit-standing',
    name: '今天拍穿搭',
    subtitle: '想拍全身照、显高显比例、连衣裙或通勤穿搭时用',
    poseNumbers: [38, 39, 41, 43, 44, 45, 46, 49, 91, 92, 94, 97, 99, 101]
  },
  {
    id: 'portrait-half',
    name: '头像半身照',
    subtitle: '适合头像、肩颈线条、撩发、托腮和近景人像',
    poseNumbers: [5, 19, 20, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
  },
  {
    id: 'street-commute',
    name: '出门街拍',
    subtitle: '适合城市街头、通勤路上、西装、机车和运动感照片',
    poseNumbers: [16, 34, 40, 42, 46, 49, 50, 53, 54, 57, 58, 60, 64, 66, 67, 68, 87, 91, 92, 93, 97, 101, 104]
  },
  {
    id: 'travel-back',
    name: '旅行打卡',
    subtitle: '到了景点不知道怎么站？山顶、湖边、海边都能照着拍',
    poseNumbers: [13, 14, 17, 26, 31, 33, 44, 45, 48, 52, 53, 55, 57, 58, 59, 60, 61, 63, 69, 70, 72, 73, 4, 91, 93, 95, 96, 97, 98, 99, 100, 102, 103, 104, 105]
  },
  {
    id: 'back-view',
    name: '不露脸背影',
    subtitle: '不想看镜头时用，背影、回眸、转身和远景氛围照',
    poseNumbers: [11, 13, 14, 15, 16, 17, 26, 29, 31, 33, 35, 93, 96, 98, 100, 102, 104, 105]
  },
  {
    id: 'props-action',
    name: '咖啡馆/道具',
    subtitle: '手不知道放哪时用，咖啡、相机、书本、雨伞都能互动',
    poseNumbers: [38, 39, 40, 41, 43, 50, 51, 56, 59, 61, 62, 64, 65, 67, 68, 69, 70, 71, 73, 76, 78, 80, 81, 84, 86, 88, 94, 97, 99, 103, 105]
  },
  {
    id: 'selfie',
    name: '自拍不尴尬',
    subtitle: '适合手机自拍、胸上近景、表情管理和酷一点的自拍',
    poseNumbers: [18, 24, 34, 75, 77, 79, 82, 86, 87]
  },
  {
    id: 'sitting-life',
    name: '坐着也好拍',
    subtitle: '适合坐姿、蹲姿、趴姿、野餐、草地和松弛生活照',
    poseNumbers: [29, 35, 47, 48, 51, 52, 55, 56, 62, 63, 65, 66, 71, 72, 4, 95, 102, 103]
  },
  {
    id: 'indoor-window',
    name: '室内窗边',
    subtitle: '适合居家、窗边、雨天、咖啡馆靠窗和暖光半身照',
    poseNumbers: [75, 76, 77, 78, 80, 81, 82, 84, 85, 86, 88, 90]
  },
  {
    id: 'art-city',
    name: '展馆/城市建筑',
    subtitle: '适合美术馆、画廊、天台、楼梯、现代建筑和都市大片',
    poseNumbers: [41, 83, 89, 92, 94, 101]
  }
]

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const poseCategories = categoryDefinitions
  .map((category) => ({
    ...category,
    poses: sortPosesByRichness(category.poseNumbers
      .map((number) => poseTemplateMap.get(customPoseId(number)))
      .filter(Boolean))
  }))
  .filter((category) => category.poses.length > 0)

const findPoseIndex = (poseId) => {
  const index = poseTemplates.findIndex((pose) => pose.id === poseId)
  return index >= 0 ? index : 0
}
const getPoseById = (poseId) => poseTemplates.find((pose) => pose.id === poseId) || null

module.exports = {
  poseTemplates,
  poseCategories,
  findPoseIndex,
  getPoseById
}
