---
name: "audit-pose-title-alignment"
description: "Audits pose photos against titles and action text. Invoke when checking or fixing mismatches between pose images, names, descriptions, or keywords."
---

# Audit Pose Title Alignment

Use this skill when the user asks to check whether existing pose photos, titles, action descriptions, or search keywords are aligned.

## Scope

- Primary data file: `utils/combinePairPoses.js`.
- Primary image source: `assets/pose_pairs/<customId>/<pairId>_demo.(png|jpg|jpeg)`.
- Generated audit artifacts should go under `.tmp/pose_title_audit/`.
- Do not revert unrelated dirty worktree changes.

## Workflow

1. Read `utils/combinePairPoses.js` and extract `combinePairPoses` entries with `id`, `name`, `description`, `modelImage`, and `searchKeywords`.
2. Generate contact-sheet audit images that place each real demo image next to its ID, current title, and a short description excerpt.
3. Review every contact sheet manually. Prioritize hard mismatches:
   - title says standing but photo is sitting, lying, crouching, or first-person;
   - title names the wrong prop, such as hat vs bag;
   - title names the wrong action, such as扶帽 vs提包, 张臂 vs蹲姿伸手;
   - image is visibly broken, blurred, blocked, or unusable.
4. Fix only evidence-backed mismatches in `utils/combinePairPoses.js`:
   - update `name`, `tip`, and `description`;
   - update `poseSearchKeywordOverrides`;
   - update `poseActionNameOverrides` when it controls the final displayed name;
   - update `poseSceneKeywordOverrides` when old scene/prop terms would mislead search.
5. Keep names concise and visually specific. Avoid generic placeholders like `姿势04` when the photo clearly shows a concrete action.
6. Flag bad images separately instead of hiding them behind a vague title.
7. Verify with:
   - `node --check utils/combinePairPoses.js`
   - `node scripts/check-guide-ratios.js`

## Contact Sheet Helper

Prefer the bundled helper:

```bash
python3 .trae/skills/audit-pose-title-alignment/scripts/generate_contact_sheets.py
```

Useful variants:

```bash
python3 .trae/skills/audit-pose-title-alignment/scripts/generate_contact_sheets.py --range 597-666 --per-sheet 12 --columns 3 --output .tmp/pose_title_audit_recent
```

The helper renders 4 columns per sheet by default, about 24 items per sheet, with:

- demo image;
- pair ID, such as `custom422_r01_g01`;
- current display name;
- first 2-3 wrapped lines of the description.

The audit output should be reusable by the user for visual review.
