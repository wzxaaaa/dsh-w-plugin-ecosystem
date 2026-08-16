# dsh-w-wallpaper

DeepSeek Harness 全界面壁纸插件。选择任意尺寸的本地图片或视频后，插件会以 `cover` 方式铺满整个 Harness 内容区域；视频会静音、循环、自动播放，并支持 `0.25x` 到 `4x` 播放速度。

## 功能

- 图片和视频都保持原始 Blob，不缩放、不转码、不上传；
- 使用浏览器 IndexedDB 持久化媒体，避免大视频写入 JSON 或 Base64 膨胀；
- 启动后自动恢复壁纸，视频使用本地 Blob URL 播放；
- 自动适配窗口尺寸，统一使用 `object-fit: cover` 铺满界面；
- 对 Harness 主背景、侧栏和常用面板应用透明/半透明表面，保留文字可读性；
- 同时适配 Harness 浅色和深色主题；
- 在“设置 -> 插件 -> 自定义插件 -> dsh-w-wallpaper”中选择、替换或删除壁纸；
- 配置面板遵循 `dsh-w-custom-plugins` 的 keyed `custom-plugin.settings` 协议。

## 配置

安装并重启后，打开自定义插件列表，在 `dsh-w-wallpaper` 卡片右侧点击齿轮：

1. 选择图片或视频；
2. 视频可以调整播放速度；
3. 点击“应用”；
4. “移除壁纸”只删除本插件在 IndexedDB 中保存的媒体副本，不会删除原文件。

壁纸存储在当前 Harness 浏览器数据域中。不同浏览器 profile 或不同 Web origin 的壁纸彼此独立。

## 安装

```powershell
npm test
npm pack --ignore-scripts
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-wallpaper-0.1.0.tgz
```

覆盖安装后重启 DeepSeek Harness Desktop。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-wallpaper
```

卸载插件不会主动清理浏览器 IndexedDB 中的壁纸；重新安装后可以继续使用或在设置中移除。
