const normalizeSearchText = (value) => String(value || '').trim().toLowerCase()

const getPoseSearchText = (pose = {}, category = {}) => [
  pose.name,
  pose.tip,
  pose.description,
  pose.badge,
  pose.categoryName,
  category.name,
  ...(pose.searchKeywords || [])
].join(' ').toLowerCase()

const isPoseMatchedSearch = (pose, category, keyword) => {
  const query = normalizeSearchText(keyword)

  if (!query) {
    return true
  }

  const searchText = getPoseSearchText(pose, category)

  if (searchText.includes(query)) {
    return true
  }

  const tokens = query.split(/[\s,，、;；/|]+/).filter(Boolean)

  return tokens.length > 1 && tokens.every((token) => searchText.includes(token))
}

module.exports = {
  getPoseSearchText,
  isPoseMatchedSearch,
  normalizeSearchText
}
