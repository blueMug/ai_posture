const SCENE_TOPIC_DETAIL_KEY = 'sceneAdvisorPlanDetail'

const sceneTopics = [
  {
    id: 'cafe-window',
    title: '咖啡店怎么拍',
    shortTitle: '咖啡店',
    painPoint: '坐下后手不知道放哪，拍出来像游客照。',
    promise: '用杯子、窗边和门口动作，快速拍出生活感。',
    shareTitle: '咖啡店不知道怎么拍？照着这 3 个姿势就行',
    categoryId: 'props-action',
    coverPoseId: 'pair-custom22-r01-g01',
    plans: [
      {
        poseId: 'pair-custom22-r01-g01',
        title: '端杯撩发',
        badge: '半身生活感',
        reason: '杯子解决手部尴尬，撩发动作让半身照更自然。',
        composition: '半身入镜，保留杯子和上半身动作。',
        camera: '手机放在胸口到眼睛之间，竖拍半身。',
        avoid: '杯子不要挡住嘴和下巴。'
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
        poseId: 'pair-custom7-r01-g01',
        title: '拿咖啡行走',
        badge: '抓拍感',
        reason: '适合店外街拍，让画面像自然路过。',
        composition: '全身入镜，前方留一点行走方向。',
        camera: '手机稍微放低，连拍抓自然步伐。',
        avoid: '不要站定硬摆，保留走路动作。'
      }
    ]
  },
  {
    id: 'beach-travel',
    title: '海边旅行怎么拍',
    shortTitle: '海边',
    painPoint: '海边景很大，但人一站进去就不知道怎么摆。',
    promise: '先用背影和回眸建立人景关系，再拍全身动作。',
    shareTitle: '海边不会摆姿势？这 3 个旅行拍法很稳',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom17-r01-g01',
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
        poseId: 'pair-custom27-r01-g01',
        title: '墨镜托特包',
        badge: '夏日活力',
        reason: '配饰动作明显，适合明亮海边和度假街区。',
        composition: '全身正面入镜，保留墨镜和托特包动作。',
        camera: '手机平视或略低，背景保持干净。',
        avoid: '不要让包挡住身体轮廓。'
      }
    ]
  },
  {
    id: 'street-corner',
    title: '街边路口怎么拍',
    shortTitle: '街边',
    painPoint: '路口人多背景乱，站着拍很容易像随手照。',
    promise: '用行走、道具和通勤动作，把杂乱街景变成街拍感。',
    shareTitle: '街边路口怎么拍？这 3 个动作不尴尬',
    categoryId: 'street-commute',
    coverPoseId: 'pair-custom49-r01-g01',
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
        poseId: 'pair-custom32-r01-g01',
        title: '相机爱心街头',
        badge: '道具互动',
        reason: '相机和手势能让街头背景更有互动感。',
        composition: '全身正面入镜，保留相机和手势。',
        camera: '手机平视，背景可以占一部分画面。',
        avoid: '相机不要遮住整个脸。'
      }
    ]
  },
  {
    id: 'park-grass',
    title: '公园草地怎么拍',
    shortTitle: '草地',
    painPoint: '草地场景容易只会站着笑，画面缺少动作。',
    promise: '用坐姿、草帽和野餐动作，把草地拍出松弛感。',
    shareTitle: '公园草地拍照姿势，照着这 3 个动作更自然',
    categoryId: 'sitting-life',
    coverPoseId: 'pair-custom47-r01-g01',
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
    id: 'exhibition',
    title: '展览馆怎么拍',
    shortTitle: '展览',
    painPoint: '展览馆光线好，但拍照容易只剩背景打卡。',
    promise: '用道具、侧身和安静动作，拍出文艺感。',
    shareTitle: '展览馆怎么拍不游客？试试这 3 个姿势',
    categoryId: 'outfit-standing',
    coverPoseId: 'pair-custom41-r01-g01',
    plans: [
      {
        poseId: 'pair-custom41-r01-g01',
        title: '画笔贝雷舞姿',
        badge: '文艺动态',
        reason: '画笔和贝雷帽元素适合展览、画室和艺术空间。',
        composition: '全身入镜，保留抬手和腿部动态。',
        camera: '手机平视，给上方手部留空间。',
        avoid: '不要把高举的手裁掉。'
      },
      {
        poseId: 'pair-custom30-r01-g01',
        title: '折扇知性站姿',
        badge: '安静优雅',
        reason: '正面道具动作适合室内展馆和精致穿搭。',
        composition: '全身入镜，保留折扇和交叉站姿。',
        camera: '手机平视或略低，画面保持端正。',
        avoid: '不要裁掉脚部交叉线条。'
      },
      {
        poseId: 'pair-custom39-r01-g01',
        title: '折扇提裙',
        badge: '复古氛围',
        reason: '折扇和提裙动作适合复古展馆或室内空间。',
        composition: '全身入镜，道具和裙摆都要拍完整。',
        camera: '手机略低，突出脚尖和裙摆。',
        avoid: '不要让道具贴脸太近。'
      }
    ]
  },
  {
    id: 'mirror-selfie',
    title: '电梯镜自拍怎么拍',
    shortTitle: '镜自拍',
    painPoint: '镜自拍最容易手僵、挡脸、背景乱。',
    promise: '先处理手机位置和上半身动作，再决定露不露脸。',
    shareTitle: '电梯镜自拍不尴尬，这 3 个姿势可以照着拍',
    categoryId: 'selfie',
    coverPoseId: 'pair-custom75-r01-g01',
    plans: [
      {
        poseId: 'pair-custom75-r01-g01',
        title: '镜前半身',
        badge: '稳定自拍',
        reason: '适合电梯、试衣间和房间镜前，动作简单好复刻。',
        composition: '半身入镜，手机不要遮住全部脸。',
        camera: '手机略低于眼睛，镜子保持干净。',
        avoid: '背景杂物先移出画面。'
      },
      {
        poseId: 'pair-custom18-r01-g01',
        title: '侧身撩发',
        badge: '自然半身',
        reason: '撩发动作能缓解自拍时手不知道放哪的问题。',
        composition: '半身入镜，保留手肘形成的三角构图。',
        camera: '手机略高于眼睛，竖拍半身。',
        avoid: '不要把手肘裁得太紧。'
      },
      {
        poseId: 'pair-custom23-r01-g01',
        title: '胸上近景',
        badge: '头像感',
        reason: '适合只想拍脸和肩颈，不想露出全身环境。',
        composition: '胸上紧凑构图，保留肩膀和脸部光线。',
        camera: '手机略高于眼睛，避免脸部变形。',
        avoid: '不要让屏幕反光挡住表情。'
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
