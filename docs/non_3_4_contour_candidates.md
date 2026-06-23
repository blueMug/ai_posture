# 非 3:4 轮廓图候选清单

筛选规则：只检查文件名包含 `contour` 或 `轮廓` 的图片；目标比例为 `3:4`，即 `width / height = 0.75`。

本次扫描到 `365` 个轮廓相关图片：

- 明显偏离 `3:4`：`56` 个文件，涉及 `26` 个 custom 编号
- 轻微非精确：`8` 个文件，通常只差 1-2 像素，暂不列为优先删除候选
- 已排除：`assets/brand/logo_pose_custom5_contour.png`，这是品牌图，不属于姿势轮廓资源

## 建议优先确认的 custom 编号

`custom1`, `custom2`, `custom3`, `custom4`, `custom5`, `custom6`, `custom7`, `custom8`, `custom9`, `custom10`, `custom13`, `custom14`, `custom15`, `custom16`, `custom17`, `custom20`, `custom24`, `custom25`, `custom30`, `custom31`, `custom32`, `custom33`, `custom35`, `custom36`, `custom37`, `custom53`

## 半身照重点候选

依据 `utils/poses.js` 里的分类，`portrait-half` 是“头像半身照”。它与上面的非 `3:4` 候选相交后，命中以下编号：

| custom | 所属分类 | 问题文件数 | 主要偏离 |
| --- | --- | ---: | --- |
| custom1 | 头像半身照 | 3 | 轮廓比例约 `0.55`，明显窄于 `3:4` |
| custom2 | 头像半身照 | 2 | 轮廓比例约 `0.55`，明显窄于 `3:4` |
| custom3 | 头像半身照 | 3 | 轮廓比例约 `0.536`，明显窄于 `3:4` |
| custom5 | 头像半身照 | 1 | 高清轮廓比例 `0.690524`，偏窄 |
| custom20 | 头像半身照 | 2 | 轮廓比例约 `0.562`，明显窄于 `3:4` |

如果把“自拍不尴尬”里的胸上近景也按半身/近景处理，还需要额外确认：

| custom | 所属分类 | 问题文件数 | 主要偏离 |
| --- | --- | ---: | --- |
| custom24 | 自拍不尴尬 | 3 | 轮廓比例约 `0.80`，偏宽 |
| custom37 | 自拍不尴尬 | 2 | 轮廓比例约 `0.667`，偏窄 |

## 明显偏离清单

| custom | 尺寸 | 当前比例 | 偏离 0.75 | 文件 |
| --- | --- | ---: | ---: | --- |
| custom1 | 916x1663 | 0.550812 | 0.199188 | `assets/pose_pairs/custom1/custom1_r01_g01_contour_hd.png` |
| custom1 | 231x420 | 0.550000 | 0.200000 | `static/pose_guides/custom1/custom1_r01_g01_contour.png` |
| custom1 | 231x420 | 0.550000 | 0.200000 | `static/recommend_guides/custom1/custom1_r01_g01_contour.png` |
| custom2 | 907x1643 | 0.552039 | 0.197961 | `assets/pose_pairs/custom2/custom2_r01_g01_contour_hd.png` |
| custom2 | 231x420 | 0.550000 | 0.200000 | `static/pose_guides/custom2/custom2_r01_g01_contour.png` |
| custom3 | 882x1645 | 0.536170 | 0.213830 | `assets/pose_pairs/custom3/custom3_r01_g01_contour_hd.png` |
| custom3 | 225x420 | 0.535714 | 0.214286 | `static/pose_guides/custom3/custom3_r01_g01_contour.png` |
| custom3 | 225x420 | 0.535714 | 0.214286 | `static/recommend_guides/custom3/custom3_r01_g01_contour.png` |
| custom4 | 790x1422 | 0.555556 | 0.194444 | `assets/pose_pairs/custom4/custom4_r01_g01_contour_hd.png` |
| custom5 | 1042x1509 | 0.690524 | 0.059476 | `assets/pose_pairs/custom5/custom5_r01_g01_contour_hd.png` |
| custom6 | 1021x1533 | 0.666014 | 0.083986 | `assets/pose_pairs/custom6/custom6_r01_g01_contour_hd.png` |
| custom6 | 279x420 | 0.664286 | 0.085714 | `static/pose_guides/custom6/custom6_r01_g01_contour.png` |
| custom7 | 1024x1536 | 0.666667 | 0.083333 | `assets/pose_pairs/custom7/custom7_r01_g01_contour_hd.png` |
| custom8 | 867x1632 | 0.531250 | 0.218750 | `assets/pose_pairs/custom8/custom8_r01_g01_contour_hd.png` |
| custom8 | 223x420 | 0.530952 | 0.219048 | `static/pose_guides/custom8/custom8_r01_g01_contour.png` |
| custom9 | 960x1486 | 0.646030 | 0.103970 | `assets/pose_pairs/custom9/custom9_r01_g01_contour_hd.png` |
| custom9 | 271x420 | 0.645238 | 0.104762 | `static/pose_guides/custom9/custom9_r01_g01_contour.png` |
| custom10 | 689x1423 | 0.484188 | 0.265812 | `assets/pose_pairs/custom10/custom10_r01_g01_contour_hd.png` |
| custom10 | 203x420 | 0.483333 | 0.266667 | `static/pose_guides/custom10/custom10_r01_g01_contour.png` |
| custom13 | 567x1598 | 0.354819 | 0.395181 | `assets/pose_pairs/custom13/custom13_r01_g01_contour_hd.png` |
| custom13 | 149x420 | 0.354762 | 0.395238 | `static/pose_guides/custom13/custom13_r01_g01_contour.png` |
| custom14 | 1023x1537 | 0.665582 | 0.084418 | `assets/pose_pairs/custom14/custom14_r01_g01_contour_hd.png` |
| custom14 | 279x420 | 0.664286 | 0.085714 | `static/pose_guides/custom14/custom14_r01_g01_contour.png` |
| custom15 | 941x1672 | 0.562799 | 0.187201 | `assets/pose_pairs/custom15/custom15_r01_g01_contour_hd.png` |
| custom16 | 1003x1568 | 0.639668 | 0.110332 | `assets/pose_pairs/custom16/custom16_r01_g01_contour_hd.png` |
| custom17 | 941x1672 | 0.562799 | 0.187201 | `assets/pose_pairs/custom17/custom17_r01_g01_contour_hd.png` |
| custom17 | 236x420 | 0.561905 | 0.188095 | `static/pose_guides/custom17/custom17_r01_g01_contour.png` |
| custom20 | 941x1672 | 0.562799 | 0.187201 | `assets/pose_pairs/custom20/custom20_r01_g01_contour_hd.png` |
| custom20 | 236x420 | 0.561905 | 0.188095 | `static/pose_guides/custom20/custom20_r01_g01_contour.png` |
| custom24 | 1122x1402 | 0.800285 | 0.050285 | `assets/pose_pairs/custom24/custom24_r01_g01_contour_hd.png` |
| custom24 | 336x420 | 0.800000 | 0.050000 | `static/pose_guides/custom24/custom24_r01_g01_contour.png` |
| custom24 | 336x420 | 0.800000 | 0.050000 | `static/recommend_guides/custom24/custom24_r01_g01_contour.png` |
| custom25 | 1023x1537 | 0.665582 | 0.084418 | `assets/pose_pairs/custom25/custom25_r01_g01_contour_hd.png` |
| custom25 | 280x420 | 0.666667 | 0.083333 | `static/pose_guides/custom25/custom25_r01_g01_contour.png` |
| custom25 | 280x420 | 0.666667 | 0.083333 | `static/recommend_guides/custom25/custom25_r01_g01_contour.png` |
| custom30 | 1024x1536 | 0.666667 | 0.083333 | `assets/pose_pairs/custom30/custom30_r01_g01_contour_hd.png` |
| custom30 | 280x420 | 0.666667 | 0.083333 | `static/pose_guides/custom30/custom30_r01_g01_contour.png` |
| custom30 | 280x420 | 0.666667 | 0.083333 | `static/recommend_guides/custom30/custom30_r01_g01_contour.png` |
| custom31 | 988x1592 | 0.620603 | 0.129397 | `assets/pose_pairs/custom31/custom31_r01_g01_contour_hd.png` |
| custom31 | 261x420 | 0.621429 | 0.128571 | `static/pose_guides/custom31/custom31_r01_g01_contour.png` |
| custom31 | 261x420 | 0.621429 | 0.128571 | `static/recommend_guides/custom31/custom31_r01_g01_contour.png` |
| custom32 | 1024x1536 | 0.666667 | 0.083333 | `assets/pose_pairs/custom32/custom32_r01_g01_contour_hd.png` |
| custom32 | 280x420 | 0.666667 | 0.083333 | `static/pose_guides/custom32/custom32_r01_g01_contour.png` |
| custom33 | 941x1672 | 0.562799 | 0.187201 | `assets/pose_pairs/custom33/custom33_r01_g01_contour_hd.png` |
| custom33 | 236x420 | 0.561905 | 0.188095 | `static/pose_guides/custom33/custom33_r01_g01_contour.png` |
| custom33 | 236x420 | 0.561905 | 0.188095 | `static/recommend_guides/custom33/custom33_r01_g01_contour.png` |
| custom35 | 941x1672 | 0.562799 | 0.187201 | `assets/pose_pairs/custom35/custom35_r01_g01_contour_hd.png` |
| custom35 | 236x420 | 0.561905 | 0.188095 | `static/pose_guides/custom35/custom35_r01_g01_contour.png` |
| custom36 | 1024x1536 | 0.666667 | 0.083333 | `assets/pose_pairs/custom36/custom36_r01_g01_contour_hd.png` |
| custom36 | 280x420 | 0.666667 | 0.083333 | `static/pose_guides/custom36/custom36_r01_g01_contour.png` |
| custom36 | 280x420 | 0.666667 | 0.083333 | `static/recommend_guides/custom36/custom36_r01_g01_contour.png` |
| custom37 | 1024x1536 | 0.666667 | 0.083333 | `assets/pose_pairs/custom37/custom37_r01_g01_contour_hd.png` |
| custom37 | 280x420 | 0.666667 | 0.083333 | `static/pose_guides/custom37/custom37_r01_g01_contour.png` |
| custom53 | 1122x1402 | 0.800285 | 0.050285 | `assets/pose_pairs/custom53/custom53_r01_g01_contour_hd.png` |
| custom53 | 336x420 | 0.800000 | 0.050000 | `static/pose_guides/custom53/custom53_r01_g01_contour.png` |
| custom53 | 1122x1402 | 0.800285 | 0.050285 | `static/pose_pairs/custom53/custom53_r01_g01_contour.png` |

## 轻微非精确，建议先保留

这些文件接近 `3:4`，偏差低于 `0.01`，更像导出取整误差：

- `assets/pose_pairs/custom12/custom12_r01_g01_contour_hd.png`
- `assets/pose_pairs/custom57/custom57_r01_g01_contour_hd.png`
- `static/pose_pairs/custom5/custom5_r01_g01_contour.png`
- `static/pose_pairs/custom6/custom6_r01_g01_contour.png`
- `static/pose_pairs/custom9/custom9_r01_g01_contour.png`
- `static/pose_pairs/custom12/custom12_r01_g01_contour.png`
- `static/pose_pairs/custom57/custom57_r01_g01_contour.png`
- `static/pose_guides/custom57/custom57_r01_g01_contour.png`
