# dsh-w-vision

DeepSeek Harness 统一视觉插件：把当前 Windows 屏幕、本地图片文件和聊天上传图片全部交给配置的视觉中转模型分析。主模型本身不需要支持图片输入。

## 功能

- 提供 `look_at_screen` 模型工具，识别当前物理桌面并返回可操作控件的物理像素坐标；
- 在每个 agent 会话中提供 scoped `read_image`，覆盖 Harness 内置同名工具；
- `read_image` 支持本地 PNG、JPEG、WebP 和 GIF，包括浏览器、Edge、Playwright 和测试工具生成的落盘截图；
- 使用 Windows 物理虚拟桌面坐标，支持多显示器、负坐标和 DPI 缩放；
- 在设置中配置视觉模型的 Base URL、API Key 和模型名；
- 配置保存在 profile 目录的 `.dsh-w-vision.json`，修改后即时生效；
- 为 `dsh-w-easy-upload` 批量识别聊天框中的 PNG、JPEG、WebP 和 GIF 图片；
- 屏幕、本地文件和上传图片使用同一组视觉中转配置，识别结果以纯文本交给主模型；
- 大图片 Base64 使用常量栈线性校验，避免 `Maximum call stack size exceeded`。

## 视觉入口

| 场景 | 入口 | 行为 |
| --- | --- | --- |
| 当前 Windows 桌面 | `look_at_screen` | 截取物理虚拟桌面并输出 UI 坐标清单 |
| 本地图片或落盘截图 | `read_image` | 通过 Harness 文件系统读取并交给视觉中转模型 |
| 用户上传图片 | `dsh-w-easy-upload -> vision.analyzeUploads` | 先识别图片，再把纯文字上下文交给主模型 |

## 安装

```powershell
npm pack --ignore-scripts
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-vision-0.3.2.tgz
```

安装后重启桌面版（或 `dsh web`），然后在设置 -> 自定义插件 -> `dsh-w-vision` 中填写模型配置。

## 注意

- API Key 只保存在本机 profile 状态文件中，不要把该文件提交到 Git；
- 视觉模型需要兼容 OpenAI 风格的 Chat Completions 图片输入；
- `look_at_screen` 返回的坐标是 Windows 虚拟桌面的物理像素，可直接传给 `dsh-w-computer-use`；
- `read_image` 通过 Harness 文件系统按当前任务工作目录解析路径，单张图片上限为 5 MB，并验证扩展名与文件魔数；
- 安装或升级后需要重启桌面版（或 `dsh web`），让新建或恢复的 agent 会话挂载 scoped `read_image`。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-vision
```
