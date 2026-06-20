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
    id: 'outfit-standing',
    name: '全身穿搭',
    subtitle: '适合显比例、连衣裙、通勤穿搭和正面全身照',
    poseNumbers: [4, 6, 8, 9, 25, 27, 30, 36, 38, 39, 41, 43, 44, 45, 46, 49]
  },
  {
    id: 'portrait-half',
    name: '半身写真',
    subtitle: '适合近景半身、肩颈线条、撩发和咖啡馆人像',
    poseNumbers: [1, 2, 3, 5, 19, 20, 22]
  },
  {
    id: 'street-commute',
    name: '街拍通勤',
    subtitle: '适合城市街拍、通勤、西装、机车和运动街头感',
    poseNumbers: [7, 9, 12, 16, 32, 34, 37, 40, 42, 46, 49, 50, 53, 54, 57, 58, 60, 64, 66, 67, 68]
  },
  {
    id: 'travel-back',
    name: '旅行景点',
    subtitle: '适合山顶、湖畔、海边、溪涧、庭园和景点打卡',
    poseNumbers: [10, 13, 14, 17, 25, 26, 31, 33, 44, 45, 48, 52, 53, 55, 57, 58, 59, 60, 61, 63, 69, 70, 72, 73, 74]
  },
  {
    id: 'back-view',
    name: '背影回眸',
    subtitle: '适合背影、回眸、转身、坐姿背影和远景氛围照',
    poseNumbers: [10, 11, 12, 13, 14, 15, 16, 17, 26, 29, 31, 33, 35]
  },
  {
    id: 'props-action',
    name: '道具互动',
    subtitle: '适合咖啡、相机、折扇、书本、雨伞等道具互动',
    poseNumbers: [7, 27, 30, 32, 38, 39, 40, 41, 43, 50, 51, 56, 59, 61, 62, 64, 65, 67, 68, 69, 70, 71, 73]
  },
  {
    id: 'selfie',
    name: '自拍表情',
    subtitle: '适合胸上自拍、手机自拍、夸张表情和酷飒自拍',
    poseNumbers: [18, 21, 23, 24, 28, 34, 37]
  },
  {
    id: 'sitting-life',
    name: '坐姿生活',
    subtitle: '适合坐姿、蹲姿、趴姿、草地野餐和松弛生活照',
    poseNumbers: [22, 29, 35, 47, 48, 51, 52, 55, 56, 62, 63, 65, 66, 71, 72, 74]
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
