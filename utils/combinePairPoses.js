const combinePairIds = [
  'custom1_r01_g01',
  'custom2_r01_g01',
  'custom3_r01_g01',
  'custom4_r01_g01',
  'custom5_r01_g01'
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
  custom4_r01_g01: {
    name: '微侧温柔回正',
    tip: '推荐侧身显瘦、温柔半身、柔光写真',
    description: '身体微侧约20度，肩膀自然下沉，头部轻轻回正看向镜头；下巴微收配合柔和浅笑，适合拍自然显瘦的温柔半身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f4efe8 0%, #7e7168 100%)',
    detailImage: '/static/pose_pairs/custom4/custom4_r01_g01_demo.jpg'
  },
  custom5_r01_g01: {
    name: '侧身撩发抬眸',
    tip: '推荐温柔毛衣照、撩发半身、灵动眼神照',
    description: '半身侧身站立，一手轻撩耳侧发丝，头部微倾；从低垂视线到抬眸看向镜头，配合侧光和浅笑，适合拍温柔甜美的自然半身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f7f0e7 0%, #8b7664 100%)',
    detailImage: '/static/pose_pairs/custom5/custom5_r01_g01_demo.jpg'
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
