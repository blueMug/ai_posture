const normalizeSearchText = (value) => String(value || '').trim().toLowerCase()

const STRICT_FILTERED_CATEGORY_ALIASES = {
  海边: ['sea-lake'],
  湖边: ['sea-lake'],
  水边: ['sea-lake'],
  古镇: ['old-town-street'],
  老街: ['old-town-street'],
  公园: ['park-garden'],
  花园: ['park-garden'],
  花海: ['park-garden'],
  草地: ['park-garden'],
  建筑: ['landmark-building', 'art-city']
}

const STRICT_CATEGORY_ALIASES = {
  全身: ['outfit-standing'],
  全身照: ['outfit-standing'],
  穿搭: ['outfit-standing'],
  旅行: ['travel-back'],
  旅行打卡: ['travel-back'],
  海边湖边: ['sea-lake'],
  古镇街巷: ['old-town-street'],
  地标: ['landmark-building'],
  花草公园: ['park-garden'],
  半身: ['portrait-half'],
  半身照: ['portrait-half'],
  近景: ['portrait-half'],
  半身近景: ['portrait-half'],
  街拍: ['street-commute'],
  街头: ['street-commute'],
  通勤: ['street-commute'],
  出门街拍: ['street-commute'],
  背影: ['back-view'],
  背影回眸: ['back-view'],
  道具: ['props-action'],
  手拿道具: ['props-action'],
  咖啡: ['cafe-table'],
  咖啡馆: ['cafe-table'],
  咖啡店: ['cafe-table'],
  坐姿: ['sitting-life'],
  坐着: ['sitting-life'],
  坐着也好拍: ['sitting-life'],
  蹲姿: ['crouch-lying'],
  趴姿: ['crouch-lying'],
  躺姿: ['crouch-lying'],
  蹲姿趴姿: ['crouch-lying'],
  自拍: ['selfie'],
  自拍不尴尬: ['selfie'],
  室内: ['indoor-window'],
  窗边: ['indoor-window'],
  室内窗边: ['indoor-window'],
  '展馆/城市建筑': ['art-city']
}

const getPoseSearchText = (pose = {}, category = {}) => [
  pose.name,
  ...(pose.strictSearchKeywords || pose.searchKeywords || [])
].join(' ').toLowerCase()

const isSelfiePose = (pose = {}, category = {}) => {
  if (category.id === 'selfie') {
    return true
  }

  const explicitSelfieText = [
    pose.name,
    ...(pose.strictSearchKeywords || pose.searchKeywords || [])
      .filter((keyword) => normalizeSearchText(keyword) !== '自拍')
  ].join(' ').toLowerCase()

  return explicitSelfieText.includes('自拍')
}

const isPoseMatchedSearch = (pose, category, keyword) => {
  const query = normalizeSearchText(keyword)

  if (!query) {
    return true
  }

  const strictFilteredCategoryIds = STRICT_FILTERED_CATEGORY_ALIASES[query]

  if (strictFilteredCategoryIds) {
    return strictFilteredCategoryIds.includes(category.id) &&
      getPoseSearchText(pose, category).includes(query)
  }

  const strictCategoryIds = STRICT_CATEGORY_ALIASES[query]

  if (strictCategoryIds) {
    return strictCategoryIds.includes(category.id)
  }

  const searchText = getPoseSearchText(pose, category)

  if (searchText.includes(query)) {
    return true
  }

  const tokens = query.split(/[\s,，、;；/|]+/).filter(Boolean)

  return tokens.length > 1 && tokens.every((token) => (
    token === '自拍'
      ? isSelfiePose(pose, category)
      : searchText.includes(token)
  ))
}

module.exports = {
  getPoseSearchText,
  isPoseMatchedSearch,
  normalizeSearchText
}
