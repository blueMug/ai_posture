const poseTemplates = [
  {
    id: 'pos1-standing-cross',
    categoryId: 'png',
    categoryName: 'PNG 模板',
    name: '单手叉腰交叉站',
    tip: '适合穿搭、街拍、景点全身照',
    description: '正面站姿，一只手自然下垂，另一只手叉腰，双腿交叉拉长比例，适合轻松显腿长的全身构图。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef2ff 0%, #7f8da3 100%)',
    guideImage: '/assets/poses/pos1_transparent.png',
    thumbnailImage: '/assets/poses/pos1_transparent.png',
    parts: []
  },
  {
    id: 'pos2-walking-lookback',
    categoryId: 'png',
    categoryName: 'PNG 模板',
    name: '走路回头抓拍',
    tip: '适合街拍、旅行路感、动态抓拍',
    description: '侧身行走姿势，头部回望一侧，手臂自然摆动，双腿大步错开，适合拍出松弛的移动感。',
    badge: '走姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f5f0e8 0%, #7f8a76 100%)',
    guideImage: '/assets/poses/pos2_transparent.png',
    thumbnailImage: '/assets/poses/pos2_transparent.png',
    parts: []
  },
  {
    id: 'pos3-cross-leg-sit',
    categoryId: 'png',
    categoryName: 'PNG 模板',
    name: '交叉腿坐姿',
    tip: '适合长椅、咖啡店、室内穿搭',
    description: '坐姿模板，双腿交叉前伸，双手自然叠放在膝前，上半身微微收拢，适合优雅安静的坐姿照片。',
    badge: '坐姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f3eef8 0%, #86748f 100%)',
    guideImage: '/assets/poses/pos3_transparent.png',
    thumbnailImage: '/assets/poses/pos3_transparent.png',
    parts: []
  },
  {
    id: 'pos4-back-hand-lift',
    categoryId: 'png',
    categoryName: 'PNG 模板',
    name: '背身抬手回眸',
    tip: '适合背影、牛仔穿搭、街头感照片',
    description: '背身站姿，一只手抬到头顶整理头发，身体微微侧转，一条腿向前点地，适合拍背影和回眸氛围。',
    badge: '背影',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef5ff 0%, #65758d 100%)',
    guideImage: '/assets/poses/pos4_transparent.png',
    thumbnailImage: '/assets/poses/pos4_transparent.png',
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
