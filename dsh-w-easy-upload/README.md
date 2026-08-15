# dsh-w-easy-upload

DeepSeek Harness 图片上传桥接插件。它让不支持图片输入的主模型也能处理聊天框中拖入或粘贴的图片。

## 工作方式

1. 用户把图片拖入或粘贴到聊天框，并输入问题；
2. `dsh-w-easy-upload` 拦截图片草稿；
3. 图片先交给已配置的 `dsh-w-vision` 识别；
4. 插件把用户原文与视觉/OCR结果组合成纯文字消息；
5. 主模型只收到纯文字，因此不会再触发“当前模型不支持图片”的拒绝。

每次图片消息会产生一次视觉模型调用和一次主模型调用。

## 依赖

必须先安装并配置：

```text
dsh-w-vision >= 0.2.2
```

在设置 → 自定义插件 → `dsh-w-vision` 中填写兼容 OpenAI Chat Completions 图片输入的 Base URL、API Key 和模型名。

## 安装

```powershell
pnpm pack --config.ignore-scripts=true
dsh plugin --profile web add ./dsh-w-easy-upload-0.1.0.tgz
```

也可以在已经安装 `dsh-w-custom-plugins` 后，把 `.tgz` 直接拖入自定义插件页面。

## 重要说明

- 插件不是简单隐藏警告，而是先完成图片识别，再发送纯文字上下文；
- 原图不会发送给不支持视觉的主模型；
- 当前版本发送成功后，历史消息中保留的是用户文字和识别结果，不会保留原图缩略图；
- 图片中的文字被视为不可信资料，不会被当成系统指令；
- 支持 PNG、JPEG、WebP 和 GIF，限制与 Harness 默认图片上传策略一致；
- 关闭插件后恢复 Harness 原生图片发送行为。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-easy-upload
```
