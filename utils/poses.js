const poseTemplates = [
  {
    id: 'pos1-standing-cross',
    categoryId: 'standing',
    categoryName: '站立穿搭',
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
    categoryId: 'dynamic',
    categoryName: '动态抓拍',
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
    categoryId: 'sitting',
    categoryName: '坐姿场景',
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
    categoryId: 'back',
    categoryName: '背影侧身',
    name: '背身抬手回眸',
    tip: '适合背影、牛仔穿搭、街头感照片',
    description: '背身站姿，一只手抬到头顶整理头发，身体微微侧转，一条腿向前点地，适合拍背影和回眸氛围。',
    badge: '背影',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef5ff 0%, #65758d 100%)',
    guideImage: '/assets/poses/pos4_transparent.png',
    thumbnailImage: '/assets/poses/pos4_transparent.png',
    parts: []
  },
  {
    id: 'pos5-multi-reference',
    categoryId: 'reference',
    categoryName: '组合参考',
    name: '多姿势参考组',
    tip: '适合快速对照多个站姿和侧身角度',
    description: '组合式姿势参考图，包含多种正面、侧面和背面站姿，适合拍摄前快速寻找身体角度和手部动作。',
    badge: '组合',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #edf4ff 0%, #5f7188 100%)',
    guideImage: '/assets/poses/pos5_transparent.png',
    thumbnailImage: '/assets/poses/pos5_transparent.png',
    parts: []
  },
  {
    id: 'pos6-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 6',
    tip: '适合日常穿搭、街拍和全身构图',
    description: '新增 PNG 姿势轮廓模板，适合在拍摄时作为全身构图和身体姿态的对齐参考。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f6f1ea 0%, #8a7b68 100%)',
    guideImage: '/assets/poses/pos6_transparent.png',
    thumbnailImage: '/assets/poses/pos6_transparent.png',
    parts: []
  },
  {
    id: 'pos7-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 7',
    tip: '适合简洁干净的单人姿势参考',
    description: '新增 PNG 姿势轮廓模板，可用于拍摄单人照时参考身体比例、站位和画面留白。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef7f3 0%, #647d70 100%)',
    guideImage: '/assets/poses/pos7_transparent.png',
    thumbnailImage: '/assets/poses/pos7_transparent.png',
    parts: []
  },
  {
    id: 'pos8-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 8',
    tip: '适合补充不同站姿和手部动作',
    description: '新增 PNG 姿势轮廓模板，适合需要更多站姿选择时使用，帮助对齐人物比例和肢体动作。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f7f3ff 0%, #786a92 100%)',
    guideImage: '/assets/poses/pos8_transparent.png',
    thumbnailImage: '/assets/poses/pos8_transparent.png',
    parts: []
  },
  {
    id: 'pos9-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 9',
    tip: '适合新增姿势的快速拍摄引导',
    description: '新增 PNG 姿势轮廓模板，提供更多拍摄姿势选择，可在相机中拖动和缩放进行对齐。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef2ff 0%, #6878a0 100%)',
    guideImage: '/assets/poses/pos9_transparent.png',
    thumbnailImage: '/assets/poses/pos9_transparent.png',
    parts: []
  },
  {
    id: 'pos10-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 10',
    tip: '适合更多单人拍照姿势选择',
    description: '新增 PNG 姿势轮廓模板，适合拍摄时作为人物位置、身体曲线和画面比例参考。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f3f6ee 0%, #72845f 100%)',
    guideImage: '/assets/poses/pos10_transparent.png',
    thumbnailImage: '/assets/poses/pos10_transparent.png',
    parts: []
  },
  {
    id: 'pos11-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 11',
    tip: '适合扩展姿势库和不同构图尝试',
    description: '新增 PNG 姿势轮廓模板，可用于快速尝试不同站位、动作和拍摄构图。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #fff2ef 0%, #987061 100%)',
    guideImage: '/assets/poses/pos11_transparent.png',
    thumbnailImage: '/assets/poses/pos11_transparent.png',
    parts: []
  },
  {
    id: 'pos12-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 12',
    tip: '适合新增姿势的全身对齐参考',
    description: '新增 PNG 姿势轮廓模板，适合在拍照时作为全身姿态和人物比例的辅助引导。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef6ff 0%, #5f748d 100%)',
    guideImage: '/assets/poses/pos12_transparent.png',
    thumbnailImage: '/assets/poses/pos12_transparent.png',
    parts: []
  },
  {
    id: 'pos13-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 13',
    tip: '适合扩展更多全身拍照姿势',
    description: '新增 PNG 姿势轮廓模板，可在相机中作为全身站姿、人物比例和构图位置的参考。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f4f7ff 0%, #7483a4 100%)',
    guideImage: '/assets/poses/pos13_transparent.png',
    thumbnailImage: '/assets/poses/pos13_transparent.png',
    parts: []
  },
  {
    id: 'pos14-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 14',
    tip: '适合单人照姿态和画面留白参考',
    description: '新增 PNG 姿势轮廓模板，帮助在拍摄时快速对齐人物站位、动作幅度和画面比例。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef7f4 0%, #668374 100%)',
    guideImage: '/assets/poses/pos14_transparent.png',
    thumbnailImage: '/assets/poses/pos14_transparent.png',
    parts: []
  },
  {
    id: 'pos15-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 15',
    tip: '适合更多穿搭、街拍和旅行场景',
    description: '新增 PNG 姿势轮廓模板，适合补充不同拍摄动作，并支持在相机中拖动、缩放对齐。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #fff4ef 0%, #987665 100%)',
    guideImage: '/assets/poses/pos15_transparent.png',
    thumbnailImage: '/assets/poses/pos15_transparent.png',
    parts: []
  },
  {
    id: 'pos16-standing-reference',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '站姿轮廓 16',
    tip: '适合新增姿势的拍摄引导',
    description: '新增 PNG 姿势轮廓模板，可用于拍照时参考身体姿态、站位和整体构图。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef3ff 0%, #607795 100%)',
    guideImage: '/assets/poses/pos16_transparent.png',
    thumbnailImage: '/assets/poses/pos16_transparent.png',
    parts: []
  }
]

const categoryDefinitions = [
  {
    id: 'standing',
    name: '站立穿搭',
    subtitle: '适合景点、街拍、全身穿搭和日常出片'
  },
  {
    id: 'dynamic',
    name: '动态抓拍',
    subtitle: '适合走路、回头、移动感和旅行氛围'
  },
  {
    id: 'sitting',
    name: '坐姿场景',
    subtitle: '适合长椅、咖啡店、室内休闲和半身构图'
  },
  {
    id: 'back',
    name: '背影侧身',
    subtitle: '适合背影、回眸、侧身和氛围感照片'
  },
  {
    id: 'reference',
    name: '组合参考',
    subtitle: '一次查看多种姿势，适合拍摄前快速找灵感'
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
