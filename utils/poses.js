const makeLine = (id, left, top, width, rotate, color = 'rgba(255, 233, 92, 0.92)') => ({
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

const poseTemplates = [
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
  }
]

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
