const combinePairIds = [
  'custom1_r01_g01',
  'custom2_r01_g01',
  'custom3_r01_g01',
  'custom4_r01_g01',
  'custom5_r01_g01',
  'custom6_r01_g01',
  'custom7_r01_g01',
  'custom8_r01_g01',
  'custom9_r01_g01',
  'custom10_r01_g01',
  'custom11_r01_g01',
  'custom12_r01_g01',
  'custom13_r01_g01',
  'custom14_r01_g01',
  'custom15_r01_g01',
  'custom16_r01_g01',
  'custom17_r01_g01',
  'custom18_r01_g01',
  'custom19_r01_g01',
  'custom20_r01_g01',
  'custom21_r01_g01',
  'custom22_r01_g01',
  'custom23_r01_g01',
  'custom24_r01_g01',
  'custom25_r01_g01',
  'custom26_r01_g01',
  'custom27_r01_g01',
  'custom28_r01_g01',
  'custom29_r01_g01',
  'custom30_r01_g01',
  'custom31_r01_g01',
  'custom32_r01_g01',
  'custom33_r01_g01',
  'custom34_r01_g01',
  'custom35_r01_g01',
  'custom36_r01_g01',
  'custom37_r01_g01'
]

const poseMetadataOverrides = {
  custom1_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '温柔侧身半身',
    tip: '推荐日常写真、半身照、侧身显瘦',
    description: '身体微微转向左侧，头部自然回正，视线轻看镜头斜上方；一手垂放、一手轻搭腰间，适合拍随性温柔的半身侧身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f7f1ec 0%, #8a7468 100%)'
  },
  custom2_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '侧光撩发半身',
    tip: '推荐日常写真、互动感半身、温柔光影照',
    description: '正面偏侧站立，头部微微向右倾，一手轻抚耳侧发丝，另一手自然垂放；直视镜头配合浅笑，适合拍自然亲和的侧光半身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f5efe8 0%, #816d60 100%)'
  },
  custom3_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '一字肩托腮',
    tip: '推荐知性半身、锁骨肩线、故事感写真',
    description: '半身正面姿态，一手轻托下巴作思考状，另一手自然环抱身前；头部微倾、眼神低垂，适合拍温柔沉静的知性氛围照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f5f3ef 0%, #7f7a73 100%)'
  },
  custom4_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '长裙从容侧身',
    tip: '推荐全身照、长裙户外、优雅站姿',
    description: '身体以四分之三角度微侧面向镜头，重心落于后脚，前脚自然着地；一手垂放、一手轻搭腰间，适合拍简洁大方的长裙全身照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #efe7dc 0%, #766b60 100%)'
  },
  custom5_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '侧身撩发抬眸',
    tip: '推荐温柔毛衣照、撩发半身、灵动眼神照',
    description: '半身侧身站立，一手轻撩耳侧发丝，头部微倾；从低垂视线到抬眸看向镜头，配合侧光和浅笑，适合拍温柔甜美的自然半身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f7f0e7 0%, #8b7664 100%)'
  },
  custom6_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '回眸显腿长',
    tip: '推荐全身穿搭、逆光街拍、显比例站姿',
    description: '全身微侧站立，一脚前伸点地拉长腿部线条，一手叉腰、一手自然下垂；头部回眸看向镜头，适合拍自信温柔的高腰穿搭照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #f6eadc 0%, #8a6d55 100%)'
  },
  custom7_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '咖啡街拍行走',
    tip: '推荐都市街拍、行走抓拍、休闲通勤穿搭',
    description: '全身自然行走姿态，一手握咖啡杯垂于身侧，另一手随步伐轻摆；低眸再抬眸看向镜头，适合拍随性自在的都市街拍感。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #eef0ed 0%, #5f6760 100%)'
  },
  custom8_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '户外自然站姿',
    tip: '推荐户外人像、日常全身照、亲和站姿',
    description: '全身自然站立，重心均匀、身形挺拔舒展，一手自然垂放身侧；面向镜头温和微笑，适合作为亲切自信的户外日常站姿参考。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #f2eadf 0%, #6f655a 100%)'
  },
  custom9_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '西装咖啡街拍',
    tip: '推荐都市街拍、通勤全身照、咖啡随拍',
    description: '身体微侧，重心落于后腿，前腿微屈放松；左手插在阔腿裤口袋，右手自然垂放轻握咖啡，适合拍干练利落又闲适从容的都市全身照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #eee7dc 0%, #7b6d60 100%)'
  },
  custom10_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '山顶背影跃动',
    tip: '推荐创意背影、旅行全身照、活力动态照',
    description: '背影站立于山顶，重心落于左腿，右腿向后踢起；右臂高举、左臂向侧方舒展，适合拍青春自由、开放有表现力的旅行背影照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #f2ddbf 0%, #66725b 100%)'
  },
  custom11_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '回眸撩发背影',
    tip: '推荐户外背影、长裙写真、温柔抓拍',
    description: '背影微侧站立，头部轻柔回眸望向镜头方向；右手抬起轻触耳侧发丝，左手自然垂放，适合拍不经意抓拍感的温柔户外人像。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #efe4d4 0%, #6f725d 100%)'
  },
  custom12_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '短发逆光回眸',
    tip: '推荐都市街拍、逆光背影、松弛感全身照',
    description: '背对镜头站在暖调街道中，身体微侧、头部回眸微笑；右手轻触衣领，左手自然垂放，适合拍松弛优雅的都市逆光背影照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #f1dfc4 0%, #806f5e 100%)'
  },
  custom13_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '湖畔草帽回眸',
    tip: '推荐湖畔日落、长裙背影、旅行氛围照',
    description: '背对镜头站在湖心栈桥上，身体微侧、头部轻柔回眸；双手在身后握着宽檐草帽，适合拍自然舒展的湖畔日落背影照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #f2c7a4 0%, #4e5363 100%)'
  },
  custom14_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '山海遮阳回眸',
    tip: '推荐山海旅行、黄金时段、草坡背影照',
    description: '背对镜头站在俯瞰大海的草坡山丘上，身体微侧、头部回眸微笑；一手抬起搭在眉间遮挡阳光，适合拍随性优雅的山海旅行背影照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #f1c6b6 0%, #6f7f79 100%)'
  },
  custom15_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '古巷提篮回眸',
    tip: '推荐古镇旅行、清晨街拍、松弛背影照',
    description: '背对镜头漫步在古镇鹅卵石小巷中，身体微侧、头部回眸微笑；一手提着编织小篮，另一手轻拢耳畔碎发，适合拍闲适从容的旅行街拍照。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #d6d7bd 0%, #6d7466 100%)'
  },
  custom16_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '露台披肩回眸',
    tip: '推荐屋顶露台、都市夜景、冷暖氛围照',
    description: '背对镜头站在暮色屋顶露台上，身体微侧、头部轻柔回眸；一手搭在栏杆上，另一手挽着披肩自然垂落，适合拍优雅从容的都市夜景人像。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #d8c2b2 0%, #2e3d5f 100%)'
  },
  custom17_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '海边提鞋回眸',
    tip: '推荐海边日出、长裙背影、梦幻旅行照',
    description: '背对镜头站在清晨沙滩上，身体微侧、头部轻柔回眸；一手提着平底凉鞋，另一手提起裙角避开浅浪，适合拍轻盈自然的海边日出人像。',
    badge: '全身',
    gradient: 'linear-gradient(150deg, #f3b7aa 0%, #6fa6b4 100%)'
  },
  custom18_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '自拍侧身撩发',
    tip: '推荐半身自拍、撩发动作、柔和侧光照',
    description: '半身自拍构图，身体微侧、头部自然倾斜；一手轻触耳侧发丝，肘部展开形成柔和三角构图，适合拍松弛自然的撩发半身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f2ddd3 0%, #7d6d68 100%)'
  },
  custom19_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '侧身远眺撩发',
    tip: '推荐半身写真、侧身撩发、随性抓拍感',
    description: '半身构图中身体向左微侧约30度，右手抬起轻搭耳侧发丝，面部朝向镜头左前方、目光柔和望向远处，适合拍松弛不刻意的侧身撩发照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f0e0d5 0%, #7b6f68 100%)'
  },
  custom20_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '窗光浅笑撩发',
    tip: '推荐半身自拍、室内窗光、自然浅笑照',
    description: '半身自拍构图，身体微侧、头部自然倾斜约15度；一手轻触耳侧发丝，眼神柔和直视镜头，适合拍室内窗光下松弛自然的撩发半身照。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f1ddd4 0%, #7a6d66 100%)'
  },
  custom21_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '午后窗边撩发',
    tip: '推荐半身自拍、午后窗光、明亮笑意照',
    description: '半身自拍构图，身体微侧、头部自然倾斜；一手轻触耳侧发丝，面向镜头露出明亮放松的笑意，适合拍午后窗边自然光下的生动抓拍感。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f4dfd4 0%, #806f66 100%)'
  },
  custom22_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '咖啡馆端杯撩发',
    tip: '推荐咖啡馆写真、端杯道具、生活感半身照',
    description: '半身构图中身体微侧面向镜头，左手端着咖啡置于胸前，右手将发丝别到耳后；柔和直视配合温暖微笑，适合拍随性有生活气息的咖啡馆人像。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #d7e2ec 0%, #8b6f58 100%)'
  },
  custom23_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '夕阳胸上自拍',
    tip: '推荐胸上自拍、夕阳逆光、自然笑容照',
    description: '紧凑胸上自拍构图，画面不出现手部或手机，仅通过肩膀微抬暗示自拍；头部微偏、长发垂落肩头，适合拍夕阳逆光下自然真诚的半身自拍感。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #f2c49b 0%, #7e6659 100%)'
  },
  custom24_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '百叶窗触脸自拍',
    tip: '推荐胸上自拍、触脸手势、百叶窗光影照',
    description: '紧凑胸上自拍构图，持机手和手机不入镜；另一只手指尖轻触下颌线，头部向手侧微倾，适合拍午后百叶窗光影下自信明亮的自然自拍感。',
    badge: '半身',
    gradient: 'linear-gradient(150deg, #ead7c5 0%, #715f58 100%)'
  },
  custom25_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '绿裙草帽比耶',
    tip: '推荐连衣裙全身照、正面笑容、活力旅行照',
    description: '身体正对镜头，一脚微微前伸并让重心落在一侧髋部；右手在脸颊旁比出小V手势，左手提着草编遮阳帽，适合拍活泼明亮的正面全身照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom25/custom25_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #c7d8b7 0%, #607858 100%)'
  },
  custom26_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '溪涧提裤行走',
    tip: '推荐森林溪涧、背影行走、自然旅行照',
    description: '背对镜头赤足走在森林浅溪中，头部微低看向水流；一手伸展轻触枝叶，另一手提起阔腿裤脚，适合拍自然灵动的溪涧旅行背影照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom26/custom26_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #e8dcc9 0%, #52654b 100%)'
  },
  custom27_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '海滨墨镜托特包',
    tip: '推荐夏日海滨、正面活力、配饰全身照',
    description: '身体正对镜头，一只膝盖微弯、脚轻快抬起；左手调整头顶墨镜，右手勾着彩色托特包肩带，适合拍明亮爽朗的夏日海滨全身照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom27/custom27_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8ecf2 0%, #315d8a 100%)'
  },
  custom28_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '惊讶捂嘴自拍',
    tip: '推荐胸上自拍、夸张表情、元气手势照',
    description: '紧凑胸上自拍构图，持机手和手机不入镜；另一只手五指张开贴近脸颊，配合圆睁双眼和微启嘴唇，适合拍甜美元气的惊讶抓拍自拍感。',
    badge: '半身',
    guideImage: '/static/pose_pairs/custom28/custom28_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #f4cbd9 0%, #7e6578 100%)'
  },
  custom29_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '湖畔码头整理辫',
    tip: '推荐湖畔黄昏、码头坐姿、闲适背影照',
    description: '背对镜头坐在木质码头边，赤足悬于湖面；一手撑在身旁木板上，另一手抬起整理辫子，脚尖轻点水面，适合拍慵懒闲适的湖畔黄昏背影照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom29/custom29_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #e9ad74 0%, #5c6d73 100%)'
  },
  custom30_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '珍珠折扇知性',
    tip: '推荐室内正面、折扇道具、优雅知性照',
    description: '身体正对镜头，双腿微交叉站立；右手执半开折扇轻置下颌附近，左手自然搭在腰间，适合拍沉静自信、带配饰层次的优雅正面照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom30/custom30_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #efd2ce 0%, #81706c 100%)'
  },
  custom31_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '庭园踮脚展臂',
    tip: '推荐日式庭园、背影动态、意境全身照',
    description: '背对镜头踮脚站在枯山水庭园踏石上，头部微低保持平衡；双臂向两侧展开，一脚踩稳、一脚向后抬起，适合拍轻盈有韵律感的庭园意境照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom31/custom31_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #c8d1d4 0%, #5d5f5b 100%)'
  },
  custom32_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '相机爱心街头',
    tip: '推荐涂鸦墙街拍、相机道具、创意正面照',
    description: '身体正对镜头自然站立，一手在胸前比出爱心手势，另一手举复古胶片相机凑到眼前；配合眨眼和明亮笑容，适合拍个性活力的街头全身照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom32/custom32_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d7c7a8 0%, #5a5f71 100%)'
  },
  custom33_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '山脊望远镜眺望',
    tip: '推荐徒步登山、背影探索、山谷旅行照',
    description: '背对镜头站在山脊岩石上，一脚踩高屈膝、一脚站稳；一手举望远镜远眺，另一手叉腰勾住裤袢，适合拍干练有探索感的户外登山背影照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom33/custom33_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d6b15a 0%, #4f655b 100%)'
  },
  custom34_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '机车墨镜自拍',
    tip: '推荐街头自拍、墨镜道具、酷飒半身照',
    description: '紧凑胸上自拍构图，持机手和手机不入镜；另一只手轻扶头顶圆形复古墨镜，配合微嘟嘴和冷淡自信眼神，适合拍酷飒俏皮的街头自拍感。',
    badge: '半身',
    guideImage: '/static/pose_pairs/custom34/custom34_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #4c5365 0%, #15181f 100%)'
  },
  custom35_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '草甸野餐取物',
    tip: '推荐田园野餐、背影坐姿、温馨生活照',
    description: '背对镜头跪坐在野花草甸的野餐毯上，头部微低整理藤编野餐篮；一手取出法棍，另一手举起草莓端详，适合拍温馨自然的田园野餐背影照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom35/custom35_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8c5ef 0%, #8e6a4f 100%)'
  },
  custom36_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '紫衫交扣许愿',
    tip: '推荐正面温柔照、交扣手势、浪漫花景',
    description: '身体正对镜头，一脚尖微微外展、重心偏向一侧；双手举至胸前十指轻轻交扣，配合银色配饰和柔和笑容，适合拍温柔浪漫的正面全身照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom36/custom36_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8c4ef 0%, #c98f9d 100%)'
  },
  custom37_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '运动自拍点赞',
    tip: '推荐运动活力、台阶站姿、自拍道具照',
    description: '身体正对镜头，一脚踏上台阶形成不对称动感站姿；右手举手机自拍，左手在腰间竖起大拇指，适合拍青春自信的运动活力全身照。',
    badge: '全身',
    guideImage: '/static/pose_pairs/custom37/custom37_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #f0f3f8 0%, #2d3038 100%)'
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
    thumbnailImage: `/static/pose_thumbs/${folder}/${pairId}_thumb.jpg`,
    modelImage: `/static/pose_pairs/${folder}/${pairId}_demo.jpg`,
    detailImage: `/static/pose_pairs/${folder}/${pairId}_demo.jpg`,
    thumbnailMode: 'aspectFill',
    parts: [],
    ...poseMetadataOverrides[pairId]
  }
})

module.exports = {
  combinePairPoses
}
