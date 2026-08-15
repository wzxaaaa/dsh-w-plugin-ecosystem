# dsh-w-vision

DeepSeek Harness 视觉插件：截取当前 Windows 屏幕，把截图交给配置的视觉模型，并返回带有物理桌面像素坐标的 UI 清单；同时为 `dsh-w-easy-upload` 提供用户上传图片的安全识别接口。

## 功能

- 提供 `look_at_screen` 模型工具；
- 使用 Windows 物理虚拟桌面坐标，支持多显示器、负坐标和 DPI 缩放；
- 在设置中配置视觉模型的 Base URL、API Key 和模型名；
- 配置保存在 profile 目录的 `.dsh-w-vision.json`，修改后即时生效；
- 返回交互元素的角色、文字、边界框和中心点；
- 为 `dsh-w-easy-upload` 批量识别聊天框中的 PNG、JPEG、WebP 和 GIF 图片，再把识别结果交给不支持图片的主模型。

## 安装

```powershell
pnpm pack --config.ignore-scripts=true
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-vision-0.2.2.tgz
```

安装后重启桌面版（或 `dsh web`），然后在设置 → 自定义插件 → `dsh-w-vision` 中填写模型配置。

## 注意

- API Key 只保存在本机 profile 状态文件中，不要把该文件提交到 Git；
- 视觉模型需要兼容 OpenAI 风格的 Chat Completions 图片输入；
- `look_at_screen` 返回的坐标是 Windows 虚拟桌面的物理像素，可直接传给 `dsh-w-computer-use`；
- 上传图片会先发给你配置的视觉模型，再把纯文字识别结果交给主模型。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-vision
```
