---
name: "import-pose-image"
description: "Imports pose images, metadata, keywords, and categories into this mini app. Invoke when adding/replacing custom pose resources."
---

# Import Pose Image

Use this skill when the user asks to add, import, replace, or wire a new pose image/resource for this `ai_posture` mini app. The goal is to make the pose appear correctly across selection lists, detail pages, camera guides, search, scene recommendations, sharing, local packaging, and the remote Gitee asset repo.

This skill covers both asset wiring and content modeling. Do not treat image import as only copying files. A complete import must also produce structured display metadata, search keywords, scene keywords, category placement, and optional scene-topic/home recommendation wiring.

Contour transparency is a hard requirement. Any `*_contour.png` used by the camera or guide flows must be a real RGBA PNG with transparent background. A visual checkerboard background is not enough; if the file is RGB or contains baked-in checkerboard/solid background pixels, convert it to alpha transparency before importing.

## Repository Context

This project uses pose IDs like `custom106_r01_g01`. Runtime pose IDs are derived as `pair-custom106-r01-g01`.

Main data flow:

- `utils/combinePairPoses.js`: source of pose metadata, image fields, search keywords, scene keywords.
- `utils/poses.js`: active pose filtering and category grouping.
- `utils/assets.js`: local-vs-Gitee image path resolution.
- `utils/guideImageSizes.js`: first-frame camera guide layout sizes.
- `assets/pose_pairs/manifest.json`: source asset manifest.
- `project.config.json`: mini app packaging ignores many `static/*` asset folders.
- `docs/add_pose_image_guide.md`: longer project-specific maintenance notes.

Remote asset repositories:

```js
// custom1 through custom1142
https://gitee.com/blueMug/posture_assets/raw/main

// custom1143 and all later pose numbers
https://gitee.com/blueMug/posture_assets_v2/raw/main
```

Many local `static/...` directories are ignored from mini app packaging. Pose photos, guide contours, thumbnails, gallery thumbnails, and share images must be published with the same `static/...` path. Treat `custom1143` as the permanent repository boundary: assets through `custom1142` stay in `blueMug/posture_assets`; assets starting at `custom1143` go to `blueMug/posture_assets_v2`. Never copy the old repository history into v2.

## Required Clarifications

Before editing, identify:

- The target pose number and ID, for example `custom106_r01_g01`.
- Whether this is a new pose or replacement of an existing pose.
- Which image files are already available locally.
- What the pose visually contains: body orientation, action, composition, scene, outfit, props, mood, and whether it is full-body, half-body, selfie, sitting, or back-view.
- Whether the pose should be shown in categories, search, scene topics, home scene advisor, or only kept as a hidden resource.
- Whether the final runtime asset path already exists in Gitee. New pose photos and contours must be remote-ready, not local-only.
- Whether the provided contour image already has a true alpha channel. Verify instead of assuming.

If the user has not provided the actual images, do not fabricate placeholder assets. Prepare the code/data checklist and ask for or wait for the real files.

## Structured Metadata Requirements

Every active pose should have a complete `poseMetadataOverrides` entry. Generate or confirm these fields from the image and the product taxonomy:

```js
customNNN_r01_g01: {
  categoryId: '...',
  categoryName: '...',
  name: '...',
  tip: '...',
  description: '...',
  badge: '全身',
  guideImage: '/static/pose_pairs/customNNN/customNNN_r01_g01_contour.png',
  gradient: 'linear-gradient(150deg, #... 0%, #... 100%)'
}
```

Field guidance:

- `name`: short display title, usually 4-8 Chinese characters plus action/scene, for example `海边提鞋回眸`.
- `tip`: comma-like recommendation phrase beginning with `推荐...`; include scene, action, and photo style.
- `description`: one or two concrete sentences describing body position, hand/leg action, gaze/orientation, props, and suitable shooting context. Camera guidance is derived from this text, so avoid vague copy.
- `badge`: choose from existing product language such as `全身`, `半身`, `背影`, `坐姿`, `自拍` when appropriate.
- `categoryId` and `categoryName`: align with existing taxonomy in `utils/poses.js` and nearby metadata. Do not invent a category unless the current taxonomy cannot represent the pose.
- `gradient`: choose colors that roughly match the image mood/background and are visually distinct from adjacent cards.

Description quality bar:

- Mention the main body orientation: front, side, back, side-back, seated, crouching, selfie.
- Mention at least one hand action and one composition or scene cue when visible.
- Mention important props or clothing only if they affect how users imitate the pose.
- Keep it factual. Do not overfit to imagined details that are not visible in the provided image.
- Do not use placeholder/template descriptions such as `参考轮廓完成画面中的站姿和手部动作`, `让姿态、手部动作和背景同时入镜`, or `适合作为...专题里的...参考`. The pose detail page depends on this field for actionable guidance, so the description must tell the user exactly what to do with body, hands, head/gaze, and legs.

## Keyword and Classification Requirements

Add or update both keyword maps in `utils/combinePairPoses.js`:

- `poseSearchKeywordOverrides[pairId]`: what users might type or browse for.
- `poseSceneKeywordOverrides[pairId]`: where this pose works.

Keyword generation checklist:

- Pose type: `全身照`, `半身照`, `背影`, `自拍`, `坐姿`, `蹲姿`, `行走`.
- Body/action: `回眸`, `撩发`, `托腮`, `扶帽`, `提裙`, `跨步`, `侧身`, `抬手`.
- Composition: `低机位`, `近景`, `七分身`, `全身入镜`, `留白`, `对角线`.
- Scene: `海边`, `草地`, `咖啡馆`, `街边`, `天台`, `美术馆`, `窗边`, `古镇`.
- Props/outfit: `草帽`, `咖啡`, `相机`, `书`, `西装`, `长裙`, `墨镜`.
- Mood/style: `松弛`, `电影感`, `通勤`, `度假`, `文艺`, `酷感`, `生活感`.

Classification logic:

- Add the number to one or more `categoryDefinitions[].poseNumbers` in `utils/poses.js` only when the category promise truly matches the image.
- Prefer existing categories: `outfit-standing`, `portrait-half`, `street-commute`, `travel-back`, `back-view`, `props-action`, `selfie`, `sitting-life`, `indoor-window`, `art-city`.
- If the pose is useful in multiple categories, include it in each relevant category. The existing sort/dedupe logic can handle overlap.
- Confirm the number is not in `removedPoseNumbers`.
- If the pose should appear in scene topics, explicitly update `utils/sceneTopics.js`. If it should appear in home scene advisor, update `pages/home/index.js` or ensure scene keywords can match it.

Do not create a separate skill just for metadata unless the user wants to batch-generate or audit metadata for many existing poses without changing assets. For normal new-pose import, metadata, keywords, and classification belong in this skill.

## Asset Checklist

For a new `customNNN_r01_g01`, expect these files when fully wired:

```text
assets/pose_pairs/customNNN/customNNN_r01_g01_demo.png
assets/pose_pairs/customNNN/customNNN_r01_g01_contour_hd.png
static/pose_pairs/customNNN/customNNN_r01_g01_demo.jpg
static/pose_pairs/customNNN/customNNN_r01_g01_contour.png
static/pose_thumbs/customNNN/customNNN_r01_g01_thumb.jpg
static/gallery_thumbs/customNNN/customNNN_r01_g01_gallery_thumb.jpg
static/share_images/customNNN/customNNN_r01_g01_share.jpg
```

Do not generate, copy, or overwrite `static/pose_guides`, `static/recommend_guides`, or `static/home_guides`. These legacy guide folders are no longer part of the import surface. The only runtime contour path to maintain is `static/pose_pairs/customNNN/customNNN_r01_g01_contour.png`.

Do not generate or copy `static/recommend_thumbs` by default. Runtime thumbnail surfaces should use `static/pose_thumbs` unless the app code explicitly requires a separate recommendation thumbnail.

## Contour Transparency Requirements

Before copying a contour image into any `*_contour.png` destination, verify it is transparent:

```sh
file path/to/input_contour.png
sips -g hasAlpha -g pixelWidth -g pixelHeight path/to/input_contour.png
```

Acceptable contour output:

- PNG reports `RGBA` or `hasAlpha: yes`.
- The background is transparent when placed over camera preview.
- The white guide lines remain visible enough for alignment.

Unacceptable contour output:

- PNG reports `RGB` with no alpha channel.
- The checkerboard pattern is baked into the pixels.
- A gray, black, or white solid background remains.

If the supplied contour has white lines on a gray/checkerboard background, convert it with PIL before copying it to `assets/pose_pairs` and `static/pose_pairs`. A typical conversion keeps bright contour pixels and turns the background transparent:

```python
from pathlib import Path
from PIL import Image

src = Path("input_contour.png")
out = Path("transparent_contour.png")
threshold = 220
image = Image.open(src).convert("RGBA")
pixels = []

for r, g, b, a in image.getdata():
    value = max(r, g, b)
    if value <= threshold:
        pixels.append((255, 255, 255, 0))
    else:
        alpha = int((value - threshold) * 255 / max(1, 255 - threshold))
        pixels.append((255, 255, 255, min(a, max(0, min(255, alpha)))))

image.putdata(pixels)
image.save(out)
```

Tune `threshold` only after visually checking the output. The goal is not to preserve the checkerboard preview; the goal is a clean camera overlay.

## Implementation Workflow

1. Inspect the worktree and relevant files first.

   Use `git status --short`, then read the relevant snippets of:

   - `utils/combinePairPoses.js`
   - `utils/poses.js`
   - `utils/assets.js`
   - `utils/guideImageSizes.js`
   - `assets/pose_pairs/manifest.json`
   - `project.config.json`

   Do not revert unrelated user changes.

2. Add or verify image files.

   Ensure filenames exactly match the `customNNN_r01_g01` convention. If the user supplied images under a different name, rename or copy only with explicit intent. Do not create visual placeholders.

   Before copying contour files, enforce the contour transparency requirements above. If the provided contour is RGB or has baked-in checkerboard pixels, convert it to transparent RGBA first and use the converted PNG for every contour destination.

3. Update `assets/pose_pairs/manifest.json`.

   Add:

   ```json
   {
     "id": "customNNN_r01_g01",
     "demo": "pose_pairs/customNNN/customNNN_r01_g01_demo.png",
     "contour": "pose_pairs/customNNN/customNNN_r01_g01_contour_hd.png"
   }
   ```

4. Update `utils/combinePairPoses.js`.

   Add `customNNN_r01_g01` to `combinePairIds`.

   Add a complete `poseMetadataOverrides` entry. Use the structured metadata requirements above, not default placeholder text. It should include at least:

   ```js
   customNNN_r01_g01: {
     categoryId: '...',
     categoryName: '...',
     name: '...',
     tip: '...',
     description: '...',
     badge: '全身',
     guideImage: '/static/pose_pairs/customNNN/customNNN_r01_g01_contour.png',
     gradient: 'linear-gradient(150deg, #... 0%, #... 100%)'
   }
   ```

   Add `poseSearchKeywordOverrides` and `poseSceneKeywordOverrides`. Include action words, scene words, composition, outfit, props, and location terms. These feed search and scene matching.

   Before leaving this file, check the generated display text by reading nearby existing entries with similar pose type. Match their tone and level of detail.

   Important: The active camera guide must use `/static/pose_pairs/..._contour.png`. Do not write metadata to `/static/pose_guides/...`, `/static/recommend_guides/...`, or `/static/home_guides/...`.

5. Update `utils/poses.js`.

   Add the pose number to suitable `categoryDefinitions[].poseNumbers` if the pose should appear in category pages/home sections.

   Check `removedPoseNumbers`. A pose number in this set will be filtered out even if it is present in `combinePairIds`.

   Confirm classification against the category descriptions, not just against visual similarity. For example, a full-body street photo may belong in both `outfit-standing` and `street-commute`, while a half-body cafe photo may belong in both `portrait-half` and `props-action`.

6. Update `utils/assets.js`.

   New pose image resources should resolve to Gitee. Do not add new pose folders to a local packing whitelist unless the user explicitly accepts the resulting package-size tradeoff.

   If a file must never be loaded locally, add its exact local path to `REMOTE_ONLY_ASSET_PATHS`.

   Check `project.config.json` packaging ignores. Current strategy ignores many `static/*` folders, so `pose_pairs`, `pose_thumbs`, `gallery_thumbs`, and `share_images` files must exist in the remote Gitee repo if used at runtime. Do not reintroduce `pose_guides`, `recommend_guides`, or `home_guides`.

7. Update `utils/guideImageSizes.js`.

   Add dimensions only for active guide PNGs under `/static/pose_pairs/..._contour.png`. Camera first-frame layout depends on these values.

   Use real PNG dimensions, for example:

   ```sh
   sips -g pixelWidth -g pixelHeight static/pose_pairs/customNNN/customNNN_r01_g01_contour.png
   ```

   Keep the PNG's own visual ratio. Do not pad or force guide images to `3:4` just because the camera preview region is `3:4`.

8. Update optional discovery surfaces.

   Only if needed:

   - `utils/sceneTopics.js`: topic `coverPoseId`, `morePoseIds`, `plans[].poseId`.
   - `pages/home/index.js`: home scene advisor `SCENE_ADVISOR_CONFIGS`.

   Topic placement rule:

   - A topic whose title has an explicit geographic identity, such as a city,
     region, country, or named attraction, belongs in the travel-landmark
     section. Add its topic ID to `LANDMARK_TOPIC_IDS` in
     `utils/sceneTopics.js`.
   - Generic environments and styles, such as beach, cafe, lawn, sunset, or
     Korean-style selfie, remain in the daily-scene section unless they name a
     real destination.
   - After importing topics, audit the full topic list with
     `isLandmarkTopic()` so locality-based topics do not remain in the
     daily-scene library.

9. Handle the remote Gitee asset repo.

   Choose the repository from the numeric pose ID before copying or pushing:

   ```text
   custom1-custom1142  -> blueMug/posture_assets/static/...
   custom1143 onward  -> blueMug/posture_assets_v2/static/...
   ```

   Both repositories use the same directory structure. The local path and Gitee path should match after removing the leading slash, for example:

   ```text
   /static/pose_pairs/custom106/custom106_r01_g01_contour.png
   https://gitee.com/blueMug/posture_assets/raw/main/static/pose_pairs/custom106/custom106_r01_g01_contour.png

   /static/pose_pairs/custom1143/custom1143_r01_g01_contour.png
   https://gitee.com/blueMug/posture_assets_v2/raw/main/static/pose_pairs/custom1143/custom1143_r01_g01_contour.png
   ```

   Do not push `custom1143` or later assets to the legacy repository. Update the matching cache version in `utils/assets.js`: `REMOTE_ASSET_VERSION` for the legacy repository or `REMOTE_ASSET_VERSION_V2` for v2. If you cannot access or update the selected remote repo, explicitly report that the code is wired locally but Gitee publication remains pending.

10. Verify.

   Run:

   ```sh
   file static/pose_pairs/customNNN/customNNN_r01_g01_contour.png
   sips -g hasAlpha -g pixelWidth -g pixelHeight static/pose_pairs/customNNN/customNNN_r01_g01_contour.png
   node scripts/check-guide-ratios.js
   node --check utils/combinePairPoses.js
   node --check utils/poses.js
   node --check utils/assets.js
   node --check utils/guideImageSizes.js
   node --check pages/camera/index.js
   git diff --check
   ```

   If a UI/manual check is feasible, inspect:

   - Home recommendation card thumbnail.
   - Pose gallery.
   - Pose detail image.
   - Camera outline mode.
   - Camera photo guide mode when `modelImage` exists.
   - Share image behavior.
   - Search result quality for several generated keywords.
   - Category placement and whether the pose appears in expected sections.

## Common Failure Modes

- Adding image files but not adding the ID to `combinePairIds`.
- Adding the ID but leaving default metadata, causing poor names/search/scene matching.
- Writing generic metadata that does not describe hand action, body orientation, or scene.
- Generating only search keywords but not scene keywords, so scene recommendation misses the pose.
- Adding a pose to a category because the image looks nice, without matching the category promise shown to users.
- Importing an RGB contour image with a baked-in checkerboard/gray background. Camera contours must be real transparent RGBA PNGs.
- Reintroducing `static/pose_guides`, `static/recommend_guides`, or `static/home_guides`. These folders are retired for imports; the camera guide contour lives under `static/pose_pairs`.
- Changing a guide image without updating `utils/guideImageSizes.js`.
- Treating camera `3:4` preview as a requirement that every contour PNG canvas must be `3:4`.
- Forgetting that many `static/*` folders are ignored by mini app packaging and must exist in the remote Gitee asset repo.
- Assuming local existence implies production availability. If `assetUrl()` maps a path to Gitee, production depends on the repository selected by the `custom1143` boundary.
- Publishing `custom1143` or later assets to the legacy `blueMug/posture_assets` repository instead of `blueMug/posture_assets_v2`.
- Adding a category but leaving the number in `removedPoseNumbers`.

## Response Expectations

When using this skill, finish with:

- Pose ID added or updated.
- Files added or still missing.
- Contour transparency status, including whether conversion was needed.
- Structured metadata, keyword maps, and category placement changed.
- Code/data files changed.
- Gitee publication status for the repository selected by the `custom1143` boundary.
- Verification commands run and results.
