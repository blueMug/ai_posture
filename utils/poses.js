const makeMarkerLine = (id, left, top, width, rotate, opacity = 0.86, thickness = 8) => ({
  id,
  type: 'marker-line',
  style: `left:${left}%;top:${top}%;width:${width}%;height:${thickness}rpx;transform:rotate(${rotate}deg);background:rgba(255,255,255,${opacity});`
})

const makeMarkerArc = (id, left, top, width, height, rotate = 0, opacity = 0.86, thickness = 8) => ({
  id,
  type: 'marker-arc',
  style: `left:${left}%;top:${top}%;width:${width}%;height:${height}%;border-width:${thickness}rpx ${thickness}rpx 0 0;transform:rotate(${rotate}deg);border-color:rgba(255,255,255,${opacity});`
})

const makeLabel = (id, text, left, top, rotate = 0, size = 5) => ({
  id,
  text,
  type: 'guide-label',
  style: `left:${left}%;top:${top}%;transform:rotate(${rotate}deg);font-size:${size}vw;`
})

const poseTemplates = [
  {
    id: 'rooftop-selfie-arm',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '天台张臂自拍',
    tip: '适合天台、城市高处、广角自拍',
    description: '近景自拍构图，一只手伸向镜头，另一只手向远处打开，用粗白外轮廓提示手臂和动作方向。',
    badge: '轮廓',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #ecf4ff 0%, #8ea4b8 100%)',
    parts: [
      makeMarkerArc('head-orbit-left', 34, 10, 30, 33, -10, 0.88, 9),
      makeMarkerArc('head-orbit-right', 45, 11, 26, 31, 16, 0.82, 9),
      makeMarkerLine('neck-left', 39, 40, 13, 116, 0.78, 7),
      makeMarkerLine('neck-right', 57, 40, 12, 64, 0.78, 7),
      makeMarkerArc('collar-left', 35, 42, 23, 15, -24, 0.7, 7),
      makeMarkerArc('collar-right', 50, 42, 22, 15, 28, 0.7, 7),
      makeMarkerLine('selfie-arm-a', 36, 48, 45, 188, 0.9, 10),
      makeMarkerLine('selfie-arm-b', 2, 56, 30, 192, 0.82, 10),
      makeMarkerArc('selfie-arm-curve', -7, 43, 25, 32, 32, 0.8, 9),
      makeMarkerLine('open-arm-upper', 58, 46, 28, 334, 0.88, 9),
      makeMarkerLine('open-arm-forearm', 78, 33, 18, 24, 0.84, 9),
      makeMarkerArc('open-hand-palm', 88, 30, 14, 15, -18, 0.86, 8),
      makeMarkerLine('open-finger-a', 93, 30, 8, 318, 0.82, 6),
      makeMarkerLine('open-finger-b', 94, 34, 8, 8, 0.82, 6),
      makeMarkerLine('open-finger-c', 93, 38, 8, 42, 0.76, 6),
      makeMarkerArc('waist-doodle', 43, 58, 22, 14, 5, 0.58, 6),
      makeMarkerLine('body-left', 42, 45, 20, 86, 0.62, 7),
      makeMarkerLine('body-right', 56, 45, 20, 96, 0.62, 7),
      makeLabel('left-label-1', '举', 8, 48, -12, 5.2),
      makeLabel('left-label-2', '起', 16, 47, -10, 5.2),
      makeLabel('left-label-3', '手', 25, 43, -35, 5.2),
      makeLabel('left-label-4', '臂', 33, 38, 0, 5.2),
      makeLabel('right-label-1', '放', 77, 55, 18, 4.8),
      makeLabel('right-label-2', '松', 75, 63, 18, 4.8),
      makeLabel('right-label-3', '张', 78, 71, 18, 4.8),
      makeLabel('right-label-4', '开', 82, 79, 18, 4.8)
    ]
  },
  {
    id: 'graduation-gown-kick',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '毕业袍张手抬腿',
    tip: '适合毕业照、校园、纪念照',
    description: '一只手高举道具，另一只手张开，侧身抬腿，用连续外轮廓强调毕业袍和腿部动作。',
    badge: '轮廓',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eef4ff 0%, #6d7580 100%)',
    parts: [
      makeMarkerArc('cap-head-left', 33, 16, 18, 20, -24, 0.86, 8),
      makeMarkerArc('cap-head-right', 44, 15, 17, 21, 20, 0.82, 8),
      makeMarkerLine('cap-edge', 37, 18, 17, 8, 0.74, 6),
      makeMarkerLine('left-arm-open-a', 35, 38, 24, 212, 0.88, 9),
      makeMarkerArc('left-hand-curl', 23, 35, 10, 14, -25, 0.84, 7),
      makeMarkerLine('right-arm-up-a', 55, 34, 30, 300, 0.9, 9),
      makeMarkerLine('right-arm-up-b', 73, 12, 18, 326, 0.86, 9),
      makeMarkerArc('raised-prop', 81, 2, 18, 22, 24, 0.8, 7),
      makeMarkerArc('gown-left-outline', 27, 35, 23, 38, -22, 0.86, 9),
      makeMarkerArc('gown-right-outline', 49, 31, 22, 41, 16, 0.86, 9),
      makeMarkerLine('gown-bottom', 35, 68, 25, 5, 0.72, 7),
      makeMarkerLine('support-leg', 44, 68, 27, 95, 0.76, 8),
      makeMarkerLine('kick-thigh', 57, 58, 27, 20, 0.9, 9),
      makeMarkerLine('kick-calf', 79, 66, 23, 10, 0.88, 9),
      makeMarkerArc('shoe-outline', 94, 63, 10, 12, -20, 0.84, 7),
      makeLabel('grad-label-1', '张', 46, 24, -26, 4.6),
      makeLabel('grad-label-2', '开', 51, 21, -22, 4.6),
      makeLabel('grad-label-3', '手', 57, 18, -16, 4.6),
      makeLabel('kick-label-1', '抬', 75, 53, 14, 4.5),
      makeLabel('kick-label-2', '抬', 82, 55, 14, 4.5),
      makeLabel('kick-label-3', '腿', 89, 57, 14, 4.5)
    ]
  },
  {
    id: 'bench-cross-sit',
    categoryId: 'leisure',
    categoryName: '休闲坐姿',
    name: '长椅交叠坐',
    tip: '适合花店、长椅、公园和街角',
    description: '身体坐在长椅中央，一只手搭在椅背，双腿交叠前伸，用外轮廓突出坐姿姿态。',
    badge: '轮廓',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #fff1df 0%, #c84d63 100%)',
    parts: [
      makeMarkerArc('sit-head-left', 43, 18, 15, 17, -18, 0.84, 8),
      makeMarkerArc('sit-head-right', 52, 18, 14, 17, 18, 0.82, 8),
      makeMarkerLine('neck', 50, 34, 8, 94, 0.72, 7),
      makeMarkerArc('shoulder-wrap', 39, 36, 26, 16, 4, 0.82, 8),
      makeMarkerLine('back-arm-seat', 36, 43, 24, 170, 0.84, 8),
      makeMarkerArc('left-hand-chair', 25, 42, 11, 13, -18, 0.78, 7),
      makeMarkerLine('right-arm-down', 62, 42, 20, 74, 0.8, 8),
      makeMarkerArc('torso-outline-left', 40, 36, 18, 30, -8, 0.82, 8),
      makeMarkerArc('torso-outline-right', 52, 38, 17, 30, 12, 0.82, 8),
      makeMarkerLine('bench-back', 24, 50, 52, 0, 0.42, 6),
      makeMarkerLine('bench-seat', 30, 62, 46, 0, 0.46, 6),
      makeMarkerLine('upper-leg-cross', 45, 62, 29, 16, 0.9, 9),
      makeMarkerLine('lower-leg-cross', 60, 70, 19, 104, 0.82, 8),
      makeMarkerLine('back-leg', 48, 66, 26, 118, 0.76, 8),
      makeMarkerArc('front-shoe', 38, 81, 13, 10, -10, 0.82, 7),
      makeMarkerArc('back-shoe', 63, 84, 13, 10, 8, 0.72, 7),
      makeLabel('bench-label-1', '手', 31, 39, -34, 4.5),
      makeLabel('bench-label-2', '搭', 35, 35, -30, 4.5),
      makeLabel('bench-label-3', '椅', 39, 31, -26, 4.5),
      makeLabel('bench-label-4', '背', 43, 28, -22, 4.5),
      makeLabel('leg-label-1', '腿', 35, 67, -42, 4.2),
      makeLabel('leg-label-2', '交', 31, 73, -42, 4.2),
      makeLabel('leg-label-3', '叠', 27, 79, -42, 4.2)
    ]
  }
]

const poseCategories = [
  {
    id: 'travel',
    name: '景点打卡',
    subtitle: '城市、校园、旅行纪念照',
    poses: poseTemplates.filter((pose) => pose.categoryId === 'travel')
  },
  {
    id: 'leisure',
    name: '休闲坐姿',
    subtitle: '长椅、花店、公园和街角',
    poses: poseTemplates.filter((pose) => pose.categoryId === 'leisure')
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
