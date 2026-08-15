# dsh-w-easy-upload

让不支持图片输入的主模型，也能获得接近原生图片上传的使用体验。

## 用户看到的效果

安装并启用后：

- 图片仍以正常缩略图显示在用户消息气泡中；
- 用户输入的原始文字保持不变；
- 不再弹出“当前模型不支持识图/图片”的提示；
- `dsh-w-vision` 在后台分析原图；
- 主模型只接收原始文字 + Vision 结果，并负责组织最终回复；
- `<dsh-w-easy-upload>`、`<vision-context>` 等内部转接内容不会显示在用户消息气泡中。

## 工作方式

1. 浏览器读取草稿图片一次；
2. 图片先调用 `dsh-w-vision` 的 `analyzeUploads`；
3. Host 把原图保存为正常的 Harness 图片附件，并追加一条普通用户消息；
4. 聊天界面照常渲染这条带图片和原文字的用户消息；
5. 主模型请求开始前，插件追加一个仅对模型可见的 Surface replacement；
6. replacement 只包含 Vision 返回的文字，所以文本模型不会收到图片，也不会触发原生图片能力拒绝。

原始用户消息是可持久化的正常消息；模型专用 replacement 不会作为聊天 UI 的新气泡显示。

## 依赖和安装顺序

必须先安装并配置：

```text
dsh-w-vision >= 0.2.2
```

在设置 → 自定义插件 → `dsh-w-vision` 中填写兼容 OpenAI Chat Completions 图片输入的 Base URL、API Key 和模型名。

然后安装本插件：

```powershell
pnpm pack --config.ignore-scripts=true
dsh plugin --profile web add ./dsh-w-easy-upload-0.2.0.tgz
```

如果已经安装 `dsh-w-custom-plugins`，也可以把生成的 `.tgz` 直接拖进自定义插件区域。

## 限制

- 原图不会发送给不支持视觉的主模型；
- 支持 PNG、JPEG、WebP 和 GIF；
- 图片数量、单图大小和总大小遵循当前 Harness 的附件策略；
- Vision 失败或 Host 入队失败时会保留草稿图片，方便重试；
- 关闭插件后恢复 Harness 原生 `sendSession` 行为。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-easy-upload
```
