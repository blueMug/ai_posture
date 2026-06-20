const { assetUrl } = require('./assets')
const { combinePairPoses } = require('./combinePairPoses')

const poseTemplates = combinePairPoses.map((pose) => ({
  ...pose,
  guideImage: assetUrl(pose.guideImage),
  thumbnailImage: assetUrl(pose.thumbnailImage),
  modelImage: assetUrl(pose.modelImage),
  detailImage: assetUrl(pose.detailImage)
}))

const categoryDefinitions = [
  {
    id: 'portrait-half',
    name: '半身写真',
    subtitle: '适合头像、半身照、肩颈线条和温柔情绪照'
  },
  {
    id: 'outfit-standing',
    name: '全身穿搭',
    subtitle: '适合显比例、长裙、通勤穿搭和户外全身照'
  },
  {
    id: 'street-dynamic',
    name: '街拍动态',
    subtitle: '适合行走抓拍、咖啡街拍和自然松弛感'
  },
  {
    id: 'travel-back',
    name: '旅行背影',
    subtitle: '适合景点、山顶、背影和更有表现力的旅行照'
  }
]

const poseCategories = categoryDefinitions
  .map((category) => ({
    ...category,
    poses: poseTemplates.filter((pose) => pose.categoryId === category.id)
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
