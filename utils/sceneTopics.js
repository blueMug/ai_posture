const SCENE_TOPIC_DETAIL_KEY = 'sceneAdvisorPlanDetail'
const LANDMARK_TOPIC_IDS = new Set([
  'changsha-orange-island',
  'imported-changcheng1',
  'imported-gulou',
  'imported-heshun',
  'imported-mangshi',
  'imported-rehai',
  'imported-tengchong',
  'imported-tiananmen',
  'imported-tiandan',
  'imported-xihu',
  'imported-yinta',
  'shanghai-bund',
  'tobecheck-greece-coast',
  'tobecheck-jeju-seaside',
  'tobecheck-shanghai-landmarks',
  'tobecheck-xinjiang-grassland'
])

const isLandmarkTopic = (topicId = '') => LANDMARK_TOPIC_IDS.has(topicId)

const makeScenePlan = (poseId, title, badge, reason, composition, camera, avoid) => ({
  poseId,
  title,
  badge,
  reason,
  composition,
  camera,
  avoid
})

const sceneTopics = [
  {
    id: "imported-huahai",
    title: "花海花田怎么拍",
    shortTitle: "花海花田",
    painPoint: "花海、花田和花园场景容易只拍成游客站照，人物和花丛关系不够明确。",
    promise: "用伸展、回眸、嗅花、递花和花园互动，让花海照片更有动作变化。",
    shareTitle: "花海花田拍照作业：花海、花园和花丛照着这些姿势拍",
    categoryId: "park-garden",
    coverPoseId: "pair-custom704-r01-g01",
    morePoseIds: [
      "pair-custom704-r01-g01",
      "pair-custom691-r01-g01",
      "pair-custom692-r01-g01",
      "pair-custom693-r01-g01",
      "pair-custom694-r01-g01",
      "pair-custom695-r01-g01",
      "pair-custom696-r01-g01",
      "pair-custom697-r01-g01",
      "pair-custom698-r01-g01",
      "pair-custom699-r01-g01",
      "pair-custom705-r01-g01",
      "pair-custom706-r01-g01",
      "pair-custom707-r01-g01",
      "pair-custom708-r01-g01",
      "pair-custom709-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom704-r01-g01",
        "花前轻嗅",
        "半身",
        "把花束抬到鼻尖附近，肩膀自然下沉，视线越过花瓣看向镜头。",
        "人物上半身靠近花丛或小径边，让花束放在脸侧形成清新浪漫焦点。",
        "手机平视半身拍，保留花束、脸部和肩颈线条，不要压得太近。",
        "不要让花完全挡住脸，也不要把手肘撑得太开。"
      ),
      makeScenePlan(
        "pair-custom691-r01-g01",
        "拥抱整片花海",
        "背影",
        "背对镜头张开双臂，让身体动作和花海范围一起打开。",
        "人物放在花丛中间或略偏一侧，手臂展开，保留大片花海和天空。",
        "手机平视或略低竖拍，把花海延展方向和人物背影一起拍完整。",
        "不要裁掉手臂，也不要让人物站得太靠边。"
      ),
      makeScenePlan(
        "pair-custom692-r01-g01",
        "花间回眸",
        "半身",
        "站在花丛旁侧身回头，既能露脸又能交代花海环境。",
        "人物上半身靠近花丛，肩膀侧开，花朵作为前景或侧边背景。",
        "手机平视半身拍，留出花丛层次，不要只拍成大头照。",
        "不要让花遮住整张脸，回头幅度也不要太僵。"
      )
    ]
  },
  {
    id: "old-town-street",
    title: "古镇街巷怎么拍",
    shortTitle: "古镇街巷",
    painPoint: "古镇老街、石板巷和木门庭院容易只拍成站立打卡照，人物和街巷关系不够明确。",
    promise: "用石巷奔跑、回眸撩发、茶舍探身和门框倚靠，把古镇里的行走感和故事感拍出来。",
    shareTitle: "古镇街巷拍照作业：老街小巷照着这些姿势拍",
    categoryId: "old-town-street",
    coverPoseId: "pair-custom340-r01-g01",
    morePoseIds: [
      "pair-custom340-r01-g01",
      "pair-custom337-r01-g01",
      "pair-custom341-r01-g01",
      "pair-custom336-r01-g01",
      "pair-custom338-r01-g01",
      "pair-custom339-r01-g01",
      "pair-custom342-r01-g01",
      "pair-custom343-r01-g01",
      "pair-custom344-r01-g01",
      "pair-custom345-r01-g01",
      "pair-custom346-r01-g01",
      "pair-custom347-r01-g01",
      "pair-custom348-r01-g01",
      "pair-custom349-r01-g01",
      "pair-custom350-r01-g01",
      "pair-custom351-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom340-r01-g01",
        "石巷提裙奔跑",
        "行走",
        "沿石板巷向镜头轻跑，双手轻提裙摆，保留脚步展开的动态。",
        "人物放在巷道中轴或略偏一侧，让石板路和墙面线条带出纵深。",
        "手机略低竖拍连拍，等裙摆和脚步同时打开时按下快门。",
        "不要把脚裁掉，也不要让背景行人压到人物轮廓。"
      ),
      makeScenePlan(
        "pair-custom337-r01-g01",
        "回眸轻撩发",
        "全身",
        "身体侧向古巷或木门，肩膀先转开，再回头看镜头并轻触头发。",
        "让木门、转角或巷口占一侧背景，人物站在另一侧留出回眸方向。",
        "手机平视拍全身，抓侧身到回头之间的瞬间，动作会更自然。",
        "不要扭腰过度，手肘也不要挡住脸。"
      ),
      makeScenePlan(
        "pair-custom341-r01-g01",
        "茶舍探身",
        "半身",
        "在茶舍招牌或临街窗口旁微微探身，一手扶包，表情像正在发现镜头。",
        "人物靠近门窗边缘，让招牌、木窗和街景形成前后层次。",
        "手机平视或略高拍半身，保留手部、包和茶舍环境信息。",
        "不要探身太用力，也不要让招牌遮住头部。"
      )
    ]
  },
  {
    id: "imported-heshun",
    title: "和顺古镇怎么拍",
    shortTitle: "和顺古镇",
    painPoint: "和顺古镇水边、庭院和石桥点位很多，动作容易拆散成多个入口不好找。",
    promise: "用水边戏水、庭院坐姿、背影望桥和石阶扶额等动作，快速拍出有古镇关系的照片。",
    shareTitle: "和顺古镇拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom384-r01-g01",
    morePoseIds: [
      "pair-custom352-r01-g01",
      "pair-custom353-r01-g01",
      "pair-custom354-r01-g01",
      "pair-custom355-r01-g01",
      "pair-custom356-r01-g01",
      "pair-custom357-r01-g01",
      "pair-custom358-r01-g01",
      "pair-custom359-r01-g01",
      "pair-custom360-r01-g01",
      "pair-custom361-r01-g01",
      "pair-custom362-r01-g01",
      "pair-custom363-r01-g01",
      "pair-custom364-r01-g01",
      "pair-custom365-r01-g01",
      "pair-custom366-r01-g01",
      "pair-custom367-r01-g01",
      "pair-custom368-r01-g01",
      "pair-custom369-r01-g01",
      "pair-custom370-r01-g01",
      "pair-custom371-r01-g01",
      "pair-custom372-r01-g01",
      "pair-custom373-r01-g01",
      "pair-custom374-r01-g01",
      "pair-custom375-r01-g01",
      "pair-custom376-r01-g01",
      "pair-custom377-r01-g01",
      "pair-custom378-r01-g01",
      "pair-custom379-r01-g01",
      "pair-custom380-r01-g01",
      "pair-custom381-r01-g01",
      "pair-custom382-r01-g01",
      "pair-custom383-r01-g01",
      "pair-custom384-r01-g01",
      "pair-custom385-r01-g01",
      "pair-custom386-r01-g01",
      "pair-custom387-r01-g01",
      "pair-custom388-r01-g01",
      "pair-custom389-r01-g01",
      "pair-custom390-r01-g01",
      "pair-custom391-r01-g01",
      "pair-custom392-r01-g01",
    ],
    plans: [
      makeScenePlan(
        "pair-custom384-r01-g01",
        "背影望桥",
        "背影",
        "人物背对镜头站在水边，身体微向石桥方向打开，别把肩膀绷直",
        "左手自然垂在身侧，右手靠近裙摆，动作要轻不要抢桥景",
        "适合古镇水巷、石桥和花丛同框的安静背影照。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom385-r01-g01",
        "临水坐望",
        "坐姿",
        "坐在石沿边缘，双腿并向一侧垂落，身体朝水面微微转开",
        "一手搭在身旁借力，另一手轻扶头发，形成松弛的侧身线",
        "适合桥边、溪畔、花木包围的小景位，营造午后发呆感。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom386-r01-g01",
        "石阶扶额",
        "全身",
        "站在石阶旁身体前倾，重心压向前脚，另一脚自然跟上",
        "右手抬到额前像遮阳，左臂顺着身体下垂，避免两手都僵硬",
        "适合石阶、门楼、古建筑入口等有高度差的位置。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-hongqiang",
    title: "红墙古建怎么拍",
    shortTitle: "红墙古建",
    painPoint: "红墙古建现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用抬头看天空、双手合十和走路抓拍这几种动作，快速拍出有场景关系的照片。",
    shareTitle: "红墙古建拍照作业：照着这些姿势拍更自然",
    categoryId: "art-city",
    coverPoseId: "pair-custom393-r01-g01",
    morePoseIds: [
      "pair-custom393-r01-g01",
      "pair-custom394-r01-g01",
      "pair-custom395-r01-g01",
      "pair-custom396-r01-g01",
      "pair-custom397-r01-g01",
      "pair-custom398-r01-g01",
      "pair-custom399-r01-g01",
      "pair-custom400-r01-g01",
      "pair-custom401-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom393-r01-g01",
        "抬头看天空",
        "全身",
        "身体轻靠红墙侧站，头部顺着墙面方向向上看，拉长脖颈线条",
        "双手收进口袋或自然贴近身体，减少手部杂乱感",
        "适合红墙大面积留白构图，突出侧脸和脖颈线条",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom394-r01-g01",
        "双手合十",
        "全身",
        "双手合十放在胸前或下巴附近，手指并拢，动作要轻不要用力",
        "身体正面略微侧转，避免合十动作显得像证件照",
        "适合寺庙、红墙、古建旁的温柔祈愿感照片",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom395-r01-g01",
        "走路抓拍",
        "全身",
        "先沿红墙平行方向慢走，摄影师连拍抓取脚步交错瞬间",
        "前脚落地、后脚抬起时按快门，腿部线条最自然",
        "适合红墙边的街拍式动态照片，画面更自然不摆拍",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-jietou",
    title: "城市街头怎么拍",
    shortTitle: "城市街头",
    painPoint: "城市街头现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用行走扶镜、彩线回眸和斑马迈步这几种动作，快速拍出更有街拍动感的照片。",
    shareTitle: "城市街头拍照作业：照着这些姿势拍更自然",
    categoryId: "street-commute",
    coverPoseId: "pair-custom421-r01-g01",
    morePoseIds: [
      "pair-custom421-r01-g01",
      "pair-custom420-r01-g01",
      "pair-custom422-r01-g01",
      "pair-custom402-r01-g01",
      "pair-custom403-r01-g01",
      "pair-custom404-r01-g01",
      "pair-custom405-r01-g01",
      "pair-custom406-r01-g01",
      "pair-custom407-r01-g01",
      "pair-custom410-r01-g01",
      "pair-custom411-r01-g01",
      "pair-custom412-r01-g01",
      "pair-custom413-r01-g01",
      "pair-custom414-r01-g01",
      "pair-custom415-r01-g01",
      "pair-custom416-r01-g01",
      "pair-custom417-r01-g01",
      "pair-custom418-r01-g01",
      "pair-custom419-r01-g01",
      "pair-custom423-r01-g01",
      "pair-custom424-r01-g01",
      "pair-custom425-r01-g01",
      "pair-custom426-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom421-r01-g01",
        "彩线回眸",
        "背影",
        "背对镜头站在彩色斑马线中央，上半身向左肩方向大幅拧转",
        "双脚分开站稳，手机自然握在身前，视线越过肩膀看向镜头",
        "适合彩虹斑马线、涂鸦路口和地面有高饱和色块的十字路口。",
        "人物站在画面中轴，地面线条要完整收进前景。"
      ),
      makeScenePlan(
        "pair-custom420-r01-g01",
        "行走扶镜",
        "全身",
        "身体侧对镜头保持行走姿态，头部向镜头方向轻转，手指轻扶墨镜边框",
        "前脚脚跟先落地，后脚脚尖点地，保留跨步瞬间的腿部线条",
        "适合红砖墙住宅街、停有轿车的老式胡同或社区门口。",
        "机位略低，完整保留脚步和街道纵深。"
      ),
      makeScenePlan(
        "pair-custom422-r01-g01",
        "斑马迈步",
        "全身",
        "身体正面朝镜头，重心略向后倾，定格正在过马路的迈步瞬间",
        "一手自然下垂，一手抬到胸前随步伐摆动，表情放松看镜头",
        "适合斑马线、老欧式建筑和可见地标塔的都市大街口。",
        "低机位正面拍摄，让斑马线从脚下延伸到远处。"
      )
    ]
  },
  {
    id: "imported-kafei",
    title: "咖啡馆探店怎么拍",
    shortTitle: "咖啡馆探店",
    painPoint: "咖啡馆探店现场动作容易重复，坐下后手和道具不知道怎么放。",
    promise: "用托腮品饮、举杯做鬼脸、双手捧盘和窗边侧身等动作，快速拍出生活感照片。",
    shareTitle: "咖啡馆探店拍照作业：照着这些姿势拍更自然",
    categoryId: "props-action",
    coverPoseId: "pair-custom666-r01-g01",
    morePoseIds: [
      "pair-custom666-r01-g01",
      "pair-custom667-r01-g01",
      "pair-custom668-r01-g01",
      "pair-custom669-r01-g01",
      "pair-custom670-r01-g01",
      "pair-custom671-r01-g01",
      "pair-custom672-r01-g01",
      "pair-custom673-r01-g01",
      "pair-custom674-r01-g01",
      "pair-custom675-r01-g01",
      "pair-custom676-r01-g01",
      "pair-custom677-r01-g01",
      "pair-custom678-r01-g01",
      "pair-custom679-r01-g01",
      "pair-custom680-r01-g01",
      "pair-custom681-r01-g01",
      "pair-custom427-r01-g01",
      "pair-custom428-r01-g01",
      "pair-custom429-r01-g01",
      "pair-custom430-r01-g01",
      "pair-custom431-r01-g01",
      "pair-custom432-r01-g01",
      "pair-custom433-r01-g01",
      "pair-custom434-r01-g01",
      "pair-custom435-r01-g01",
      "pair-custom436-r01-g01",
      "pair-custom437-r01-g01",
      "pair-custom438-r01-g01",
      "pair-custom439-r01-g01",
      "pair-custom440-r01-g01",
      "pair-custom441-r01-g01",
      "pair-custom442-r01-g01",
      "pair-custom84-r01-g01",
      "pair-custom51-r01-g01",
      "pair-custom76-r01-g01",
      "pair-custom78-r01-g01",
      "pair-custom64-r01-g01",
      "pair-custom75-r01-g01",
      "pair-custom79-r01-g01",
      "pair-custom88-r01-g01",
      "pair-custom80-r01-g01",
      "pair-custom81-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom666-r01-g01",
        "托腮品饮",
        "半身",
        "身体微前倾，双肘自然撑在桌面上，动作安静但不僵硬。",
        "一只手托腮，另一只手轻扶饮品杯，让杯子和桌面都进入画面。",
        "手机平视或略高，视线看向镜头或微微下垂，营造慵懒感。",
        "不要裁掉手部、杯子和桌面道具。"
      ),
      makeScenePlan(
        "pair-custom427-r01-g01",
        "举杯做鬼脸",
        "半身",
        "举杯动作能解决手空问题，表情夸张一点更像探店抓拍。",
        "右手握住玻璃杯举到嘴角旁，杯身微微前倾对准镜头。",
        "手机平视拍半身，保留杯子、桌面和身后的咖啡馆环境。",
        "不要裁掉杯子，也不要让杯子挡住整张脸。"
      ),
      makeScenePlan(
        "pair-custom668-r01-g01",
        "双手捧盘",
        "全身",
        "把甜品盘作为道具端到胸前，适合咖啡馆门口或桌边展示氛围。",
        "双手自然捧起甜品盘，身体微微前倾，视线看向镜头。",
        "竖构图拍全身或七分身，露出肩线和咖啡馆背景。",
        "不要裁掉盘子、手部和脚部姿态。"
      )
    ]
  },
  {
    id: "imported-mangshi",
    title: "芒市大金塔怎么拍",
    shortTitle: "芒市大金塔",
    painPoint: "芒市大金塔现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用金墙仰望、塔前静立和佛前侧坐这几种动作，快速拍出有场景关系的照片。",
    shareTitle: "芒市大金塔拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom443-r01-g01",
    morePoseIds: [
      "pair-custom443-r01-g01",
      "pair-custom444-r01-g01",
      "pair-custom445-r01-g01",
      "pair-custom446-r01-g01",
      "pair-custom447-r01-g01",
      "pair-custom448-r01-g01",
      "pair-custom449-r01-g01",
      "pair-custom450-r01-g01",
      "pair-custom451-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom443-r01-g01",
        "金墙仰望",
        "全身",
        "身体贴近金色护墙侧站，头向塔檐方向抬起，拉长颈部线条",
        "双手轻扶腰侧或裙边，手臂贴近身体，避免遮住红色上衣",
        "适合金塔护栏、浮雕墙和阳光很足的金色建筑边。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom444-r01-g01",
        "塔前静立",
        "全身",
        "站在台阶正中偏下位置，身体侧向镜头，双手自然交叠在身前",
        "脚尖并拢或微错开，让长裙保持直线，不抢后方大金塔",
        "适合大金塔正门、长台阶和对称建筑前的到此一游照。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom445-r01-g01",
        "佛前侧坐",
        "坐姿",
        "侧坐在金色台沿前，身体朝镜头转半身，双手向后轻扶支撑",
        "一条腿自然收起，另一条顺着台沿延伸，注意裙摆铺开层次",
        "适合佛像、金色栏墙和低台阶组合的近景。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-rehai",
    title: "腾冲热海司莫拉怎么拍",
    shortTitle: "腾冲热海司莫拉",
    painPoint: "腾冲热海司莫拉现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用桥上举串拍零食、热海墙前展臂和图腾柱前踢腿这几种动作，快速拍出有场景关系的照片。",
    shareTitle: "腾冲热海司莫拉拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom452-r01-g01",
    morePoseIds: [
      "pair-custom452-r01-g01",
      "pair-custom453-r01-g01",
      "pair-custom454-r01-g01",
      "pair-custom455-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom452-r01-g01",
        "桥上举串拍零食",
        "全身",
        "左手高高举起提着草绳串食物，手臂完全伸直让食物高于头顶",
        "右手五指自然张开微微离开身体，保持站姿不呆板",
        "地热景区木桥或栈道处手持当地特色食物打卡拍摄",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom453-r01-g01",
        "热海墙前展臂",
        "全身",
        "双臂向身体两侧完全平伸张开，手掌翻转朝上呈拥抱姿态",
        "左腿直立撑重心，右腿向左前方跨出一步脚尖点地形成交叉步",
        "景区标志性文字墙或石刻前展开身体的打卡定番姿势",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom454-r01-g01",
        "图腾柱前踢腿",
        "全身",
        "右腿作支撑腿站稳，左腿向侧后方踢起脚尖绷直呈动态弧线",
        "左手自然举着奶茶杯保持在胸前高度，右手拎包垂于身侧",
        "少数民族文化陈列馆或木雕建筑前的活泼动态打卡",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-senlin",
    title: "森林树林怎么拍",
    shortTitle: "森林树林",
    painPoint: "森林、果园和花树枝头都容易背景杂乱，站着拍不容易突出人物和枝叶关系。",
    promise: "用花间凝望、摘果互动、枝头仰望和倒木捧花，把林间照片拍得更自然。",
    shareTitle: "森林树林拍照作业：枝叶、花树、果园和树桩都能拍",
    categoryId: "travel-back",
    coverPoseId: "pair-custom456-r01-g01",
    morePoseIds: [
      "pair-custom220-r01-g01",
      "pair-custom221-r01-g01",
      "pair-custom222-r01-g01",
      "pair-custom223-r01-g01",
      "pair-custom224-r01-g01",
      "pair-custom225-r01-g01",
      "pair-custom252-r01-g01",
      "pair-custom253-r01-g01",
      "pair-custom254-r01-g01",
      "pair-custom255-r01-g01",
      "pair-custom256-r01-g01",
      "pair-custom257-r01-g01",
      "pair-custom258-r01-g01",
      "pair-custom259-r01-g01",
      "pair-custom260-r01-g01",
      "pair-custom261-r01-g01",
      "pair-custom262-r01-g01",
      "pair-custom263-r01-g01",
      "pair-custom264-r01-g01",
      "pair-custom456-r01-g01",
      "pair-custom457-r01-g01",
      "pair-custom458-r01-g01",
      "pair-custom459-r01-g01",
      "pair-custom460-r01-g01",
      "pair-custom461-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom456-r01-g01",
        "花间凝望",
        "蹲姿",
        "侧身蹲坐在雏菊花丛中，身体朝向画面左侧形成侧颜轮廓",
        "双手十指交叉合拢抬至下巴正前方，指尖轻触唇下营造沉思感",
        "适合林间雏菊花丛或低矮野花地带，利用花朵做前景虚化框住半身",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom457-r01-g01",
        "倒木捧花",
        "坐姿",
        "坐在横倒的粗树干上，臀部靠近树干中段，双脚自然垂下踩地",
        "双手在腿上捧住白色百合花束，花朵朝向镜头方向",
        "适合森林中横倒的树干或粗木桩，利用原木纹理做天然坐椅",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom458-r01-g01",
        "举果俏皮",
        "坐姿",
        "盘腿坐在林间草地上，裙摆铺散在地面形成圆形轮廓",
        "右手举起半切番石榴贴近右脸颊，手臂弯曲呈直角",
        "适合林间空地或草坪，背景选择阳光穿透树冠的逆光位置",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-tengchong",
    title: "腾冲火山热气球怎么拍",
    shortTitle: "腾冲火山热气球",
    painPoint: "腾冲火山热气球现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用抱膝望镜、扶栏回眸和夹花托腮这几种动作，快速拍出有场景关系的照片。",
    shareTitle: "腾冲火山热气球拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom471-r01-g01",
    morePoseIds: [
      "pair-custom471-r01-g01",
      "pair-custom472-r01-g01",
      "pair-custom473-r01-g01",
      "pair-custom474-r01-g01",
      "pair-custom475-r01-g01",
      "pair-custom476-r01-g01",
      "pair-custom477-r01-g01",
      "pair-custom478-r01-g01",
      "pair-custom479-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom471-r01-g01",
        "抱膝望镜",
        "坐姿",
        "整个身体正侧对镜头坐在石墙上，双腿并膝屈起脚踩墙面",
        "双臂环抱在屈起的双膝前方，手掌自然叠放贴在小腿上",
        "适合正对腾冲热海气球群的观景石墙一侧，让背景群山和多只彩色气球平铺在画面左半边",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom472-r01-g01",
        "扶栏回眸",
        "背影",
        "整个身体背对镜头站立，左手扶在木栏杆立柱上做支点",
        "重心压在后腿上前腿脚尖点地，臀线自然翘出",
        "适合观景台带木栏杆的角落，让斜切的栏杆做前景引导线",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom473-r01-g01",
        "夹花托腮",
        "坐姿",
        "盘腿坐在石墙上正面朝镜头，双腿盘成小三角",
        "右手举到右脸颊做托腮，虎口夹住一朵小雏菊贴在颧骨上",
        "适合石墙加低机位仰拍，让人物略微俯视镜头看起来腿更长",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-tiananmen",
    title: "天安门怎么拍",
    shortTitle: "天安门",
    painPoint: "天安门现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用手持红旗微微侧身、微微歪头双手环抱和举起红旗眼看红旗这几种动作，快速拍出有场景关系的照片。",
    shareTitle: "天安门拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom480-r01-g01",
    morePoseIds: [
      "pair-custom480-r01-g01",
      "pair-custom481-r01-g01",
      "pair-custom482-r01-g01",
      "pair-custom483-r01-g01",
      "pair-custom484-r01-g01",
      "pair-custom485-r01-g01",
      "pair-custom486-r01-g01",
      "pair-custom487-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom480-r01-g01",
        "手持红旗微微侧身",
        "半身",
        "身体斜向站立，肩膀不要完全正对镜头，红旗放在身体外侧形成延展线",
        "拿旗的手臂自然弯曲，旗面略高于腰线，避免挡住脸和上半身",
        "适合天安门广场红旗打卡，突出纪念感和轻盈侧身线条",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom481-r01-g01",
        "微微歪头双手环抱",
        "全身",
        "双臂环抱时手肘不要夹太紧，留出肩颈和手臂轮廓",
        "头部轻轻向一侧倾斜，下巴微收，避免脸部仰得过高",
        "适合红墙或广场前的安静站姿照，表达乖巧、端正的纪念氛围",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom482-r01-g01",
        "举起红旗眼看红旗",
        "全身",
        "举旗手臂向斜上方伸展，手腕放松，让旗面自然展开",
        "脸部和视线跟随红旗方向，不必看镜头，营造互动感",
        "适合表现和红旗互动的动态画面，画面更有仪式感",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-tiandan",
    title: "天坛怎么拍",
    shortTitle: "天坛",
    painPoint: "天坛现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用侧身回望、展臂仰头和合掌祈福，把人物动作与祈年殿的中轴和仪式感拍清楚。",
    shareTitle: "天坛拍照作业：照着这些姿势拍更自然",
    categoryId: "art-city",
    coverPoseId: "pair-custom1538-r01-g01",
    morePoseIds: [
      "pair-custom488-r01-g01",
      "pair-custom489-r01-g01",
      "pair-custom490-r01-g01",
      "pair-custom491-r01-g01",
      "pair-custom492-r01-g01",
      "pair-custom493-r01-g01",
      "pair-custom494-r01-g01",
      "pair-custom495-r01-g01",
      "pair-custom496-r01-g01",
      "pair-custom497-r01-g01",
      "pair-custom498-r01-g01",
      "pair-custom499-r01-g01",
      "pair-custom500-r01-g01",
      "pair-custom501-r01-g01",
      "pair-custom502-r01-g01",
      "pair-custom503-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom1538-r01-g01",
        "侧身回望",
        "半身",
        "身体转成侧面，再从肩膀带动头部回望镜头，下巴微收并自然微笑。",
        "把祈年殿放在画面正中，人物站在中轴稍偏一侧，保留屋檐左右对称。",
        "手机平视拍半身或七分身，让脸部、肩背线和祈年殿同时清楚。",
        "不要只扭脖子不转肩，也不要让人物完全挡住祈年殿。"
      ),
      makeScenePlan(
        "pair-custom1530-r01-g01",
        "展臂仰头",
        "全身",
        "站稳后双臂向左右充分展开，手掌放松，下巴抬起并顺势闭眼。",
        "人物站在金色宝顶正下方，让展开的手臂和祈年殿中轴形成稳定构图。",
        "手机略低竖拍全身，完整保留双手、衣摆和祈年殿顶部。",
        "不要只展开一半手臂，也不要裁掉手指或建筑宝顶。"
      ),
      makeScenePlan(
        "pair-custom1531-r01-g01",
        "合掌祈福",
        "半身",
        "身体侧向祈年殿，双掌在胸前贴合，指尖抬到下巴附近，闭眼放松。",
        "祈年殿与石栏保留在人物身后，用侧身站位避开台阶人流。",
        "手机平视拍半身，保留合掌手势、侧脸和完整建筑轮廓。",
        "不要耸肩或把手掌贴到脸上，也不要让背景人群穿过头部。"
      )
    ]
  },
  {
    id: "imported-xihu",
    title: "杭州西湖怎么拍",
    shortTitle: "杭州西湖",
    painPoint: "杭州西湖现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用背影举机拍湖、长椅张臂欢呼和侧身微倾浅笑这几种动作，快速拍出有场景关系的照片。",
    shareTitle: "杭州西湖拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom504-r01-g01",
    morePoseIds: [
      "pair-custom504-r01-g01",
      "pair-custom505-r01-g01",
      "pair-custom506-r01-g01",
      "pair-custom507-r01-g01",
      "pair-custom508-r01-g01",
      "pair-custom509-r01-g01",
      "pair-custom510-r01-g01",
      "pair-custom511-r01-g01",
      "pair-custom512-r01-g01",
      "pair-custom513-r01-g01",
      "pair-custom514-r01-g01",
      "pair-custom515-r01-g01",
      "pair-custom516-r01-g01",
      "pair-custom517-r01-g01",
      "pair-custom518-r01-g01",
      "pair-custom519-r01-g01",
      "pair-custom520-r01-g01",
      "pair-custom521-r01-g01",
      "pair-custom522-r01-g01",
      "pair-custom523-r01-g01",
      "pair-custom524-r01-g01",
      "pair-custom525-r01-g01",
      "pair-custom526-r01-g01",
      "pair-custom527-r01-g01",
      "pair-custom528-r01-g01",
      "pair-custom529-r01-g01",
      "pair-custom530-r01-g01",
      "pair-custom531-r01-g01",
      "pair-custom532-r01-g01",
      "pair-custom533-r01-g01",
      "pair-custom534-r01-g01",
      "pair-custom535-r01-g01",
      "pair-custom536-r01-g01",
      "pair-custom537-r01-g01",
      "pair-custom538-r01-g01",
      "pair-custom539-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom504-r01-g01",
        "背影举机拍湖",
        "背影",
        "取背影全身，人物坐在木栈道边缘（可垫脚跟或半蹲状），画面中人物只露后脑与外套背面",
        "双手一起把手机横向举到耳侧高度、镜头对准远方湖心，肘部微向外张开自然张开",
        "适合冬春交界枯枝残柳的湖边木栈道，天空色调清冷时最出氛围",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom505-r01-g01",
        "长椅张臂欢呼",
        "背影",
        "背对镜头坐在临湖木长椅上，肩背贴椅背保持挺直",
        "双臂同时高举、向左右斜上方45度打开成大V字，掌心自然朝前",
        "适合春季垂柳新绿的湖边长椅，前景抓一束下垂柳条压顶",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom506-r01-g01",
        "侧身微倾浅笑",
        "半身",
        "身体略侧站在栈道靠水一侧，上半身微微前倾10–15度指向镜头",
        "肩线放松下沉，一只肩比另一只稍低，形成非对称柔软线条",
        "适合日落金光时的湖边栈道，让侧光打在半张脸和衬衫褶皱上",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-xiyang",
    title: "海边夕阳怎么拍",
    shortTitle: "海边夕阳",
    painPoint: "海边夕阳现场动作容易重复，站着拍不容易突出场景特点。",
    promise: "用举V迎光、背手静立和举机拍日这几种动作，快速拍出有场景关系的照片。",
    shareTitle: "海边夕阳拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom540-r01-g01",
    morePoseIds: [
      "pair-custom540-r01-g01",
      "pair-custom541-r01-g01",
      "pair-custom542-r01-g01",
      "pair-custom543-r01-g01",
      "pair-custom544-r01-g01",
      "pair-custom545-r01-g01",
      "pair-custom546-r01-g01",
      "pair-custom547-r01-g01",
      "pair-custom548-r01-g01",
      "pair-custom549-r01-g01",
      "pair-custom550-r01-g01",
      "pair-custom551-r01-g01",
      "pair-custom552-r01-g01",
      "pair-custom553-r01-g01",
      "pair-custom554-r01-g01",
      "pair-custom555-r01-g01",
      "pair-custom556-r01-g01",
      "pair-custom557-r01-g01",
      "pair-custom558-r01-g01",
      "pair-custom559-r01-g01",
      "pair-custom560-r01-g01",
      "pair-custom561-r01-g01",
      "pair-custom562-r01-g01",
      "pair-custom563-r01-g01",
      "pair-custom564-r01-g01",
      "pair-custom565-r01-g01",
      "pair-custom566-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom540-r01-g01",
        "举V迎光",
        "背影",
        "背对镜头站立，重心稳落双脚，双腿自然并拢",
        "右臂由肩部向斜上方伸直，手指比出V手势指向天空右上方",
        "海边落日剪影氛围留念，凸显轻盈少女感",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom541-r01-g01",
        "背手静立",
        "背影",
        "背对镜头，双脚微微没入水中并拢站立",
        "双手在腰后自然交握，肘部微弯让肩背线条舒展",
        "适合长吊带裙/连衣裙的静谧感海边独照",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom542-r01-g01",
        "举机拍日",
        "全身",
        "身体侧对镜头，重心落在后脚，前脚微点沙面",
        "双手横向平举手机于面前，手肘架起腋下留空",
        "假装拍夕阳的抓拍生活感照片",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: "imported-yinta",
    title: "芒市银塔怎么拍",
    shortTitle: "芒市银塔",
    painPoint: "芒市银塔水边、白塔广场和拱门点位分散，分成多个入口不方便连续查看。",
    promise: "用镜畔轻坐、回眸倚塔和侧坐凝光等水镜动作，快速拍出银塔镜面氛围照片。",
    shareTitle: "芒市银塔拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom710-r01-g01",
    morePoseIds: [
      "pair-custom710-r01-g01",
      "pair-custom711-r01-g01",
      "pair-custom712-r01-g01",
      "pair-custom713-r01-g01",
      "pair-custom714-r01-g01",
      "pair-custom715-r01-g01",
      "pair-custom716-r01-g01",
      "pair-custom717-r01-g01",
      "pair-custom718-r01-g01",
      "pair-custom611-r01-g01",
      "pair-custom462-r01-g01",
      "pair-custom463-r01-g01",
      "pair-custom464-r01-g01",
      "pair-custom465-r01-g01",
      "pair-custom466-r01-g01",
      "pair-custom467-r01-g01",
      "pair-custom468-r01-g01",
      "pair-custom469-r01-g01",
      "pair-custom470-r01-g01",
      "pair-custom567-r01-g01",
      "pair-custom568-r01-g01",
      "pair-custom569-r01-g01",
      "pair-custom570-r01-g01",
      "pair-custom571-r01-g01",
      "pair-custom572-r01-g01",
      "pair-custom573-r01-g01",
      "pair-custom574-r01-g01",
      "pair-custom575-r01-g01",
      "pair-custom576-r01-g01",
      "pair-custom577-r01-g01",
      "pair-custom578-r01-g01",
      "pair-custom579-r01-g01",
      "pair-custom580-r01-g01",
      "pair-custom581-r01-g01",
      "pair-custom582-r01-g01",
      "pair-custom583-r01-g01",
      "pair-custom584-r01-g01",
      "pair-custom585-r01-g01",
      "pair-custom586-r01-g01",
      "pair-custom587-r01-g01",
      "pair-custom588-r01-g01",
      "pair-custom589-r01-g01",
      "pair-custom590-r01-g01",
      "pair-custom591-r01-g01",
      "pair-custom592-r01-g01",
      "pair-custom593-r01-g01",
      "pair-custom594-r01-g01",
      "pair-custom595-r01-g01",
      "pair-custom596-r01-g01",
      "pair-custom597-r01-g01",
      "pair-custom598-r01-g01",
      "pair-custom599-r01-g01",
      "pair-custom600-r01-g01",
      "pair-custom601-r01-g01",
      "pair-custom602-r01-g01",
      "pair-custom603-r01-g01",
      "pair-custom604-r01-g01",
      "pair-custom605-r01-g01",
      "pair-custom606-r01-g01",
      "pair-custom607-r01-g01",
      "pair-custom608-r01-g01",
      "pair-custom609-r01-g01",
      "pair-custom610-r01-g01",
      "pair-custom612-r01-g01",
      "pair-custom613-r01-g01",
      "pair-custom614-r01-g01",
      "pair-custom615-r01-g01",
      "pair-custom616-r01-g01",
      "pair-custom617-r01-g01",
      "pair-custom618-r01-g01",
      "pair-custom619-r01-g01",
      "pair-custom620-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom710-r01-g01",
        "镜畔轻坐",
        "坐姿",
        "低机位贴近镜面水面，人物屈膝侧坐，后手撑地稳定身体",
        "肩线放松，脸微微转向镜头，让银白服饰和白塔色调呼应",
        "适合银塔近景、水镜倒影和蓝天强对比画面。",
        "机位尽量贴近水面，保留人物、银塔和倒影的三层关系。"
      ),
      makeScenePlan(
        "pair-custom711-r01-g01",
        "回眸倚塔",
        "坐姿",
        "人物放在画面右侧，双腿交叠坐稳，一只手撑地形成支点",
        "下颌微抬，视线越过镜头，让塔身细节和水面层次一起入画",
        "适合银塔塔身细节丰富的中近景和午后侧光。",
        "构图保留塔身边线，不要让人物压住建筑主体。"
      ),
      makeScenePlan(
        "pair-custom712-r01-g01",
        "侧坐凝光",
        "坐姿",
        "侧身落座，背部挺直，前腿屈起，后腿自然收拢",
        "用塔身中轴稳定构图，手部自然落在膝前，整体动作安静克制",
        "适合水镜、白塔和银白服饰统一的东方写真画面。",
        "画面保持干净留白，避免裁掉裙摆和水面倒影。"
      )
    ]
  },
  {
    id: "imported-yinxing1",
    title: "银杏秋叶公园怎么拍",
    shortTitle: "银杏秋叶",
    painPoint: "银杏和秋叶公园现场动作容易重复，站着拍不容易突出金黄落叶和林间纵深。",
    promise: "用叶海捧花、围巾回眸、林下侧立和手持秋叶等动作，快速拍出秋日氛围照片。",
    shareTitle: "银杏秋叶公园拍照作业：照着这些姿势拍更自然",
    categoryId: "travel-back",
    coverPoseId: "pair-custom621-r01-g01",
    morePoseIds: [
      "pair-custom621-r01-g01",
      "pair-custom622-r01-g01",
      "pair-custom623-r01-g01",
      "pair-custom624-r01-g01",
      "pair-custom625-r01-g01",
      "pair-custom626-r01-g01",
      "pair-custom627-r01-g01",
      "pair-custom628-r01-g01",
      "pair-custom629-r01-g01",
      "pair-custom630-r01-g01",
      "pair-custom631-r01-g01",
      "pair-custom632-r01-g01",
      "pair-custom633-r01-g01",
      "pair-custom634-r01-g01",
      "pair-custom635-r01-g01",
      "pair-custom636-r01-g01",
      "pair-custom637-r01-g01",
      "pair-custom638-r01-g01",
      "pair-custom639-r01-g01",
      "pair-custom640-r01-g01",
      "pair-custom641-r01-g01",
      "pair-custom642-r01-g01",
      "pair-custom643-r01-g01",
      "pair-custom644-r01-g01",
      "pair-custom645-r01-g01",
      "pair-custom646-r01-g01",
      "pair-custom647-r01-g01",
      "pair-custom648-r01-g01",
      "pair-custom649-r01-g01",
      "pair-custom650-r01-g01",
      "pair-custom651-r01-g01",
      "pair-custom652-r01-g01",
      "pair-custom653-r01-g01",
      "pair-custom654-r01-g01",
      "pair-custom655-r01-g01",
      "pair-custom656-r01-g01",
      "pair-custom657-r01-g01",
      "pair-custom658-r01-g01",
      "pair-custom659-r01-g01",
      "pair-custom660-r01-g01",
      "pair-custom661-r01-g01",
      "pair-custom662-r01-g01",
      "pair-custom663-r01-g01",
      "pair-custom664-r01-g01",
      "pair-custom665-r01-g01"
    ],
    plans: [
      makeScenePlan(
        "pair-custom621-r01-g01",
        "叶海捧花",
        "蹲姿",
        "蹲坐或低身靠近落叶地面，双手捧起银杏叶放在身前",
        "头部微微侧向镜头，围巾贴近脸部，表情柔和",
        "适合银杏落叶很厚的地面、树下近景和暖色秋日人像。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom622-r01-g01",
        "围巾回眸",
        "全身",
        "侧身站在银杏树下，头部回看镜头，围巾自然垂在胸前",
        "双手轻扶围巾或衣襟，肩膀放松，不要挡住脸",
        "适合银杏大道、逆光树荫和半身到七分身构图。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      ),
      makeScenePlan(
        "pair-custom623-r01-g01",
        "林下侧立",
        "全身",
        "站在银杏林中身体侧向镜头，一手扶围巾，一手自然垂下",
        "头部轻轻回看，身体保持竖直，腿部不要站成一条线",
        "适合银杏路、树林纵深和阳光穿过树叶的场景。",
        "不要裁掉手脚和关键道具，背景也不要压过人物。"
      )
    ]
  },
  {
    id: 'imported-changcheng1',
    title: '长城怎么拍',
    shortTitle: '长城',
    painPoint: '长城墙体高、游客多，只站在城墙边容易拍成普通到此一游。',
    promise: '用垛口欢呼、伸手邀请、城道坐姿和城垛回望，把城墙线条和人物动作一起拍出来。',
    shareTitle: '长城拍照作业：城墙、城垛和烽火台这样拍更有气势',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom309-r01-g01',
    morePoseIds: [
      'pair-custom293-r01-g01',
      'pair-custom294-r01-g01',
      'pair-custom295-r01-g01',
      'pair-custom296-r01-g01',
      'pair-custom297-r01-g01',
      'pair-custom298-r01-g01',
      'pair-custom299-r01-g01',
      'pair-custom300-r01-g01',
      'pair-custom301-r01-g01',
      'pair-custom302-r01-g01',
      'pair-custom303-r01-g01',
      'pair-custom304-r01-g01',
      'pair-custom305-r01-g01',
      'pair-custom306-r01-g01',
      'pair-custom307-r01-g01',
      'pair-custom308-r01-g01',
      'pair-custom309-r01-g01',
      'pair-custom310-r01-g01',
      'pair-custom311-r01-g01',
      'pair-custom312-r01-g01',
      'pair-custom313-r01-g01',
      'pair-custom314-r01-g01',
      'pair-custom315-r01-g01',
      'pair-custom316-r01-g01',
      'pair-custom317-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom309-r01-g01',
        '城墙前伸手邀请',
        '全身互动',
        '站在长城步道上向镜头伸手，像邀请拍摄者一起往前走。',
        '人物全身入镜，伸出的手形成前景，身后的城墙和山线保留完整。',
        '手机略低或平视，顺着城墙延伸方向拍出纵深。',
        '不要裁掉伸出的手和脚部，城墙线条也不要拍歪。'
      ),
      makeScenePlan(
        'pair-custom310-r01-g01',
        '城道坐地伸腿',
        '坐姿线条',
        '坐在城道地面上能压低重心，伸腿动作顺着砖路拉长线条。',
        '身体微微后撑，双腿向前伸展，脚部和城墙两侧都保留。',
        '手机略低从侧前方拍，利用地砖和墙体做透视。',
        '不要从膝盖或脚踝裁切，坐姿支撑手也要入镜。'
      ),
      makeScenePlan(
        'pair-custom317-r01-g01',
        '城垛侧倚回望',
        '地标回眸',
        '借城垛支撑身体，侧倚回望比正面站立更松弛，也能交代长城环境。',
        '人物靠在城垛旁侧身回看，右侧留出远处长城和天空。',
        '手机平视或略低，沿墙体方向构图，人物不要贴边。',
        '不要让城垛挡住脸，也不要把远景全部裁掉。'
      )
    ]
  },
  {
    id: 'imported-gulou',
    title: '北京鼓楼怎么拍',
    shortTitle: '北京鼓楼',
    painPoint: '鼓楼红墙、路牌和街巷元素多，只站着拍容易背景抢人。',
    promise: '用指牌、远指楼檐和红墙回身，把鼓楼地标和街巷氛围一起拍清楚。',
    shareTitle: '北京鼓楼拍照作业：红墙、路牌和楼檐这样拍更有地点感',
    categoryId: 'art-city',
    coverPoseId: 'pair-custom327-r01-g01',
    morePoseIds: [
      'pair-custom327-r01-g01',
      'pair-custom328-r01-g01',
      'pair-custom329-r01-g01',
      'pair-custom330-r01-g01',
      'pair-custom331-r01-g01',
      'pair-custom332-r01-g01',
      'pair-custom333-r01-g01',
      'pair-custom334-r01-g01',
      'pair-custom335-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom327-r01-g01',
        '举手指牌',
        '地标全身',
        '抬手指向路牌能直接交代地点，另一只手拿道具让动作更自然。',
        '人物站在路牌下方全身入镜，路牌放在画面上方，鼓楼背景保持完整。',
        '手机平视或略低，先对齐路牌和人物，再保留街道纵深。',
        '不要裁掉路牌和手臂，也不要让人物完全挡住鼓楼。'
      ),
      makeScenePlan(
        'pair-custom328-r01-g01',
        '远指楼檐',
        '红墙全身',
        '指向楼檐能把人物动作和古建背景连起来，比单纯靠墙更有方向。',
        '人物侧身站在红墙前，一手指向檐角，另一手扶帽或轻靠头部。',
        '手机略低竖拍，保留红墙、灰瓦和人物全身比例。',
        '不要把手指方向裁掉，建筑线条也不要明显倾斜。'
      ),
      makeScenePlan(
        'pair-custom333-r01-g01',
        '红墙回身',
        '街巷回眸',
        '沿红墙行走再回头，能拍出胡同街巷里的停留感。',
        '身体斜向前方，头部回望镜头，双手抱住糖葫芦或小道具放在身前。',
        '顺着红墙线条平视拍，给人物前方和街巷方向留空间。',
        '不要贴墙太近，回眸时肩颈不要缩起来。'
      )
    ]
  },
  {
    id: 'changsha-orange-island',
    title: '长沙橘子洲头怎么拍',
    shortTitle: '橘子洲头',
    painPoint: '雕塑前人多背景大，只站着合影容易像普通游客照。',
    promise: '用背影比心、红帽侧望和夕阳抱臂，把雕塑打卡拍得更有互动感。',
    shareTitle: '长沙橘子洲头拍照作业：青年毛泽东雕塑前照着这些姿势拍',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom184-r01-g01',
    morePoseIds: [
      'pair-custom132-r01-g01',
      'pair-custom133-r01-g01',
      'pair-custom134-r01-g01',
      'pair-custom135-r01-g01',
      'pair-custom176-r01-g01',
      'pair-custom177-r01-g01',
      'pair-custom178-r01-g01',
      'pair-custom179-r01-g01',
      'pair-custom180-r01-g01',
      'pair-custom181-r01-g01',
      'pair-custom182-r01-g01',
      'pair-custom183-r01-g01',
      'pair-custom184-r01-g01',
      'pair-custom185-r01-g01',
      'pair-custom186-r01-g01',
      'pair-custom187-r01-g01',
      'pair-custom188-r01-g01',
      'pair-custom189-r01-g01',
      'pair-custom190-r01-g01',
      'pair-custom191-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom184-r01-g01',
        title: '侧后方比爱心',
        badge: '背影互动',
        reason: '双手比心直接和雕塑产生关系，比普通到此一游更有记忆点。',
        composition: '背对雕塑微侧身，双手举到雕塑脸部前方，比心和雕塑同时入镜。',
        camera: '手机略低拍，保留草地前景和雕塑头部，人物不要贴画面边缘。',
        avoid: '比心不要偏离雕塑脸部，手臂和头部都不要被裁掉。'
      },
      {
        poseId: 'pair-custom185-r01-g01',
        title: '红帽插兜侧望',
        badge: '全身侧望',
        reason: '红帽提供亮色记忆点，插兜和侧望能避开直视镜头的尴尬。',
        composition: '人物全身入镜，身体侧向雕塑方向，草地和花海作为前景层次。',
        camera: '手机平视或略低，留出雕塑和天空空间，保证帽子和脚部完整。',
        avoid: '不要把脚裁掉，也不要让红帽和雕塑重叠太乱。'
      },
      {
        poseId: 'pair-custom186-r01-g01',
        title: '夕阳抱臂站立',
        badge: '逆光半身',
        reason: '夕阳侧逆光和抱臂动作能拍出更稳的气场，适合亮色穿搭。',
        composition: '半身或大半身入镜，双臂交叉抱胸，夕阳和天空作为背景。',
        camera: '手机平视，稍微压暗背景保住夕阳层次，脸部不要完全黑掉。',
        avoid: '抱臂不要耸肩，夕阳也不要被头部完全挡住。'
      }
    ]
  },
  {
    id: 'shanghai-bund',
    title: '上海外滩怎么拍',
    shortTitle: '上海外滩',
    painPoint: '外滩人多、建筑高，普通正面合影容易背景乱、动作僵。',
    promise: '用托塔、扶栏、回眸和塔下蹲拍，把东方明珠和江景拍进动作里。',
    shareTitle: '上海外滩拍照作业：东方明珠和江景这样拍更有互动感',
    categoryId: 'art-city',
    coverPoseId: 'pair-custom151-r01-g01',
    morePoseIds: [
      'pair-custom151-r01-g01',
      'pair-custom152-r01-g01',
      'pair-custom153-r01-g01',
      'pair-custom154-r01-g01',
      'pair-custom155-r01-g01',
      'pair-custom156-r01-g01',
      'pair-custom157-r01-g01',
      'pair-custom158-r01-g01',
      'pair-custom159-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom151-r01-g01',
        '街头托塔',
        '地标互动',
        '手掌托住东方明珠，能把地标变成动作的一部分。',
        '人物半身入镜，手掌放到塔身下方，背景保留完整塔体。',
        '手机略低，边看屏幕边微调手掌和塔的位置。',
        '手掌不要离塔太远，否则互动关系会断。'
      ),
      makeScenePlan(
        'pair-custom154-r01-g01',
        '扶栏拨发',
        '江景半身',
        '栏杆给手部动作落点，拨发能让夜景人像更自然。',
        '人物靠近栏杆，侧身拨发，江面和灯光作为背景。',
        '手机平视，从侧前方拍，保留栏杆线条。',
        '不要让栏杆横线切到脸部。'
      ),
      makeScenePlan(
        'pair-custom158-r01-g01',
        '背影走塔',
        '城市背影',
        '背影走向地标比原地站立更有旅行故事感。',
        '人物背影全身入镜，路面、栏杆和东方明珠形成纵深。',
        '手机略低连拍，抓迈步自然的一张。',
        '不要把脚裁掉，塔也不要只剩半截。'
      )
    ]
  },
  {
    id: 'imported-caodi',
    title: '公园草地怎么拍',
    shortTitle: '公园草地',
    painPoint: '草地场景看起来选择多，但坐下容易塌、站着容易空，手和腿不知道怎么摆。',
    promise: '用俯身看书、树旁回眸和抱膝微笑，把草地照片拍出文艺午后和松弛生活感。',
    shareTitle: '公园草地拍照作业：坐姿、躺姿、野餐和行走动作照着拍',
    categoryId: 'sitting-life',
    coverPoseId: 'pair-custom274-r01-g01',
    morePoseIds: [
      'pair-custom274-r01-g01',
      'pair-custom275-r01-g01',
      'pair-custom276-r01-g01',
      'pair-custom35-r01-g01',
      'pair-custom45-r01-g01',
      'pair-custom47-r01-g01',
      'pair-custom50-r01-g01',
      'pair-custom55-r01-g01',
      'pair-custom58-r01-g01',
      'pair-custom74-r01-g01',
      'pair-custom95-r01-g01',
      'pair-custom118-r01-g01',
      'pair-custom125-r01-g01',
      'pair-custom261-r01-g01',
      'pair-custom262-r01-g01',
      'pair-custom263-r01-g01',
      'pair-custom264-r01-g01',
      'pair-custom265-r01-g01',
      'pair-custom266-r01-g01',
      'pair-custom267-r01-g01',
      'pair-custom268-r01-g01',
      'pair-custom269-r01-g01',
      'pair-custom270-r01-g01',
      'pair-custom271-r01-g01',
      'pair-custom272-r01-g01',
      'pair-custom273-r01-g01',
      'pair-custom277-r01-g01',
      'pair-custom278-r01-g01',
      'pair-custom279-r01-g01',
      'pair-custom280-r01-g01',
      'pair-custom281-r01-g01',
      'pair-custom282-r01-g01',
      'pair-custom283-r01-g01',
      'pair-custom284-r01-g01',
      'pair-custom285-r01-g01',
      'pair-custom286-r01-g01',
      'pair-custom287-r01-g01',
      'pair-custom288-r01-g01',
      'pair-custom289-r01-g01',
      'pair-custom290-r01-g01',
      'pair-custom291-r01-g01',
      'pair-custom292-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom274-r01-g01',
        '俯身看书',
        '草地趴姿',
        '身体俯趴在草地上，手肘稳定支撑上半身，书本放在身前。',
        '小腿向后弯起、脚尖轻轻上翘，视线看向镜头，动作要轻松不要塌肩。',
        '贴近草坪的低机位能突出悠闲午后感和书本互动。',
        '不要裁掉书本、脚尖和手肘支撑点。'
      ),
      makeScenePlan(
        'pair-custom275-r01-g01',
        '树旁回眸',
        '草地全身',
        '身体贴近树干侧站，肩线微微转开，单肩背包自然下垂。',
        '回头看向镜头微笑，手臂放松，裙摆和发丝保持轻盈。',
        '竖构图保留树干、草坪和人物全身层次。',
        '不要让树干遮住身体，也不要裁掉脚部。'
      ),
      makeScenePlan(
        'pair-custom276-r01-g01',
        '抱膝微笑',
        '草地坐姿',
        '坐在草地上收紧双腿，让膝盖靠近身体，双手托住下巴。',
        '手肘落在膝上形成稳定三角形，表情放松看镜头。',
        '平视或略高机位突出表情，背景保留树荫和草地留白。',
        '不要把膝盖拍得过大，托下巴的手不要挡住整张脸。'
      )
    ]
  },
  {
    id: 'bamboo-creek',
    title: '竹林溪边怎么拍',
    shortTitle: '竹林溪边',
    painPoint: '竹林和溪水颜色接近，站着拍容易没有动作重点。',
    promise: '用遮光、坐姿伸展、蓝伞和瀑布抓拍，把绿色场景拍得更有层次。',
    shareTitle: '竹林溪边拍照作业：照着这些姿势拍出清透旅行感',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom142-r01-g01',
    morePoseIds: [
      'pair-custom136-r01-g01',
      'pair-custom137-r01-g01',
      'pair-custom138-r01-g01',
      'pair-custom139-r01-g01',
      'pair-custom140-r01-g01',
      'pair-custom141-r01-g01',
      'pair-custom142-r01-g01',
      'pair-custom143-r01-g01',
      'pair-custom144-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom142-r01-g01',
        '蓝伞侧立',
        '道具侧身',
        '蓝伞能从绿色背景里跳出来，侧身站更显线条。',
        '人物全身入镜，伞面和竹林同时保留，身体微侧。',
        '手机平视或略低，避开伞面挡脸。',
        '不要把伞裁掉，也不要让伞完全压住肩颈。'
      ),
      makeScenePlan(
        'pair-custom136-r01-g01',
        '仰头遮光',
        '清透半身',
        '抬手遮光能解决手部空着的问题，也能和林间光线呼应。',
        '人物半身入镜，一手抬到额前，脸部微仰。',
        '手机平视，利用树影做前景层次。',
        '手不要压住眼睛，脸部不要被阴影盖住。'
      ),
      makeScenePlan(
        'pair-custom141-r01-g01',
        '瀑旁拍照',
        '旅行抓拍',
        '拿手机拍景的动作比直站更自然，也能交代溪边瀑布环境。',
        '人物七分身入镜，手机、瀑布和身体动作都保留。',
        '从侧后方拍，保留水流方向。',
        '不要裁掉手里的手机。'
      )
    ]
  },
  {
    id: 'beach-vacation',
    title: '海边沙滩怎么拍',
    shortTitle: '海边沙滩',
    painPoint: '海边风大、背景空，动作容易重复，手和道具也不知道怎么放。',
    promise: '用踢水花、捧脸坐姿、举椰欢呼和海边回眸，把沙滩拍出清爽度假感。',
    shareTitle: '海边沙滩拍照作业：照着这些动作拍出松弛度假感',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom160-r01-g01',
    morePoseIds: [
      'pair-custom160-r01-g01',
      'pair-custom682-r01-g01',
      'pair-custom683-r01-g01',
      'pair-custom684-r01-g01',
      'pair-custom685-r01-g01',
      'pair-custom686-r01-g01',
      'pair-custom687-r01-g01',
      'pair-custom688-r01-g01',
      'pair-custom689-r01-g01',
      'pair-custom690-r01-g01',
      'pair-custom145-r01-g01',
      'pair-custom146-r01-g01',
      'pair-custom147-r01-g01',
      'pair-custom148-r01-g01',
      'pair-custom149-r01-g01',
      'pair-custom150-r01-g01',
      'pair-custom161-r01-g01',
      'pair-custom162-r01-g01',
      'pair-custom163-r01-g01',
      'pair-custom164-r01-g01',
      'pair-custom165-r01-g01',
      'pair-custom166-r01-g01',
      'pair-custom167-r01-g01',
      'pair-custom168-r01-g01',
      'pair-custom169-r01-g01',
      'pair-custom170-r01-g01',
      'pair-custom171-r01-g01',
      'pair-custom172-r01-g01',
      'pair-custom173-r01-g01',
      'pair-custom174-r01-g01',
      'pair-custom175-r01-g01',
      'pair-custom244-r01-g01',
      'pair-custom245-r01-g01',
      'pair-custom246-r01-g01',
      'pair-custom17-r01-g01',
      'pair-custom44-r01-g01',
      'pair-custom48-r01-g01',
      'pair-custom52-r01-g01',
      'pair-custom53-r01-g01',
      'pair-custom57-r01-g01',
      'pair-custom96-r01-g01',
      'pair-custom99-r01-g01',
      'pair-custom100-r01-g01',
      'pair-custom122-r01-g01',
      'pair-custom247-r01-g01',
      'pair-custom248-r01-g01',
      'pair-custom249-r01-g01',
      'pair-custom250-r01-g01',
      'pair-custom251-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom160-r01-g01',
        '踢水花',
        '浅滩动态',
        '单腿向前踢起水花，动作明快，很适合做海边沙滩首图。',
        '人物全身入镜，双臂自然展开保持平衡，脚边水花和海面都要保留。',
        '手机略低连拍，抓水花最高、表情最自然的一张。',
        '不要裁掉脚边水花，也不要让海平线明显倾斜。'
      ),
      makeScenePlan(
        'pair-custom682-r01-g01',
        '粉色格纹捧脸',
        '沙滩坐姿',
        '坐在铺开的沙滩布或毛巾上，动作小但和场景关系明确。',
        '人物正面入镜，双手抬到脸颊两侧，保留沙滩布和身前空间。',
        '机位与视线齐平或略高，正面构图，眼神微微向下。',
        '不要裁掉手脚、沙滩布和身边道具。'
      ),
      makeScenePlan(
        'pair-custom683-r01-g01',
        '举椰欢呼',
        '道具全身',
        '椰子和抬手动作能解决手空问题，也能把海边度假感拍出来。',
        '全身入镜，一条腿向后勾起，右手托举青椰，左手斜向上打开。',
        '手机放低到腰线以下微仰拍，把腿部线条和蓝天一起框进来。',
        '不要裁掉椰子、手臂和脚部动作。'
      )
    ]
  },
  {
    id: 'lotus-pond',
    title: '荷塘荷花怎么拍',
    shortTitle: '荷塘荷花',
    painPoint: '荷叶多、花也多，动作太小会被背景吃掉。',
    promise: '用荷叶当伞、执扇端坐、荷花近景和背影摸叶，拍出夏日古风感。',
    shareTitle: '荷塘荷花拍照作业：荷叶、团扇和花都能用起来',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom193-r01-g01',
    morePoseIds: [
      'pair-custom192-r01-g01',
      'pair-custom193-r01-g01',
      'pair-custom194-r01-g01',
      'pair-custom195-r01-g01',
      'pair-custom196-r01-g01',
      'pair-custom197-r01-g01',
      'pair-custom198-r01-g01',
      'pair-custom199-r01-g01',
      'pair-custom200-r01-g01',
      'pair-custom201-r01-g01',
      'pair-custom202-r01-g01',
      'pair-custom203-r01-g01',
      'pair-custom204-r01-g01',
      'pair-custom205-r01-g01',
      'pair-custom206-r01-g01',
      'pair-custom207-r01-g01',
      'pair-custom208-r01-g01',
      'pair-custom209-r01-g01',
      'pair-custom210-r01-g01',
      'pair-custom211-r01-g01',
      'pair-custom212-r01-g01',
      'pair-custom213-r01-g01',
      'pair-custom214-r01-g01',
      'pair-custom215-r01-g01',
      'pair-custom216-r01-g01',
      'pair-custom217-r01-g01',
      'pair-custom218-r01-g01',
      'pair-custom219-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom195-r01-g01',
        '荷叶当伞',
        '荷叶道具',
        '把荷叶举到头顶能立刻形成夏日识别点，也解决手部动作。',
        '人物半身入镜，荷叶在头顶偏一侧，脸部露出来。',
        '手机平视，背景荷塘虚一点，人物和荷叶清晰。',
        '荷叶不要完全遮脸。'
      ),
      makeScenePlan(
        'pair-custom193-r01-g01',
        '执扇端坐',
        '古风坐姿',
        '团扇和坐姿更适合荷塘的安静氛围，画面不容易乱。',
        '人物坐姿入镜，团扇放在胸前或脸侧，保留荷叶背景。',
        '手机略高一点拍，避免腿部和裙摆变形。',
        '团扇不要挡住五官。'
      ),
      makeScenePlan(
        'pair-custom203-r01-g01',
        '背影摸叶',
        '背影氛围',
        '背影伸手摸荷叶，能把人物和荷塘关系拍清楚。',
        '人物背影七分身入镜，一手伸向荷叶，水面和叶片保留。',
        '从身后稍侧拍，保持手和叶片不重叠。',
        '不要只拍背，手碰荷叶的动作要看得见。'
      )
    ]
  },
  {
    id: 'rapeseed-field',
    title: '油菜花田怎么拍',
    shortTitle: '油菜花田',
    painPoint: '花海太满，人物动作不明显时容易被黄色背景淹没。',
    promise: '用挥手、抛帽、提帽遮阳和花丛蹲拍，让花田照片有明确动作。',
    shareTitle: '油菜花田拍照作业：帽子和花海这样拍更出片',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom237-r01-g01',
    morePoseIds: [
      'pair-custom235-r01-g01',
      'pair-custom236-r01-g01',
      'pair-custom237-r01-g01',
      'pair-custom238-r01-g01',
      'pair-custom239-r01-g01',
      'pair-custom240-r01-g01',
      'pair-custom241-r01-g01',
      'pair-custom242-r01-g01',
      'pair-custom243-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom237-r01-g01',
        '抛帽仰头',
        '动态花海',
        '抛帽动作能从花海里跳出来，画面更有动势。',
        '人物全身或七分身入镜，帽子抛到头顶上方，花海保留到腰部。',
        '手机略低连拍，抓帽子刚离手的一张。',
        '不要把帽子裁出画面。'
      ),
      makeScenePlan(
        'pair-custom238-r01-g01',
        '提帽遮阳',
        '帽子道具',
        '提帽遮阳适合强光花田，也能让手部动作自然。',
        '人物半身入镜，一手提帽檐，脸微侧。',
        '手机平视，注意脸部不要过曝。',
        '帽檐不要压住眼睛。'
      ),
      makeScenePlan(
        'pair-custom242-r01-g01',
        '花丛蹲拍',
        '低位花海',
        '蹲下来能让花海包围人物，适合近距离拍层次。',
        '人物蹲在花丛边，手靠近花朵，脸部露出。',
        '手机略低或平视，让前景花朵虚一点。',
        '不要让花完全挡住脸。'
      )
    ]
  },
  {
    id: 'outdoor-sport',
    title: '户外运动怎么拍',
    shortTitle: '户外运动',
    painPoint: '运动风照片只站着会像装备照，动作不够有能量。',
    promise: '用登山、挥拍、跑动、骑行、扶帽和伸展动作，拍出更有力量的户外感。',
    shareTitle: '户外运动拍照作业：跑动、挥拍、骑行和伸展这样拍',
    categoryId: 'outfit-standing',
    coverPoseId: 'pair-custom249-r01-g01',
    morePoseIds: [
      'pair-custom33-r01-g01',
      'pair-custom42-r01-g01',
      'pair-custom54-r01-g01',
      'pair-custom58-r01-g01',
      'pair-custom66-r01-g01',
      'pair-custom119-r01-g01',
      'pair-custom247-r01-g01',
      'pair-custom248-r01-g01',
      'pair-custom249-r01-g01',
      'pair-custom250-r01-g01',
      'pair-custom251-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom249-r01-g01',
        '双臂高举伸展',
        '能量伸展',
        '高举双臂能拉开身体线条，适合户外开阔背景。',
        '人物全身入镜，双臂向上打开，脚下地面保留完整。',
        '手机略低拍，天空留白多一点。',
        '不要裁掉手臂和脚。'
      ),
      makeScenePlan(
        'pair-custom42-r01-g01',
        '羽毛球挥拍弓步',
        '挥拍动态',
        '挥拍和弓步自带发力感，适合球场、操场或开阔草地。',
        '人物全身入镜，球拍举到画面上方，前后腿形成斜线。',
        '手机平视或略低，连拍抓住挥拍最高点。',
        '不要裁掉球拍和后脚，手臂也不要贴住身体。'
      ),
      makeScenePlan(
        'pair-custom54-r01-g01',
        '跑动挥手活力',
        '跑动抓拍',
        '跑动和挥手能让运动风更有感染力，适合公园、操场和校园路面。',
        '人物从画面一侧跑向镜头，给前进方向留空间。',
        '手机平视连拍，优先挑双脚离地或手臂打开的一张。',
        '不要用太慢快门，脸和脚都容易糊。'
      )
    ]
  },
  {
    id: 'pipe-sitting',
    title: '台阶坐姿怎么拍',
    shortTitle: '台阶坐姿',
    painPoint: '坐在管道、台阶或低矮装置上时，身体容易塌，手也不知道放哪。',
    promise: '用倚坐、托膝、撑臂后仰和扶手动作，把坐姿拍得更有线条。',
    shareTitle: '台阶坐姿拍照作业：低矮装置和楼梯上照着这些动作拍',
    categoryId: 'sitting-life',
    coverPoseId: 'pair-custom226-r01-g01',
    morePoseIds: [
      'pair-custom226-r01-g01',
      'pair-custom227-r01-g01',
      'pair-custom228-r01-g01',
      'pair-custom229-r01-g01',
      'pair-custom230-r01-g01',
      'pair-custom231-r01-g01',
      'pair-custom232-r01-g01',
      'pair-custom233-r01-g01',
      'pair-custom234-r01-g01',
      'pair-custom101-r01-g01',
      'pair-custom40-r01-g01',
      'pair-custom64-r01-g01',
      'pair-custom92-r01-g01',
      'pair-custom121-r01-g01'
    ],
    plans: [
      makeScenePlan(
        'pair-custom226-r01-g01',
        '慵懒倚坐',
        '松弛坐姿',
        '身体轻靠能让坐姿更放松，不会像端坐证件照。',
        '人物坐在管道或台面边，身体向一侧倚，腿部自然伸展。',
        '手机略低，从侧前方拍出腿部线条。',
        '不要弓背塌腰，脚部不要被裁掉。'
      ),
      makeScenePlan(
        'pair-custom229-r01-g01',
        '静坐托膝',
        '托膝构图',
        '托膝能给手一个落点，也能让坐姿更安静。',
        '人物坐姿入镜，一手或双手落在膝盖附近，身体微侧。',
        '手机平视，保留坐具边缘和腿部方向。',
        '膝盖不要顶到画面最前面造成变形。'
      ),
      makeScenePlan(
        'pair-custom231-r01-g01',
        '撑臂后仰',
        '身体线条',
        '撑臂后仰能打开肩颈，坐姿更有力量感。',
        '人物坐在边缘，双臂向后支撑，上半身微微后仰。',
        '手机略低侧拍，拍清手臂支撑点。',
        '不要后仰过度，手臂和肩颈线条要自然。'
      )
    ]
  },
  {
    id: 'lake-riverside',
    title: '湖边河畔怎么拍',
    shortTitle: '湖边河畔',
    painPoint: '湖边河边没有海浪和沙滩，动作太大容易违和，站着又显得普通。',
    promise: '用白莲点水、浅水踢鞋和码头坐姿，把普通水边拍出安静松弛感。',
    shareTitle: '湖边河畔拍照作业：没有海边也能照着这 3 个动作拍',
    categoryId: 'travel-back',
    coverPoseId: 'pair-custom129-r01-g01',
    morePoseIds: [
      'pair-custom13-r01-g01',
      'pair-custom26-r01-g01',
      'pair-custom71-r01-g01',
      'pair-custom73-r01-g01',
      'pair-custom102-r01-g01',
      'pair-custom103-r01-g01',
      'pair-custom4-r01-g01',
      'pair-custom74-r01-g01',
      'pair-custom61-r01-g01',
      'pair-custom65-r01-g01',
      'pair-custom123-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom129-r01-g01',
        title: '白莲点水站姿',
        badge: '湖面点水',
        reason: '白莲轻触水面很有普通湖边的识别度，比单纯站在岸边更有动作记忆点。',
        composition: '全身或七分身入镜，保留脚边水面、白莲和远处湖面。',
        camera: '手机平视或略低，人物微侧，花茎顺着身体线条向下延伸。',
        avoid: '不要裁掉花头和脚边水面，点水动作会看不出来。'
      },
      {
        poseId: 'pair-custom69-r01-g01',
        title: '湖边提鞋踢水',
        badge: '浅水互动',
        reason: '提鞋和轻踢水面更像湖边河边的夏日互动，不会和海边踢浪混淆。',
        composition: '全身入镜，保留手里的鞋、裙摆和脚边水花。',
        camera: '手机平视连拍，抓脚尖刚踢起水面的一瞬间。',
        avoid: '不要让水花和脚被裁掉，互动感会变弱。'
      },
      {
        poseId: 'pair-custom29-r01-g01',
        title: '码头整理辫子',
        badge: '码头坐姿',
        reason: '木码头和低头整理辫子很安静，适合河边码头、湖边栈桥这类普通水边场景。',
        composition: '全身背影或七分身入镜，保留码头边缘和水面。',
        camera: '手机平视，从侧后方拍，人物不要坐得太贴画面边缘。',
        avoid: '不要只拍上半身，脚边水面和码头线条是重点。'
      }
    ]
  },
  {
    id: 'flower-street',
    title: '花束街拍怎么拍',
    shortTitle: '花束街拍',
    painPoint: '拿到花束后只会抱在胸前，照片容易像证件照加道具。',
    promise: '用小巷旋转、捧花飞裙和暖光正站，让花束自然参与动作。',
    shareTitle: '花束街拍拍照作业：这 3 个动作比抱花站着更出片',
    categoryId: 'street-commute',
    coverPoseId: 'pair-custom127-r01-g01',
    morePoseIds: [
      'pair-custom113-r01-g01',
      'pair-custom120-r01-g01',
      'pair-custom123-r01-g01',
      'pair-custom126-r01-g01',
      'pair-custom128-r01-g01',
      'pair-custom130-r01-g01',
      'pair-custom118-r01-g01',
      'pair-custom121-r01-g01',
      'pair-custom124-r01-g01',
      'pair-custom125-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom127-r01-g01',
        title: '玫瑰小巷旋转',
        badge: '小巷旋转',
        reason: '小巷纵深和玫瑰花束很有氛围，裙摆动作比原地站更有画面感。',
        composition: '全身入镜，保留小巷两侧墙面和脚下路面。',
        camera: '手机略低，连拍抓裙摆展开的一瞬间。',
        avoid: '不要裁掉裙摆和花束。'
      },
      {
        poseId: 'pair-custom126-r01-g01',
        title: '捧花旋转飞裙',
        badge: '动态花束',
        reason: '花束和裙摆一起形成动态，比普通抱花站姿更像拍照作业。',
        composition: '全身入镜，保留花束、裙摆和脚下路面。',
        camera: '手机略低连拍，抓裙摆打开的一张。',
        avoid: '不要裁掉裙摆和手里的花。'
      },
      {
        poseId: 'pair-custom128-r01-g01',
        title: '郁金香暖光正站',
        badge: '暖光花束',
        reason: '暖光街景和红色郁金香很有氛围，适合作为花束专题的安静款。',
        composition: '全身入镜，花束放在身体中线但不要挡住脸。',
        camera: '手机平视，背景街灯和路面纵深保留一点。',
        avoid: '不要让花束压住腰线。'
      }
    ]
  },
  {
    id: 'mirror-selfie',
    title: '镜前自拍怎么拍',
    shortTitle: '镜前自拍',
    painPoint: '对镜自拍很容易遮脸、显腿短，动作也容易重复。',
    promise: '用酷感站姿、蹲姿和侧立，让镜前自拍更像穿搭大片。',
    shareTitle: '镜前自拍拍照作业：这 3 个姿势照着拍更显比例',
    categoryId: 'selfie',
    coverPoseId: 'pair-custom107-r01-g01',
    morePoseIds: [
      'pair-custom110-r01-g01',
      'pair-custom115-r01-g01',
      'pair-custom75-r01-g01',
      'pair-custom79-r01-g01',
      'pair-custom34-r01-g01',
      'pair-custom108-r01-g01'
    ],
    plans: [
      {
        poseId: 'pair-custom107-r01-g01',
        title: '酷感对镜自拍',
        badge: '镜前穿搭',
        reason: '对镜构图完整，适合展示全身穿搭和姿态比例。',
        composition: '镜子里全身入镜，手机不要挡住脸部重点。',
        camera: '手机放在胸口附近，镜头略向下但不要俯拍过重。',
        avoid: '不要把脚裁掉，对镜照会立刻显矮。'
      },
      {
        poseId: 'pair-custom110-r01-g01',
        title: '单膝蹲姿自拍',
        badge: '酷感蹲姿',
        reason: '蹲姿比普通站姿更有态度，适合做镜前自拍里的强风格参考。',
        composition: '全身入镜，帽子、鞋和包都保留。',
        camera: '手机放在脸侧，镜头略向下但不要把腿拍短。',
        avoid: '不要让手机完全挡住脸。'
      },
      {
        poseId: 'pair-custom112-r01-g01',
        title: '倚墙侧立自拍',
        badge: '显腿线条',
        reason: '靠墙侧立能稳定身体，腿部交错更显比例。',
        composition: '全身入镜，保留包和脚部姿态。',
        camera: '手机平视或略低，人物身体侧向镜子。',
        avoid: '不要让手机挡住上半身轮廓。'
      }
    ]
  }
]

const poseIdsFromRange = (start, end) => {
  const poseIds = []

  for (let number = start; number <= end; number += 1) {
    poseIds.push(`pair-custom${number}-r01-g01`)
  }

  return poseIds
}

const makeTobecheckTopic = ({
  id,
  title,
  shortTitle,
  painPoint,
  promise,
  categoryId,
  poseIds,
  plans
}) => ({
  id,
  title,
  shortTitle,
  painPoint,
  promise,
  shareTitle: `${shortTitle}拍照作业：照着这些姿势拍更自然`,
  categoryId,
  coverPoseId: poseIds[0],
  morePoseIds: poseIds,
  plans
})

const TOBECHECK_SCENE_TOPICS = [
  makeTobecheckTopic({
    id: 'tobecheck-autumn-girl',
    title: '秋叶少女怎么拍',
    shortTitle: '秋叶少女',
    painPoint: '秋叶、银杏和公园场景容易只拍成普通站照，手部和视线缺少明确动作。',
    promise: '用回眸、托腮、抱膝、抬手赏叶和捧花动作，把秋日公园拍得更温柔。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(719, 727),
    plans: [
      makeScenePlan('pair-custom719-r01-g01', '回眸侧身', '半身', '身体微侧后回看镜头，手放衣领处，突出脸部和发丝线条。', '人物放在林荫或落叶背景前，保留肩颈和头发轮廓。', '手机平视或略高拍半身，背景留出秋叶层次。', '不要耸肩，也不要让头发挡住眼睛。'),
      makeScenePlan('pair-custom720-r01-g01', '俯卧托腮', '半身', '俯卧在草地或落叶边，双手托住下巴，表情放松看镜头。', '低机位贴近草地，把前景落叶和脸部一起拍清楚。', '镜头与脸部齐平，避免从正上方压扁身体。', '手肘不要撑太开，肩颈不要紧绷。'),
      makeScenePlan('pair-custom724-r01-g01', '抬手赏叶', '背影', '背对镜头抬手靠近树叶，身体微微侧开，动作像在触碰秋光。', '人物站在树荫或银杏下方，手臂和树叶形成连接。', '竖拍保留头顶枝叶和下方身体线条。', '不要把抬起的手裁掉，也不要让背景过暗。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-beach-night-red-dress',
    title: '海边夜景红裙怎么拍',
    shortTitle: '海夜红裙',
    painPoint: '夜晚海边光线暗，红裙容易只拍成站立照，姿势变化和裙摆动势不明显。',
    promise: '用回身、提裙、侧站和海风动作，让夜景沙滩照片更有电影感。',
    categoryId: 'sea-lake',
    poseIds: poseIdsFromRange(728, 763),
    plans: [
      makeScenePlan('pair-custom728-r01-g01', '红裙开场', '全身', '站在湿沙或浪边，身体侧向镜头，让红裙成为画面视觉中心。', '保留海面、夜色和完整裙摆，人物不要贴边。', '手机略低竖拍，等裙摆被风吹开时按快门。', '不要用过强闪光直打脸，也不要裁掉裙摆。'),
      makeScenePlan('pair-custom736-r01-g01', '海风侧身', '全身', '身体侧站，肩膀放松，顺着海风方向整理裙摆或头发。', '让浪花和湿沙形成横向背景，红裙占画面中下部。', '低机位拍全身，保持地平线平直。', '不要让海平线切过脸部。'),
      makeScenePlan('pair-custom752-r01-g01', '夜海回身', '全身', '先背向海面，再从肩膀带动上身回望，裙摆顺势打开。', '人物放在画面中心偏下，海面和天空留出呼吸感。', '连拍捕捉回身瞬间，优先保留手臂和裙摆完整。', '不要转身过猛，避免裙摆糊成一团。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-field-slope-flower',
    title: '草坡花束怎么拍',
    shortTitle: '草坡花束',
    painPoint: '草坡、花束和小屋背景元素多，动作不明确时画面容易散。',
    promise: '用抱花漫步、遮面、背影摇摆和举机留影，把草坡照片拍出轻旅行感。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(764, 772),
    plans: [
      makeScenePlan('pair-custom764-r01-g01', '抱花漫步', '全身', '双手抱花向前慢走，脚步一前一后，身体保持轻松。', '人物沿草坡小路或开阔草地走，让花束贴近胸前。', '手机平视竖拍，抓脚步打开和花束稳定的瞬间。', '不要让花束完全挡住脸。'),
      makeScenePlan('pair-custom765-r01-g01', '花束遮面', '半身', '把花束抬到脸侧或嘴边，露出眼神和肩颈线条。', '用草坡或小屋做柔和背景，花束作为前景焦点。', '平视半身拍，保留手指和花束边缘。', '不要把整张脸遮没，也不要让手指僵硬。'),
      makeScenePlan('pair-custom772-r01-g01', '回眸拾光', '全身', '侧身站在草坡上回头看镜头，手部自然靠近花束或裙摆。', '人物放在光线更亮的一侧，让草坡延伸方向带出空间。', '略低机位拍全身，保留脚下坡度。', '不要站得太直，身体要有轻微转向。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-forest-stream',
    title: '森林溪水怎么拍',
    shortTitle: '森林溪水',
    painPoint: '溪边和森林背景容易显乱，动作不聚焦时人物会被环境吃掉。',
    promise: '用捧水、戏水、回眸、探水和坐石动作，让溪边照片更有互动感。',
    categoryId: 'sea-lake',
    poseIds: poseIdsFromRange(773, 781),
    plans: [
      makeScenePlan('pair-custom773-r01-g01', '溪边捧水', '半身', '蹲在溪边双手捧水，身体前倾但背部保持舒展。', '让水面、石头和手部动作形成前景关系。', '手机略低靠近水面拍，保留手和脸的互动。', '不要蹲得太塌，也不要让头发遮住脸。'),
      makeScenePlan('pair-custom775-r01-g01', '溪畔回眸', '全身', '身体朝溪流方向，肩膀回转看镜头，手自然搭在帽檐或身侧。', '人物站在浅水边或石头旁，保留溪流走向。', '竖拍全身，注意脚下安全和水面反光。', '不要踩进过深水区，也不要把脚裁掉。'),
      makeScenePlan('pair-custom780-r01-g01', '岩边轻蹲', '蹲姿', '在岩石边轻蹲，一手靠近膝盖，一手保持平衡。', '用石头稳定画面，溪水留在人物侧后方。', '平视或略低拍，突出蹲姿轮廓。', '不要让膝盖和手臂挤成一团。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-garden-cute',
    title: '花园俏皮近景怎么拍',
    shortTitle: '花园近景',
    painPoint: '花园近景容易只剩表情，手势和脸部关系不清晰。',
    promise: '用比耶、托脸、兔耳、框景和嘟嘴动作，让花园半身照更活泼。',
    categoryId: 'portrait-half',
    poseIds: poseIdsFromRange(782, 790),
    plans: [
      makeScenePlan('pair-custom782-r01-g01', '双指点脸', '半身', '双手靠近脸颊做点脸动作，头部微微歪向一侧。', '花丛或绿植放在背景，人物脸部居中。', '手机平视拍胸上半身，保留完整手势。', '不要让手指压住嘴角或眼睛。'),
      makeScenePlan('pair-custom784-r01-g01', '花式托脸', '半身', '双手托住脸侧，手腕放松，肩膀自然下沉。', '让花园背景柔化，脸部和手部成为画面中心。', '平视近景拍，留一点头顶空间。', '不要耸肩，也不要把手掌贴得太用力。'),
      makeScenePlan('pair-custom788-r01-g01', '框住快乐', '半身', '双手在脸前做框景动作，眼神看向镜头。', '人物站在花园亮处，让手势框住表情。', '半身竖拍，确保手指边缘不被裁切。', '不要离镜头太近，避免手部变形。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-jk-beret',
    title: '贝雷帽学院感怎么拍',
    shortTitle: '贝雷帽',
    painPoint: '贝雷帽和包袋道具多，站姿、蹲姿和坐姿容易混在一起不好选。',
    promise: '用扶帽、提包、抱臂、挥手和蹲坐动作，拍出清爽学院感。',
    categoryId: 'portrait-half',
    poseIds: poseIdsFromRange(791, 825),
    plans: [
      makeScenePlan('pair-custom791-r01-g01', '跪坐扶帽', '半身', '跪坐后轻扶帽檐，身体微侧，眼神看向镜头。', '让包袋或裙摆留在画面下方，帽子作为上方焦点。', '手机平视半身拍，保留手和帽檐关系。', '不要把帽檐压太低，也不要耸肩。'),
      makeScenePlan('pair-custom800-r01-g01', '侧身回望', '半身', '身体侧向站立或坐下，从肩膀带动头部回望。', '背景保持简洁，让帽子、脸部和肩线清晰。', '平视拍半身或七分身，抓回头一瞬间。', '不要只转头不转肩，动作会显僵。'),
      makeScenePlan('pair-custom825-r01-g01', '托腮蹲姿', '蹲姿', '蹲下后双手靠近脸侧托腮，膝盖自然分开稳定身体。', '人物放在画面中下部，保留鞋、包和帽子。', '略低机位拍，突出蹲姿和腿部线条。', '不要蹲得太低导致身体缩成一团。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-lawn-energy',
    title: '草坡活力怎么拍',
    shortTitle: '草坡活力',
    painPoint: '草坡动作幅度大，跳跃、坐姿和道具互动如果没选好很容易乱。',
    promise: '用举罐、展臂、躺拍、跳跃和比心动作，拍出明亮草地活力感。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(826, 841),
    plans: [
      makeScenePlan('pair-custom826-r01-g01', '举罐迎风', '全身', '单手举起饮料罐，身体迎风站立，另一只手自然打开。', '草坡和天空作为背景，人物站在画面中心。', '略低机位拍全身，让手臂和天空都有空间。', '不要让饮料罐挡住脸。'),
      makeScenePlan('pair-custom833-r01-g01', '背影比心', '背影', '背对镜头举手比心，身体轻轻向一侧倾斜。', '用大片草地或树影做背景，保持人物轮廓干净。', '竖拍保留手臂和下半身，适合做组图氛围照。', '不要把手势放出画面。'),
      makeScenePlan('pair-custom835-r01-g01', '跳跃伸展', '全身', '起跳时双臂打开，一条腿向后弯起，表情保持轻松。', '让草地和天空留出足够空间，人物不要贴边。', '连拍抓最高点，手机略低更有动势。', '不要在落地瞬间按快门，姿态会显沉。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-park-lawn',
    title: '晴天草坪怎么拍',
    shortTitle: '晴天草坪',
    painPoint: '晴天草坪光线强，普通站姿容易单调，坐姿和跳跃缺少节奏。',
    promise: '用站姿、抬腿比耶、坐沿伸手和跳跃挥手，让草坪照更轻快。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(842, 850),
    plans: [
      makeScenePlan('pair-custom842-r01-g01', '草坪站姿', '全身', '双脚自然站开，身体轻微侧向镜头，手臂放松。', '保留草坪、蓝天或树林，人物站在画面下方三分之一。', '平视或略低竖拍，全身入镜。', '不要让强光把脸拍得过曝。'),
      makeScenePlan('pair-custom843-r01-g01', '比耶抬腿', '全身', '单腿站稳，另一腿轻抬，双手比耶增加活力。', '人物放在开阔草坪中，动作向外打开。', '连拍捕捉平衡稳定的一刻。', '不要抬腿过高导致身体歪斜。'),
      makeScenePlan('pair-custom847-r01-g01', '跳跃挥手', '全身', '跳起时一手挥向镜头，双腿自然分开。', '背景尽量干净，保留头顶和脚下空间。', '手机略低连拍，让动作更轻盈。', '不要裁掉脚尖，也不要背光过重。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-pink-hillside',
    title: '粉色山坡怎么拍',
    shortTitle: '粉色山坡',
    painPoint: '彩色山坡背景抢眼，人物动作太小会被环境淹没。',
    promise: '用挥手、跃起、托脸、回眸倚坐和迎风张臂，把山坡背景用起来。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(851, 859),
    plans: [
      makeScenePlan('pair-custom851-r01-g01', '侧身挥手', '全身', '身体侧站，靠近镜头一侧手臂挥起，表情看向镜头。', '让粉色山坡形成斜向背景，人物站在干净区域。', '平视竖拍，保留挥手方向的空间。', '不要让手臂挡住脸。'),
      makeScenePlan('pair-custom852-r01-g01', '跃起伸臂', '全身', '跳起时双臂向上打开，腿部自然弯曲。', '人物放在山坡色块前，背景越简洁越突出动作。', '连拍最高点，手机略低。', '不要贴近边缘跳，避免画面不稳。'),
      makeScenePlan('pair-custom855-r01-g01', '回眸倚坐', '坐姿', '侧坐后上身回望，手臂支撑身体，保持肩颈舒展。', '利用坡面作为斜线构图，人物放在视觉中心。', '平视或略低拍七分身，保留腿部线条。', '不要塌腰，也不要让手臂被身体压住。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-stream-picnic',
    title: '溪边野餐怎么拍',
    shortTitle: '溪边野餐',
    painPoint: '溪边野餐道具多，水边、餐布和人物动作容易互相抢画面。',
    promise: '用捧水、涉溪、取果、举杯和布餐动作，让溪边野餐更有故事感。',
    categoryId: 'sea-lake',
    poseIds: poseIdsFromRange(860, 868),
    plans: [
      makeScenePlan('pair-custom860-r01-g01', '溪畔捧水', '半身', '靠近溪边双手捧水，身体向水面轻轻前倾。', '水面、手部和脸部形成三角关系，背景保留绿意。', '低机位靠近水面拍，突出清凉感。', '不要让手部遮住下巴。'),
      makeScenePlan('pair-custom864-r01-g01', '举杯入镜', '半身', '一手把杯子举向镜头，另一手自然支撑身体。', '餐布和溪水作为背景，杯子做前景互动。', '手机平视略近拍，注意杯子不要变形过大。', '不要让杯子完全挡住脸。'),
      makeScenePlan('pair-custom867-r01-g01', '岩上布餐', '坐姿', '坐在岩石或餐布旁，双手整理食物和道具。', '把野餐篮、水果和溪水都放进画面，但主体保持清晰。', '俯一点点拍坐姿和餐布，保留环境关系。', '不要让道具堆得太满。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-sunny-lawn',
    title: '阳光草坪怎么拍',
    shortTitle: '阳光草坪',
    painPoint: '阳光草坪很适合拍生活照，但动作太普通会显得像随手站拍。',
    promise: '用递耳机、飞跃、前踢坐姿、框住阳光和侧坐回眸，拍出夏日生活感。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(869, 877),
    plans: [
      makeScenePlan('pair-custom870-r01-g01', '递来耳机', '全身', '身体微微前倾，双手把耳机递向镜头，表情自然。', '草地和蓝天做背景，手部动作放在画面前景。', '平视略近拍，保留上半身和递出动作。', '不要让手完全糊到镜头前。'),
      makeScenePlan('pair-custom872-r01-g01', '前踢坐姿', '坐姿', '坐在草地上，一条腿前伸靠近镜头，另一腿自然弯曲。', '靴子作为前景，人物脸部保持清晰。', '低机位拍，利用透视增加俏皮感。', '不要让脚底完全占满画面。'),
      makeScenePlan('pair-custom875-r01-g01', '框住阳光', '坐姿', '盘坐后用手指做框景动作，表情看向镜头。', '人物坐在开阔草地中，手势框住脸部或阳光方向。', '平视半身拍，保留手势完整。', '不要让手指遮住眼睛。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-wheat-field',
    title: '麦田草帽怎么拍',
    shortTitle: '麦田草帽',
    painPoint: '麦田和草帽很容易拍成单一站姿，缺少背影、行走和互动变化。',
    promise: '用举帽、扶帽、回眸、抛帽和麦间托腮，把田园感拍得更完整。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(878, 886),
    plans: [
      makeScenePlan('pair-custom878-r01-g01', '举帽仰望', '全身', '双手把草帽举高，身体侧向站立，脸部仰向天空。', '保留麦田、草地或天空留白，手臂不要贴边。', '略低机位竖拍，让手臂线条更舒展。', '不要把帽子举出画面。'),
      makeScenePlan('pair-custom880-r01-g01', '回眸背影', '背影', '背对麦田站立，肩膀轻转，回头看镜头。', '用麦浪或草地做大背景，人物站在路径或开阔处。', '平视全身拍，保留裙摆和草帽。', '不要回头过猛，肩颈保持自然。'),
      makeScenePlan('pair-custom883-r01-g01', '草间托腮', '半身', '坐在麦田边双手托腮，头部轻轻歪向一侧。', '麦穗或草丛做前景，脸部保持清晰。', '平视近景拍，突出眼神和手部。', '不要让麦穗挡住眼睛。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-wheat-white-dress',
    title: '白裙麦田怎么拍',
    shortTitle: '白裙麦田',
    painPoint: '白裙麦田画面很干净，但动作太小会缺少情绪和层次。',
    promise: '用扶帽浅蹲、拿帽回眸、遮阳、张臂前行和捧麦动作，拍出清新田园感。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(887, 895),
    plans: [
      makeScenePlan('pair-custom887-r01-g01', '扶帽浅蹲', '半身', '低机位前浅蹲，一手扶帽檐，一手自然靠近裙摆。', '麦穗放在前景，白裙和草帽形成清新焦点。', '手机略低拍半身，保留麦穗包围感。', '不要蹲得太低，也不要让帽檐遮眼。'),
      makeScenePlan('pair-custom890-r01-g01', '张臂前行', '全身', '沿麦田小路向前走，双臂向两侧打开。', '人物放在小路中间，麦田向两侧延伸。', '略低机位竖拍全身，连拍抓裙摆打开。', '不要裁掉脚，也不要让手臂贴住身体。'),
      makeScenePlan('pair-custom893-r01-g01', '蹲姿捧麦', '半身', '蹲在麦穗旁，双手捧住麦穗靠近胸前或脸侧。', '麦穗做前景，脸部和手部都要清楚。', '平视近景拍，突出温柔表情。', '不要把麦穗贴得太高挡脸。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-seaside-road',
    title: '海边公路怎么拍',
    shortTitle: '海边公路',
    painPoint: '海边公路背景开阔，人物如果只是站着会显得空，墨镜和杯子也不容易用自然。',
    promise: '用迎风扶发、坐墙抬腿、扶镜停步、回望迈步和持杯倚靠，拍出度假街拍感。',
    categoryId: 'sea-lake',
    poseIds: poseIdsFromRange(896, 904),
    plans: [
      makeScenePlan('pair-custom896-r01-g01', '迎风扶发', '全身', '身体与镜头成斜角站立，一手扶头发，重心落在后侧腿。', '把海边公路、天空和人物全身一起放进画面。', '手机略低竖拍，等头发和衣摆被风吹开。', '不要迎风眯眼过重，也不要双腿站平。'),
      makeScenePlan('pair-custom900-r01-g01', '回望迈步', '全身', '先向前迈步，再从肩膀带动上身回望，双臂自然展开。', '道路延伸线放在人物身后，制造旅行方向感。', '连拍抓脚步落地和回头同时发生的瞬间。', '不要只转头不转肩，也不要裁掉脚。'),
      makeScenePlan('pair-custom903-r01-g01', '持杯伸腿', '全身', '身体侧倚在栏杆或矮墙边，一手持杯，一条腿自然伸出。', '让海景、路边栏杆或咖啡店外景形成横向层次。', '平视七分身或全身拍，保留杯子和腿部线条。', '不要把杯子贴脸太近，也不要塌腰。')
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-forest-outdoor",
    title: "森系户外写真怎么拍",
    shortTitle: "森系户外",
    painPoint: "森系户外背景细节多，人物如果只站着会被花枝和树影淹没。",
    promise: "用读书、探花、捧花、扶叶和侧身动作，把森系写真拍得更安静、有层次。",
    categoryId: "park-garden",
    poseIds: poseIdsFromRange(905, 913),
    plans: [
      makeScenePlan("pair-custom905-r01-g01", "坐读书", "坐姿", "坐姿放松，书本贴近膝前。", "适合草地、长椅或花园角落。改脸重建后脸部更清晰，适合做安静开场。", "手机平视或略低拍摄，保留人物完整轮廓。", "不要裁掉手部、脚尖或关键道具。"),
      makeScenePlan("pair-custom906-r01-g01", "探花枝", "半身", "身体靠近花枝，手部轻触花朵。", "适合花丛、灌木和低枝植物旁。侧脸细节更干净，适合轻盈互动感。", "手机平视或略低拍摄，保留人物完整轮廓。", "不要裁掉手部、脚尖或关键道具。"),
      makeScenePlan("pair-custom907-r01-g01", "捧花站", "半身", "双手抱花在身前，身体挺直。", "适合竖构图全身照。人物和花束关系清楚，适合做封面候选。", "手机平视或略低拍摄，保留人物完整轮廓。", "花束不要遮住脸部。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-jeju-seaside",
    title: "济州海边火山岩怎么拍",
    shortTitle: "济州海边",
    painPoint: "火山岩和海风场景开阔，动作太小会显得人物不够突出。",
    promise: "用张臂、扶帽、倚石、举机和回眸动作，让海边旅拍更有度假感。",
    categoryId: "sea-lake",
    poseIds: poseIdsFromRange(914, 922),
    plans: [
      makeScenePlan("pair-custom914-r01-g01", "迎海张臂", "全身", "身体微微靠近画面中心，双臂自然打开。", "适合开场第一张，用大幅度动作表现海边松弛感。石墙和海平线能帮助复刻机位。", "适合开场第一张，用大幅度动作表现海边松弛感。石墙和海平线能帮助复刻机位。", "不要裁掉手部、脚尖或关键道具。"),
      makeScenePlan("pair-custom915-r01-g01", "扶帽后踢", "全身", "一手抬到帽檐前，像遮阳一样轻轻定住。", "适合阳光很强的海边场景，扶帽遮阳动作自然又有度假感。后踢腿让画面更活泼。", "手机平视或略低拍摄，保留人物完整轮廓。", "身体不要过度前倾，重心落在支撑脚。"),
      makeScenePlan("pair-custom916-r01-g01", "双手扶帽", "全身", "双手放在帽檐或耳侧，肩膀放松。", "适合做安静甜美的正面照，动作简单，出片稳定。适合人多时快速完成拍摄。", "手机平视或略低拍摄，保留人物完整轮廓。", "不要裁掉手部、脚尖或关键道具。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-red-wall",
    title: "红墙街拍怎么拍",
    shortTitle: "红墙街拍",
    painPoint: "红墙背景颜色强，姿势太收会显得拘谨，动作太乱又会抢画面。",
    promise: "用举手、比耶、后踢、贴墙和回眸动作，拍出干净明亮的街拍九宫格。",
    categoryId: "street-commute",
    poseIds: poseIdsFromRange(923, 931),
    plans: [
      makeScenePlan("pair-custom923-r01-g01", "举手开场", "全身", "双臂自然向上打开，手腕放松，形成轻盈Y字。", "适合红墙、纯色墙面或店铺门口的第一张开场照。动作舒展，能迅速拉开画面氛围，适合活泼甜美风。", "手机平视或略低拍摄，保留人物完整轮廓。", "包带保持在肩侧，身体不要被包压住。"),
      makeScenePlan("pair-custom924-r01-g01", "双V交叉", "全身", "双手抬到耳侧比V，手肘外打开，脸部保持露出。", "适合近距离竖构图，突出可爱表情和穿搭层次。红墙背景越干净，人物越容易成为视觉中心。", "手机平视或略低拍摄，保留人物完整轮廓。", "不要裁掉手部、脚尖或关键道具。"),
      makeScenePlan("pair-custom925-r01-g01", "俏皮后踢", "半身", "双手在肩侧比V，手指朝外打开。", "适合想拍俏皮感、少女感的场景。后踢腿能增加动态，但要注意支撑脚站稳。", "手机平视或略低拍摄，保留人物完整轮廓。", "不要裁掉手部、脚尖或关键道具。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-seaside-street",
    title: "海边街道怎么拍",
    shortTitle: "海边街道",
    painPoint: "海边步道和护栏很容易拍成游客照，需要明确手部和站位。",
    promise: "用扶栏、侧望、比心、坐阶和回眸漫步，把海边街道拍得清爽自然。",
    categoryId: "sea-lake",
    poseIds: poseIdsFromRange(932, 940),
    plans: [
      makeScenePlan("pair-custom932-r01-g01", "倚栏侧望", "全身", "身体微侧靠近栏杆，左手自然搭住蓝色扶栏。", "适合海边步道、观景台和带护栏的栈道拍摄。用侧脸和扶栏动作拉出度假感，背景海平线越干净越出片。", "机位略低于胸口，保持海平线水平。", "裙摆和包带自然下垂，不要遮住关键手势。"),
      makeScenePlan("pair-custom933-r01-g01", "正面微笑", "全身", "正面站直，双手自然交叠放在裙前。", "适合做封面或整组第一张。动作简单稳妥，能清楚展示服装和人物气质。", "脚尖并拢略向内，肩背挺直，脸部正对镜头。", "裙摆和包带自然下垂，不要遮住关键手势。"),
      makeScenePlan("pair-custom934-r01-g01", "举手比心", "全身", "一手抬到脸侧做小爱心，另一手轻托动作。", "适合活泼甜美的游客照。栏杆和海面在身后展开，画面会更有层次。", "机位略低于胸口，保持海平线水平。", "裙摆和包带自然下垂，不要遮住关键手势。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-city-life-street",
    title: "城市生活街拍怎么拍",
    shortTitle: "生活街拍",
    painPoint: "城市街边环境元素多，近景、道具和回眸动作容易显得杂乱或刻意。",
    promise: "用饮料、帽子、窗边互动、回眸和市集坐姿，拍出自然轻松的城市漫游感。",
    categoryId: "street-commute",
    poseIds: poseIdsFromRange(941, 956),
    plans: [
      makeScenePlan("pair-custom941-r01-g01", "歪头水瓶", "半身", "肩线向水瓶反方向轻压，拿瓶手离开脸侧，身体轻微前倾。", "适合林荫路、公园街边和有斑驳阳光的位置。", "平视拍半身，保留水瓶、肩线和另一侧手臂。", "不要让瓶身遮脸，也不要把腰背压塌。"),
      makeScenePlan("pair-custom945-r01-g01", "回身挥手", "半身", "身体继续向前走，从肩膀带动头部回望，一只手向后挥开。", "适合街口、林荫路和城市漫游抓拍。", "使用连拍捕捉头发和手臂同时打开的瞬间。", "不要只转头不转肩，也不要裁掉关键手势。"),
      makeScenePlan("pair-custom956-r01-g01", "果摊托腮", "坐姿", "坐在果摊前双手托腮，手肘落在膝前，身体略向镜头靠近。", "让水果和摊位成为背景层次，人物保持在视觉中心。", "平视拍坐姿，保留膝盖、脚尖和双手。", "不要让招牌压住头部，也不要让背景遮住手臂。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-xinjiang-grassland",
    title: "新疆草原怎么拍",
    shortTitle: "新疆草原",
    painPoint: "草原、雪山和溪流背景很开阔，普通站姿容易显小，人物动作也缺少旅行张力。",
    promise: "用举花抬腿、迎风张臂、溪边提篮、雪山比耶和湖畔跃拍，拍出辽阔鲜活的新疆旅拍。",
    categoryId: "travel-back",
    poseIds: poseIdsFromRange(957, 972),
    plans: [
      makeScenePlan("pair-custom957-r01-g01", "花束抬腿", "全身", "一手把花束斜举向天空，侧抬腿轻搭木栏，靴尖向外。", "木栏、牛群和云层同时入镜，形成牧场开场画面。", "平视竖拍全身，给举花手和抬起的腿留足空间。", "不要压低手腕，也不要让木栏挡住支撑腿。"),
      makeScenePlan("pair-custom963-r01-g01", "迎风舒展", "全身", "双臂一高一低向外展开，双腿分开站稳，胸口向上打开。", "人物放在高处草坡，让外套、云层和远山形成迎风层次。", "低机位竖拍，保留手臂上方天空和完整脚部。", "不要收紧肩膀，也不要让外套遮住身体主线。"),
      makeScenePlan("pair-custom970-r01-g01", "湖畔跃拍", "全身", "举相机的手完全伸直，跳起时双腿形成一收一下的层次。", "湖水和松林完整留在背景，人物位于开阔区域。", "开启连拍，在腾空最高点按下快门。", "不要裁掉举起的手，也不要在落地瞬间拍摄。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-cafe-daily-3",
    title: "咖啡馆日常怎么拍",
    shortTitle: "咖啡日常",
    painPoint: "桌面空间有限，托脸、手机和杯子容易互相遮挡，动作也容易重复。",
    promise: "用托腮、爱心、自拍、端盘和窗边侧望，拍出自然亲近的下午茶日常。",
    categoryId: "props-action",
    poseIds: poseIdsFromRange(973, 988).concat(poseIdsFromRange(1021, 1036)),
    plans: [
      makeScenePlan("pair-custom973-r01-g01", "托腮甜笑", "半身", "手肘贴桌，手掌轻托下颌，身体微微前倾看镜头。", "适合窗边或小圆桌，用饮品做前景增加咖啡馆氛围。", "平视拍半身，让人物位于桌面上方中央。", "杯子不要挡住手臂，托腮时不要挤压脸部。"),
      makeScenePlan("pair-custom982-r01-g01", "手比爱心", "半身", "双手在眼前合成爱心，手臂抬起但肩膀保持放松。", "适合明亮咖啡馆和朋友聚会，手势醒目可作为封面。", "镜头对准手势中心，同时保留桌上饮品。", "不要让手掌完全遮住眼睛，也不要抬肩。"),
      makeScenePlan("pair-custom988-r01-g01", "捧杯侧望", "半身", "双手捧杯靠近嘴边，脸转向窗外，手肘自然收拢。", "适合窗边暖光和安静午后氛围。", "侧前方拍摄，保留窗框与面部受光。", "杯口不要遮住五官，手指保持自然。"),
      makeScenePlan("pair-custom1021-r01-g01", "蛋糕遮脸", "半身", "双手端住蛋糕托盘，把杯沿抬到鼻尖位置，袖口自然向两侧展开。", "适合甜品刚上桌时拍摄，让蛋糕和饮品形成前后层次。", "平视拍半身，桌面甜点保留在画面下方。", "托盘保持水平，不要让杯子完全挡住双眼。"),
      makeScenePlan("pair-custom1029-r01-g01", "趴桌休息", "趴姿", "肩颈放松趴在桌面，一手向前伸，另一手自然弯曲靠近身体。", "适合朋友抓拍和略带疲惫感的咖啡馆日常。", "略高机位拍摄，保留帽檐、前伸手臂和饮品。", "不要压住脸部轮廓，也不要裁掉前伸的手。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-restaurant-noodles",
    title: "餐厅吃面怎么拍",
    shortTitle: "吃面探店",
    painPoint: "拍面食时容易只剩食物特写，人物表情、筷子和碗也常互相遮挡。",
    promise: "用捧碗、夹面、挑面、托腮和第一口尝鲜，拍出有食欲又自然的探店照片。",
    categoryId: "props-action",
    poseIds: poseIdsFromRange(989, 1004),
    plans: [
      makeScenePlan("pair-custom989-r01-g01", "俯拍拌面", "半身", "镜头略高于头顶，人物抬脸看镜头，右手自然夹面。", "适合小店靠窗或吧台位，桌面和面碗共同交代场景。", "俯拍时保留完整碗口和双手。", "不要让筷子挡脸，也不要裁掉桌面食物。"),
      makeScenePlan("pair-custom998-r01-g01", "眨眼夹面", "半身", "一手托住半侧脸做眨眼表情，另一手横向夹起面条。", "适合暖光面馆和活泼探店记录。", "平视近拍，让筷子、面条和表情同时清楚。", "面条不要遮住眼睛，托脸手保持放松。"),
      makeScenePlan("pair-custom1004-r01-g01", "近景拉面", "半身", "身体靠近镜头，筷子高高挑起面条，视线落在面条前方。", "适合用作美食探店的封面或收尾照片。", "竖拍近景，保留筷尖、完整面条和碗口。", "手臂不要出框，面条不要完全挡住脸。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-shanghai-streetwear",
    title: "上海街头穿搭怎么拍",
    shortTitle: "上海街拍",
    painPoint: "弄堂、路牌和老墙信息丰富，人物容易被背景淹没，站姿也容易僵硬。",
    promise: "用叉腰、扶栏、倚杆、交腿和回眸，把上海街区拍出清爽明确的穿搭感。",
    categoryId: "street-commute",
    poseIds: poseIdsFromRange(1005, 1020),
    plans: [
      makeScenePlan("pair-custom1005-r01-g01", "树荫叉腰", "全身", "双脚靠近微内扣，双手叉腰并放松手肘，肩膀打开。", "适合梧桐树下和有纵深的街道作为开场照。", "略低于胸口竖拍，完整保留鞋子和头顶树影。", "不要耸肩，背包肩带保持可见。"),
      makeScenePlan("pair-custom1014-r01-g01", "砖墙倚杆", "全身", "背靠电杆，一手扶发，另一手拿饮品，双腿交叉前伸。", "适合砖墙、铁栏和电杆组成的复古街角。", "平视拍全身，让电杆保持竖直。", "支撑腿不要被遮住，饮品手离开身体轮廓。"),
      makeScenePlan("pair-custom1020-r01-g01", "花店回眸", "全身", "身体侧倾回眸，后腿向后抬起，一手拎饮料，另一手放松背包带。", "适合花店门口、绿植和有色彩的招牌前。", "连拍捕捉回眸与抬腿同时到位的瞬间。", "不要让帽檐遮眼，也不要裁掉抬起的脚。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-seaside-hidden-face",
    title: "海边不露脸怎么拍",
    shortTitle: "海边遮脸",
    painPoint: "不想看镜头时容易只剩僵硬背影，人物和海景也缺少动作关系。",
    promise: "用帽檐、手机、回眸、张臂和剪影动作，轻松拍出安静自然的海边氛围照。",
    categoryId: "back-view",
    poseIds: poseIdsFromRange(1037, 1052),
    plans: [
      makeScenePlan("pair-custom1037-r01-g01", "侧身回眸", "半身", "身体转向海面侧后方，双手抬到下巴附近轻轻整理袖口。", "适合傍晚海边散步，帽檐和侧脸能自然降低表情压力。", "人物放在画面偏左，为海面和远岛留出空间。", "不要把肩膀缩紧，也不要让挎包带遮住手臂。"),
      makeScenePlan("pair-custom1040-r01-g01", "双臂迎海", "背影", "背对海平线站稳，双手高举向外打开，手腕和指尖保持放松。", "适合日出日落时拍剪影或半剪影。", "让海平线落在腰到胸之间，完整保留手臂和脚部。", "不要握拳，也不要让双脚完全并拢。"),
      makeScenePlan("pair-custom1048-r01-g01", "日落比心", "背影", "站在落日前方，双臂举过头顶围成完整心形。", "适合太阳接近海平线时拍有仪式感的纪念照。", "调整站位，让心形框住太阳附近的高光。", "不要裁掉手指，也不要让心形左右失衡。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-seaside-interaction",
    title: "海边互动写真怎么拍",
    shortTitle: "海边互动",
    painPoint: "海边正面照容易只会站着笑，道具、浪花和手势很难同时拍自然。",
    promise: "用水果、礁石、水花、伸手和眨眼动作，拍出活泼有代入感的度假写真。",
    categoryId: "sea-lake",
    poseIds: poseIdsFromRange(1053, 1061).concat(poseIdsFromRange(1109, 1142)),
    plans: [
      makeScenePlan("pair-custom1053-r01-g01", "水果俏拍", "半身", "正面站稳，把香蕉轻贴脸侧，头部向道具方向微偏。", "适合海边小摊、果汁吧和彩色市集。", "使用中近景，让悬挂水果形成四周前景。", "不要完全平视僵站，也不要让水果遮住眼睛。"),
      makeScenePlan("pair-custom1055-r01-g01", "礁石狂欢", "坐姿", "坐稳礁石后把手势大胆伸向镜头，用大笑接住浪花瞬间。", "适合浪大、礁石多且动势强的海岸。", "压低机位并开启连拍，让手势、礁石和浪花同时入镜。", "先确认礁石稳固，避免在湿滑边缘拍摄。"),
      makeScenePlan("pair-custom1059-r01-g01", "牵手邀约", "半身", "一只手向镜头伸出，另一只手轻扶草帽边缘，脸部保持自然微笑。", "适合海面和天空层次干净的沙滩。", "焦点锁在脸上，允许前伸的手轻微虚化。", "不要让伸手完全挡住脸，也不要把帽檐压得太低。"),
      makeScenePlan("pair-custom1116-r01-g01", "牵手回头", "半身", "身体向前走，右手向后伸向镜头，回头打开笑容。", "适合金色沙滩、椰林小道和海边木栈道。", "摄影师略低机位跟拍，让前伸手形成第一视角。", "不要让前臂遮住身体，也不要把藤编包甩离轮廓。"),
      makeScenePlan("pair-custom1131-r01-g01", "踢水举手", "全身", "侧身单脚站稳，另一条腿向前踢起，同时一手高举张开。", "适合浪小的浅滩，用水花增加画面动势。", "开启连拍，在踢腿最高点捕捉笑容和水花。", "先确认脚下不滑，支撑腿保持微屈。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-seaside-dopamine",
    title: "多巴胺海边度假怎么拍",
    shortTitle: "海边多巴胺",
    painPoint: "海边大景里人物动作太小容易被背景淹没，花束和包也常不知道怎么拿。",
    promise: "用举花、踏浪、张臂、抬腿和回眸动作，拍出明亮舒展的海边度假大片。",
    categoryId: "sea-lake",
    poseIds: poseIdsFromRange(1062, 1077),
    plans: [
      makeScenePlan("pair-custom1062-r01-g01", "抬手迎光", "半身", "身体在潮线边微微侧转，一手从头顶划出弧线，另一手自然垂下。", "适合金色夕阳、海面反光和脚印清楚的沙滩。", "略低机位拍摄，让落日位于抬起的手臂附近。", "不要耸肩，也不要让包袋遮住身体侧线。"),
      makeScenePlan("pair-custom1063-r01-g01", "高举花束", "背影", "背对镜头站在浪边，一手把花束高举，另一手绕到头后，腰背轻轻拉长。", "适合蓝天海面纯净、人少的开阔海岸。", "拉远竖拍并为天空留白，完整保留花束和裙摆。", "不要塌肩含胸，也不要过度后弯。"),
      makeScenePlan("pair-custom1072-r01-g01", "蹲拍挥手", "蹲姿", "在沙滩边稳定半蹲，一手拿相机，另一手向镜头自然挥起。", "适合沙面平整、浪线靠近的海边日常抓拍。", "机位接近人物视线，保留手势、相机和海浪。", "不要把抬手举得僵直，也不要在湿滑斜坡下蹲。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-seaside-blue-hour",
    title: "海边蓝调夜拍怎么拍",
    shortTitle: "蓝调夜海",
    painPoint: "夜海背景容易全黑，普通站姿又缺少手部层次和情绪重点。",
    promise: "用墨镜、托脸、牵手、闪光灯和泼水动作，拍出清冷或热烈的夜海写真。",
    categoryId: "sea-lake",
    poseIds: poseIdsFromRange(1078, 1108),
    plans: [
      makeScenePlan("pair-custom1078-r01-g01", "墨镜比耶", "半身", "正面略向前倾，头轻偏一侧，贴近脸部比出小幅耶手势。", "适合傍晚蓝调和海面仍有纹理的近景位置。", "使用中近景，保留墨镜、双辫和腰间小包。", "不要让手势完全挡住墨镜，也不要端平双肩。"),
      makeScenePlan("pair-custom1084-r01-g01", "牵手向海", "背影", "背对镜头向海边走，一手向后伸出与镜头外的人牵住。", "适合沙面干净、能拍第一视角陪伴感的位置。", "边走边连拍，保留完整背影和牵手关系。", "不要补入画外人物，也不要让牵手位置出框。"),
      makeScenePlan("pair-custom1103-r01-g01", "举罐泼饮", "半身", "一手把饮料罐高举向下倾倒，另一手向侧面打开，表情和笑容完全放开。", "适合深夜海边用闪光灯拍热烈瞬间。", "使用高速连拍定格液体下落线和笑脸。", "使用清水或可安全清理的饮品，避免滑倒和污染环境。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-desert-travel",
    title: "沙漠荒野旅拍怎么拍",
    shortTitle: "沙漠旅拍",
    painPoint: "沙丘和戈壁背景开阔，动作太小会显得人物被环境吞没，长裙和帽子也容易失去层次。",
    promise: "用扬纱、提裙、迎风张臂、回眸和坐卧动作，覆盖黑裙大片、沙丘电影感与西北公路旅拍。",
    categoryId: "travel-back",
    poseIds: poseIdsFromRange(1167, 1265),
    plans: [
      makeScenePlan("pair-custom1167-r01-g01", "黑裙迎风", "全身", "身体侧向风来的方向站稳，手臂打开并让裙摆自然扬起。", "适合沙丘高点和开阔荒漠，用大动作建立人物存在感。", "略低机位竖拍，保留完整裙摆、脚部和上方留白。", "不要站在陡峭沙坡边缘，也不要裁掉扬起的裙摆。"),
      makeScenePlan("pair-custom1215-r01-g01", "沙丘回眸", "背影", "沿沙脊向前走，再从肩膀带动上身回头看镜头。", "把沙脊曲线放在人物身后，形成明确的行进方向。", "使用连拍捕捉脚步与回头同时到位的瞬间。", "不要只转头不转肩，脚部也要完整保留。"),
      makeScenePlan("pair-custom1250-r01-g01", "公路舒展", "全身", "站在安全的路边或旷野空地，双臂向两侧打开，重心落在一条腿上。", "适合戈壁、公路、风电场等横向延展的西北场景。", "镜头略低并适当拉远，让环境线条和人物全身同时入镜。", "不要在通行车道内拍摄，也不要让地平线切过头部。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-summer-city",
    title: "夏日城市街拍怎么拍",
    shortTitle: "夏日街拍",
    painPoint: "街角、斑马线和林荫道信息很多，普通站姿容易僵硬，人物也容易被背景分散。",
    promise: "用快走、扶镜、倚栏、回眸和抬腿动作，拍出清新、有节奏的城市生活感。",
    categoryId: "street-commute",
    poseIds: poseIdsFromRange(1152, 1166)
      .concat(poseIdsFromRange(1275, 1283), poseIdsFromRange(1355, 1379)),
    plans: [
      makeScenePlan("pair-custom1152-r01-g01", "街角快走", "全身", "沿街边自然迈步，手臂跟随步幅摆动，视线看向行进方向。", "适合斑马线、街角和有纵深的人行道。", "略低机位连拍，保留完整脚步与道路延伸线。", "不要在车流中停留，也不要让路牌遮住人物。"),
      makeScenePlan("pair-custom1275-r01-g01", "林荫扶镜", "半身", "身体微侧，一手轻扶镜框，另一手自然垂下或扶包。", "适合树影清楚的街边和商圈外沿，动作简洁但有生活感。", "平视拍半身或七分身，让斑驳光线落在肩侧。", "不要让镜框和手指挡住眼睛，也不要耸肩。"),
      makeScenePlan("pair-custom1355-r01-g01", "夏日回眸", "背影", "先向前走，再从肩膀带动上身回望，手臂保持自然摆动。", "适合林荫道、公园路边和明亮城市户外。", "使用连拍，在头发、衣摆和脚步同时打开时取景。", "不要只扭脖子，也不要裁掉后侧脚。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-grassland-snow",
    title: "草原雪山怎么拍",
    shortTitle: "草原雪山",
    painPoint: "草原、山湖和雪山草甸空间很大，人物动作不够舒展时容易显得拘谨。",
    promise: "用张臂、奔跑、举花、栈道漫步和草甸坐姿，拍出自由松弛的高原旅行感。",
    categoryId: "travel-back",
    poseIds: poseIdsFromRange(1284, 1315).concat(poseIdsFromRange(1328, 1345)),
    plans: [
      makeScenePlan("pair-custom1284-r01-g01", "草原张臂", "全身", "双脚分开站稳，胸口打开，双臂向两侧充分伸展。", "适合草坡、牧场和大面积蓝天背景，用动作撑起开阔画面。", "略低机位竖拍，为手臂和天空保留空间。", "不要耸肩，也不要让双手贴近画面边缘。"),
      makeScenePlan("pair-custom1312-r01-g01", "山湖栈道漫步", "全身", "沿木栈道缓慢前行，身体侧向镜头，手臂自然随步幅摆动。", "利用栈道线条引向山湖和雪山，让人物处在画面纵深中。", "平视或略低连拍，保留完整脚步和栈道方向。", "不要站在护栏外侧，也不要让栏杆切过脸部。"),
      makeScenePlan("pair-custom1328-r01-g01", "花海望雪山", "全身", "身体侧向雪山站立，手持花束或轻扶裙摆，视线看向远处。", "适合雪山、花海和草甸同框的开阔位置。", "适当拉远，把人物全身和雪山层次同时纳入竖构图。", "不要踩入花丛，也不要让花束完全挡住上身。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-spring-bouquet",
    title: "春日花束写真怎么拍",
    shortTitle: "春日花束",
    painPoint: "花束和绿植元素丰富，双手容易堆在胸前，脸部也常被花朵挡住。",
    promise: "用捧花、闻花、举花、拎包和草地坐姿，让花束成为动作支点而不是遮挡。",
    categoryId: "park-garden",
    poseIds: poseIdsFromRange(1143, 1151)
      .concat(poseIdsFromRange(1266, 1274), poseIdsFromRange(1316, 1323), poseIdsFromRange(1346, 1354)),
    plans: [
      makeScenePlan("pair-custom1143-r01-g01", "扶帽闭眼", "半身", "双手轻扶帽檐两侧，肩膀放松，闭眼自然微笑。", "适合花园台阶、绿植街边和明亮春日户外。", "平视拍半身，保留帽檐、双手和肩颈线条。", "不要压低帽檐挡脸，也不要把手肘夹得太紧。"),
      makeScenePlan("pair-custom1266-r01-g01", "花前轻嗅", "半身", "把花束抬到鼻尖下方，头部轻低，视线落在花瓣上。", "适合花园、花丛和阳光柔和的街边。", "平视拍半身，让花束和脸部保持清晰间隔。", "不要让花朵完全遮住五官，也不要耸肩。"),
      makeScenePlan("pair-custom1316-r01-g01", "草地抱花", "坐姿", "坐在草地上把花束抱在膝前，双腿自然错开，背部保持放松。", "适合公园草地、野餐区和大片绿地。", "略低或平视拍摄，保留花束、手部和坐姿关系。", "不要压坏花草，也不要让花束挡住整个上身。")
    ]
  }),
  makeTobecheckTopic({
    id: "tobecheck-watermelon-summer",
    title: "夏日西瓜怎么拍",
    shortTitle: "夏日西瓜",
    painPoint: "西瓜、草帽和街边环境色彩很强，动作处理不好容易像单纯展示道具。",
    promise: "用抱瓜、吃瓜、举瓜和趴墙互动，拍出轻松鲜活的夏日生活照。",
    categoryId: "props-action",
    poseIds: poseIdsFromRange(1388, 1396),
    plans: [
      makeScenePlan("pair-custom1388-r01-g01", "抱瓜看镜", "半身", "把西瓜抱在身体一侧，肩膀轻转，脸部看向镜头。", "适合街边、院墙和停放车辆附近的生活场景。", "平视拍半身或七分身，保留西瓜和双手。", "不要让西瓜挡住脸部，也不要站在通行车道。"),
      makeScenePlan("pair-custom1392-r01-g01", "侧坐捧番茄", "坐姿", "侧坐在石台边，双手把番茄捧在身前，肩膀放松并看向镜头。", "适合阳光明亮的路边、院墙和乡村摊位，让红色果实成为画面焦点。", "平视拍摄，完整保留坐姿、草帽、双手和番茄。", "不要让道具挡住脸，也不要坐在不稳或过高的台沿。"),
      makeScenePlan("pair-custom1396-r01-g01", "趴墙吃瓜", "半身", "上半身自然靠在矮墙边，一手托瓜，另一手把小勺停在嘴边。", "适合院墙、矮台和有生活气息的户外环境。", "平视近拍，保留草帽、双手和西瓜的互动关系。", "不要把身体压得太低，也不要让帽檐遮住眼睛。")
    ]
  })
]

const IMPORTED_1397_SCENE_TOPICS = [
  makeTobecheckTopic({
    id: 'tobecheck-tropical-island-2',
    title: '热带海岛度假怎么拍',
    shortTitle: '热带海岛',
    painPoint: '椰林、沙滩和海边廊道背景开阔，动作太小容易显得人物拘谨。',
    promise: '用举手比耶、迎风张臂、椰子互动和秋千坐姿，拍出轻快完整的海岛旅行组图。',
    categoryId: 'sea-lake',
    poseIds: poseIdsFromRange(1397, 1405)
      .concat(poseIdsFromRange(1473, 1476), poseIdsFromRange(1511, 1518), poseIdsFromRange(1541, 1558)),
    plans: [
      makeScenePlan('pair-custom1397-r01-g01', '廊道双手比耶', '全身', '身体侧向镜头，双臂举过头顶比耶，后腿屈膝轻抬。', '利用石墙和椰影形成纵深，让人物位于廊道中线附近。', '镜头降到腰腹高度略仰拍，完整保留手臂和脚部。', '不要让双手顶住画面边缘，也不要站到湿滑墙沿。'),
      makeScenePlan('pair-custom1512-r01-g01', '浅浪捧椰', '全身', '站稳浅浪后双手捧住椰子，肩膀放松，身体轻轻侧转。', '让海平线、椰子和人物全身同时入镜，突出热带道具。', '平视竖拍并开启连拍，捕捉浪花经过脚边的瞬间。', '不要背对来浪，也不要让椰子完全挡住脸。'),
      makeScenePlan('pair-custom1554-r01-g01', '秋千仰望', '坐姿', '坐稳木板，一手握绳、一手搭膝，抬脸看向斜上方。', '秋千绳形成纵向框架，背景保留海面与椰林。', '低机位拍摄，完整保留手部、绳索和坐姿关系。', '先确认秋千稳固，不要在摆动过快时拍摄。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-popart-wall',
    title: '涂鸦波普墙怎么拍',
    shortTitle: '涂鸦波普',
    painPoint: '彩色墙面信息密集，手势过多容易遮脸，人物也容易被背景抢走。',
    promise: '用抵唇、托腮、撩发和点酒窝等紧凑手势，拍出重点清楚的半身街头人像。',
    categoryId: 'art-city',
    poseIds: poseIdsFromRange(1406, 1414),
    plans: [
      makeScenePlan('pair-custom1406-r01-g01', '叠手抵唇', '半身', '双臂在胸前前后叠放，前手指节停在下唇下方，头轻靠一侧。', '人物居中，让黑白衣饰与彩色墙面形成明确对比。', '平视拍半身，保留双手、肩线和墙面图案。', '不要用力压住嘴唇，也不要让肘部完全张开。'),
      makeScenePlan('pair-custom1410-r01-g01', '屈指抵下颌', '半身', '一手松握抵住下巴底缘，另一手叉腰，形成一收一放的肩线。', '适合图案较大的墙面，用冷静表情平衡背景色彩。', '镜头与眼睛齐平，人物放在较干净的图案区域。', '不要托住整个下颌，也不要让手指挡住嘴角。'),
      makeScenePlan('pair-custom1414-r01-g01', '双指点酒窝', '半身', '两肘向内收，双手食指分别轻点脸颊，头部只微微倾斜。', '对称手势适合作为一组波普墙照片的轻快收尾。', '正面近拍，保持脸部和双手都清晰。', '不要用力戳脸，也不要让双手遮住下颌线。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-grassland-road-2',
    title: '草原公路旅拍怎么拍',
    shortTitle: '草原公路',
    painPoint: '公路和草原线条很长，普通站姿容易被环境吞没，也缺少行进感。',
    promise: '用扶帽漫步、扬手飞踢和侧身回眸，让人物与公路纵深形成清楚关系。',
    categoryId: 'travel-back',
    poseIds: poseIdsFromRange(1415, 1423),
    plans: [
      makeScenePlan('pair-custom1415-r01-g01', '扶帽漫步', '全身', '一手轻扶帽檐，身体侧向镜头，前脚沿道路标线自然迈出。', '利用公路线条引向远处草原，人物保持在安全路边。', '腰腹高度略低机位连拍，完整保留帽子和脚步。', '不要站在通行车道，也不要把帽檐压住眼睛。'),
      makeScenePlan('pair-custom1417-r01-g01', '扬手飞踢', '全身', '一手高举，另一手拨发，后腿屈膝高抬制造跳跃感。', '大幅动作适合开阔草原和无车的安全空地。', '提前倒数并连拍，在抬腿最高点取景。', '先确认脚下平整，支撑腿不要锁死。'),
      makeScenePlan('pair-custom1420-r01-g01', '侧身回眸', '全身', '身体侧对镜头，肩线顺着道路方向，头部自然回看。', '让长发和公路延伸线共同表现安静的旅行感。', '适当拉远拍全身，为道路和天空保留空间。', '不要只扭脖子，肩膀要跟随转动。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-greece-coast',
    title: '希腊海岸怎么拍',
    shortTitle: '希腊海岸',
    painPoint: '白色建筑、石堤和蓝海反差很强，动作太散会破坏干净画面。',
    promise: '用抱臂仰头、展臂旋裙和堤道扶帽，拍出简洁有层次的地中海旅拍。',
    categoryId: 'landmark-building',
    poseIds: poseIdsFromRange(1424, 1432),
    plans: [
      makeScenePlan('pair-custom1424-r01-g01', '抱臂仰头', '半身', '身体侧转约四十五度，双臂轻抱，抬起下巴并自然闭眼。', '让蓝色海面作为干净背景，突出红白穿搭。', '平视拍半身，保留肩线与海平线。', '不要夹紧手臂，也不要在强光下勉强睁眼。'),
      makeScenePlan('pair-custom1427-r01-g01', '展臂旋裙', '全身', '双臂向两侧展开，后腿轻抬，让裙摆随转身自然扬起。', '选择人少的石堤，左右各留出一臂空间。', '开启连拍，在裙摆展开且身体稳定时取景。', '不要靠近湿滑堤岸，也不要裁掉手脚。'),
      makeScenePlan('pair-custom1432-r01-g01', '堤道扶帽', '全身', '站在堤道中线，一手轻捏帽檐，另一手自然拎包，双腿并拢。', '堤道两侧边线向远处收拢，形成显高的中心构图。', '略低机位竖拍，完整纳入帽顶、裙摆和脚部。', '浪大或涨潮时不要进入堤道中段。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-cafe-space-4',
    title: '咖啡馆空间怎么拍',
    shortTitle: '咖啡空间',
    painPoint: '门框、台阶和吧台结构很多，人物容易站得僵硬或被线条切割。',
    promise: '用门边提腿、低位坐姿、阶梯交腿和倚柱捧杯，拍出有空间层次的探店照片。',
    categoryId: 'cafe-table',
    poseIds: poseIdsFromRange(1433, 1441).concat(poseIdsFromRange(1451, 1459)),
    plans: [
      makeScenePlan('pair-custom1433-r01-g01', '蓝门提腿', '全身', '背部轻靠门板，一手捏住发辫，后腿屈膝向后抬起。', '彩色门板作为完整背景，让绿植和栏杆留在侧边。', '平视竖拍，保留门框、鞋子和抬腿动作。', '不要整个人压平在门上，也不要让手腕僵硬。'),
      makeScenePlan('pair-custom1455-r01-g01', '阶梯交腿坐', '坐姿', '坐在较高一级台阶，双腿交叠下落，双臂自然搭在腿上。', '横向台阶线条帮助稳定画面，人物保持在中间区域。', '平视拍全身坐姿，保留脚部与连续台阶。', '不要靠背塌腰，也不要让膝盖挡住双手。'),
      makeScenePlan('pair-custom1458-r01-g01', '倚柱捧杯', '全身', '肩、上臂和胯部轻靠立柱，双手在腰前捧杯，双腿交叉点地。', '白墙和立柱形成极简框架，用杯子明确咖啡馆场景。', '镜头保持竖直，拍完整人物和柱体边线。', '不要把杯子抬高遮住腰线，也不要整身压在柱上。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-lotus-forest',
    title: '荷塘森林写真怎么拍',
    shortTitle: '荷塘森林',
    painPoint: '荷叶和树林背景细节丰富，人物手部容易没有支点，脸也容易被植物遮挡。',
    promise: '用扶帽、握荷、触叶、摘叶和依树动作，让人物自然融入夏日绿意。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(1442, 1450).concat(poseIdsFromRange(1519, 1524)),
    plans: [
      makeScenePlan('pair-custom1442-r01-g01', '扶帽低眉', '半身', '身体侧转，一手轻捏帽檐，低头看向脚边荷叶。', '靠近荷塘小径，用草帽边缘收住繁密背景。', '平视拍半身，保留帽檐、手部和荷叶层次。', '不要用帽檐完全遮住眼睛，也不要踩入荷塘。'),
      makeScenePlan('pair-custom1444-r01-g01', '蹲身触叶', '蹲姿', '重心放在后脚，一手指尖轻靠荷叶上方，另一手抱住荷花。', '低姿态让人物与荷叶处于同一高度，增强沉浸感。', '略低机位拍摄，完整保留蹲姿、花朵和手指。', '不要折损荷叶，也不要在湿滑岸边深蹲。'),
      makeScenePlan('pair-custom1524-r01-g01', '依树捧帽', '半身', '身体侧向树干，肩膀放松，双手在髋前捧住草帽。', '把粗树干放在画面一侧，形成自然前景框。', '平视拍半身或七分身，保留帽子和依树关系。', '不要用力靠树，也不要让帽檐挡住腰部动作。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-plane-tree-street',
    title: '梧桐老街怎么拍',
    shortTitle: '梧桐老街',
    painPoint: '林荫老街的廊柱和道路线条较多，静站容易显得生硬。',
    promise: '用捧饮回眸、交叉走位和路缘抱膝，拍出自然松弛的夏日街拍。',
    categoryId: 'street-commute',
    poseIds: poseIdsFromRange(1460, 1463),
    plans: [
      makeScenePlan('pair-custom1460-r01-g01', '捧罐回眸', '半身', '身体先转向侧面，再从肩膀带动头部回看，双手在腰前捧饮品。', '适合林荫路和老街连廊，用侧逆光勾出发丝。', '平视拍半身，保留饮品、锁骨与街道纵深。', '不要只扭脖子，也不要把手肘夹死。'),
      makeScenePlan('pair-custom1461-r01-g01', '撩发交叉走', '全身', '正面向镜头行走，一脚交叉落地，一手抬到耳侧轻撩头发。', '利用廊柱和道路延伸线表现行走节奏。', '略低机位连拍，完整保留裙摆与脚步。', '不要握拳，也不要在车行区域拍摄。'),
      makeScenePlan('pair-custom1463-r01-g01', '路缘抱膝', '坐姿', '侧坐路缘，双膝并拢屈起，双臂向前环抱小腿，低头放松。', '干净路缘与虚化街景适合安静的收尾画面。', '平视拍全身坐姿，保留脚部和道路留白。', '先确认路缘安全，不要坐在通行车辆旁。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-rocky-sunset-coast',
    title: '礁石日落海岸怎么拍',
    shortTitle: '礁石日落',
    painPoint: '礁石与栈道边缘复杂，动作不明确容易显乱，也要兼顾站位安全。',
    promise: '用礁石比耶、坐姿招手和日落张臂，拍出从白天浪花到晚霞的海岸组图。',
    categoryId: 'sea-lake',
    poseIds: poseIdsFromRange(1464, 1472).concat(poseIdsFromRange(1502, 1510)),
    plans: [
      makeScenePlan('pair-custom1464-r01-g01', '礁石双比耶', '半身', '一手在耳侧比耶，另一手在胸前做小手势，头部轻侧并眨眼。', '选择平稳礁石站位，让海面和远山保持水平。', '平视拍半身，保留双手和礁石前景。', '不要站在湿滑边缘，也不要背对突发浪花。'),
      makeScenePlan('pair-custom1472-r01-g01', '坐礁招手', '坐姿', '坐稳礁石后，一手抬到额前张掌，另一手自然前伸。', '让水面反光围绕人物，远山保持完整横向层次。', '平视或略高连拍，保留手势与坐姿支撑点。', '先确认礁石干燥稳定，避免在涨潮区域停留。'),
      makeScenePlan('pair-custom1504-r01-g01', '日落张臂', '全身', '双臂向斜上方张开成V形，肩膀下沉，双脚站稳。', '利用夕阳逆光勾勒手臂、开衫和裙摆轮廓。', '低机位竖拍，保留完整手臂与栈道护栏。', '固定好包带，不要靠近护栏外侧。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-korean-selfie',
    title: '韩系美妆自拍怎么拍',
    shortTitle: '韩系自拍',
    painPoint: '近距离自拍容易角度重复，手掌、手机和甜品也常遮住五官。',
    promise: '用托腮、捧脸、侧躺和甜品互动，拍出有变化的韩系近景自拍。',
    categoryId: 'selfie',
    poseIds: poseIdsFromRange(1477, 1492),
    plans: [
      makeScenePlan('pair-custom1477-r01-g01', '指尖托腮', '自拍', '手掌轻贴脸颊，指尖搭在颧骨附近，下巴微抬看向镜头上方。', '适合咖啡馆窗边和暖色室内，同时展示妆容与美甲。', '手机略高于眉心俯拍，保留完整手指和发丝。', '不要挤压脸部，也不要让手掌遮住眼睛。'),
      makeScenePlan('pair-custom1484-r01-g01', '侧躺伸手拍', '自拍', '上半身侧躺，一只手臂向镜头方向伸出持手机，头发自然散开。', '适合床边或沙发，用前伸手臂引导视线到脸部。', '手机略高于脸部，预留头顶空间。', '不要让肩颈承受过大压力，也不要让手臂挡脸。'),
      makeScenePlan('pair-custom1492-r01-g01', '叉子甜品照', '自拍', '一手把叉子举到脸侧，另一手支撑身体，甜品留在画面前景。', '适合咖啡馆与甜品店，人物和食物共同交代场景。', '略高角度近拍，保留叉子、表情和完整甜品。', '不要让叉尖靠近眼睛，也不要遮住嘴部。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-shanghai-landmarks',
    title: '上海地标怎么拍',
    shortTitle: '上海地标',
    painPoint: '东方明珠、外滩和陆家嘴建筑很高，普通构图容易裁掉地标或把人物拍得太小。',
    promise: '用背影比心、倚栏站姿和高楼张臂，让人物与城市天际线同时清楚。',
    categoryId: 'landmark-building',
    poseIds: poseIdsFromRange(1493, 1501),
    plans: [
      makeScenePlan('pair-custom1493-r01-g01', '明珠比心背影', '背影', '背对镜头，双手在头顶合成心形，一条小腿向后轻抬。', '调整站位让心形框住东方明珠塔身。', '腰部高度用广角仰拍，完整保留人物和塔尖。', '不要在拥挤通道停留，也不要裁掉手指。'),
      makeScenePlan('pair-custom1497-r01-g01', '护栏松弛站', '全身', '腰胯轻靠护栏，双手在包前交叠，双腿前后错开半步。', '连续护栏和老街背景适合表现都市散步感。', '平视拍全身，让护栏保持水平。', '不要整个人挂在护栏上，也不要挡住通道。'),
      makeScenePlan('pair-custom1501-r01-g01', '高楼张臂', '全身', '站稳后双臂向两侧斜向打开，头部略低并看向一侧。', '让上海中心与周边高楼保持完整竖线，人物位于画面下部。', '低机位广角仰拍，保留手臂和楼顶。', '避免超广角过度拉伸四肢，也不要站在车行区域。')
    ]
  })
]

const IMPORTED_1559_SCENE_TOPICS = [
  makeTobecheckTopic({
    id: 'tobecheck-european-bridge-riverside',
    title: '欧式桥畔写真怎么拍',
    shortTitle: '欧式桥畔',
    painPoint: '桥拱、栏杆和河岸线条很多，普通站姿容易被背景切割，人物也容易显得拘谨。',
    promise: '用杂志作支点，搭配倚栏、石阶侧坐和桥塔正面站姿，拍出安静完整的桥畔组图。',
    categoryId: 'landmark-building',
    poseIds: poseIdsFromRange(1559, 1565),
    plans: [
      makeScenePlan('pair-custom1559-r01-g01', '桥前垂杂志', '全身', '身体微侧，右手虚握杂志垂在腿前，左肩略向后收，双腿自然站稳。', '让桥拱、栏杆和河面形成横竖交叉，人物站在线条之间。', '用人像倍率拍全身，保留杂志、裙摆与桥塔轮廓。', '不要把手肘夹紧腰侧，也不要站到湿滑河岸边缘。'),
      makeScenePlan('pair-custom1562-r01-g01', '石阶侧坐回望', '坐姿', '侧坐石阶，双腿并拢折向一侧，一手压住石面支撑，头部回看镜头。', '人物压低后让整座桥完整露在身后，水面留出大块呼吸空间。', '用长焦略拉远拍摄，完整保留腿部、手掌和桥景。', '先确认石阶干燥稳固，不要坐在临水湿滑位置。'),
      makeScenePlan('pair-custom1564-r01-g01', '撩发抬膝靠栏', '全身', '一手轻触耳侧头发，另一手把卷起的杂志夹在腰侧，外侧腿屈膝轻抬。', '桥拱在人物两侧形成留白，抬腿与撩发让静态站姿更轻快。', '用人像倍率连拍全身，保留发丝、杂志和抬起的脚部。', '不要整个人压在栏杆上，也不要在湿滑河岸边单脚站立。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-homestyle-selfie',
    title: '居家氛围自拍怎么拍',
    shortTitle: '居家自拍',
    painPoint: '卧室和沙发自拍距离近，手势容易遮脸，连续拍摄也容易角度重复。',
    promise: '用兜帽、托腮、捧脸、抱枕和伸展动作，拍出有节奏的居家近景自拍。',
    categoryId: 'selfie',
    poseIds: poseIdsFromRange(1566, 1601),
    plans: [
      makeScenePlan('pair-custom1566-r01-g01', '兜帽摸发', '自拍', '帽檐停在眉毛上方，一手抬到耳侧轻搭帽口和发丝，手肘自然下沉。', '暖色墙面和少量木质家具就能形成干净居家背景。', '手机略高于眼睛近拍，保留完整帽檐、手指和肩线。', '不要让帽檐压住眼睛，也不要把小臂夹在身侧。'),
      makeScenePlan('pair-custom1575-r01-g01', '双手捧脸', '自拍', '一手贴太阳穴，另一手托住脸颊，两只手一高一低，头部向托脸侧轻倾。', '纯色墙面适合表现针织、戒指和柔和妆容。', '近距离拍头肩构图，手指、发丝与下颌线都要完整。', '不要用力挤脸，也不要让手掌遮住眼睛。'),
      makeScenePlan('pair-custom1593-r01-g01', '乱发托下颌', '自拍', '先把头发轻轻抓松，一手从画面下方抬起，用弯曲手指虚托下颌。', '暖色墙面保持干净，让碎发和眼神成为近景重点。', '手机略高于眼睛近拍，只让手腕和手指自然进入画面。', '不要让头发完全遮住眼睛，也不要真正压住下巴。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-qingdao-citywalk',
    title: '青岛街拍打卡怎么拍',
    shortTitle: '青岛街拍',
    painPoint: '海边栏杆、红瓦街区和商业街场景跨度大，动作不连贯时组图容易显散。',
    promise: '从海边倚栏到店门驻足，再用斑马线行走收尾，拍出完整的青岛城市漫游。',
    categoryId: 'travel-back',
    poseIds: poseIdsFromRange(1602, 1616),
    plans: [
      makeScenePlan('pair-custom1602-r01-g01', '海边栏杆倚靠', '全身', '身体侧转约四十五度轻倚栏杆，外侧腿站直，内侧腿微曲，手掌轻扶栏杆。', '连续蓝色栏杆、海面和红顶建筑共同交代青岛海岸。', '腰部高度平拍全身，让栏杆横线保持水平。', '不要把重心全压在栏杆上，也不要靠近临海危险区域。'),
      makeScenePlan('pair-custom1608-r01-g01', '店门驻足侧站', '半身', '双脚并拢侧向站立，双手在腹前轻叠，头部转向店门方向。', '用门框做天然框景，保留自行车或店铺陈设作为城市生活线索。', '胸口高度平拍，让门框竖线保持垂直。', '注意店门台阶，不要挡住正常进出通道。'),
      makeScenePlan('pair-custom1616-r01-g01', '斑马线大步走', '全身', '侧身大步穿过斑马线，前腿跨出踩稳，后脚跟抬起，双臂自然前后摆动。', '横向条纹和两侧街景形成节奏清楚的城市收尾画面。', '用长焦在安全位置连拍，完整保留脚步和街道纵深。', '只在绿灯与无车时拍摄，不要为了动作停留在车道中。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-red-wall-walk',
    title: '古建红墙怎么拍',
    shortTitle: '古建红墙',
    painPoint: '大片红墙背景颜色强烈，人物贴墙或动作太小会显得扁平单调。',
    promise: '用举手比耶、贴墙回眸和挥手互动，利用墙面留白拍出舒展的中式旅拍。',
    categoryId: 'landmark-building',
    poseIds: poseIdsFromRange(1617, 1632),
    plans: [
      makeScenePlan('pair-custom1617-r01-g01', '举手比耶向天', '全身', '离墙半米侧站，一手向斜上方举高比耶，另一手轻搭裙边，肩膀下沉。', '高举手臂利用红墙上方留白，灰白石基线稳定画面下沿。', '略低机位竖拍，保留完整手臂、裙摆和墙面高度。', '不要贴墙站立，也不要让手指顶住画面边缘。'),
      makeScenePlan('pair-custom1623-r01-g01', '环抱侧望交叉腿', '半身', '双手在胸前环抱，肩膀下沉，头转向侧面看远处，双腿前后交叉点地。', '红墙留白与收拢的身体线条形成安静、显瘦的杂志感画面。', '平视拍七分身，保留环抱手臂和交叉腿关系。', '不要夹紧肩颈，也不要让前后两腿完全重叠。'),
      makeScenePlan('pair-custom1632-r01-g01', '挥手打招呼', '半身', '一手在脸侧张掌挥手，手腕放松，另一手轻扶斜挎包，双脚自然打开。', '交流感动作适合放在红墙组图结尾，背景保持简洁。', '平视拍七分身，完整保留挥手动作和包袋。', '不要让手掌挡住脸，也不要把手臂锁成直角。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-seaside-beach-stairs',
    title: '海边沙滩台阶怎么拍',
    shortTitle: '沙滩台阶',
    painPoint: '沙滩风大、台阶线条密集，草帽和手臂容易遮脸，人物比例也容易被拍短。',
    promise: '用举帽行走、回眸抚肩、台阶招手和扶栏站姿，拍出清爽有变化的海边度假组图。',
    categoryId: 'sea-lake',
    poseIds: poseIdsFromRange(1633, 1646),
    plans: [
      makeScenePlan('pair-custom1633-r01-g01', '举帽迎风走', '全身', '一手把草帽举过头顶，另一手顺着裙面下垂，迎着海风自然向前迈步。', '海浪、沙滩与天空分成三层，人物保持在中央偏侧位置。', '用广角略拉远连拍，完整保留帽子、裙摆和脚步。', '不要在浪线附近倒退行走，也不要让帽子挡住脸。'),
      makeScenePlan('pair-custom1637-r01-g01', '回眸抚肩笑', '半身', '身体转向侧后方，只把头转回镜头，一手轻搭锁骨上方，肩背自然打开。', '利用海浪虚化和侧逆光表现露肩、长发与草帽轮廓。', '用人像倍率拍半身，保留手部与完整肩背线条。', '不要只扭脖子，也不要用力抓住衣料。'),
      makeScenePlan('pair-custom1642-r01-g01', '台阶举掌招呼', '全身', '站稳白色台阶，一手在脸侧张掌，另一手平贴锁骨下方，身体保持正直。', '斜向扶手、海平线和泳池色块共同形成度假民宿构图。', '腰部高度拍全身，让台阶与扶手线条完整。', '先确认台阶干燥，不要让抬手遮住下巴和眼睛。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-sunset-lakeside-form',
    title: '夕阳湖边形体怎么拍',
    shortTitle: '夕阳形体',
    painPoint: '逆光下人物容易只剩僵硬剪影，礁石站位还需要兼顾动作幅度与安全。',
    promise: '用坐姿展臂、礁石前伸和后仰弧线，拍出层次清楚的夕阳形体剪影。',
    categoryId: 'sea-lake',
    poseIds: poseIdsFromRange(1647, 1656),
    plans: [
      makeScenePlan('pair-custom1647-r01-g01', '倚石仰望展臂', '坐姿', '坐稳礁石并把重心后压在一只手掌上，另一臂高举，抬起下巴拉长颈线。', '人物落在天空和水面之间，避免被远处岸线切断。', '机位降到礁石顶面高度，完整保留手臂与坐姿支撑点。', '先确认礁石干燥稳定，涨潮或风大时不要靠近水边。'),
      makeScenePlan('pair-custom1651-r01-g01', '礁石展臂前伸', '全身', '支撑腿站稳，另一腿向斜前方绷直脚背，双臂水平打开，肩膀主动下沉。', '开阔水面和远处夕阳适合表现长线条剪影。', '用标准镜头拍全身，保留指尖、脚尖和礁石边缘。', '只在平整干燥的站位尝试，不要让悬空腿影响平衡。'),
      makeScenePlan('pair-custom1656-r01-g01', '后仰下腰绽放', '全身', '双脚站稳，从胸口和上背开始后仰，双臂向后上方打开，头发自然垂落。', '夕阳余光勾勒身体弧线，适合作为形体组图的舒展收尾。', '侧面拍摄并预留动作方向，让完整弧线落在天空背景中。', '先充分热身并安排同伴保护，风大或地面不平时不要尝试。')
    ]
  }),
  makeTobecheckTopic({
    id: 'tobecheck-terraced-tea-garden',
    title: '梯田茶园写真怎么拍',
    shortTitle: '梯田茶园',
    painPoint: '茶垄层次密集，长裙和手部动作没有安排时容易和绿色背景混在一起。',
    promise: '用石上侧坐、铺裙托腮和端茶互动，把人物、长裙与梯田线条同时拍清楚。',
    categoryId: 'park-garden',
    poseIds: poseIdsFromRange(1657, 1662),
    plans: [
      makeScenePlan('pair-custom1657-r01-g01', '侧坐叠手垂膝', '坐姿', '侧坐石面前三分之一，背部挺直，双手在膝前松松交叠，头部向镜头轻偏。', '人物压低后，茶垄和梯田层次能完整铺在身后。', '平视拍全身坐姿，保留纱裙从膝盖垂到石面的线条。', '先检查石面稳固，不要为了铺裙坐到边缘。'),
      makeScenePlan('pair-custom1660-r01-g01', '远景铺裙点下巴', '坐姿', '侧坐低石，把长裙完整铺向前方，一手指尖轻点下巴，另一手撑住石面。', '裙摆占据画面下部，树冠和茶园在上方形成环境留白。', '适当拉远拍摄，完整保留裙摆、石板路与梯田。', '不要让撑地侧肩膀歪斜，也不要把手掌压在尖锐石面。'),
      makeScenePlan('pair-custom1661-r01-g01', '篱前站姿握手', '全身', '站在竹篱笆前半步，重心落在后脚，双手在腰前轻握，肩膀下沉。', '竹篱笆横线与梯田斜线自然分层，适合展示完整服装和茶园环境。', '平视拍全身，保留裙摆、手部和篱笆边线。', '不要贴靠竹篱笆，也不要在湿滑坡面后退取景。')
    ]
  })
]

sceneTopics.push(
  ...TOBECHECK_SCENE_TOPICS,
  ...IMPORTED_1397_SCENE_TOPICS,
  ...IMPORTED_1559_SCENE_TOPICS
)

const appendPoseIdsToTopic = (topicId, poseIds) => {
  const topic = sceneTopics.find((item) => item.id === topicId)

  if (topic) {
    topic.morePoseIds = Array.from(new Set((topic.morePoseIds || []).concat(poseIds)))
  }
}

appendPoseIdsToTopic('tobecheck-seaside-street', poseIdsFromRange(1324, 1327))
appendPoseIdsToTopic('imported-tiandan', poseIdsFromRange(1380, 1387).concat(poseIdsFromRange(1525, 1540)))

const SCENE_TOPIC_ALIASES = {
  'cafe-window': 'imported-kafei',
  'city-stairs': 'pipe-sitting',
  'imported-cafe': 'imported-kafei',
  'imported-caodi1': 'imported-caodi',
  'imported-changcheng2': 'imported-changcheng1',
  'imported-haitan-a': 'beach-vacation',
  'imported-heshun2': 'imported-heshun',
  'imported-heshun3': 'imported-heshun',
  'imported-taizhuang': 'imported-yinta',
  'imported-yinta2': 'imported-yinta',
  'imported-yinta3': 'imported-yinta',
  'imported-yinta4': 'imported-yinta',
  'imported-yinta5': 'imported-yinta',
  'imported-yinxing2': 'imported-yinxing1',
  'imported-yinxing3': 'imported-yinxing1',
  'imported-yinxing4': 'imported-yinxing1',
  'imported-yinxing5': 'imported-yinxing1',
  'orchard-vine': 'imported-senlin',
  'flower-tree': 'imported-senlin'
}

const getSceneTopic = (topicId) => {
  const resolvedTopicId = SCENE_TOPIC_ALIASES[topicId] || topicId
  return sceneTopics.find((topic) => topic.id === resolvedTopicId) || sceneTopics[0]
}

module.exports = {
  SCENE_TOPIC_DETAIL_KEY,
  sceneTopics,
  getSceneTopic,
  isLandmarkTopic
}
