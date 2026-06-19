const poseTemplates = [
  {
    id: 'uploaded-contour-png',
    categoryId: 'png',
    categoryName: 'PNG 模板',
    name: '上传轮廓图',
    tip: '直接使用你提供的 PNG 图片叠加',
    description: '不再解析、不再重绘，直接把 PNG 图片作为相机引导层叠加。',
    badge: '图片',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef2ff 0%, #7f8da3 100%)',
    guideImage: '/assets/poses/tiktok-contour-pose.png',
    thumbnailImage: '/assets/poses/tiktok-contour-pose.png',
    parts: []
  },
  {
    id: 'pos1-standing-png',
    categoryId: 'png',
    categoryName: 'PNG 模板',
    name: '站立姿势 Pos1',
    tip: '直接使用 tmp/pos1.png 引入的站立姿势',
    description: '从 tmp/pos1.png 复制到正式素材目录后直接叠加到相机预览，不做解析或重绘。',
    badge: 'PNG',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f6f7fb 0%, #8b93a3 100%)',
    guideImage: '/assets/poses/pos1.png',
    thumbnailImage: '/assets/poses/pos1.png',
    parts: []
  }
]

const poseCategories = [
  {
    id: 'png',
    name: 'PNG 模板',
    subtitle: '直接使用上传的姿势轮廓图',
    poses: poseTemplates.filter((pose) => pose.categoryId === 'png')
  }
]

const findPoseIndex = (poseId) => {
  const index = poseTemplates.findIndex((pose) => pose.id === poseId)
  return index >= 0 ? index : 0
}

module.exports = {
  poseTemplates,
  poseCategories,
  findPoseIndex
}
