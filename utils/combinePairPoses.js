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
  'custom37_r01_g01',
  'custom38_r01_g01',
  'custom39_r01_g01',
  'custom40_r01_g01',
  'custom41_r01_g01',
  'custom42_r01_g01',
  'custom43_r01_g01',
  'custom44_r01_g01',
  'custom45_r01_g01',
  'custom46_r01_g01',
  'custom47_r01_g01',
  'custom48_r01_g01',
  'custom49_r01_g01',
  'custom50_r01_g01',
  'custom51_r01_g01',
  'custom52_r01_g01',
  'custom53_r01_g01',
  'custom54_r01_g01',
  'custom55_r01_g01',
  'custom56_r01_g01',
  'custom57_r01_g01',
  'custom58_r01_g01',
  'custom59_r01_g01',
  'custom60_r01_g01',
  'custom61_r01_g01',
  'custom62_r01_g01',
  'custom63_r01_g01',
  'custom64_r01_g01',
  'custom65_r01_g01',
  'custom66_r01_g01',
  'custom67_r01_g01',
  'custom68_r01_g01',
  'custom69_r01_g01',
  'custom70_r01_g01',
  'custom71_r01_g01',
  'custom72_r01_g01',
  'custom73_r01_g01',
  'custom74_r01_g01'
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
    guideImage: '/static/pose_guides/custom25/custom25_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #c7d8b7 0%, #607858 100%)'
  },
  custom26_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '溪涧提裤行走',
    tip: '推荐森林溪涧、背影行走、自然旅行照',
    description: '背对镜头赤足走在森林浅溪中，头部微低看向水流；一手伸展轻触枝叶，另一手提起阔腿裤脚，适合拍自然灵动的溪涧旅行背影照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom26/custom26_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #e8dcc9 0%, #52654b 100%)'
  },
  custom27_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '海滨墨镜托特包',
    tip: '推荐夏日海滨、正面活力、配饰全身照',
    description: '身体正对镜头，一只膝盖微弯、脚轻快抬起；左手调整头顶墨镜，右手勾着彩色托特包肩带，适合拍明亮爽朗的夏日海滨全身照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom27/custom27_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8ecf2 0%, #315d8a 100%)'
  },
  custom28_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '惊讶捂嘴自拍',
    tip: '推荐胸上自拍、夸张表情、元气手势照',
    description: '紧凑胸上自拍构图，持机手和手机不入镜；另一只手五指张开贴近脸颊，配合圆睁双眼和微启嘴唇，适合拍甜美元气的惊讶抓拍自拍感。',
    badge: '半身',
    guideImage: '/static/pose_guides/custom28/custom28_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #f4cbd9 0%, #7e6578 100%)'
  },
  custom29_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '湖畔码头整理辫',
    tip: '推荐湖畔黄昏、码头坐姿、闲适背影照',
    description: '背对镜头坐在木质码头边，赤足悬于湖面；一手撑在身旁木板上，另一手抬起整理辫子，脚尖轻点水面，适合拍慵懒闲适的湖畔黄昏背影照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom29/custom29_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #e9ad74 0%, #5c6d73 100%)'
  },
  custom30_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '珍珠折扇知性',
    tip: '推荐室内正面、折扇道具、优雅知性照',
    description: '身体正对镜头，双腿微交叉站立；右手执半开折扇轻置下颌附近，左手自然搭在腰间，适合拍沉静自信、带配饰层次的优雅正面照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom30/custom30_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #efd2ce 0%, #81706c 100%)'
  },
  custom31_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '庭园踮脚展臂',
    tip: '推荐日式庭园、背影动态、意境全身照',
    description: '背对镜头踮脚站在枯山水庭园踏石上，头部微低保持平衡；双臂向两侧展开，一脚踩稳、一脚向后抬起，适合拍轻盈有韵律感的庭园意境照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom31/custom31_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #c8d1d4 0%, #5d5f5b 100%)'
  },
  custom32_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '相机爱心街头',
    tip: '推荐涂鸦墙街拍、相机道具、创意正面照',
    description: '身体正对镜头自然站立，一手在胸前比出爱心手势，另一手举复古胶片相机凑到眼前；配合眨眼和明亮笑容，适合拍个性活力的街头全身照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom32/custom32_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d7c7a8 0%, #5a5f71 100%)'
  },
  custom33_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '山脊望远镜眺望',
    tip: '推荐徒步登山、背影探索、山谷旅行照',
    description: '背对镜头站在山脊岩石上，一脚踩高屈膝、一脚站稳；一手举望远镜远眺，另一手叉腰勾住裤袢，适合拍干练有探索感的户外登山背影照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom33/custom33_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d6b15a 0%, #4f655b 100%)'
  },
  custom34_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '机车墨镜自拍',
    tip: '推荐街头自拍、墨镜道具、酷飒半身照',
    description: '紧凑胸上自拍构图，持机手和手机不入镜；另一只手轻扶头顶圆形复古墨镜，配合微嘟嘴和冷淡自信眼神，适合拍酷飒俏皮的街头自拍感。',
    badge: '半身',
    guideImage: '/static/pose_guides/custom34/custom34_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #4c5365 0%, #15181f 100%)'
  },
  custom35_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '草甸野餐取物',
    tip: '推荐田园野餐、背影坐姿、温馨生活照',
    description: '背对镜头跪坐在野花草甸的野餐毯上，头部微低整理藤编野餐篮；一手取出法棍，另一手举起草莓端详，适合拍温馨自然的田园野餐背影照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom35/custom35_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8c5ef 0%, #8e6a4f 100%)'
  },
  custom36_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '紫衫交扣许愿',
    tip: '推荐正面温柔照、交扣手势、浪漫花景',
    description: '身体正对镜头，一脚尖微微外展、重心偏向一侧；双手举至胸前十指轻轻交扣，配合银色配饰和柔和笑容，适合拍温柔浪漫的正面全身照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom36/custom36_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8c4ef 0%, #c98f9d 100%)'
  },
  custom37_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '运动自拍点赞',
    tip: '推荐运动活力、台阶站姿、自拍道具照',
    description: '身体正对镜头，一脚踏上台阶形成不对称动感站姿；右手举手机自拍，左手在腰间竖起大拇指，适合拍青春自信的运动活力全身照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom37/custom37_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #f0f3f8 0%, #2d3038 100%)'
  },
  custom38_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '锁骨草帽侧站',
    tip: '推荐全身穿搭、自然站姿、草帽道具照',
    description: '全身入镜自然松弛站立，身体微微侧向一方，重心落于后脚、前脚轻点地面；一手轻触锁骨附近，另一手垂于身侧持握草帽，适合拍柔美从容的全身站姿照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom38/custom38_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #efe2c8 0%, #7a6658 100%)'
  },
  custom39_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '翡翠折扇提裙',
    tip: '推荐轻奢写真、折扇道具、优雅全身照',
    description: '全身入镜优雅站立，一手持闭合复古折扇轻置下颌附近，另一手轻提裙摆露出脚踝；双脚芭蕾式交叉、前脚脚尖点地，适合拍典雅精致的室内轻奢风写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom39/custom39_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #0f5f4d 0%, #c7b08b 100%)'
  },
  custom40_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '牛仔咖啡台阶',
    tip: '推荐都市街拍、咖啡道具、休闲穿搭照',
    description: '全身入镜随性站立，一手持外带咖啡杯靠近胸前，另一手拇指勾入牛仔裤前口袋；一腿承重、一腿屈膝搭在身后低矮台阶上，适合拍休闲时髦的都市街拍照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom40/custom40_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8dee7 0%, #31445d 100%)'
  },
  custom41_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '画笔贝雷舞姿',
    tip: '推荐艺术馆写真、画笔道具、文艺动态照',
    description: '全身入镜呈艺术感动态姿态，一手高举画笔如指挥棒，另一手搭于腰间；上半身微微后仰向上凝望，一腿承重、一腿屈膝向后抬起脚尖绷直，适合拍文艺别致的创意写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom41/custom41_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #efe8dc 0%, #2f2c2a 100%)'
  },
  custom42_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '羽毛球挥拍弓步',
    tip: '推荐运动风写真、户外活力、挥拍动态照',
    description: '全身入镜呈运动发力姿态，一手高举羽毛球拍挥拍，另一手向前伸展追踪球路；前腿屈膝跨出、后腿蹬直脚尖点地，适合拍动感利落的户外运动写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom42/custom42_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #f6f8fb 0%, #1f3d68 100%)'
  },
  custom43_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '蕾丝阳伞花园',
    tip: '推荐少女风写真、花园阳伞、浪漫全身照',
    description: '全身入镜浪漫站立，双手轻抬至胸前共持蕾丝阳伞搭于肩头，双眼微闭；一腿承重，另一腿屈膝向后轻抬、脚尖似触非触地面，适合拍诗意梦幻的花园少女风写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom43/custom43_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8b5c0 0%, #8d6b78 100%)'
  },
  custom44_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '海边草帽白裙',
    tip: '推荐海边度假、长裙穿搭、松弛全身照',
    description: '站在海边沙滩上，重心落在右腿，左腿微弯向前点地形成 S 型曲线；左手扶宽檐草帽，右手轻触锁骨附近发丝，适合拍松弛自然的度假氛围全身照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom44/custom44_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #f4efe4 0%, #6ca5b8 100%)'
  },
  custom45_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '草地草帽锁骨',
    tip: '推荐草地自然光、草帽道具、松弛全身照',
    description: '站在草地上呈自然 S 形站姿，重心落在后腿、前脚微微向前点地；左手握草帽垂在身侧，右手指尖轻触锁骨，适合拍温暖自然的松弛全身照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom45/custom45_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #efe4c9 0%, #6f8f56 100%)'
  },
  custom46_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '职场西装领口',
    tip: '推荐职场写真、杂志风、力量感站姿',
    description: '全身入镜呈干练力量感站姿，一手整理西装领口，另一手背于身后持黑色文件夹；前腿微屈跨出、后腿蹬直脚跟离地，适合拍利落大气的职场杂志风写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom46/custom46_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #5a5b60 0%, #7d2336 100%)'
  },
  custom47_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '草地盘坐晒太阳',
    tip: '推荐草地坐姿、松弛感写真、温暖逆光照',
    description: '坐在草地上双腿交叉盘坐，身体微微后仰，双手撑在身后草地上；头部微仰、双眼轻闭，适合拍温暖惬意的户外松弛感坐姿照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom47/custom47_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #ece2d2 0%, #4f6f43 100%)'
  },
  custom48_r01_g01: {
    categoryId: 'outfit-standing',
    categoryName: '全身穿搭',
    name: '礁石粉裙侧坐',
    tip: '推荐海边度假、礁石坐姿、柔美长裙照',
    description: '侧身坐在海边礁石上，双腿并拢向一侧延伸、脚尖微绷；一手撑在身后保持平衡，另一手搭在膝上扶宽檐草帽，适合拍慵懒优雅的海边度假坐姿照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom48/custom48_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #efb7ac 0%, #6ca1b5 100%)'
  },
  custom49_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '风衣拢发行走',
    tip: '推荐通勤街拍、行走抓拍、风衣穿搭照',
    description: '捕捉行走中的动态瞬间，一手随步伐自然前摆，另一手抬起轻拢耳后发丝；前腿迈出脚跟落地、后腿蹬地脚尖将离地，适合拍洒脱利落的通勤街拍照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom49/custom49_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #c7945e 0%, #314b67 100%)'
  },
  custom50_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '草地相机迈步',
    tip: '推荐草地行走、相机道具、生活感抓拍',
    description: '草地上大步行走的瞬间，一脚踩稳、一脚轻盈抬起，身体微微前倾；左手随步伐前摆，右手举复古胶片相机靠近胸前，适合拍活力自然的生活感抓拍。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom50/custom50_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #e8dfcf 0%, #b5673e 100%)'
  },
  custom51_r01_g01: {
    categoryId: 'portrait-half',
    categoryName: '半身写真',
    name: '木凳相机休闲',
    tip: '推荐咖啡馆写真、相机道具、松弛坐姿',
    description: '坐在低矮木凳上，一手轻搭膝头，另一手举复古胶片相机凑近眼前；一腿屈膝踩地，另一腿前伸脚踝交叠，适合拍慵懒舒适的日常休闲写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom51/custom51_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d9c8ae 0%, #6b7453 100%)'
  },
  custom52_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '海边蹲姿拾贝',
    tip: '推荐海边旅行、蹲姿互动、自然探索感',
    description: '蹲在海水与沙滩交界处，一腿膝盖轻触湿沙，另一腿弯曲支撑；一手在沙面划出纹路，另一手捏着小贝壳低头端详，适合拍灵动静谧的海边探索感写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom52/custom52_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #eee4d2 0%, #6aa5b8 100%)'
  },
  custom53_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '晚霞海滩拎鞋',
    tip: '推荐海边日落、行走抓拍、松弛度假照',
    description: '日落海滩上悠然漫步，一脚向前迈出陷入细沙、后脚刚离地；一手插在裤袋中，另一手拎着人字拖自然垂落，适合拍静谧诗意的海边行走照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom53/custom53_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #1d365a 0%, #e58a74 100%)'
  },
  custom54_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '跑动挥手活力',
    tip: '推荐运动风写真、跑动抓拍、户外活力照',
    description: '全身入镜捕捉轻快跑动瞬间，一手高举向镜头挥舞，另一臂自然屈肘摆动；一腿高抬屈膝腾空，另一腿蹬地将离地，适合拍灿烂有感染力的运动活力照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom54/custom54_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #ff8a8f 0%, #252a32 100%)'
  },
  custom55_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '草地蹲姿看花',
    tip: '推荐草地自然光、蹲姿互动、生活感写真',
    description: '蹲在草地上双膝弯曲、身体低伏，一手伸向前方触碰雏菊，另一手自然搭在膝盖上；头部微侧、目光低垂看向花朵，适合拍宁静温柔的自然生活感写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom55/custom55_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8b2bb 0%, #6d8f55 100%)'
  },
  custom56_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '蹲姿撸猫互动',
    tip: '推荐宠物互动、日系休闲、低伏蹲姿照',
    description: '全身入镜低伏蹲姿，一手撑地五指张开保持平衡，另一手轻抚身旁白色小猫；双腿深屈膝蹲低、脚跟微抬，适合拍生动温馨的宠物互动写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom56/custom56_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #b9d7e8 0%, #b85b4b 100%)'
  },
  custom57_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '海水踢浪嬉戏',
    tip: '推荐夏日海边、踢水动态、活力旅行照',
    description: '站在齐踝深海水中嬉戏，一腿向前踢起水花，双臂向两侧张开保持平衡；一手弹起水花、另一手高举张开，适合拍自由欢快的夏日海边动态照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom57/custom57_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #ffd13d 0%, #40a9cf 100%)'
  },
  custom58_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '草地慢跑腾空',
    tip: '推荐草地跑步、运动活力、腾空抓拍',
    description: '草地上轻盈慢跑的瞬间，双脚同时离地形成腾空姿态；双臂自然弯曲随节奏摆动，高马尾向后飞扬，适合拍青春自由的户外运动抓拍。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom58/custom58_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #9fbf9a 0%, #41474d 100%)'
  },
  custom59_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '栈道相机侧站',
    tip: '推荐旅行抓拍、相机道具、自然侧站照',
    description: '自然放松地站在木质栈道上，身体重心偏向一侧形成 S 形曲线；一手将复古胶片相机举至胸前，另一手随意插入口袋，双脚前后错落站立，适合拍从容松弛的旅行抓拍照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom59/custom59_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d4b98a 0%, #536c78 100%)'
  },
  custom60_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '公路草帽行走',
    tip: '推荐公路旅行、行走抓拍、草帽道具照',
    description: '轻快行走在空旷公路上，一腿向前跨出、对侧手臂顺势后摆；右手垂于身侧轻握编织草帽，左手抬起将发丝拢至耳后，适合拍松弛愉悦的旅行动态照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom60/custom60_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d9b16f 0%, #65747b 100%)'
  },
  custom61_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '石桥相机侧站',
    tip: '推荐旅行抓拍、相机道具、桥上自然站姿',
    description: '自然站在石桥上，身体微微侧向镜头；左手轻搭桥栏，右手持复古相机垂于身前，右腿微屈脚尖点地，头部略转向远方，适合拍不经意的旅行抓拍照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom61/custom61_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #c8b08a 0%, #586b73 100%)'
  },
  custom62_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '台阶拍立得坐姿',
    tip: '推荐户外街拍、台阶坐姿、拍立得道具照',
    description: '随性坐在户外石阶上，一腿向前伸展搭在下方台阶，另一腿屈膝撑起并将手肘搭在膝盖上；左手举拍立得相机，右手撩拨头发，适合拍酷感十足的街头坐姿写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom62/custom62_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #22262f 0%, #c77b4d 100%)'
  },
  custom63_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '站台行李箱坐姿',
    tip: '推荐复古旅行、站台场景、行李箱坐姿照',
    description: '悠然坐在火车站台的复古行李箱上，身体微微侧转，一条腿搭在另一条腿脚踝处；双手轻搭行李箱边缘，微微回头望向铁轨远方，适合拍带有旅途期待感的复古写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom63/custom63_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #c28d5a 0%, #5b5f68 100%)'
  },
  custom64_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '台阶雨伞咖啡',
    tip: '推荐城市台阶、咖啡雨伞道具、知性街拍',
    description: '以对角线站姿立于现代城市石阶上，右脚踩高一级台阶、左脚落低一级台阶；左手端外带咖啡，右手握透明雨伞轻搭肩头，适合拍优雅知性的情绪感街拍。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom64/custom64_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8c0a1 0%, #75846f 100%)'
  },
  custom65_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '石桥读书侧坐',
    tip: '推荐石桥场景、读书道具、慵懒文艺坐姿',
    description: '侧身坐在石桥栏杆边缘，一腿自然垂落悬空，另一腿屈膝踩在栏杆边沿；一手捧着翻开的平装书搁在膝上，另一手抬起调整头顶墨镜，适合拍慵懒午后的文艺旅行照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom65/custom65_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #9eb09a 0%, #5c6b78 100%)'
  },
  custom66_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '石桥系鞋带蹲姿',
    tip: '推荐石桥场景、运动街拍、蹲姿系鞋带动作',
    description: '活泼地蹲在石桥上，一脚屈膝跪地、另一脚踩实桥面；一手向下系白色运动鞋鞋带，另一手撑在膝上保持平衡，适合拍青春动感的街头运动风写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom66/custom66_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8d1bd 0%, #66714d 100%)'
  },
  custom67_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '站台立柱读书',
    tip: '推荐复古站台、靠柱站姿、书本咖啡道具',
    description: '斜倚在火车站台复古立柱旁，一侧肩膀轻靠柱面，同侧腿屈膝脚底贴柱；一手举翻开的书至胸前，另一手握热咖啡垂于腰际，适合拍沉静知性的候车街拍。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom67/custom67_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #b8a27b 0%, #32353a 100%)'
  },
  custom68_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '蓝调台阶靠墙',
    tip: '推荐夜景人像、台阶靠墙、仙女棒氛围照',
    description: '倚靠在幽静小巷老石阶旁，背部轻贴侧墙，一脚平踩台阶、另一脚屈膝蹬在身后墙壁；左手高举燃烧的仙女棒，右手将复古手账本按在胸前，适合拍蓝调时刻的电影感夜景人像。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom68/custom68_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #1d2b45 0%, #d6a344 100%)'
  },
  custom69_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '湖边提鞋踢水',
    tip: '推荐湖边浅水、提鞋道具、度假感动态照',
    description: '赤足踏入清澈湖水中，一手提着脱下的白色帆布鞋，另一手轻提长裙裙摆至脚踝上方；一只脚俏皮轻踢水面，适合拍明亮治愈的夏日湖畔度假照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom69/custom69_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d7b6b2 0%, #7fa0a2 100%)'
  },
  custom70_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '古树咖啡靠站',
    tip: '推荐秋日森林、古树倚靠、咖啡道具照',
    description: '斜倚在粗壮古树旁，一侧肩膀轻靠树干，双腿交叉靴尖点地；一手插在毛衣口袋中，另一手捧着热咖啡贴近胸前，适合拍深秋森林的温暖静谧写真。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom70/custom70_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #9a4a32 0%, #3e2d25 100%)'
  },
  custom71_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '栈桥写生盘坐',
    tip: '推荐湖边栈桥、盘腿坐姿、写生苹果道具',
    description: '盘腿坐在延伸至湖心的木质栈桥上，速写本摊开放在膝上；一手握铅笔勾勒线条，另一手举着咬过的苹果停在嘴边，适合拍安静专注的湖边写生氛围照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom71/custom71_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #c4b79a 0%, #596b61 100%)'
  },
  custom72_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '森林树枝侧坐',
    tip: '推荐春日森林、树枝坐姿、清新俏皮写真',
    description: '侧身坐在森林中粗壮的横向树枝上，双腿自然垂落轻晃；一手扶着树枝保持平衡，另一手向上探出轻触头顶叶片，适合拍清新灵动的春日森林照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom72/custom72_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #b9d7c5 0%, #4d6b45 100%)'
  },
  custom73_r01_g01: {
    categoryId: 'travel-back',
    categoryName: '旅行背影',
    name: '芦苇浅滩漫步',
    tip: '推荐湖边浅滩、芦苇互动、手杖道具照',
    description: '赤足行走在湖边浅滩，一手拄长木质手杖保持平衡，另一手向外伸展轻拂岸边芦苇顶端；一脚踏入浅水荡开涟漪，适合拍静谧自然的湖畔漫步照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom73/custom73_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #e5dfcf 0%, #9b6c4b 100%)'
  },
  custom74_r01_g01: {
    categoryId: 'street-dynamic',
    categoryName: '街拍动态',
    name: '野餐垫托腮趴姿',
    tip: '推荐湖岸野餐、趴姿托腮、慵懒少女感照片',
    description: '趴在湖岸草地的格纹野餐垫上，双肘撑地、双手托腮，双腿在身后屈膝翘起并交叉脚踝；面前摆着书、法棍和葡萄，适合拍慵懒午后的野餐氛围照。',
    badge: '全身',
    guideImage: '/static/pose_guides/custom74/custom74_r01_g01_contour.png',
    gradient: 'linear-gradient(150deg, #d8c0df 0%, #6f7d58 100%)'
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
