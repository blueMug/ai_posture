# 新增姿势图片维护说明

本文档用于后续新增一张姿势图片时，快速确认需要准备哪些图片、修改哪些数据、跑哪些校验。

## 当前资源链路

姿势主数据入口在 `utils/combinePairPoses.js`。每个姿势使用 `customN_r01_g01` 作为资源 ID，对外暴露为 `pair-customN-r01-g01`。

默认字段由 `combinePairIds` 自动拼出：

```js
guideImage: `/static/pose_pairs/${folder}/${pairId}_contour.png`
thumbnailImage: `/static/pose_thumbs/${folder}/${pairId}_thumb.jpg`
shareImage: `/static/share_images/${folder}/${pairId}_share.jpg`
modelImage: `/static/pose_pairs/${folder}/${pairId}_demo.jpg`
detailImage: `/static/pose_pairs/${folder}/${pairId}_demo.jpg`
```

但现有姿势基本都会在 `poseMetadataOverrides` 中显式覆盖 `guideImage` 为 `/static/pose_guides/..._contour.png`。相机页的 active 轮廓以这个 `guideImage` 为准，不要只看目录里的 `static/pose_pairs`。

`utils/poses.js` 会过滤被移除的编号、把图片路径转成本地或 CDN 地址，并按 `categoryDefinitions` 组织分类。页面基本都消费 `poseTemplates` 和 `poseCategories`，不直接扫描图片目录。

## 需要准备的图片

新增 `custom106_r01_g01` 这类姿势时，建议至少准备以下文件：

| 目录 | 文件名 | 用途 |
| --- | --- | --- |
| `assets/pose_pairs/custom106/` | `custom106_r01_g01_demo.png` | 原始或高清真人示例，项目内作为源资源留档 |
| `assets/pose_pairs/custom106/` | `custom106_r01_g01_contour_hd.png` | 原始或高清轮廓，校验脚本会用它和 active 轮廓比比例 |
| `static/pose_pairs/custom106/` | `custom106_r01_g01_demo.jpg` | 真人参考图，详情页、半透明照片引导、CDN 资源来源 |
| `static/pose_pairs/custom106/` | `custom106_r01_g01_contour.png` | 默认轮廓兜底，通常不作为 active 相机轮廓 |
| `static/pose_guides/custom106/` | `custom106_r01_g01_contour.png` | active 相机轮廓，通常需要在元数据里显式指定 |
| `static/pose_thumbs/custom106/` | `custom106_r01_g01_thumb.jpg` | 通用缩略图 |
| `static/recommend_thumbs/custom106/` | `custom106_r01_g01_thumb.jpg` | 首页和推荐模块优先使用的轻量缩略图 |
| `static/recommend_guides/custom106/` | `custom106_r01_g01_contour.png` | 推荐模块轮廓资源，如该姿势进入相关推荐链路则补齐 |
| `static/gallery_thumbs/custom106/` | `custom106_r01_g01_gallery_thumb.jpg` | 姿势大全的本地缩略图兜底 |
| `static/share_images/custom106/` | `custom106_r01_g01_share.jpg` | 分享卡片图 |
| `static/home_guides/custom106/` | `custom106_r01_g01_contour.png` | 首页本地轮廓，仅当要做首页本地轮廓优化时需要 |

当前仓库没有发现图片派生脚本或 `package.json`。也就是说，上面这些 `jpg/png` 产物需要在项目外生成后拷入仓库，或者另行补充生成脚本。新增时不要假设改 JS 后会自动生成缩略图、分享图或裁切轮廓。

## 必改代码和数据

1. `assets/pose_pairs/manifest.json`

   增加源资源记录：

   ```json
   {
     "id": "custom106_r01_g01",
     "demo": "pose_pairs/custom106/custom106_r01_g01_demo.png",
     "contour": "pose_pairs/custom106/custom106_r01_g01_contour_hd.png"
   }
   ```

2. `utils/combinePairPoses.js`

   在 `combinePairIds` 增加 `custom106_r01_g01`。

   在 `poseMetadataOverrides` 增加文案和 active 轮廓配置。建议至少补齐：

   ```js
   custom106_r01_g01: {
     categoryId: 'travel-back',
     categoryName: '旅行背影',
     name: '姿势名称',
     tip: '推荐场景、动作关键词、出片方向',
     description: '动作和构图描述，拍照页会从这里生成简短动作指导。',
     badge: '全身',
     guideImage: '/static/pose_guides/custom106/custom106_r01_g01_contour.png',
     gradient: 'linear-gradient(150deg, #颜色1 0%, #颜色2 100%)'
   }
   ```

   同文件还要补 `poseSearchKeywordOverrides` 和 `poseSceneKeywordOverrides`。搜索、场景推荐会依赖这些关键词，建议写入人物动作、构图、服装、道具、地点和场景词。

3. `utils/poses.js`

   如果该姿势要出现在分类页或首页分类卡片里，把编号加入合适的 `categoryDefinitions[].poseNumbers`。

   如果只是临时隐藏，不要加入 `removedPoseNumbers`；如果想彻底不展示，则加入 `removedPoseNumbers` 或不要加入 `combinePairIds`。

4. `utils/assets.js`

   如果要让首页/推荐模块使用本地 `static/recommend_thumbs/custom106/...`，把 `custom106` 加入 `HOME_LOCAL_ASSET_FOLDERS`。

   注意 `project.config.json` 里 `static/pose_pairs`、`static/pose_guides`、`static/pose_thumbs`、`static/gallery_thumbs`、`static/share_images`、`static/recommend_guides`、`static/home_guides` 都被忽略打包；当前本地打包策略主要保留 `static/recommend_thumbs`。其他路径通常会通过 `cdnAssetUrl()` 映射到 `https://cdn.jsdelivr.net/gh/blueMug/posture_assets@main/static/...`。

   如果某个资源明确不能本地加载，可加入 `REMOTE_ONLY_ASSET_PATHS`。现有例子是 `custom74` 的 demo 和 thumb。

5. `utils/guideImageSizes.js`

   新增 active 轮廓、兜底轮廓、推荐轮廓等 PNG 的尺寸记录。相机页首帧布局依赖这个表，尺寸和实际 PNG 不一致会导致进入相机时轮廓先跳一下再稳定。

   目前没有生成脚本，需按 PNG 头信息手动补，或者补一个脚本生成。PNG 宽高可以用系统工具查看，例如：

   ```sh
   sips -g pixelWidth -g pixelHeight static/pose_guides/custom106/custom106_r01_g01_contour.png
   ```

6. `utils/sceneTopics.js` 和 `pages/home/index.js`

   只有当新姿势要进入专题或首页场景顾问时才需要改。

   `utils/sceneTopics.js` 控制专题页：`coverPoseId`、`morePoseIds`、`plans[].poseId`。

   `pages/home/index.js` 里有首页场景顾问的 `SCENE_ADVISOR_CONFIGS`，可把新姿势放进某个场景的 `plans`，或通过关键词让它被自动匹配。

## 新增步骤建议

1. 选择下一个编号，例如 `custom106_r01_g01`，创建上述 `assets/` 和 `static/` 目录。
2. 放入真人示例、轮廓、缩略图、分享图等产物，保持文件名严格一致。
3. 更新 `assets/pose_pairs/manifest.json`。
4. 更新 `utils/combinePairPoses.js`：`combinePairIds`、`poseMetadataOverrides`、搜索关键词、场景关键词。
5. 更新 `utils/poses.js` 分类，必要时更新专题和首页场景配置。
6. 更新 `utils/assets.js` 的本地/远程策略，确认资源是否会被小程序包包含，还是走 CDN。
7. 更新 `utils/guideImageSizes.js`，确保 active `guideImage` 的宽高和真实 PNG 一致。
8. 如果走 CDN，同步把 `static/...` 资源发布到 `blueMug/posture_assets` 对应路径；本仓库里的同路径只是开发和校验来源，不一定会打进小程序包。
9. 跑校验，打开小程序分别看首页、姿势大全、详情页、相机页和分享入口。

## 校验命令

```sh
node scripts/check-guide-ratios.js
node --check utils/combinePairPoses.js
node --check utils/poses.js
node --check utils/assets.js
node --check utils/guideImageSizes.js
node --check pages/camera/index.js
git diff --check
```

`scripts/check-guide-ratios.js` 会检查：

- active `guideImage` 是否存在；
- `utils/guideImageSizes.js` 中记录的尺寸是否等于本地 PNG；
- active 轮廓相对当前 HEAD 的比例是否发生异常变化；
- active 轮廓和 `assets/pose_pairs/..._contour_hd.png` 的比例是否一致。

## 容易出错的点

- 不要把 `3:4` 相机预览区域理解成所有轮廓 PNG 都必须是 `3:4`。裁切轮廓应保持自身视觉比例。
- 不要只修改 `static/pose_pairs/..._contour.png`。相机页实际用的通常是 `poseMetadataOverrides` 里的 `/static/pose_guides/..._contour.png`。
- 改了轮廓 PNG 后必须同步 `utils/guideImageSizes.js`，否则首帧布局和图片加载后的布局可能不一致。
- 新增了图片但没加入 `combinePairIds`，页面不会出现。
- 加入了 `combinePairIds` 但没有补元数据，页面会显示默认的“真人姿势 XX”，搜索和场景推荐质量会明显下降。
- 加入分类前确认编号不在 `removedPoseNumbers`。
- 走 CDN 的资源要确认 CDN 仓库同路径已发布，否则开发时本地存在，线上仍可能 404。
- 首页本地缩略图依赖 `HOME_LOCAL_ASSET_FOLDERS` 和 `static/recommend_thumbs`，只放 `pose_thumbs` 不一定能提升首页首屏加载。
