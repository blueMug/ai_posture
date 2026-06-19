const combinePairIds = [
  'combine1_r01_g01',
  'combine1_r01_g02',
  'combine1_r02_g01',
  'combine1_r02_g02',
  'combine1_r03_g01',
  'combine1_r03_g02',
  'combine2_r01_g01',
  'combine2_r01_g02',
  'combine2_r02_g01',
  'combine2_r02_g02',
  'combine2_r03_g01',
  'combine2_r03_g02',
  'combine3_r01_g01',
  'combine3_r01_g02',
  'combine3_r02_g01',
  'combine3_r02_g02',
  'combine3_r03_g01',
  'combine3_r03_g02',
  'combine4_r01_g01',
  'combine4_r01_g02',
  'combine4_r02_g01',
  'combine4_r02_g02',
  'combine4_r03_g01',
  'combine4_r03_g02',
  'combine5_r01_g01',
  'combine5_r01_g02',
  'combine5_r02_g01',
  'combine5_r02_g02',
  'combine5_r03_g01',
  'combine5_r03_g02',
  'combine5_r04_g01',
  'combine5_r04_g02'
]

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
    thumbnailMode: 'aspectFill',
    parts: []
  }
})

module.exports = {
  combinePairPoses
}
