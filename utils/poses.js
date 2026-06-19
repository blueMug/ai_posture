const { assetUrl } = require('./assets')
const { combinePairPoses } = require('./combinePairPoses')

const SIMPLE_POSE_IDS = [
  'pos1-standing-cross',
  'pos2-walking-lookback',
  'pos3-cross-leg-sit',
  'pos4-back-hand-lift'
]

const pairPoses = combinePairPoses

const poseTemplates = [
  {
    id: 'pos1-standing-cross',
    categoryId: 'standing',
    categoryName: '站立穿搭',
    name: '叉腰显腿长',
    tip: '推荐穿搭照、景点全身照',
    description: '单手叉腰配合交叉站姿，身体重心更自然，适合拍出轻松显腿长的正面全身照。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef2ff 0%, #7f8da3 100%)',
    guideImage: '/static/poses/pos1_transparent.png',
    thumbnailImage: '/static/poses/pos1_transparent.png',
    parts: []
  },
  {
    id: 'pos2-walking-lookback',
    categoryId: 'dynamic',
    categoryName: '动态抓拍',
    name: '回头走路感',
    tip: '推荐街拍、旅行路感、动态抓拍',
    description: '侧身迈步配合自然回头，手臂和腿部形成动态线条，适合拍出正在路上的松弛感。',
    badge: '走姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f5f0e8 0%, #7f8a76 100%)',
    guideImage: '/static/poses/pos2_transparent.png',
    thumbnailImage: '/static/poses/pos2_transparent.png',
    parts: []
  },
  {
    id: 'pos3-cross-leg-sit',
    categoryId: 'sitting',
    categoryName: '坐姿场景',
    name: '温柔交叉坐',
    tip: '推荐长椅、咖啡店、室内穿搭',
    description: '双腿交叉前伸，双手自然放在身前，上半身微微收拢，适合安静、干净的坐姿照片。',
    badge: '坐姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f3eef8 0%, #86748f 100%)',
    guideImage: '/static/poses/pos3_transparent.png',
    thumbnailImage: '/static/poses/pos3_transparent.png',
    parts: []
  },
  {
    id: 'pos4-back-hand-lift',
    categoryId: 'back',
    categoryName: '背影侧身',
    name: '抬手背影杀',
    tip: '推荐背影、回眸、街头氛围照',
    description: '背身侧转，一只手抬起整理头发，腿部自然前点，适合拍背影和回眸氛围。',
    badge: '背影',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef5ff 0%, #65758d 100%)',
    guideImage: '/static/poses/pos4_transparent.png',
    thumbnailImage: '/static/poses/pos4_transparent.png',
    parts: []
  },
  {
    id: 'pos5-multi-reference',
    categoryId: 'reference',
    categoryName: '组合参考',
    name: '半身氛围特写',
    tip: '推荐头像、半身照、情绪氛围照',
    description: '手部靠近脸部，肩颈线条清晰，适合拍半身特写、头像和更有情绪感的照片。',
    badge: '半身',
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
    name: '衬衫通勤感',
    tip: '推荐通勤穿搭、干净半身照',
    description: '正面半身站姿，肩线和腰线比较明确，适合衬衫、裙装和简洁通勤风照片。',
    badge: '半身',
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
    name: '侧脸抱臂',
    tip: '推荐侧脸照、职场感、简约穿搭',
    description: '侧脸转头配合抱臂动作，姿态利落，适合拍干净、有态度的半身照。',
    badge: '半身',
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
    name: '轻靠肩线',
    tip: '推荐温柔半身、肩颈线条照片',
    description: '身体微侧，手臂自然贴近身体，适合突出肩颈和上半身轮廓的温柔风照片。',
    badge: '半身',
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
    name: '回眸肩头看',
    tip: '推荐回眸、侧身、氛围感半身照',
    description: '侧身回眸，手部轻搭肩头，适合拍出柔和、带一点故事感的半身构图。',
    badge: '回眸',
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
    name: '裙装叉腰站',
    tip: '推荐裙装穿搭、日常街拍',
    description: '正面站姿配合单手叉腰，腰线和裙摆更明显，适合拍清爽自然的穿搭照。',
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
    name: '松弛站姿',
    tip: '推荐日常穿搭、景点随拍',
    description: '自然站立动作，适合不想太刻意的全身构图，可用于旅行、街边和室外随拍。',
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
    name: '轻侧身显瘦',
    tip: '推荐侧身穿搭、全身比例照',
    description: '身体轻微侧转，让肩线和腰线更有层次，适合拍显瘦、显比例的全身照。',
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
    name: '自然站立款',
    tip: '推荐新手拍照、基础全身照',
    description: '基础站姿模板，动作简单好复刻，适合作为新手拍照时的默认全身参考。',
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
    name: '随性街拍站',
    tip: '推荐街拍、商场、路边随拍',
    description: '更偏随性的站姿轮廓，适合街景和日常场景，让人物站位看起来不僵硬。',
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
    name: '显比例穿搭站',
    tip: '推荐全身穿搭、鞋包展示',
    description: '强调纵向比例的站姿，适合需要展示整套穿搭、鞋子和包包的照片。',
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
    name: '氛围感站姿',
    tip: '推荐旅行、景点、落日氛围照',
    description: '适合放在景点或户外背景里使用，帮助控制人物比例、站位和整体画面留白。',
    badge: '站姿',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef3ff 0%, #607795 100%)',
    guideImage: '/assets/poses/pos16_transparent.png',
    thumbnailImage: '/assets/poses/pos16_transparent.png',
    parts: []
  }
]
  .filter((pose) => SIMPLE_POSE_IDS.includes(pose.id))
  .concat(pairPoses)
  .map((pose) => ({
    ...pose,
    guideImage: assetUrl(pose.guideImage),
    thumbnailImage: assetUrl(pose.thumbnailImage)
  }))

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
  },
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
