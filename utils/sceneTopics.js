const SCENE_TOPIC_DETAIL_KEY = 'sceneAdvisorPlanDetail'

const sceneTopics = [
  {
    id: 'cafe-window',
    title: '咖啡店怎么拍',
    shortTitle: '咖啡店',
    painPoint: '坐下后手不知道放哪，拍出来像游客照。',
    promise: '用杯子、窗边和门口动作，快速拍出生活感。',
    shareTitle: '咖啡店拍照作业：照着这 3 个姿势，别再只拍大头照',
    categoryId: 'props-action',
    coverPoseId: 'pair-custom84-r01-g01',
    morePoseIds: [
      'pair-custom51-r01-g01',
      'pair-custom76-r01-g01',
      'pair-custom78-r01-g01',
      'pair-custom64-r01-g01',
      'pair-custom75-r01-g01',
      'pair-custom79-r01-g01',
      'pair-custom88-r01-g01',
      'pair-custom80-r01-g01',
      'pair-custom81-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom84-r01-g01',
        title: '捧杯近景',
        badge: '半身生活感',
        reason: '杯子解决手部尴尬，近景动作更适合咖啡店桌边和窗边。',
        composition: '半身入镜，保留杯子和上半身动作。',
        camera: '手机放在胸口到眼睛之间，竖拍半身。',
        avoid: '杯子不要完全挡住嘴和下巴。'
      },
      {
        poseId: 'pair-custom40-r01-g01',
        title: '店外台阶咖啡',
        badge: '休闲全身',
        reason: '适合咖啡店门口或街边台阶，拍全身不僵硬。',
        composition: '全身入镜，把台阶和脚部姿态拍完整。',
        camera: '手机略低，保持人物从头到脚完整。',
        avoid: '不要从膝盖处裁切。'
      },
      {
        poseId: 'pair-custom76-r01-g01',
        title: '窗边侧身相机',
        badge: '文艺窗边',
        reason: '适合咖啡馆靠窗位置，用相机或道具让手部动作更自然。',
        composition: '半身或七分身入镜，保留窗边光线和手部道具。',
        camera: '手机平视，人物侧身比正面对镜头更松弛。',
        avoid: '不要让窗户高光把脸压暗。'
      }
    ]
  },
  {
    id: 'beach-travel',
    title: '海边旅行怎么拍',
    shortTitle: '海边',
    painPoint: '海边景很大，但人一站进去就不知道怎么摆。',
    promise: '先用背影和回眸建立人景关系，再拍全身动作。',
    shareTitle: '海边想拍出片？把这 3 个姿势发给一起拍照的人',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom17-r01-g01',
    morePoseIds: [
      'pair-custom52-r01-g01',
      'pair-custom53-r01-g01',
      'pair-custom57-r01-g01',
      'pair-custom96-r01-g01',
      'pair-custom99-r01-g01',
      'pair-custom100-r01-g01',
      'pair-custom48-r01-g01',
      'pair-custom69-r01-g01',
      'pair-custom85-r01-g01',
      'pair-custom98-r01-g01',
      'pair-custom103-r01-g01',
      'pair-custom104-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom17-r01-g01',
        title: '提鞋回眸',
        badge: '海边背影',
        reason: '提鞋和回眸都贴合海边情境，不用正面硬站。',
        composition: '全身背影入镜，保留沙滩和水面。',
        camera: '手机平视，人物不要贴画面边缘。',
        avoid: '不要裁掉手里的鞋和裙角。'
      },
      {
        poseId: 'pair-custom44-r01-g01',
        title: '草帽白裙站姿',
        badge: '度假全身',
        reason: '草帽、白裙和海边背景天然匹配，适合度假照。',
        composition: '全身入镜，脚下沙滩保留一点空间。',
        camera: '手机略低，拍出长裙和腿部线条。',
        avoid: '不要俯拍全身。'
      },
      {
        poseId: 'pair-custom96-r01-g01',
        title: '海边黄昏侧身',
        badge: '日落度假',
        reason: '海边和黄昏背景匹配，适合拍度假感全身照。',
        composition: '全身或七分身入镜，保留海面和日落方向。',
        camera: '手机平视或略低，背景保持干净。',
        avoid: '不要让强逆光把脸完全压暗。'
      }
    ]
  },
  {
    id: 'street-corner',
    title: '街边路口怎么拍',
    shortTitle: '街边',
    painPoint: '路口人多背景乱，站着拍很容易像随手照。',
    promise: '用行走、道具和通勤动作，把杂乱街景变成街拍感。',
    shareTitle: '街边路口不尴尬拍法，拍照搭子照着这 3 个动作拍',
    categoryId: 'street-commute',
    coverPoseId: 'pair-custom49-r01-g01',
    morePoseIds: [
      'pair-custom40-r01-g01',
      'pair-custom62-r01-g01',
      'pair-custom87-r01-g01',
      'pair-custom15-r01-g01',
      'pair-custom34-r01-g01',
      'pair-custom54-r01-g01',
      'pair-custom61-r01-g01',
      'pair-custom63-r01-g01',
      'pair-custom67-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom49-r01-g01',
        title: '风衣拢发行走',
        badge: '通勤动态',
        reason: '行走和拢发动作适合路口、斑马线和街边墙面。',
        composition: '全身入镜，人物前方留一点行走方向。',
        camera: '手机略低，连续拍几张抓自然步伐。',
        avoid: '不要站定硬摆。'
      },
      {
        poseId: 'pair-custom46-r01-g01',
        title: '西装整理领口',
        badge: '利落街拍',
        reason: '整理领口有动作重点，适合通勤建筑和街边背景。',
        composition: '全身入镜，保留跨步和手部动作。',
        camera: '手机略低，镜头保持垂直。',
        avoid: '不要裁掉脚部跨步。'
      },
      {
        poseId: 'pair-custom50-r01-g01',
        title: '街边蹲姿互动',
        badge: '道具互动',
        reason: '蹲姿能避开路口杂乱背景，让街边照片更有动作。',
        composition: '全身或七分身入镜，保留腿部姿态和手部动作。',
        camera: '手机略低，保持人物重心稳定。',
        avoid: '不要从小腿中间裁切。'
      }
    ]
  },
  {
    id: 'park-grass',
    title: '公园草地怎么拍',
    shortTitle: '草地',
    painPoint: '草地场景容易只会站着笑，画面缺少动作。',
    promise: '用坐姿、草帽和野餐动作，把草地拍出松弛感。',
    shareTitle: '公园草地拍照姿势，照着这 3 个动作更自然显松弛',
    categoryId: 'sitting-life',
    coverPoseId: 'pair-custom47-r01-g01',
    morePoseIds: [
      'pair-custom4-r01-g01',
      'pair-custom50-r01-g01',
      'pair-custom55-r01-g01',
      'pair-custom58-r01-g01',
      'pair-custom91-r01-g01',
      'pair-custom95-r01-g01',
      'pair-custom26-r01-g01',
      'pair-custom69-r01-g01',
      'pair-custom72-r01-g01',
      'pair-custom73-r01-g01',
      'pair-custom85-r01-g01',
      'pair-custom98-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom47-r01-g01',
        title: '草地盘坐晒太阳',
        badge: '松弛坐姿',
        reason: '坐姿比站姿更适合草地，画面自然不紧张。',
        composition: '保留草地环境，人物放在画面中下部。',
        camera: '手机略高一点，拍出坐姿和周围草地。',
        avoid: '不要只拍脸，坐姿会丢失。'
      },
      {
        poseId: 'pair-custom45-r01-g01',
        title: '草帽锁骨站姿',
        badge: '自然全身',
        reason: '草帽和锁骨动作适合阳光草地，画面温柔。',
        composition: '全身入镜，保留草帽和脚部站姿。',
        camera: '手机平视或略低，人物居中。',
        avoid: '不要裁掉手里的草帽。'
      },
      {
        poseId: 'pair-custom35-r01-g01',
        title: '野餐取物',
        badge: '生活感',
        reason: '野餐动作让草地照片更有故事，不像空站。',
        composition: '保留野餐篮和手部取物动作。',
        camera: '手机略高，从侧前方拍更清楚。',
        avoid: '不要让道具堆满画面。'
      }
    ]
  },
  {
    id: 'landmark-travel',
    title: '景点打卡怎么拍',
    shortTitle: '景点打卡',
    painPoint: '到了景点只会站着比耶，背景好看但人很僵。',
    promise: '用走路、回眸和展开身体的动作，让人和景都好看。',
    shareTitle: '到了景点不知道怎么拍？先把这 3 个姿势发给搭子',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom104-r01-g01',
    morePoseIds: [
      'pair-custom13-r01-g01',
      'pair-custom14-r01-g01',
      'pair-custom15-r01-g01',
      'pair-custom33-r01-g01',
      'pair-custom60-r01-g01',
      'pair-custom16-r01-g01',
      'pair-custom26-r01-g01',
      'pair-custom29-r01-g01',
      'pair-custom59-r01-g01',
      'pair-custom61-r01-g01',
      'pair-custom63-r01-g01',
      'pair-custom93-r01-g01',
      'pair-custom96-r01-g01',
      'pair-custom100-r01-g01',
      'pair-custom102-r01-g01',
      'pair-custom105-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom104-r01-g01',
        title: '古镇展臂蹦跳',
        badge: '快乐旅行感',
        reason: '适合古镇、小巷、步道这类景点，动作比站着更有记忆点。',
        composition: '全身入镜，把路面延伸和背影动作拍完整。',
        camera: '手机平视或略低，连续拍几张抓跳起瞬间。',
        avoid: '不要裁掉展开的手臂和脚尖。'
      },
      {
        poseId: 'pair-custom97-r01-g01',
        title: '老城地图跨步',
        badge: '城市漫步',
        reason: '适合老城、古镇、旅游街区，用地图和跨步让打卡不呆板。',
        composition: '全身入镜，背景街道留出纵深。',
        camera: '手机略低，人物前方留一点行走方向。',
        avoid: '不要让地图挡住上半身动作。'
      },
      {
        poseId: 'pair-custom31-r01-g01',
        title: '庭园踮脚展臂',
        badge: '景区背影',
        reason: '适合庭园、公园、古建筑和步道，背影动作简单好复刻。',
        composition: '全身背影入镜，保留左右环境和脚下空间。',
        camera: '手机平视，给展开的手臂留足空间。',
        avoid: '不要离人物太近，景点环境要拍出来。'
      }
    ]
  },
  {
    id: 'city-building',
    title: '城市建筑怎么拍',
    shortTitle: '城市建筑',
    painPoint: '楼梯、天台和建筑很好看，但人站进去容易像证件照。',
    promise: '用扶手、倚栏和靠墙动作，把建筑线条拍出高级感。',
    shareTitle: '城市建筑这样拍更出片，照着这 3 个姿势拍全身照',
    categoryId: 'art-city',
    coverPoseId: 'pair-custom101-r01-g01',
    morePoseIds: [
      'pair-custom16-r01-g01',
      'pair-custom62-r01-g01',
      'pair-custom64-r01-g01',
      'pair-custom83-r01-g01',
      'pair-custom87-r01-g01',
      'pair-custom94-r01-g01',
      'pair-custom40-r01-g01',
      'pair-custom78-r01-g01',
      'pair-custom79-r01-g01',
      'pair-custom89-r01-g01',
      'pair-custom93-r01-g01',
      'pair-custom97-r01-g01',
      'pair-custom104-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom101-r01-g01',
        title: '楼梯扶手沉思',
        badge: '建筑楼梯',
        reason: '适合美术馆、商场、写字楼和创意园楼梯，动作明确不尴尬。',
        composition: '全身入镜，顺着楼梯线条构图。',
        camera: '手机略低，保持建筑线条端正。',
        avoid: '不要斜拍到墙线歪斜。'
      },
      {
        poseId: 'pair-custom92-r01-g01',
        title: '天台倚栏墨镜',
        badge: '城市天台',
        reason: '适合露台、观景台和城市天际线，用栏杆解决站姿问题。',
        composition: '半身或七分身入镜，保留栏杆和远处城市背景。',
        camera: '手机平视，人物侧身更显松弛。',
        avoid: '不要让栏杆横线压在脖子位置。'
      },
      {
        poseId: 'pair-custom68-r01-g01',
        title: '蓝调台阶靠墙',
        badge: '夜景氛围',
        reason: '适合夜晚台阶、建筑外墙和城市灯光，靠墙让动作更稳定。',
        composition: '全身入镜，保留台阶和灯光氛围。',
        camera: '手机略低，尽量保持人物和台阶完整。',
        avoid: '不要用强闪光破坏夜景氛围。'
      }
    ]
  }
]

const getSceneTopic = (topicId) => (
  sceneTopics.find((topic) => topic.id === topicId) || sceneTopics[0]
)

module.exports = {
  SCENE_TOPIC_DETAIL_KEY,
  sceneTopics,
  getSceneTopic
}
