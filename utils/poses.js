const { assetUrl } = require('./assets')
const { combinePairPoses } = require('./combinePairPoses')
const { comparePoseByRichness } = require('./poseRanking')

const customPoseId = (number) => `pair-custom${number}-r01-g01`
const removedPoseNumbers = new Set([1, 2, 3, 6, 7, 8, 9, 10, 12, 21, 22, 23, 25, 27, 28, 30, 32, 36, 37])
const getPoseNumber = (poseId = '') => {
  const match = String(poseId).match(/custom(\d+)/)

  return match ? Number(match[1]) : 0
}
const keepActivePoseNumber = (number) => !removedPoseNumbers.has(number)

const poseTemplates = combinePairPoses
  .filter((pose) => keepActivePoseNumber(getPoseNumber(pose.id)))
  .map((pose) => ({
    ...pose,
    guideImage: assetUrl(pose.guideImage),
    thumbnailImage: assetUrl(pose.thumbnailImage),
    shareImage: assetUrl(pose.shareImage),
    modelImage: assetUrl(pose.modelImage),
    detailImage: assetUrl(pose.detailImage)
  }))

const uniquePoseNumbers = (...numberLists) => {
  const seenNumbers = new Set()

  return numberLists
    .flat()
    .map((number) => Number(number))
    .filter((number) => {
      if (!number || seenNumbers.has(number) || !keepActivePoseNumber(number)) {
        return false
      }

      seenNumbers.add(number)
      return true
    })
}

const getPoseSearchText = (pose = {}) => [
  pose.name,
  pose.description,
  pose.tip,
  ...(pose.searchKeywords || []),
  ...(pose.tags || [])
].join(' ')

const findPoseNumbersByText = (includeTerms = [], options = {}) => {
  const excludeTerms = options.excludeTerms || []
  const limit = Number(options.limit || 0)
  const matchedNumbers = poseTemplates
    .filter((pose) => {
      const searchText = getPoseSearchText(pose)
      const hasIncludedTerm = includeTerms.some((term) => searchText.includes(term))
      const hasExcludedTerm = excludeTerms.some((term) => searchText.includes(term))

      return hasIncludedTerm && !hasExcludedTerm
    })
    .map((pose) => getPoseNumber(pose.id))

  return limit > 0 ? matchedNumbers.slice(0, limit) : matchedNumbers
}

const categoryDefinitions = [
  {
    id: 'outfit-standing',
    name: '今天拍穿搭',
    subtitle: '想拍全身照、显高显比例、连衣裙或通勤穿搭时用',
    preferredPoseNumbers: [278, 270, 265, 279, 119, 127, 101, 92],
    deprioritizedPoseNumbers: [131],
    poseNumbers: [38, 39, 41, 43, 44, 45, 46, 49, 91, 92, 94, 97, 99, 101, 106, 107, 109, 112, 113, 116, 117, 119, 120, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 247, 248, 249, 250, 251, 265, 270, 275, 278, 279, 287, 694, 696, 697]
  },
  {
    id: 'portrait-half',
    name: '半身近景',
    subtitle: '只放胸上、半身、肩颈、表情和手部近景人像',
    preferredPoseNumbers: [280, 84, 76, 88, 80, 85, 89, 78, 87],
    poseNumbers: [5, 19, 20, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 154, 173, 179, 186, 187, 190, 214, 223, 224, 235, 264, 280, 291, 293, 294, 304, 310, 311, 315, 318, 319, 328, 331, 334, 336, 337, 350, 357, 379, 397, 399, 401, 403, 404, 411, 421, 424, 427, 428, 429, 430, 433, 435, 437, 438, 439, 440, 441, 445, 455, 456, 458, 459, 466, 473, 480, 500, 505, 506, 510, 514, 521, 529, 570, 572, 574, 576, 583, 586, 591, 599, 609, 612, 614, 618, 621, 625, 630, 632, 633, 634, 639, 643, 644, 646, 647, 649, 650, 657, 661, 666, 667, 669, 670, 674, 677, 681, 682, 685, 686, 688, 692, 693, 694, 695, 699, ...Array.from({ length: 9 }, (_, index) => 1143 + index)]
  },
  {
    id: 'street-commute',
    name: '出门街拍',
    subtitle: '适合城市街头、通勤路上、西装、机车和运动感照片',
    preferredPoseNumbers: [119, 130, 127, 126, 128, 116, 123, 101, 92, 107, 110, 121, 87, 34],
    deprioritizedPoseNumbers: [131],
    poseNumbers: [16, 34, 40, 42, 46, 49, 50, 53, 54, 57, 58, 60, 64, 66, 67, 68, 87, 91, 92, 93, 97, 101, 104, 107, 109, 110, 115, 116, 119, 120, 121, 123, 124, 126, 127, 128, 130, 131, 331, 332, 333, 341, 373, 376, 389, 391, 392, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 472, 474, 493, 496, 497, 500, 511, 560, 564, 581, 582, 585, 592, 596, 648, 651, 653, 656, ...Array.from({ length: 16 }, (_, index) => 1005 + index), ...Array.from({ length: 15 }, (_, index) => 1152 + index), ...Array.from({ length: 9 }, (_, index) => 1275 + index), ...Array.from({ length: 25 }, (_, index) => 1355 + index)]
  },
  {
    id: 'travel-back',
    name: '旅行打卡',
    subtitle: '到了景点不知道怎么拍？山顶、湖边、海边都能照着用',
    preferredPoseNumbers: [17, 57, 100],
    poseNumbers: [4, 13, 14, 17, 26, 31, 33, 44, 45, 48, 52, 53, 55, 57, 58, 59, 60, 61, 63, 69, 70, 72, 73, 91, 93, 95, 96, 97, 98, 99, 100, 102, 103, 104, 105, 111, 113, 114, 117, 119, 121, 122, 123, 124, 125, 126, 127, 128, 129, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699]
  },
  {
    id: 'back-view',
    name: '背影回眸',
    subtitle: '适合背对镜头、侧身转头、回眸和远景氛围照',
    preferredPoseNumbers: [100, 105, 98, 104, 109],
    poseNumbers: [11, 13, 14, 15, 16, 17, 26, 29, 31, 33, 35, 93, 96, 98, 100, 102, 104, 105, 109, 114, 122, 133, 134, 140, 142, 156, 158, 176, 184, 192, 197, 202, 203, 211, 221, 297, 304, 325, 333, 353, 354, 364, 366, 371, 372, 375, 384, 387, 388, 396, 404, 416, 421, 423, 448, 449, 461, 463, 468, 472, 501, 504, 505, 516, 523, 524, 526, 540, 541, 546, 548, 549, 550, 551, 552, 554, 555, 556, 557, 558, 561, 563, 566, 574, 589, 622, 636, 638, 672, 687, 690, 691, 692]
  },
  {
    id: 'props-action',
    name: '咖啡馆/道具',
    subtitle: '手不知道放哪时用，咖啡、相机、书本、雨伞都能互动',
    preferredPoseNumbers: [84, 76, 88, 130, 127, 126, 128, 121],
    deprioritizedPoseNumbers: [131],
    poseNumbers: [38, 39, 40, 41, 43, 50, 51, 56, 59, 61, 62, 64, 65, 67, 68, 69, 70, 71, 73, 76, 78, 80, 81, 84, 86, 88, 94, 97, 99, 103, 105, 108, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 140, 141, 142, 143, 145, 146, 147, 148, 150, 152, 153, 154, 156, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 169, 174, 178, 179, 180, 181, 183, 184, 185, 186, 187, 190, 191, 192, 193, 194, 195, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 224, 225, 226, 227, 232, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 247, 248, 250, 251, 254, 255, 257, 258, 261, 262, 263, 264, 281, 282, 283, 284, 285, 286, 287, 288, 290, 291, 293, 295, 296, 299, 300, 301, 302, 305, 307, 309, 312, 313, 317, 318, 320, 321, 329, 331, 340, 341, 354, 364, 373, 375, 379, 381, 382, 384, 385, 391, 392, 402, 404, 406, 407, 408, 412, 413, 416, 417, 420, 421, 422, 424, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 448, 450, 451, 452, 454, 455, 456, 457, 458, 460, 461, 472, 473, 475, 477, 478, 480, 482, 483, 504, 508, 510, 511, 512, 517, 518, 522, 523, 524, 525, 526, 527, 528, 529, 531, 532, 533, 535, 537, 538, 542, 548, 560, 564, 567, 572, 574, 576, 583, 586, 587, 589, 591, 592, 594, 595, 597, 599, 600, 601, 602, 603, 605, 606, 619, 621, 623, 632, 634, 635, 649, 651, 659, 662, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 683, 684, 685, 686, 687, 688, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699]
  },
  {
    id: 'selfie',
    name: '自拍不尴尬',
    subtitle: '适合手机自拍、胸上近景、表情管理和酷一点的自拍',
    preferredPoseNumbers: [107, 110, 112, 115, 108, 109, 34, 87, 75, 79, 82, 86],
    poseNumbers: [18, 24, 34, 75, 77, 79, 82, 86, 87, 106, 107, 108, 109, 110, 111, 112, 114, 115]
  },
  {
    id: 'sitting-life',
    name: '坐着也好拍',
    subtitle: '适合坐姿、蹲姿、趴姿、野餐、草地和松弛生活照',
    preferredPoseNumbers: [121, 110, 108],
    poseNumbers: [29, 35, 47, 48, 51, 52, 55, 56, 62, 63, 65, 66, 71, 72, 4, 95, 102, 103, 108, 110, 111, 115, 118, 121, 125, 137, 138, 139, 144, 146, 147, 159, 193, 196, 209, 213, 216, 218, 219, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 251, 262, 263, 281, 282, 283, 284, 285, 286, 288, 289, 290, 291, 292, 296, 297, 298, 299, 300, 306, 310, 312, 313, 316, 328, 329, 336, 343, 347, 350, 352, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 385, 392, 424, 425, 426, 429, 433, 436, 439, 441, 442, 445, 446, 449, 455, 456, 457, 458, 459, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 473, 475, 476, 477, 478, 479, 497, 500, 504, 505, 508, 509, 510, 513, 514, 515, 516, 517, 529, 530, 531, 534, 535, 536, 537, 539, 565, 569, 570, 571, 572, 573, 575, 577, 578, 580, 583, 586, 592, 593, 595, 597, 599, 602, 603, 606, 607, 609, 611, 615, 618, 621, 624, 625, 626, 628, 642, 652, 653, 655, 664, 672, 679, 682, 684, 685, 687, 693, 694, 695, 699]
  },
  {
    id: 'indoor-window',
    name: '室内窗边',
    subtitle: '适合居家、窗边、雨天、咖啡馆靠窗和暖光半身照',
    preferredPoseNumbers: [84, 76, 88, 80, 85, 81, 78, 90, 82, 86, 77, 75],
    poseNumbers: [75, 76, 77, 78, 80, 81, 82, 84, 85, 86, 88, 90, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 666, 667, 669, 670, 672, 673, 674, 675, 676, 679, 680]
  },
  {
    id: 'art-city',
    name: '展馆/城市建筑',
    subtitle: '适合美术馆、画廊、天台、楼梯、现代建筑和都市大片',
    preferredPoseNumbers: [101, 92, 130],
    poseNumbers: [41, 83, 89, 92, 94, 101, 130, 151, 152, 153, 154, 155, 156, 157, 158, 159, 293, 294, 295, 298, 300, 301, 302, 304, 305, 306, 309, 310, 311, 312, 313, 314, 315, 316, 317, 327, 328, 329, 330, 331, 332, 333, 334, 335, 353, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 386, 389, 390, 393, 394, 395, 396, 397, 398, 399, 400, 401, 443, 444, 447, 449, 450, 451, 462, 463, 464, 465, 467, 468, 469, 480, 481, 484, 485, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 512, 552, 568, 571, 572, 573, 575, 576, 577, 579, 580, 581, 584, 585, 586, 587, 588, 589, 590, 596, 610, 612, 613, 614, 615, 616, 617, 618]
  }
]

const findCategoryIndex = (categoryId) => (
  categoryDefinitions.findIndex((category) => category.id === categoryId)
)

// Keep legacy category ids stable, then split broad gallery buckets into sharper browsing entries.
const replaceCategoryDefinition = (categoryId, nextCategory) => {
  const index = findCategoryIndex(categoryId)

  if (index >= 0) {
    categoryDefinitions.splice(index, 1, nextCategory)
  }
}

const insertCategoryAfter = (targetCategoryId, nextCategory) => {
  if (findCategoryIndex(nextCategory.id) >= 0) {
    return
  }

  const targetIndex = findCategoryIndex(targetCategoryId)
  const insertIndex = targetIndex >= 0 ? targetIndex + 1 : categoryDefinitions.length
  categoryDefinitions.splice(insertIndex, 0, nextCategory)
}

const seaLakePoseNumbers = uniquePoseNumbers(
  [17, 57, 99, 96, 122, 504, 102, 103, 354, 384, 237, 254],
  Array.from({ length: 25 }, (_, index) => 1037 + index),
  Array.from({ length: 81 }, (_, index) => 1062 + index),
  Array.from({ length: 4 }, (_, index) => 1312 + index),
  Array.from({ length: 4 }, (_, index) => 1324 + index),
  findPoseNumbersByText(['海边', '海滩', '海水', '沙滩', '湖边', '西湖', '水边', '河畔', '码头', '瀑布', '浅水', '海浪', '浪花'])
)
const oldTownPoseNumbers = uniquePoseNumbers(
  [15, 97, 104, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 353, 354, 355, 356, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392],
  findPoseNumbersByText(['古镇', '和顺古镇', '欧洲古镇', '老城', '老街', '古巷', '水乡', '石板路', '青石板', '白墙黛瓦'])
)
const landmarkPoseNumbers = uniquePoseNumbers(
  [151, 152, 153, 154, 155, 156, 157, 158, 159, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 327, 328, 329, 330, 331, 332, 333, 334, 335, 443, 444, 445, 446, 447, 448, 449, 450, 451, 462, 463, 464, 465, 466, 467, 468, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 583, 610, 612, 613, 614, 615, 616, 617, 618],
  Array.from({ length: 8 }, (_, index) => 1380 + index),
  findPoseNumbersByText(['长城', '城墙', '城楼', '城垛', '垛口', '天安门', '天坛', '祈年殿', '东方明珠', '外滩', '鼓楼', '红墙古建筑', '宫墙', '大金塔', '金塔', '银塔', '白塔', '佛塔', '毛泽东雕塑', '青年毛泽东雕塑'], {
    limit: 160
  })
)
const parkGardenPoseNumbers = uniquePoseNumbers(
  [91, 95, 105, 117, 123, 125, 126, 127, 128, 621, 648, 657],
  Array.from({ length: 9 }, (_, index) => 1266 + index),
  Array.from({ length: 8 }, (_, index) => 1316 + index),
  Array.from({ length: 9 }, (_, index) => 1328 + index),
  Array.from({ length: 9 }, (_, index) => 1346 + index),
  findPoseNumbersByText(['公园', '花园', '花海', '花田', '花丛', '花束', '花店', '樱花', '向日葵', '郁金香', '薰衣草', '银杏', '秋叶', '落叶', '草地', '植物园'])
)
const cafePoseNumbers = uniquePoseNumbers(
  [116, 84, 88, 427, 428, 432, 434, 438, 442, 433, 429, 439, 436, 441, 440, 431, 437, 435, 430, 64, 70, 40],
  Array.from({ length: 16 }, (_, index) => 973 + index),
  Array.from({ length: 16 }, (_, index) => 1021 + index)
)
const handPropPoseNumbers = uniquePoseNumbers(
  [269, 274, 76, 88, 84, 130, 127, 128, 121, 111, 659, 662, 648, 655],
  Array.from({ length: 32 }, (_, index) => 973 + index),
  Array.from({ length: 16 }, (_, index) => 1021 + index),
  Array.from({ length: 9 }, (_, index) => 1053 + index),
  Array.from({ length: 16 }, (_, index) => 1062 + index),
  [1078, 1085, 1089, 1093, 1095, 1103],
  Array.from({ length: 34 }, (_, index) => 1109 + index),
  Array.from({ length: 9 }, (_, index) => 1266 + index),
  Array.from({ length: 8 }, (_, index) => 1316 + index),
  Array.from({ length: 9 }, (_, index) => 1346 + index),
  Array.from({ length: 9 }, (_, index) => 1388 + index),
  findPoseNumbersByText(['道具', '手拿', '拿着', '捧花', '捧杯', '捧书', '相机', '书本', '花束', '雨伞', '帽子', '杯子', '银杏叶', '大叶', '包', '行李箱', '扇'], {
    limit: 170
  })
)
const stairSittingPoseNumbers = uniquePoseNumbers(
  [121, 101, 313, 310, 312, 316, 505, 508, 529, 565, 1055, 1056, 1072, 1090, 1108, 1109, 1111, 1112, 1117, 1118, 1119, 1121, 1122, 1124, 1125, 1134, 1136, 1138, 1140],
  Array.from({ length: 32 }, (_, index) => 973 + index),
  Array.from({ length: 16 }, (_, index) => 1021 + index),
  findPoseNumbersByText(['坐姿', '坐在', '坐地', '侧坐', '端坐', '盘坐', '倚坐', '坐靠', '静坐', '石凳', '长椅', '椅子'], {
    limit: 150
  })
)
const crouchLyingPoseNumbers = uniquePoseNumbers(
  [273, 274, 110, 115, 281, 312, 316, 652, 653, 655, 664, 1056, 1072, 1090, 1109, 1118, 1119, 1124, 1138],
  findPoseNumbersByText(['蹲姿', '半蹲', '蹲在', '低位蹲', '跪地', '跪坐', '单膝跪', '侧跪', '趴', '躺', '斜躺', '倒躺', '侧卧'])
)

replaceCategoryDefinition('travel-back', {
  id: 'travel-back',
  name: '旅行打卡',
  subtitle: '景点现场先看这一组，覆盖站姿、坐姿、背影和地标合影',
  preferredPoseNumbers: [17, 57, 100, 104, 99, 97, 504, 357, 480, 488, 621, 657],
  poseNumbers: uniquePoseNumbers(
    [17, 57, 100, 104, 99, 97, 504, 357, 480, 488, 621, 657],
    Array.from({ length: 16 }, (_, index) => 957 + index),
    Array.from({ length: 16 }, (_, index) => 1037 + index),
    Array.from({ length: 99 }, (_, index) => 1167 + index),
    Array.from({ length: 28 }, (_, index) => 1284 + index),
    Array.from({ length: 18 }, (_, index) => 1328 + index),
    seaLakePoseNumbers.slice(0, 80),
    oldTownPoseNumbers.slice(0, 70),
    landmarkPoseNumbers.slice(0, 70),
    parkGardenPoseNumbers.slice(0, 70)
  )
})

const existingBackViewDefinition = categoryDefinitions.find((category) => category.id === 'back-view')
replaceCategoryDefinition('back-view', {
  ...existingBackViewDefinition,
  poseNumbers: uniquePoseNumbers(
    existingBackViewDefinition.poseNumbers,
    Array.from({ length: 16 }, (_, index) => 1037 + index),
    [1063, 1064, 1065, 1066, 1068, 1069, 1073, 1074, 1076, 1077, 1083, 1084, 1092, 1102, 1120, 1123]
  )
})

insertCategoryAfter('travel-back', {
  id: 'sea-lake',
  name: '海边湖边',
  subtitle: '适合海滩、湖边、码头、水边和瀑布场景',
  preferredPoseNumbers: [17, 57, 99, 96, 122, 504, 102, 103, 354, 384],
  poseNumbers: seaLakePoseNumbers
})

insertCategoryAfter('sea-lake', {
  id: 'old-town-street',
  name: '古镇街巷',
  subtitle: '适合古镇、老街、小巷、庭院和石板路',
  preferredPoseNumbers: [336, 337, 338, 340, 344, 346, 353, 354, 384, 97, 104, 15],
  poseNumbers: oldTownPoseNumbers
})

insertCategoryAfter('old-town-street', {
  id: 'landmark-building',
  name: '建筑地标',
  subtitle: '适合长城、城楼、展馆、桥梁、银塔和城市建筑',
  preferredPoseNumbers: [327, 328, 332, 309, 314, 317, 480, 488, 501, 448, 468, 568],
  poseNumbers: landmarkPoseNumbers
})

insertCategoryAfter('landmark-building', {
  id: 'park-garden',
  name: '花草公园',
  subtitle: '适合花束、草地、银杏、秋叶和公园散步感',
  preferredPoseNumbers: [278, 265, 270, 275, 279, 91, 95, 105, 117, 123, 125, 126, 127, 128, 648, 657, 662],
  poseNumbers: parkGardenPoseNumbers
})

replaceCategoryDefinition('props-action', {
  id: 'props-action',
  name: '手拿道具',
  subtitle: '手不知道放哪时用，花束、相机、书本、伞、帽子和叶子都能互动',
  preferredPoseNumbers: [269, 274, 76, 88, 84, 130, 127, 128, 121, 111, 659, 662, 648, 655],
  deprioritizedPoseNumbers: [131],
  poseNumbers: handPropPoseNumbers
})

insertCategoryAfter('props-action', {
  id: 'cafe-table',
  name: '咖啡店',
  subtitle: '适合窗边、桌边、杯子、蛋糕和室内松弛感',
  preferredPoseNumbers: [116, 84, 88, 427, 428, 432, 434, 438, 442],
  poseNumbers: cafePoseNumbers
})

replaceCategoryDefinition('sitting-life', {
  id: 'sitting-life',
  name: '坐着也好拍',
  subtitle: '适合椅子、石阶、草地和低机位坐姿',
  preferredPoseNumbers: [266, 267, 268, 271, 272, 276, 277, 121, 108, 102, 103, 95, 313, 310, 505, 508, 664],
  poseNumbers: uniquePoseNumbers(
    [266, 267, 268, 271, 272, 276, 277, 121, 108, 102, 103, 95, 313, 310, 505, 508, 664],
    stairSittingPoseNumbers.slice(0, 140),
    parkGardenPoseNumbers
      .filter((number) => getPoseSearchText(poseTemplates.find((pose) => getPoseNumber(pose.id) === number)).includes('坐'))
      .slice(0, 60)
  )
})

insertCategoryAfter('sitting-life', {
  id: 'crouch-lying',
  name: '蹲姿趴姿',
  subtitle: '适合蹲下、趴着、躺拍和更有变化的低姿态照片',
  preferredPoseNumbers: [273, 274, 110, 115, 281, 312, 316, 652, 653, 655, 664],
  poseNumbers: crouchLyingPoseNumbers
})

// Generated imports declare a primary category in metadata. Keep category pages
// in sync automatically so future import modules do not need another ID list.
categoryDefinitions.forEach((category) => {
  category.poseNumbers = uniquePoseNumbers(
    category.poseNumbers,
    poseTemplates
      .filter((pose) => pose.categoryId === category.id)
      .map((pose) => getPoseNumber(pose.id))
  )
})

const preferredCategoryOrder = [
  'outfit-standing',
  'travel-back',
  'sea-lake',
  'old-town-street',
  'landmark-building',
  'park-garden',
  'portrait-half',
  'street-commute',
  'back-view',
  'props-action',
  'cafe-table',
  'sitting-life',
  'crouch-lying',
  'selfie',
  'indoor-window',
  'art-city'
]
const categoryOrderMap = preferredCategoryOrder.reduce((map, categoryId, index) => {
  map.set(categoryId, index)
  return map
}, new Map())

categoryDefinitions.sort((left, right) => {
  const leftRank = categoryOrderMap.has(left.id) ? categoryOrderMap.get(left.id) : Number.MAX_SAFE_INTEGER
  const rightRank = categoryOrderMap.has(right.id) ? categoryOrderMap.get(right.id) : Number.MAX_SAFE_INTEGER

  return leftRank - rightRank
})

const strictCategoryProfiles = {
  'outfit-standing': {
    includeTerms: ['全身照', '全身', '穿搭', '显高', '连衣裙', '长裙', '风衣', '西装', '通勤', '侧站', '站姿'],
    excludeTerms: ['自拍', '半身', '蹲姿', '趴', '躺']
  },
  'travel-back': {
    includeTerms: ['景点打卡', '旅行打卡', '旅行景点', '旅行', '旅拍', '到此一游', '游客照', '雕塑', '广场', '景区', '纪念照', '沙漠', '沙丘', '戈壁', '草原', '雪山', '高原', '旷野', '山湖'],
    excludeTerms: ['咖啡馆', '咖啡店', '咖啡厅', '室内', '卧室', '自拍']
  },
  'sea-lake': {
    includeTerms: ['海边', '海滩', '海水', '沙滩', '湖边', '西湖', '水边', '河畔', '码头', '瀑布', '浅水', '海浪', '浪花'],
    excludeTerms: ['咖啡馆', '咖啡店', '咖啡厅', '室内', '卧室']
  },
  'old-town-street': {
    includeTerms: ['古镇', '和顺古镇', '欧洲古镇', '老城', '老街', '古巷', '水乡', '石板路', '青石板', '白墙黛瓦'],
    excludeTerms: ['鼓楼', '北京鼓楼', '橘子洲', '长沙', '青年毛泽东', '毛泽东雕塑', '雕塑', '荷花', '荷塘', '荷叶', '果园', '油菜花', '森林', '树林', '山顶', '观景台', '海边', '沙滩', '湖边', '城市街头', '夜景人像', '日式庭园', '咖啡馆', '咖啡店', '咖啡厅', '室内', '卧室'],
    excludePoseNumbers: [31, 68, 327, 328, 329, 330, 331, 332, 333, 334, 335, 402, 411, 412, 424]
  },
  'landmark-building': {
    includeTerms: ['长城', '城墙', '城楼', '城垛', '垛口', '天安门', '天坛', '祈年殿', '东方明珠', '外滩', '鼓楼', '红墙古建筑', '宫墙', '大金塔', '金塔', '银塔', '白塔', '佛塔', '毛泽东雕塑', '青年毛泽东雕塑'],
    excludeTerms: ['海边', '海滩', '海水', '沙滩', '湖边', '西湖', '水边', '河畔', '码头', '瀑布', '草地', '花田', '花海', '森林', '树林', '古镇', '和顺古镇', '咖啡馆', '咖啡店', '咖啡厅', '卧室']
  },
  'park-garden': {
    includeTerms: ['公园', '花园', '花束', '花店', '花海', '樱花', '向日葵', '郁金香', '薰衣草', '银杏', '秋叶', '落叶', '草地', '植物园'],
    excludeTerms: ['咖啡馆', '咖啡店', '咖啡厅', '室内', '卧室']
  },
  'portrait-half': {
    includeTerms: ['半身', '头像', '近景', '胸上', '肩颈', '锁骨', '撩发', '托腮', '脸侧'],
    excludeTerms: ['全身照', '全身', '背影', '远景', '坐姿', '蹲姿', '跪姿', '侧卧', '躺姿', '双腿', '膝'],
    excludePoseNumbers: [283, 284, 415, 470, 607]
  },
  'street-commute': {
    includeTerms: ['街拍', '街头', '街边', '马路', '通勤', '城市', '站台', '扶车', '机车', '天台', '栏杆', '台阶'],
    excludeTerms: ['咖啡馆', '咖啡店', '咖啡厅', '卧室', '自拍']
  },
  'back-view': {
    includeTerms: ['背影', '不露脸', '回眸', '转身', '侧后', '背对', '远景'],
    excludeTerms: ['自拍', '正面']
  },
  'props-action': {
    includeTerms: ['道具', '手拿', '拿着', '捧花', '捧杯', '捧书', '相机', '书本', '花束', '雨伞', '帽子', '杯子', '饮品', '甜品', '手机', '筷子', '叉子', '勺子', '碗', '餐盘', '面条', '西瓜', '银杏叶', '叶子', '包', '行李箱', '扇'],
    excludeTerms: []
  },
  'cafe-table': {
    includeTerms: ['咖啡馆', '咖啡店', '咖啡厅', '蛋糕', '叉子', '甜品', '下午茶', '咖啡杯'],
    excludeTerms: ['公园', '花园', '花海', '古镇', '景区'],
    manualOnly: true
  },
  'sitting-life': {
    includeTerms: ['坐姿', '坐在', '坐地', '侧坐', '端坐', '盘坐', '倚坐', '坐靠', '静坐', '长椅坐', '椅上', '椅边', '椅背', '石凳', '野餐', '桌边', '桌前', '餐桌'],
    excludeTerms: ['站在', '站立', '侧立', '站姿', '行走', '漫步', '迈步', '扶栏', '倚靠', '蹲姿', '趴', '躺'],
    excludePoseNumbers: [141, 227, 233, 234, 301, 360, 362, 367, 368, 370, 372, 373, 375, 376, 379, 381, 383, 388]
  },
  'crouch-lying': {
    includeTerms: ['蹲姿', '半蹲', '蹲在', '低位蹲', '跪地', '跪坐', '单膝跪', '侧跪', '趴', '躺', '斜躺', '倒躺', '侧卧'],
    excludeTerms: ['摄影师蹲', '蹲低拍摄', '蹲低随拍', '蹲下从'],
    excludePoseNumbers: [411, 417, 420]
  },
  selfie: {
    includeTerms: ['自拍', '手机', '前置', '镜子', '全身镜', '对镜', '举手机'],
    excludeTerms: ['咖啡馆门口', '景点']
  },
  'indoor-window': {
    includeTerms: ['室内', '居家', '家里', '卧室', '房间', '窗边', '靠窗', '窗光', '暖光', '书店'],
    excludeTerms: ['咖啡馆门口', '景区', '海边', '古镇']
  },
  'art-city': {
    includeTerms: ['展馆', '美术馆', '画廊', '博物馆', '现代建筑', '建筑', '天台', '楼梯', '玻璃幕墙', '城市建筑'],
    excludeTerms: ['咖啡馆', '咖啡店', '咖啡厅', '卧室']
  }
}

const poseNumberMap = poseTemplates.reduce((map, pose) => {
  map.set(getPoseNumber(pose.id), pose)
  return map
}, new Map())
const getPoseByNumber = (number) => poseNumberMap.get(number)
const getStrictPoseText = (number) => getPoseSearchText(getPoseByNumber(number))

const countMatchedTerms = (searchText, terms = []) => (
  terms.reduce((count, term) => count + (searchText.includes(term) ? 1 : 0), 0)
)

const getStrictCategoryScore = (category = {}, number) => {
  const profile = strictCategoryProfiles[category.id]
  const searchText = getStrictPoseText(number)
  const preferredPoseNumbers = category.preferredPoseNumbers || []
  const categoryPoseNumbers = category.poseNumbers || []
  const deprioritizedPoseNumbers = category.deprioritizedPoseNumbers || []
  let score = preferredPoseNumbers.includes(number) ? 100 : 0

  if (!profile) {
    return score + 1
  }

  if (profile.manualOnly && !categoryPoseNumbers.includes(number)) {
    return Number.NEGATIVE_INFINITY
  }

  if ((profile.excludePoseNumbers || []).includes(number)) {
    return Number.NEGATIVE_INFINITY
  }

  const includeCount = countMatchedTerms(searchText, profile.includeTerms)
  const excludeCount = countMatchedTerms(searchText, profile.excludeTerms)
  score += includeCount * 10
  score -= excludeCount * 15

  if (deprioritizedPoseNumbers.includes(number)) {
    score -= 20
  }

  return score
}

const matchesStrictCategory = (category = {}, number) => getStrictCategoryScore(category, number) > 0

const getDefaultStrictCategoryId = (number) => {
  const searchText = getStrictPoseText(number)
  const fallbackRules = [
    ['crouch-lying', ['蹲姿', '半蹲', '蹲在', '低位蹲', '跪地', '跪坐', '单膝跪', '侧跪', '趴', '躺', '斜躺', '倒躺', '侧卧']],
    ['sitting-life', ['坐姿', '坐在', '坐地', '侧坐', '端坐', '盘坐', '倚坐', '坐靠', '静坐', '长椅坐', '椅上', '椅边', '椅背', '石凳', '野餐']],
    ['selfie', ['自拍', '手机', '前置', '镜子', '全身镜', '对镜', '举手机']],
    ['portrait-half', ['半身', '头像', '近景', '胸上', '肩颈', '锁骨']],
    ['sea-lake', ['海边', '海滩', '海水', '沙滩', '湖边', '西湖', '水边', '河畔', '码头', '瀑布']],
    ['old-town-street', ['古镇', '和顺古镇', '欧洲古镇', '老城', '老街', '古巷', '石板路', '青石板']],
    ['landmark-building', ['长城', '城墙', '城楼', '城垛', '垛口', '天安门', '天坛', '祈年殿', '东方明珠', '外滩', '鼓楼', '大金塔', '金塔', '银塔', '白塔', '佛塔']],
    ['park-garden', ['公园', '花园', '花束', '花店', '花海', '樱花', '向日葵', '郁金香', '薰衣草', '银杏', '秋叶', '落叶', '草地']],
    ['street-commute', ['街拍', '街头', '街边', '马路', '通勤', '城市', '站台', '扶车', '机车']],
    ['back-view', ['背影', '不露脸', '回眸', '转身', '侧后', '背对']],
    ['outfit-standing', ['全身照', '全身', '穿搭', '显高', '连衣裙', '长裙', '风衣', '西装', '站姿']]
  ]
  const matchedRule = fallbackRules.find(([, terms]) => terms.some((term) => searchText.includes(term)))

  return matchedRule ? matchedRule[0] : 'outfit-standing'
}

const getBestStrictCategoryId = (number) => {
  const rankedCategories = categoryDefinitions
    .map((category) => ({
      category,
      score: getStrictCategoryScore(category, number)
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      const leftRank = categoryOrderMap.has(left.category.id) ? categoryOrderMap.get(left.category.id) : Number.MAX_SAFE_INTEGER
      const rightRank = categoryOrderMap.has(right.category.id) ? categoryOrderMap.get(right.category.id) : Number.MAX_SAFE_INTEGER

      return leftRank - rightRank
    })

  return rankedCategories[0] && rankedCategories[0].score > 0
    ? rankedCategories[0].category.id
    : getDefaultStrictCategoryId(number)
}

const normalizeStrictCategoryCoverage = () => {
  const activePoseNumbers = poseTemplates.map((pose) => getPoseNumber(pose.id))
  const activePoseNumberSet = new Set(activePoseNumbers)
  const categoryById = categoryDefinitions.reduce((map, category) => {
    map.set(category.id, category)
    return map
  }, new Map())

  categoryDefinitions.forEach((category) => {
    category.poseNumbers = uniquePoseNumbers(category.poseNumbers || [])
      .filter((number) => activePoseNumberSet.has(number))
      .filter((number) => matchesStrictCategory(category, number))
  })

  activePoseNumbers.forEach((number) => {
    const matchedCategories = categoryDefinitions.filter((category) => category.poseNumbers.includes(number))

    if (matchedCategories.length === 0) {
      const fallbackCategory = categoryById.get(getBestStrictCategoryId(number))
      if (fallbackCategory) {
        fallbackCategory.poseNumbers = uniquePoseNumbers(fallbackCategory.poseNumbers || [], [number])
      }
    }
  })

  activePoseNumbers.forEach((number) => {
    const matchedCategories = categoryDefinitions
      .filter((category) => category.poseNumbers.includes(number))
      .map((category) => ({
        category,
        score: getStrictCategoryScore(category, number)
      }))
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score
        }

        const leftRank = categoryOrderMap.has(left.category.id) ? categoryOrderMap.get(left.category.id) : Number.MAX_SAFE_INTEGER
        const rightRank = categoryOrderMap.has(right.category.id) ? categoryOrderMap.get(right.category.id) : Number.MAX_SAFE_INTEGER

        return leftRank - rightRank
      })
    const retainedCategoryIds = new Set(matchedCategories.slice(0, 2).map((item) => item.category.id))

    matchedCategories.slice(2).forEach(({ category }) => {
      if (!retainedCategoryIds.has(category.id)) {
        category.poseNumbers = category.poseNumbers.filter((poseNumber) => poseNumber !== number)
      }
    })
  })
}

normalizeStrictCategoryCoverage()

const poseTemplateMap = poseTemplates.reduce((map, pose) => {
  map.set(pose.id, pose)
  return map
}, new Map())

const getPreferredPoseRank = (category = {}, pose = {}) => {
  const poseNumber = getPoseNumber(pose.id)
  const preferredPoseNumbers = category.preferredPoseNumbers || []
  const index = preferredPoseNumbers.indexOf(poseNumber)

  return index >= 0 ? index : Number.MAX_SAFE_INTEGER
}

const getDeprioritizedPoseRank = (category = {}, pose = {}) => {
  const poseNumber = getPoseNumber(pose.id)
  const deprioritizedPoseNumbers = category.deprioritizedPoseNumbers || []
  const index = deprioritizedPoseNumbers.indexOf(poseNumber)

  return index >= 0 ? index : Number.MAX_SAFE_INTEGER
}

const sortCategoryPoses = (category = {}, poses = []) => (
  poses.slice().sort((left, right) => {
    const rankDiff = getPreferredPoseRank(category, left) - getPreferredPoseRank(category, right)

    if (rankDiff !== 0) {
      return rankDiff
    }

    const leftDeprioritizedRank = getDeprioritizedPoseRank(category, left)
    const rightDeprioritizedRank = getDeprioritizedPoseRank(category, right)
    const leftIsDeprioritized = leftDeprioritizedRank !== Number.MAX_SAFE_INTEGER
    const rightIsDeprioritized = rightDeprioritizedRank !== Number.MAX_SAFE_INTEGER

    if (leftIsDeprioritized !== rightIsDeprioritized) {
      return leftIsDeprioritized ? 1 : -1
    }

    if (leftIsDeprioritized && rightIsDeprioritized) {
      return leftDeprioritizedRank - rightDeprioritizedRank
    }

    return comparePoseByRichness(left, right)
  })
)

const poseCategories = categoryDefinitions
  .map((category) => ({
    ...category,
    poses: sortCategoryPoses(category, category.poseNumbers
      .map((number) => poseTemplateMap.get(customPoseId(number)))
      .filter(Boolean))
  }))
  .filter((category) => category.poses.length > 0)

const findPoseIndex = (poseId) => {
  const index = poseTemplates.findIndex((pose) => pose.id === poseId)
  return index >= 0 ? index : 0
}
const getPoseById = (poseId) => poseTemplates.find((pose) => pose.id === poseId) || null

module.exports = {
  poseTemplates,
  poseCategories,
  findPoseIndex,
  getPoseById
}
