# AI Posture

一个微信小程序原型：调用微信原生相机，并在拍摄预览画面上叠加固定人物姿势线条，用于景点拍照、穿搭拍照等娱乐出片场景。

## 功能

- 姿势选择引导页
- 按景点打卡、休闲坐姿分类展示轮廓模板
- 点击姿势后再打开相机
- 原生相机全屏预览
- 3 套固定轮廓引导模板
- 支持图片提取型透明 PNG 姿势轮廓模板
- 模板左右切换
- 前后摄像头切换
- 显示或隐藏姿势线条
- 拍照后预览
- 保存照片到系统相册

## 使用方式

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择当前目录：`/Users/bytedance/Documents/person/project/ai_posture`。
4. AppID 可以先使用测试号或替换为你的正式小程序 AppID。
5. 相机能力建议用真机预览测试，开发者工具模拟器对相机能力支持有限。
6. 进入小程序后，先在首页选择姿势，再进入相机拍照。

## 当前边界

- 姿势线条只在拍摄预览时显示，不会合成到最终照片里。
- 暂不做人像识别、姿势识别或实时纠偏提示。
- 姿势模板只保留轮廓型表达，不再维护骨架、关节点或人体关键点线条。

## 图片姿势提取

离线提取工具放在 `tools/`：

```bash
python3 tools/extract_pose_outline.py assets/extracted/baidu_pose_source.jpeg --id demo_pose
```

脚本会输出透明底 PNG、SVG 和 JSON 模板。当前默认使用 OpenCV GrabCut 作为兜底分割，效果只适合调试；产品级需要把 `tools/extract_pose_outline.py` 中的 `segment_person()` 替换为 MODNet、SAM/SAM2 或 MediaPipe ImageSegmenter 等模型，并结合 Pose/Hands 关键点做规则化轮廓。
