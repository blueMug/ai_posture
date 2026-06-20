const combinePairIds = [
  'custom1_r01_g01',
  'custom2_r01_g01',
  'custom3_r01_g01',
  'custom5_r01_g01',
  'custom6_r01_g01',
  'custom7_r01_g01'
]

const poseMetadataOverrides = {
  custom1_r01_g01: {
    name: '温柔侧身半身',
    tip: '推荐日常写真、半身照、侧身显瘦',
    description: '身体微微转向左侧，头部自然回正，视线轻看镜头斜上方；一手垂放、一手轻搭腰间，适合拍随性温柔的半身侧身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f7f1ec 0%, #8a7468 100%)',
    detailImage: '/static/pose_pairs/custom1/custom1_r01_g01_demo.jpg'
  },
  custom2_r01_g01: {
    name: '侧光撩发半身',
    tip: '推荐日常写真、互动感半身、温柔光影照',
    description: '正面偏侧站立，头部微微向右倾，一手轻抚耳侧发丝，另一手自然垂放；直视镜头配合浅笑，适合拍自然亲和的侧光半身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f5efe8 0%, #816d60 100%)',
    detailImage: '/static/pose_pairs/custom2/custom2_r01_g01_demo.jpg'
  },
  custom3_r01_g01: {
    name: '一字肩托腮',
    tip: '推荐知性半身、锁骨肩线、故事感写真',
    description: '半身正面姿态，一手轻托下巴作思考状，另一手自然环抱身前；头部微倾、眼神低垂，适合拍温柔沉静的知性氛围照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f5f3ef 0%, #7f7a73 100%)',
    detailImage: '/static/pose_pairs/custom3/custom3_r01_g01_demo.jpg'
  },
  custom5_r01_g01: {
    name: '侧身撩发抬眸',
    tip: '推荐温柔毛衣照、撩发半身、灵动眼神照',
    description: '半身侧身站立，一手轻撩耳侧发丝，头部微倾；从低垂视线到抬眸看向镜头，配合侧光和浅笑，适合拍温柔甜美的自然半身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f7f0e7 0%, #8b7664 100%)',
    detailImage: '/static/pose_pairs/custom5/custom5_r01_g01_demo.jpg'
  },
  custom6_r01_g01: {
    name: '回眸显腿长',
    tip: '推荐全身穿搭、逆光街拍、显比例站姿',
    description: '全身微侧站立，一脚前伸点地拉长腿部线条，一手叉腰、一手自然下垂；头部回眸看向镜头，适合拍自信温柔的高腰穿搭照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #f6eadc 0%, #8a6d55 100%)',
    detailImage: '/static/pose_pairs/custom6/custom6_r01_g01_demo.jpg'
  },
  custom7_r01_g01: {
    name: '咖啡街拍行走',
    tip: '推荐都市街拍、行走抓拍、休闲通勤穿搭',
    description: '全身自然行走姿态，一手握咖啡杯垂于身侧，另一手随步伐轻摆；低眸再抬眸看向镜头，适合拍随性自在的都市街拍感。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #eef0ed 0%, #5f6760 100%)',
    detailImage: '/static/pose_pairs/custom7/custom7_r01_g01_demo.jpg'
  }
}

const combinePairPoses = combinePairIds.map((pairId, index) => {
  const folder = pairId.split('_')[0]
  const poseNumber = index + 1

  return {
    id: `pair-${pairId.replace(/_/g, '-')}`,
    categoryId: 'model-pairs',
    categoryName: '真人示例',
    name: `真人姿势 ${String(poseNumber).padStart(2, '0')}`,
    tip: '先看真人示意，进入相机后按轮廓对齐',
    description: '选择页展示真人模特照片；进入相机后显示对应透明轮廓，用于对齐姿势和构图。',
    badge: '真人',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f7f1e8 0%, #6f665f 100%)',
    guideImage: `/static/pose_pairs/${folder}/${pairId}_contour.png`,
    thumbnailImage: `/static/pose_pairs/${folder}/${pairId}_demo.jpg`,
    modelImage: `/static/pose_pairs/${folder}/${pairId}_demo.jpg`,
    detailImage: `/assets/pose_pairs/${folder}/${pairId}_demo.png`,
    thumbnailMode: 'aspectFill',
    parts: [],
    ...poseMetadataOverrides[pairId]
  }
})

module.exports = {
  combinePairPoses
}
