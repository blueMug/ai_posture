const primaryLine = 'rgba(255, 255, 255, 0.62)'
const secondaryLine = 'rgba(255, 255, 255, 0.34)'

const makeLine = (id, left, top, width, rotate, color = primaryLine) => ({
  id,
  type: 'line',
  style: `left:${left}%;top:${top}%;width:${width}%;transform:rotate(${rotate}deg);background:${color};`
})

const makeJoint = (id, left, top, size = 4) => ({
  id,
  type: 'joint',
  style: `left:${left}%;top:${top}%;width:${size}%;height:${size}%;`
})

const makeHead = (id, left, top, size = 12) => ({
  id,
  type: 'head',
  style: `left:${left}%;top:${top}%;width:${size}%;height:${size}%;`
})

const makeArc = (id, left, top, width, height, rotate = 0, opacity = 0.42) => ({
  id,
  type: 'arc',
  style: `left:${left}%;top:${top}%;width:${width}%;height:${height}%;transform:rotate(${rotate}deg);border-color:rgba(255,255,255,${opacity});`
})

const makeFootGuide = (id, left, top, width, rotate = 0) => ({
  id,
  type: 'foot-guide',
  style: `left:${left}%;top:${top}%;width:${width}%;transform:rotate(${rotate}deg);background:${secondaryLine};`
})

const makeMarkerLine = (id, left, top, width, rotate, opacity = 0.86) => ({
  id,
  type: 'marker-line',
  style: `left:${left}%;top:${top}%;width:${width}%;transform:rotate(${rotate}deg);background:rgba(255,255,255,${opacity});`
})

const makeMarkerArc = (id, left, top, width, height, rotate = 0, opacity = 0.86) => ({
  id,
  type: 'marker-arc',
  style: `left:${left}%;top:${top}%;width:${width}%;height:${height}%;transform:rotate(${rotate}deg);border-color:rgba(255,255,255,${opacity});`
})

const makeLabel = (id, text, left, top, rotate = 0, size = 5) => ({
  id,
  text,
  type: 'guide-label',
  style: `left:${left}%;top:${top}%;transform:rotate(${rotate}deg);font-size:${size}vw;`
})

const addSoftGuides = (pose) => pose.skipSoftGuides ? pose : ({
  ...pose,
  parts: [
    makeArc(`${pose.id}-face-orbit`, 41, 14, 18, 18, -8, 0.32),
    makeArc(`${pose.id}-shoulder-curve`, 35, 30, 31, 15, 2, 0.36),
    makeArc(`${pose.id}-torso-flow`, 42, 34, 23, 27, 7, 0.3),
    makeArc(`${pose.id}-hip-curve`, 39, 50, 24, 13, -3, 0.32),
    makeFootGuide(`${pose.id}-foot-left`, 40, 80, 17, 6),
    makeFootGuide(`${pose.id}-foot-right`, 54, 80, 17, -6),
    ...pose.parts
  ]
})

const basePoseTemplates = [
  {
    id: 'front',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '正面站姿',
    tip: '适合景点正面打卡',
    description: '身体居中，肩膀打开，适合地标建筑、草坪、海边等场景。',
    badge: '经典',
    accent: '#ffe95c',
    gradient: 'linear-gradient(150deg, #fff3a3 0%, #ffb86c 100%)',
    parts: [
      makeHead('head', 44, 18),
      makeLine('neck', 50, 31, 8, 90),
      makeLine('shoulder', 38, 35, 24, 0),
      makeLine('body', 50, 35, 18, 90),
      makeLine('left-arm', 39, 36, 25, 116),
      makeLine('right-arm', 61, 36, 25, 64),
      makeLine('hip', 42, 54, 16, 0),
      makeLine('left-leg', 45, 55, 26, 102),
      makeLine('right-leg', 55, 55, 26, 78),
      makeJoint('face-dot', 49, 23, 3)
    ]
  },
  {
    id: 'raise-hand',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '抬手看景',
    tip: '适合山海、天台、城市远景',
    description: '一只手自然抬起遮阳或指向远处，身体轻微侧转，画面更有旅行感。',
    badge: '开阔',
    accent: '#ffe95c',
    gradient: 'linear-gradient(150deg, #fff7b7 0%, #ff9f80 100%)',
    parts: [
      makeHead('head', 45, 16),
      makeLine('neck', 51, 30, 7, 94),
      makeLine('shoulder', 39, 34, 24, -6),
      makeLine('body', 51, 35, 19, 88),
      makeLine('raised-arm', 41, 34, 24, 232),
      makeLine('raised-forearm', 29, 20, 20, 348),
      makeLine('relaxed-arm', 61, 36, 22, 70),
      makeLine('hip', 43, 54, 17, -4),
      makeLine('left-leg', 46, 55, 27, 96),
      makeLine('right-leg', 56, 55, 25, 78),
      makeJoint('hand-dot', 28, 18, 3)
    ]
  },
  {
    id: 'back-view',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '背影看风景',
    tip: '适合大场景和风景照',
    description: '背对镜头站立，双臂自然打开一点，突出人与风景的比例。',
    badge: '大片',
    accent: '#9ce7ff',
    gradient: 'linear-gradient(150deg, #d9f8ff 0%, #71b7ff 100%)',
    parts: [
      makeHead('head', 44, 17),
      makeLine('neck', 50, 31, 7, 90),
      makeLine('shoulder', 37, 35, 26, 0),
      makeLine('body', 50, 35, 18, 90),
      makeLine('left-arm', 38, 37, 24, 132),
      makeLine('right-arm', 62, 37, 24, 48),
      makeLine('hip', 42, 54, 17, 0),
      makeLine('left-leg', 46, 55, 28, 96),
      makeLine('right-leg', 54, 55, 28, 84),
      makeJoint('view-dot', 49, 22, 3)
    ]
  },
  {
    id: 'wide-landscape',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '张开双臂',
    tip: '适合海边、草原、雪山',
    description: '双臂向两侧打开，身体保持挺拔，适合表达轻松和开阔感。',
    badge: '自由',
    accent: '#b8ff8a',
    gradient: 'linear-gradient(150deg, #ecffd7 0%, #65d6c0 100%)',
    parts: [
      makeHead('head', 44, 16),
      makeLine('neck', 50, 30, 7, 90),
      makeLine('shoulder', 37, 34, 26, 0),
      makeLine('body', 50, 35, 19, 90),
      makeLine('left-arm', 38, 35, 28, 188),
      makeLine('right-arm', 62, 35, 28, -8),
      makeLine('hip', 42, 55, 17, 0),
      makeLine('left-leg', 46, 56, 26, 102),
      makeLine('right-leg', 55, 56, 26, 78)
    ]
  },
  {
    id: 'grass-leg-v',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '草坪抬腿比耶',
    tip: '适合草坪、山野、晴天旅行照',
    description: '一只手高举比耶，另一只手自然下垂，单腿抬起形成活泼的旅行感。',
    badge: '元气',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eaf7ff 0%, #91d9a8 100%)',
    parts: [
      makeHead('head', 44, 16),
      makeLine('cap-brim', 43, 22, 13, 2, 'rgba(255, 255, 255, 0.46)'),
      makeLine('neck', 50, 30, 7, 92),
      makeLine('shoulder', 38, 34, 24, -4),
      makeLine('torso', 50, 35, 19, 88),
      makeArc('waist-curve', 43, 48, 19, 10, 4, 0.38),
      makeLine('high-arm', 39, 34, 29, 246),
      makeLine('v-finger-a', 25, 13, 10, 236, 'rgba(255, 255, 255, 0.72)'),
      makeLine('v-finger-b', 25, 13, 10, 286, 'rgba(255, 255, 255, 0.72)'),
      makeLine('down-arm', 61, 36, 23, 74),
      makeLine('bag-hand', 67, 56, 12, 340, 'rgba(255, 255, 255, 0.38)'),
      makeLine('hip', 43, 54, 17, -4),
      makeLine('support-leg', 55, 55, 29, 86),
      makeLine('raised-thigh', 45, 55, 17, 142),
      makeLine('raised-calf', 36, 63, 18, 72),
      makeArc('raised-knee', 34, 58, 12, 10, -20, 0.4),
      makeJoint('v-hand-dot', 25, 12, 3),
      makeJoint('knee-dot', 36, 61, 3)
    ]
  },
  {
    id: 'grass-wave-cross',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '草坪举手交叉步',
    tip: '适合全身照和景区步道',
    description: '一只手高举挥手，双腿前后交叉，身体轻微侧倾，适合明亮户外场景。',
    badge: '清爽',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #effcff 0%, #a7d96a 100%)',
    parts: [
      makeHead('head', 45, 16),
      makeLine('cap-brim', 44, 22, 12, 0, 'rgba(255, 255, 255, 0.46)'),
      makeLine('neck', 51, 30, 7, 98),
      makeLine('shoulder', 39, 34, 23, -6),
      makeLine('torso', 51, 35, 19, 88),
      makeArc('skirt-hem', 42, 51, 21, 9, -2, 0.36),
      makeLine('wave-arm', 61, 34, 30, 292),
      makeArc('wave-hand', 72, 15, 11, 10, -12, 0.58),
      makeLine('relaxed-arm', 40, 36, 23, 108),
      makeLine('shoes-hand', 33, 55, 13, 16, 'rgba(255, 255, 255, 0.36)'),
      makeLine('hip', 43, 54, 17, -5),
      makeLine('front-leg', 47, 55, 32, 72),
      makeLine('back-leg', 55, 55, 28, 106),
      makeArc('cross-ankle', 51, 76, 12, 8, 10, 0.38),
      makeJoint('wave-dot', 75, 15, 3),
      makeJoint('cross-dot', 52, 68, 3)
    ]
  },
  {
    id: 'rooftop-selfie-arm',
    categoryId: 'travel',
    categoryName: '景点打卡',
    name: '天台张臂自拍',
    tip: '适合天台、城市高处、广角自拍',
    description: '近景自拍构图，一只手伸向镜头，另一只手向远处打开，用粗白手绘线提示手臂和背景方向。',
    badge: '手绘',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #ecf4ff 0%, #8ea4b8 100%)',
    skipSoftGuides: true,
    parts: [
      makeMarkerArc('head-orbit-left', 34, 10, 30, 33, -10, 0.88),
      makeMarkerArc('head-orbit-right', 45, 11, 26, 31, 16, 0.82),
      makeMarkerLine('neck-left', 39, 40, 13, 116, 0.78),
      makeMarkerLine('neck-right', 57, 40, 12, 64, 0.78),
      makeMarkerArc('collar-left', 35, 42, 23, 15, -24, 0.7),
      makeMarkerArc('collar-right', 50, 42, 22, 15, 28, 0.7),
      makeMarkerLine('selfie-arm-a', 36, 48, 45, 188, 0.9),
      makeMarkerLine('selfie-arm-b', 2, 56, 30, 192, 0.82),
      makeMarkerArc('selfie-arm-curve', -7, 43, 25, 32, 32, 0.8),
      makeMarkerLine('open-arm-upper', 58, 46, 28, 334, 0.88),
      makeMarkerLine('open-arm-forearm', 78, 33, 18, 24, 0.84),
      makeMarkerArc('open-hand-palm', 88, 30, 14, 15, -18, 0.86),
      makeMarkerLine('open-finger-a', 93, 30, 8, 318, 0.82),
      makeMarkerLine('open-finger-b', 94, 34, 8, 8, 0.82),
      makeMarkerLine('open-finger-c', 93, 38, 8, 42, 0.76),
      makeMarkerArc('waist-doodle', 43, 58, 22, 14, 5, 0.58),
      makeMarkerLine('body-left', 42, 45, 20, 86, 0.62),
      makeMarkerLine('body-right', 56, 45, 20, 96, 0.62),
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
    id: 'side',
    categoryId: 'outfit',
    categoryName: '穿搭街拍',
    name: '侧身回头',
    tip: '适合穿搭和街拍',
    description: '侧身拉出轮廓，轻微回头，适合展示外套、裙摆和整体穿搭。',
    badge: '显瘦',
    accent: '#9ce7ff',
    gradient: 'linear-gradient(150deg, #d7fbff 0%, #8da2ff 100%)',
    parts: [
      makeHead('head', 48, 17),
      makeLine('gaze', 46, 23, 14, 180, 'rgba(255, 255, 255, 0.82)'),
      makeLine('neck', 53, 31, 8, 105),
      makeLine('shoulder', 44, 36, 20, -16),
      makeLine('body', 53, 36, 20, 84),
      makeLine('front-arm', 45, 38, 21, 82),
      makeLine('back-arm', 58, 38, 20, 118),
      makeLine('hip', 47, 56, 15, -10),
      makeLine('front-leg', 51, 57, 26, 82),
      makeLine('back-leg', 57, 57, 23, 108),
      makeJoint('turn-dot', 50, 22, 3)
    ]
  },
  {
    id: 'grass-cap-cross',
    categoryId: 'outfit',
    categoryName: '穿搭街拍',
    name: '压帽交叉步',
    tip: '适合棒球帽、短裙、运动穿搭',
    description: '一只手轻扶帽檐，双腿交叉站立，另一只手自然拿道具，适合不看镜头的穿搭照。',
    badge: '清甜',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #f3fbff 0%, #9fcf7a 100%)',
    parts: [
      makeHead('head', 44, 16),
      makeLine('cap-brim', 42, 22, 15, 0, 'rgba(255, 255, 255, 0.5)'),
      makeLine('neck', 50, 30, 7, 94),
      makeLine('shoulder', 38, 34, 24, 0),
      makeLine('torso', 50, 35, 18, 90),
      makeArc('top-outline', 42, 34, 20, 18, 0, 0.32),
      makeLine('cap-arm-upper', 39, 35, 15, 220),
      makeLine('cap-arm-lower', 32, 28, 13, 338),
      makeJoint('cap-hand-dot', 39, 25, 3),
      makeLine('down-arm', 61, 36, 22, 74),
      makeLine('prop-hand', 67, 55, 12, 340, 'rgba(255, 255, 255, 0.36)'),
      makeLine('hip', 42, 54, 18, 0),
      makeLine('front-leg', 47, 55, 31, 72),
      makeLine('back-leg', 55, 55, 29, 108),
      makeArc('ankle-cross', 50, 76, 13, 8, 10, 0.4),
      makeFootGuide('front-foot', 58, 79, 14, -4)
    ]
  },
  {
    id: 'grass-close-v',
    categoryId: 'outfit',
    categoryName: '穿搭街拍',
    name: '近景低头比耶',
    tip: '适合半身照、草坪和蓝天背景',
    description: '身体靠近镜头，头微低，一只手在脸侧比耶，另一只手放松，适合近景氛围照。',
    badge: '近景',
    accent: '#f4f7ff',
    gradient: 'linear-gradient(150deg, #eaf8ff 0%, #8ed18f 100%)',
    parts: [
      makeHead('head', 47, 14, 13),
      makeLine('cap-brim', 46, 21, 15, 4, 'rgba(255, 255, 255, 0.5)'),
      makeLine('gaze', 50, 24, 12, 42, 'rgba(255, 255, 255, 0.34)'),
      makeLine('neck', 53, 29, 8, 106),
      makeLine('shoulder', 40, 33, 24, -12),
      makeLine('torso', 53, 34, 22, 86),
      makeArc('upper-body', 42, 32, 25, 25, 5, 0.36),
      makeLine('v-arm-upper', 42, 34, 17, 220),
      makeLine('v-arm-lower', 34, 26, 15, 332),
      makeLine('v-finger-a', 31, 24, 10, 230, 'rgba(255, 255, 255, 0.72)'),
      makeLine('v-finger-b', 31, 24, 10, 286, 'rgba(255, 255, 255, 0.72)'),
      makeLine('relaxed-arm', 64, 36, 25, 78),
      makeLine('hip', 43, 56, 21, -4),
      makeLine('front-leg', 48, 57, 32, 72),
      makeLine('back-leg', 56, 57, 28, 108),
      makeArc('skirt-flow', 38, 49, 29, 14, -2, 0.34),
      makeJoint('v-dot', 31, 24, 3)
    ]
  },
  {
    id: 'hand-pocket',
    categoryId: 'outfit',
    categoryName: '穿搭街拍',
    name: '单手插兜',
    tip: '适合外套、牛仔裤、通勤穿搭',
    description: '一只手插兜，另一只手放松下垂，适合拍出利落的街拍感。',
    badge: '利落',
    accent: '#d7c7ff',
    gradient: 'linear-gradient(150deg, #efe8ff 0%, #9d8cff 100%)',
    parts: [
      makeHead('head', 45, 16),
      makeLine('neck', 51, 30, 7, 96),
      makeLine('shoulder', 39, 34, 23, -4),
      makeLine('body', 51, 35, 20, 88),
      makeLine('pocket-arm', 41, 37, 18, 58),
      makeLine('relaxed-arm', 61, 36, 24, 78),
      makeLine('hip', 43, 55, 18, -4),
      makeLine('left-leg', 47, 56, 27, 94),
      makeLine('right-leg', 56, 56, 25, 82),
      makeJoint('pocket-dot', 49, 45, 3)
    ]
  },
  {
    id: 'cross-leg',
    categoryId: 'outfit',
    categoryName: '穿搭街拍',
    name: '交叉站姿',
    tip: '适合显腿长和全身穿搭',
    description: '双腿轻微交叉，身体重心放在后脚，适合全身照和镜头下沿构图。',
    badge: '显高',
    accent: '#ffc4df',
    gradient: 'linear-gradient(150deg, #ffe4ef 0%, #ff94b8 100%)',
    parts: [
      makeHead('head', 45, 16),
      makeLine('neck', 51, 30, 7, 92),
      makeLine('shoulder', 39, 34, 23, 0),
      makeLine('body', 51, 35, 19, 88),
      makeLine('left-arm', 40, 36, 23, 112),
      makeLine('right-arm', 61, 36, 23, 68),
      makeLine('hip', 43, 54, 18, 0),
      makeLine('front-leg', 47, 55, 32, 74),
      makeLine('back-leg', 55, 55, 28, 106),
      makeJoint('cross-dot', 51, 70, 3)
    ]
  },
  {
    id: 'hair-touch',
    categoryId: 'outfit',
    categoryName: '穿搭街拍',
    name: '抬手撩发',
    tip: '适合半身、裙装、逆光',
    description: '一只手靠近头部，另一只手自然放松，适合拍出更柔和的氛围。',
    badge: '氛围',
    accent: '#ffd7a8',
    gradient: 'linear-gradient(150deg, #fff0d7 0%, #ffb27d 100%)',
    parts: [
      makeHead('head', 45, 16),
      makeLine('neck', 51, 30, 7, 98),
      makeLine('shoulder', 39, 34, 23, -5),
      makeLine('body', 51, 35, 19, 88),
      makeLine('upper-arm', 40, 35, 19, 226),
      makeLine('forearm', 31, 25, 16, 338),
      makeLine('relaxed-arm', 61, 36, 23, 72),
      makeLine('hip', 43, 54, 18, -4),
      makeLine('left-leg', 47, 55, 27, 96),
      makeLine('right-leg', 56, 55, 25, 80),
      makeJoint('hair-dot', 38, 21, 3)
    ]
  },
  {
    id: 'walk',
    categoryId: 'outfit',
    categoryName: '穿搭街拍',
    name: '走路抓拍',
    tip: '适合自然动态出片',
    description: '模拟向前迈步的瞬间，适合街区、商场、展览和旅行路上。',
    badge: '自然',
    accent: '#b8ff8a',
    gradient: 'linear-gradient(150deg, #e5ffc9 0%, #77d9a3 100%)',
    parts: [
      makeHead('head', 44, 16),
      makeLine('neck', 50, 30, 7, 95),
      makeLine('shoulder', 39, 34, 23, -8),
      makeLine('body', 51, 35, 19, 82),
      makeLine('left-arm', 40, 36, 25, 128),
      makeLine('right-arm', 61, 34, 24, 52),
      makeLine('hip', 43, 54, 18, -8),
      makeLine('front-thigh', 51, 55, 24, 62),
      makeLine('front-calf', 63, 65, 20, 112),
      makeLine('back-leg', 48, 56, 31, 116),
      makeJoint('step-dot', 61, 64, 3)
    ]
  },
  {
    id: 'bag-look',
    categoryId: 'outfit',
    categoryName: '穿搭街拍',
    name: '低头看包',
    tip: '适合包包、配饰和街头橱窗',
    description: '头部微低，手部靠近包或衣摆，适合弱化看镜头的尴尬感。',
    badge: '细节',
    accent: '#c8f7ff',
    gradient: 'linear-gradient(150deg, #e2fbff 0%, #7cc9ff 100%)',
    parts: [
      makeHead('head', 46, 17),
      makeLine('gaze', 49, 25, 11, 42, 'rgba(255, 255, 255, 0.82)'),
      makeLine('neck', 52, 31, 7, 105),
      makeLine('shoulder', 40, 35, 22, -8),
      makeLine('body', 52, 36, 19, 86),
      makeLine('bag-arm', 41, 37, 22, 68),
      makeLine('other-arm', 61, 37, 21, 108),
      makeLine('hip', 44, 55, 17, -5),
      makeLine('left-leg', 48, 56, 26, 92),
      makeLine('right-leg', 56, 56, 25, 80),
      makeJoint('bag-dot', 49, 47, 3)
    ]
  },
  {
    id: 'sit',
    categoryId: 'leisure',
    categoryName: '休闲坐姿',
    name: '坐姿',
    tip: '适合长椅、台阶、咖啡店',
    description: '坐下后保持身体舒展，腿部错开，适合咖啡店、长椅和台阶。',
    badge: '松弛',
    accent: '#ffc4df',
    gradient: 'linear-gradient(150deg, #ffe1ed 0%, #c89bff 100%)',
    parts: [
      makeHead('head', 45, 17),
      makeLine('neck', 51, 31, 7, 90),
      makeLine('shoulder', 39, 35, 24, 0),
      makeLine('body', 51, 35, 18, 92),
      makeLine('left-arm', 40, 37, 21, 110),
      makeLine('right-arm', 61, 37, 21, 70),
      makeLine('hip', 42, 54, 18, 0),
      makeLine('left-thigh', 43, 56, 24, 18),
      makeLine('right-thigh', 55, 56, 24, -18),
      makeLine('left-calf', 64, 63, 19, 92),
      makeLine('right-calf', 36, 63, 19, 88)
    ]
  },
  {
    id: 'stair-sit',
    categoryId: 'leisure',
    categoryName: '休闲坐姿',
    name: '台阶错腿坐',
    tip: '适合台阶、路边、展馆',
    description: '坐姿重心后放，一条腿向前伸，一条腿弯曲，画面更松弛。',
    badge: '随性',
    accent: '#b7a8ff',
    gradient: 'linear-gradient(150deg, #eee7ff 0%, #8f83ff 100%)',
    parts: [
      makeHead('head', 45, 16),
      makeLine('neck', 51, 30, 7, 95),
      makeLine('shoulder', 39, 34, 23, -4),
      makeLine('body', 51, 35, 18, 104),
      makeLine('left-arm', 40, 37, 22, 122),
      makeLine('right-arm', 61, 37, 20, 72),
      makeLine('hip', 43, 55, 18, 0),
      makeLine('bent-thigh', 43, 57, 23, 20),
      makeLine('bent-calf', 63, 65, 18, 96),
      makeLine('long-leg', 55, 58, 34, 18),
      makeJoint('knee-dot', 61, 64, 3)
    ]
  },
  {
    id: 'wall-lean',
    categoryId: 'leisure',
    categoryName: '休闲坐姿',
    name: '靠墙放松',
    tip: '适合街角、展墙、店铺外立面',
    description: '肩部轻靠墙，单腿弯起，适合拍出不刻意的日常感。',
    badge: '松弛',
    accent: '#ffd7a8',
    gradient: 'linear-gradient(150deg, #fff1dc 0%, #ff9d7e 100%)',
    parts: [
      makeHead('head', 47, 16),
      makeLine('neck', 53, 30, 7, 106),
      makeLine('shoulder', 42, 34, 22, -16),
      makeLine('body', 54, 35, 20, 80),
      makeLine('left-arm', 43, 36, 22, 118),
      makeLine('right-arm', 63, 35, 24, 76),
      makeLine('hip', 46, 55, 17, -12),
      makeLine('straight-leg', 50, 56, 29, 88),
      makeLine('bent-leg', 58, 56, 23, 124),
      makeLine('bent-calf', 46, 66, 18, 42)
    ]
  },
  {
    id: 'couple-lean',
    categoryId: 'group',
    categoryName: '双人合照',
    name: '双人靠近',
    tip: '适合朋友、情侣、亲子',
    description: '两个人肩部靠近，身体微微向中间倾斜，适合快速合照。',
    badge: '双人',
    accent: '#ffe95c',
    gradient: 'linear-gradient(150deg, #fff7ba 0%, #ff8ec7 100%)',
    parts: [
      makeHead('left-head', 34, 17, 10),
      makeHead('right-head', 56, 17, 10),
      makeLine('left-body', 39, 31, 20, 82),
      makeLine('right-body', 59, 31, 20, 98),
      makeLine('left-shoulder', 30, 35, 21, -8),
      makeLine('right-shoulder', 54, 35, 21, 8),
      makeLine('left-arm', 31, 37, 22, 116),
      makeLine('middle-arm', 49, 38, 19, 48, 'rgba(255, 255, 255, 0.82)'),
      makeLine('right-arm', 71, 37, 22, 64),
      makeLine('left-leg', 39, 54, 26, 100),
      makeLine('right-leg', 59, 54, 26, 80)
    ]
  },
  {
    id: 'bestie-v',
    categoryId: 'group',
    categoryName: '双人合照',
    name: '好友比耶',
    tip: '适合闺蜜、朋友旅行照',
    description: '两人一高一低或轻微错位，手部靠近脸侧，画面更活泼。',
    badge: '活泼',
    accent: '#9ce7ff',
    gradient: 'linear-gradient(150deg, #dffbff 0%, #a28cff 100%)',
    parts: [
      makeHead('left-head', 32, 18, 10),
      makeHead('right-head', 57, 15, 10),
      makeLine('left-body', 37, 32, 19, 88),
      makeLine('right-body', 62, 29, 20, 92),
      makeLine('left-v-arm', 33, 33, 16, 232),
      makeLine('left-v-hand', 24, 24, 12, 330, 'rgba(255, 255, 255, 0.82)'),
      makeLine('right-v-arm', 66, 30, 17, 306),
      makeLine('right-v-hand', 74, 22, 12, 28, 'rgba(255, 255, 255, 0.82)'),
      makeLine('left-leg', 38, 52, 26, 96),
      makeLine('right-leg', 63, 50, 27, 84),
      makeJoint('left-hand-dot', 24, 23, 3),
      makeJoint('right-hand-dot', 76, 22, 3)
    ]
  }
]

const poseTemplates = basePoseTemplates.map(addSoftGuides)

const poseCategories = [
  {
    id: 'travel',
    name: '景点打卡',
    subtitle: '地标、风景、旅行照',
    poses: poseTemplates.filter((pose) => pose.categoryId === 'travel')
  },
  {
    id: 'outfit',
    name: '穿搭街拍',
    subtitle: '显身形、看起来更自然',
    poses: poseTemplates.filter((pose) => pose.categoryId === 'outfit')
  },
  {
    id: 'leisure',
    name: '休闲坐姿',
    subtitle: '咖啡店、长椅、台阶',
    poses: poseTemplates.filter((pose) => pose.categoryId === 'leisure')
  },
  {
    id: 'group',
    name: '双人合照',
    subtitle: '朋友、情侣、亲子合影',
    poses: poseTemplates.filter((pose) => pose.categoryId === 'group')
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
