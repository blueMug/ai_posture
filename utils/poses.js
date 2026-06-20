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
    id: 'model-pairs',
    name: '真人示例',
    subtitle: '选择页看真人模特照片，拍摄页使用对应透明轮廓'
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
