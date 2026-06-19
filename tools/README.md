# 姿势轮廓提取工具

小程序只负责展示姿势模板；人物图片到姿势模板的生成放在离线工具里完成。

当前脚本：

```bash
python3 tools/extract_pose_outline.py assets/extracted/baidu_pose_source.jpeg --id demo_pose
```

会输出：

- `*_overlay.png`：叠加预览
- `*_silhouette.png`：透明底姿势引导图，可被小程序 `guideImage` 使用
- `*.svg`：轮廓 path 版本
- `*_template.json`：模板元数据

默认分割方式是 OpenCV GrabCut，只用于兜底和调试。要做产品级效果，需要把 `extract_pose_outline.py` 里的 `segment_person()` 替换成真实模型：

- MODNet / Robust Video Matting：人像边缘更好，适合服务端批量生成姿势库。
- SAM / SAM2：泛化强，适合复杂背景，但需要人物框或点作为提示。
- MediaPipe ImageSegmenter + Pose + Hands：更适合实时原型，能同时拿到人体和手部关键点。

最终模板不要直接使用模型 mask 边缘。建议流程是：

```text
分割模型得到 person mask
人体关键点确定头、肩、手、躯干位置
手部关键点修正手掌和手指提示
规则化轮廓，去掉头发等非姿势外形
导出 PNG/SVG/JSON
```
