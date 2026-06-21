const getPoseNumber = (pose = {}) => {
  const matched = String(pose.id || '').match(/custom(\d+)/)
  return matched ? Number(matched[1]) : 0
}

const getTextLength = (value) => String(value || '').trim().length

const getPoseRichnessScore = (pose = {}) => {
  const descriptionScore = getTextLength(pose.description) * 3
  const tipScore = getTextLength(pose.tip) * 1.4
  const nameScore = getTextLength(pose.name) * 0.6
  const recencyScore = Math.min(getPoseNumber(pose), 120)

  return descriptionScore + tipScore + nameScore + recencyScore
}

const comparePoseByRichness = (a, b) => {
  const scoreDiff = getPoseRichnessScore(b) - getPoseRichnessScore(a)

  if (scoreDiff !== 0) {
    return scoreDiff
  }

  return getPoseNumber(b) - getPoseNumber(a)
}

const sortPosesByRichness = (poses = []) => (
  poses.slice().sort(comparePoseByRichness)
)

module.exports = {
  comparePoseByRichness,
  getPoseRichnessScore,
  sortPosesByRichness
}
