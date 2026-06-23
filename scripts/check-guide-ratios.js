const fs = require('fs')
const { execFileSync } = require('child_process')
const { poseTemplates } = require('../utils/poses')
const { JSDELIVR_ASSET_BASE } = require('../utils/assets')
const { getGuideImageSize } = require('../utils/guideImageSizes')

const RATIO_DIFF_THRESHOLD = 0.01

const readPngSize = (file) => {
  if (!fs.existsSync(file)) {
    return null
  }

  const buffer = fs.readFileSync(file)

  if (buffer.toString('ascii', 1, 4) !== 'PNG') {
    return null
  }

  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)

  return {
    width,
    height,
    ratio: width / height
  }
}

const readPngSizeFromBuffer = (buffer) => {
  if (!buffer || buffer.toString('ascii', 1, 4) !== 'PNG') {
    return null
  }

  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)

  return {
    width,
    height,
    ratio: width / height
  }
}

const readHeadPngSize = (file) => {
  try {
    return readPngSizeFromBuffer(execFileSync('git', ['show', `HEAD:${file}`], {
      maxBuffer: 20 * 1024 * 1024
    }))
  } catch (error) {
    return null
  }
}

const toLocalStaticPath = (url) => {
  let path = String(url || '').split('?')[0]

  if (path.startsWith(`${JSDELIVR_ASSET_BASE}/`)) {
    path = `/${path.slice(JSDELIVR_ASSET_BASE.length + 1)}`
  }

  const staticIndex = path.indexOf('/static/')

  return staticIndex >= 0 ? path.slice(staticIndex) : path
}

const getPoseFolder = (guidePath) => {
  const match = guidePath.match(/custom\d+/)

  return match ? match[0] : ''
}

const failures = []

poseTemplates.forEach((pose) => {
  const guidePath = toLocalStaticPath(pose.guideImage)
  const folder = getPoseFolder(guidePath)

  if (!folder) {
    return
  }

  const guideSize = readPngSize(guidePath.replace(/^\/+/, ''))
  const hdSize = readPngSize(`assets/pose_pairs/${folder}/${folder}_r01_g01_contour_hd.png`)
  const tableSize = getGuideImageSize(pose.guideImage)

  if (!guideSize) {
    failures.push({
      id: pose.id,
      name: pose.name,
      guidePath,
      reason: 'missing active guide png'
    })
    return
  }

  if (!tableSize || tableSize.width !== guideSize.width || tableSize.height !== guideSize.height) {
    failures.push({
      id: pose.id,
      name: pose.name,
      guidePath,
      reason: 'guideImageSizes mismatch',
      guideSize,
      tableSize
    })
  }

  const headSize = readHeadPngSize(guidePath.replace(/^\/+/, ''))
  if (headSize && Math.abs(guideSize.ratio - headSize.ratio) > RATIO_DIFF_THRESHOLD) {
    failures.push({
      id: pose.id,
      name: pose.name,
      guidePath,
      reason: 'active guide ratio changed from HEAD baseline',
      guideSize,
      headSize,
      ratioDiff: Math.abs(guideSize.ratio - headSize.ratio)
    })
  }

  if (!hdSize) {
    return
  }

  const ratioDiff = Math.abs(guideSize.ratio - hdSize.ratio)

  if (ratioDiff > RATIO_DIFF_THRESHOLD) {
    failures.push({
      id: pose.id,
      name: pose.name,
      guidePath,
      reason: 'guide and hd ratio mismatch',
      guideSize,
      hdSize,
      ratioDiff
    })
  }
})

if (failures.length) {
  console.error(`Guide ratio checks failed: ${failures.length}`)
  failures.forEach((failure) => {
    console.error([
      failure.id,
      failure.name,
      failure.reason,
      failure.guideSize ? `guide=${failure.guideSize.width}x${failure.guideSize.height}(${failure.guideSize.ratio.toFixed(6)})` : '',
      failure.tableSize ? `table=${failure.tableSize.width}x${failure.tableSize.height}` : '',
      failure.headSize ? `HEAD=${failure.headSize.width}x${failure.headSize.height}(${failure.headSize.ratio.toFixed(6)})` : '',
      failure.hdSize ? `hd=${failure.hdSize.width}x${failure.hdSize.height}(${failure.hdSize.ratio.toFixed(6)})` : '',
      failure.ratioDiff ? `diff=${failure.ratioDiff.toFixed(6)}` : '',
      failure.guidePath
    ].filter(Boolean).join('\t'))
  })
  process.exit(1)
}

console.log('Guide ratios OK')
