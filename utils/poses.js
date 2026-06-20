const { assetUrl } = require('./assets')
const { combinePairPoses } = require('./combinePairPoses')

const poseTemplates = combinePairPoses.map((pose) => ({
  ...pose,
  guideImage: assetUrl(pose.guideImage),
  thumbnailImage: assetUrl(pose.thumbnailImage),
  modelImage: assetUrl(pose.modelImage),
  detailImage: assetUrl(pose.detailImage)
}))

const customPoseId = (number) => `pair-custom${number}-r01-g01`

const categoryDefinitions = [
  {
    id: 'portrait-half',
    name: '半身照',
    subtitle: '适合头像、半身写真、肩颈线条和近景拍照姿势',
    poseNumbers: [1, 2, 3, 5, 18, 19, 20, 21, 22]
  },
  {
    id: 'selfie',
    name: '自拍照',
    subtitle: '适合手机自拍、窗边自然光、咖啡馆自拍和亲近感构图',
    poseNumbers: [18, 20, 21, 1, 2, 5]
  },
  {
    id: 'hair-hand',
    name: '撩发托腮',
    subtitle: '适合撩发、托腮、手部动作和半身拍照姿势',
    poseNumbers: [2, 3, 5, 11, 15, 18, 19, 20, 21, 22]
  },
  {
    id: 'outfit-standing',
    name: '全身照/穿搭',
    subtitle: '适合全身照、显比例、长裙、通勤穿搭和户外拍照',
    poseNumbers: [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
  },
  {
    id: 'street-commute',
    name: '街拍照',
    subtitle: '适合城市街拍、咖啡馆、通勤、西装和古巷抓拍',
    poseNumbers: [7, 9, 12, 15, 16, 22, 6]
  },
  {
    id: 'look-back',
    name: '回眸侧身',
    subtitle: '适合回眸、侧身显瘦、背影转身和自然抓拍',
    poseNumbers: [1, 6, 10, 11, 12, 13, 14, 15, 16, 17, 19]
  },
  {
    id: 'travel-back',
    name: '旅行/景点',
    subtitle: '适合旅行拍照、景点打卡、山顶、湖畔、海边和背影照',
    poseNumbers: [10, 11, 12, 13, 14, 15, 16, 17]
  }
]

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const poseCategories = categoryDefinitions
  .map((category) => ({
    ...category,
    poses: category.poseNumbers
      .map((number) => poseTemplateMap.get(customPoseId(number)))
      .filter(Boolean)
  }))
  .filter((category) => category.poses.length > 0)

const findPoseIndex = (poseId) => {
  const index = poseTemplates.findIndex((pose) => pose.id === poseId)
  return index >= 0 ? index : 0
}

module.exports = {
  poseTemplates,
  poseCategories,
  findPoseIndex
}
