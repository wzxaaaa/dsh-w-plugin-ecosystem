# dsh-w-plugin-ecosystem

`wzxaaaa` 的 DeepSeek Harness W 系列插件合集。这里集中维护 6 个可直接安装的插件源码和当前版本 `.tgz` 包。

> 这些插件面向 Windows 桌面版 / Web profile。插件拥有本机代码执行权限，请只安装你信任的版本。

## 插件列表

| 插件 | 当前版本 | 作用 | 安装包 |
| --- | ---: | --- | --- |
| [`dsh-w-custom-plugins`](./dsh-w-custom-plugins) | `0.3.1` | 自定义插件管理、启停和拖拽安装；**建议第一个安装** | [下载 `.tgz`](./dsh-w-custom-plugins/dsh-w-custom-plugins-0.3.1.tgz?raw=1) |
| [`dsh-w-chatflow`](./dsh-w-chatflow) | `0.3.1` | 消除超长流式思维链的重复扫描；屏外延迟渲染改为可选，避免长消息向上滚动回弹 | [下载 `.tgz`](./dsh-w-chatflow/dsh-w-chatflow-0.3.1.tgz?raw=1) |
| [`dsh-w-computer-use`](./dsh-w-computer-use) | `0.3.2` | Windows 鼠标、键盘、窗口和安全边框控制 | [下载 `.tgz`](./dsh-w-computer-use/dsh-w-computer-use-0.3.2.tgz?raw=1) |
| [`dsh-w-easy-upload`](./dsh-w-easy-upload) | `0.2.0` | 保留原图缩略图与原文字，由视觉插件为纯文本主模型提供后台识图结果 | [下载 `.tgz`](./dsh-w-easy-upload/dsh-w-easy-upload-0.2.0.tgz?raw=1) |
| [`dsh-w-persona`](./dsh-w-persona) | `0.2.0` | 查看、编辑、保存和恢复全局人设提示词 | [下载 `.tgz`](./dsh-w-persona/dsh-w-persona-0.2.0.tgz?raw=1) |
| [`dsh-w-vision`](./dsh-w-vision) | `0.3.1` | 统一接管物理屏幕、本地图片/落盘截图及上传图片识别，文本主模型也可用 | [下载 `.tgz`](./dsh-w-vision/dsh-w-vision-0.3.1.tgz?raw=1) |

## 推荐安装顺序

### 第一步：先安装 `dsh-w-custom-plugins`

建议先安装 [`dsh-w-custom-plugins`](https://github.com/wzxaaaa/dsh-w-plugin-ecosystem/blob/main/dsh-w-custom-plugins)。它是本插件生态的图形化管理入口，安装以后，其余五个插件都可以直接把 `.tgz` 安装包拖入页面完成安装。

首次安装管理器时还没有拖拽入口，因此需要使用一次 DeepSeek Harness 官方 CLI：

```powershell
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add .\dsh-w-custom-plugins\dsh-w-custom-plugins-0.3.1.tgz
```

如果已经配置了全局 `dsh`，也可以使用：

```powershell
dsh plugin --profile web add .\dsh-w-custom-plugins\dsh-w-custom-plugins-0.3.1.tgz
```

安装完成后重启桌面版（或重新启动 `dsh web`），进入：

> **设置 → 插件 → 自定义插件**

### 第二步：先安装视觉依赖，再拖入其他插件

下载并依次拖入下面五个当前版本的 `.tgz` 文件：

1. [`dsh-w-vision-0.3.1.tgz`](./dsh-w-vision/dsh-w-vision-0.3.1.tgz?raw=1)
2. [`dsh-w-easy-upload-0.2.0.tgz`](./dsh-w-easy-upload/dsh-w-easy-upload-0.2.0.tgz?raw=1)
3. [`dsh-w-chatflow-0.3.1.tgz`](./dsh-w-chatflow/dsh-w-chatflow-0.3.1.tgz?raw=1)
4. [`dsh-w-computer-use-0.3.2.tgz`](./dsh-w-computer-use/dsh-w-computer-use-0.3.2.tgz?raw=1)
5. [`dsh-w-persona-0.2.0.tgz`](./dsh-w-persona/dsh-w-persona-0.2.0.tgz?raw=1)

拖入后页面会显示上传/安装进度，并调用官方 `dsh plugin add` 完成安装。建议一次只拖入一个文件，等待成功提示后再安装下一个；全部安装完成后再重启一次桌面版或 `dsh web`，确保所有插件都已加载。

> [!IMPORTANT]
> 请拖入插件目录中的 **`.tgz` 安装包**，不要拖源码文件夹，也不要下载并拖入整个仓库的 GitHub ZIP。整个仓库包含多个插件，会被安装器的“单插件包”安全校验拒绝。

> [!NOTE]
> `dsh-w-easy-upload` 依赖 `dsh-w-vision >= 0.2.2`，所以必须先安装并配置视觉插件。`dsh-w-vision 0.3.1` 还会在每个 agent 会话中用 scoped `read_image` 覆盖内置工具，把本地图片和落盘截图统一发送到配置的视觉中转模型，因此主模型不需要声明图片输入能力。`0.2.0` 会在聊天记录中保留原图缩略图和用户原文字，同时用只对模型可见的 Surface replacement 把视觉/OCR结果交给当前主模型；因此不是简单隐藏“当前模型不支持图片”的提示，也不会把内部视觉上下文显示成用户气泡。每条图片消息会产生一次视觉模型调用和一次主模型调用。

### 不使用管理器时

其他插件仍然可以单独通过官方 CLI 安装。例如：

```powershell
dsh plugin --profile web add .\dsh-w-vision\dsh-w-vision-0.3.1.tgz
```

每个插件目录的 README 都有自己的功能说明、依赖和卸载命令。

## 开发与验证

每个插件保留可安装源码；`dsh-w-computer-use` 包含不执行点击的控制器 smoke test，视觉与图片桥接插件也包含单元测试：

```powershell
cd .\dsh-w-computer-use
node .\test\controller-smoke.mjs

cd ..\dsh-w-vision
npm test

cd ..\dsh-w-easy-upload
node --test .\test\client.test.mjs .\test\core.test.mjs

cd ..\dsh-w-chatflow
npm test
```

发布前应至少执行：

```powershell
node --check .\index.js
pnpm pack --config.ignore-scripts=true
```

## 仓库范围

本仓库只包含 `dsh-w-*` W 系列插件，不包含第三方插件。
