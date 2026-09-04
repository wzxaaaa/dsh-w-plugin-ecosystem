# dsh-w-plugin-ecosystem

`wzxaaaa` 的 DeepSeek Harness W 系列插件合集。这里集中维护 W 系列可直接安装的插件源码和当前版本 `.tgz` 包。

> 这些插件面向 Windows 桌面版 / Web profile。插件拥有本机代码执行权限，请只安装你信任的版本。

## 插件列表

| 插件 | 当前版本 | 作用 | 安装包 |
| --- | ---: | --- | --- |
| [`dsh-w-custom-plugins`](./dsh-w-custom-plugins) | `0.3.2` | 自定义插件管理、启停和拖拽安装；隐藏 preset 内部实现模块；**建议第一个安装** | [下载 `.tgz`](./dsh-w-custom-plugins/dsh-w-custom-plugins-0.3.2.tgz?raw=1) |
| [`dsh-w-right-sidebar`](./dsh-w-right-sidebar) | `0.7.1` | W 系列共用的右侧 Sidebar 宿主：工具栏、工具页返回、收缩栏直达工具，并真实挤压中间对话区域, 已完美兼容**dsh-better-sidebar**; **建议第二个安装** | [下载 `.tgz`](./dsh-w-right-sidebar/dsh-w-right-sidebar-0.7.1.tgz?raw=1) |
| [`dsh-w-noval-write`](./dsh-w-noval-write) | `0.8.2` | 工作区共享的小说数据层：schema v4 自定义字段、卷章场景大纲、按 ID 局部 AI 工具和持久 `/write`；兼容 Harness 0.1.2-alpha.4 | [下载 `.tgz`](./dsh-w-noval-write/dsh-w-noval-write-0.8.2.tgz?raw=1) |
| [`dsh-w-whale-tail`](./dsh-w-whale-tail) | `0.5.0` | 右侧 Sidebar 中的鲸鱼娘工具：透明主立绘、眨眼与状态动作、流动液体爱心淫乱值和对话记忆窗口 | [下载 `.tgz`](./dsh-w-whale-tail/dsh-w-whale-tail-0.5.0.tgz?raw=1) |
| [`dsh-w-archive-manager`](./dsh-w-archive-manager) | `0.1.2` | 在设置中管理已归档对话，支持还原、永久删除、一键清理和真实的 30 天自动清理 | [下载 `.tgz`](./dsh-w-archive-manager/dsh-w-archive-manager-0.1.2.tgz?raw=1) |
| [`dsh-w-assistant-refresh`](./dsh-w-assistant-refresh) | `0.2.2` | 在同一会话内重生成指定 AI 回复，不创建新对话并隐藏被替换的旧回复 | [下载 `.tgz`](./dsh-w-assistant-refresh/dsh-w-assistant-refresh-0.2.2.tgz?raw=1) |
| [`dsh-w-chatflow`](./dsh-w-chatflow) | `0.3.2` | 消除超长流式思维链的重复扫描；屏外延迟渲染改为可选，避免长消息向上滚动回弹；兼容 Harness 0.1.2-alpha.4 | [下载 `.tgz`](./dsh-w-chatflow/dsh-w-chatflow-0.3.2.tgz?raw=1) |
| [`dsh-w-computer-use`](./dsh-w-computer-use) | `0.3.2` | Windows 鼠标、键盘、窗口和安全边框控制 | [下载 `.tgz`](./dsh-w-computer-use/dsh-w-computer-use-0.3.2.tgz?raw=1) |
| [`dsh-w-easy-upload`](./dsh-w-easy-upload) | `0.2.0` | 保留原图缩略图与原文字，由视觉插件为纯文本主模型提供后台识图结果 | [下载 `.tgz`](./dsh-w-easy-upload/dsh-w-easy-upload-0.2.0.tgz?raw=1) |
| [`dsh-w-knowledge-base`](./dsh-w-knowledge-base) | `0.4.3` | 双模式跨会话 Markdown 知识库：assistant 笔记与独立 writing 文风语料库、`kb_*` 工具、千万字符整本投喂，以及响应式侧栏界面 | [下载 `.tgz`](./dsh-w-knowledge-base/dsh-w-knowledge-base-0.4.3.tgz?raw=1) |
| [`dsh-w-persona`](./dsh-w-persona) | `0.3.1` | 在设置中编辑 Persona，保存并一键切换完整人设模板，同时配置隐藏的两轮 user/assistant 对话预设；兼容 Harness 0.1.2-alpha.4 | [下载 `.tgz`](./dsh-w-persona/dsh-w-persona-0.3.1.tgz?raw=1) |
| [`dsh-w-reasoning-bridge`](./dsh-w-reasoning-bridge) | `0.2.2` | 在官方模型设置中启用中转模型能力，并让对话框直接显示 DSH 原生“推理等级”选择器；中转协议按端点而非模型名称判断 | [下载 `.tgz`](./dsh-w-reasoning-bridge/dsh-w-reasoning-bridge-0.2.2.tgz?raw=1) |
| [`dsh-w-vision`](./dsh-w-vision) | `0.3.2` | 统一接管物理屏幕、本地图片/落盘截图及上传图片识别，文本主模型也可用 | [下载 `.tgz`](./dsh-w-vision/dsh-w-vision-0.3.2.tgz?raw=1) |
| [`dsh-w-route-primer`](./dsh-w-route-primer) | `0.3.0` | 路由预热、任务分类与模式工具；感谢风神开源 `routing-suite` 和社区开源贡献 | [下载 `.tgz`](./dsh-w-route-primer/dsh-w-route-primer-0.3.0.tgz?raw=1) |
| [`dsh-w-teacher-help-me`](./dsh-w-teacher-help-me) | `0.2.0` | 主模型受阻时召唤可只读调查工作区的老师模型，获取诊断和解决思路 | [下载 `.tgz`](./dsh-w-teacher-help-me/dsh-w-teacher-help-me-0.2.0.tgz?raw=1) |
| [`dsh-w-wallpaper`](./dsh-w-wallpaper) | `0.2.0` | 图片/视频铺满整个工作区（含左侧 sidebar），支持 0–40px 模糊和视频速度调节 | [下载 `.tgz`](./dsh-w-wallpaper/dsh-w-wallpaper-0.2.0.tgz?raw=1) |

## 推荐安装顺序

### 第一步：先安装 `dsh-w-custom-plugins`

建议先安装 [`dsh-w-custom-plugins`](https://github.com/wzxaaaa/dsh-w-plugin-ecosystem/blob/main/dsh-w-custom-plugins)。它是本插件生态的图形化管理入口，安装以后，其余 W 系列插件都可以直接把 `.tgz` 安装包拖入页面完成安装。

首次安装管理器时还没有拖拽入口，因此需要使用一次 DeepSeek Harness 官方 CLI：

```powershell
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add .\dsh-w-custom-plugins\dsh-w-custom-plugins-0.3.2.tgz
```

如果已经配置了全局 `dsh`，也可以使用：

```powershell
dsh plugin --profile web add .\dsh-w-custom-plugins\dsh-w-custom-plugins-0.3.2.tgz
```

安装完成后重启桌面版（或重新启动 `dsh web`），进入：

> **设置 → 插件 → 自定义插件**

### 第二步：先安装视觉依赖，再拖入其他插件

下载并依次拖入下面当前版本的 `.tgz` 文件：

1. [`dsh-w-right-sidebar-0.7.1.tgz`](./dsh-w-right-sidebar/dsh-w-right-sidebar-0.7.1.tgz?raw=1)
2. [`dsh-w-whale-tail-0.5.0.tgz`](./dsh-w-whale-tail/dsh-w-whale-tail-0.5.0.tgz?raw=1)
3. [`dsh-w-vision-0.3.2.tgz`](./dsh-w-vision/dsh-w-vision-0.3.2.tgz?raw=1)
4. [`dsh-w-easy-upload-0.2.0.tgz`](./dsh-w-easy-upload/dsh-w-easy-upload-0.2.0.tgz?raw=1)
5. [`dsh-w-chatflow-0.3.2.tgz`](./dsh-w-chatflow/dsh-w-chatflow-0.3.2.tgz?raw=1)
6. [`dsh-w-computer-use-0.3.2.tgz`](./dsh-w-computer-use/dsh-w-computer-use-0.3.2.tgz?raw=1)
7. [`dsh-w-persona-0.3.1.tgz`](./dsh-w-persona/dsh-w-persona-0.3.1.tgz?raw=1)
8. [`dsh-w-reasoning-bridge-0.2.2.tgz`](./dsh-w-reasoning-bridge/dsh-w-reasoning-bridge-0.2.2.tgz?raw=1)
9. [`dsh-w-route-primer-0.3.0.tgz`](./dsh-w-route-primer/dsh-w-route-primer-0.3.0.tgz?raw=1)
10. [`dsh-w-teacher-help-me-0.2.0.tgz`](./dsh-w-teacher-help-me/dsh-w-teacher-help-me-0.2.0.tgz?raw=1)
11. [`dsh-w-wallpaper-0.2.0.tgz`](./dsh-w-wallpaper/dsh-w-wallpaper-0.2.0.tgz?raw=1)
12. [`dsh-w-archive-manager-0.1.2.tgz`](./dsh-w-archive-manager/dsh-w-archive-manager-0.1.2.tgz?raw=1)
13. [`dsh-w-assistant-refresh-0.2.2.tgz`](./dsh-w-assistant-refresh/dsh-w-assistant-refresh-0.2.2.tgz?raw=1)
14. [`dsh-w-knowledge-base-0.4.3.tgz`](./dsh-w-knowledge-base/dsh-w-knowledge-base-0.4.3.tgz?raw=1)
15. [`dsh-w-noval-write-0.8.2.tgz`](./dsh-w-noval-write/dsh-w-noval-write-0.8.2.tgz?raw=1)

拖入后页面会显示上传/安装进度，并调用官方 `dsh plugin add` 完成安装。建议一次只拖入一个文件，等待成功提示后再安装下一个；全部安装完成后再重启一次桌面版或 `dsh web`，确保所有插件都已加载。

> [!IMPORTANT]
> 请拖入插件目录中的 **`.tgz` 安装包**，不要拖源码文件夹，也不要下载并拖入整个仓库的 GitHub ZIP。整个仓库包含多个插件，会被安装器的“单插件包”安全校验拒绝。

> [!NOTE]
> `dsh-w-whale-tail` 依赖 `dsh-w-right-sidebar`，必须先安装右侧 Sidebar 宿主，再安装鲸鱼娘功能页。

> [!NOTE]
> `dsh-w-easy-upload` 依赖 `dsh-w-vision >= 0.2.2`，所以必须先安装并配置视觉插件。`dsh-w-vision 0.3.2` 还会在每个 agent 会话中用 scoped `read_image` 覆盖内置工具，把本地图片和落盘截图统一发送到配置的视觉中转模型，因此主模型不需要声明图片输入能力；同时修复约 4 MB 以上上传图片可能触发的 `Maximum call stack size exceeded`。`0.2.0` 会在聊天记录中保留原图缩略图和用户原文字，同时用只对模型可见的 Surface replacement 把视觉/OCR结果交给当前主模型；因此不是简单隐藏“当前模型不支持图片”的提示，也不会把内部视觉上下文显示成用户气泡。每条图片消息会产生一次视觉模型调用和一次主模型调用。

### 不使用管理器时

其他插件仍然可以单独通过官方 CLI 安装。例如：

```powershell
dsh plugin --profile web add .\dsh-w-vision\dsh-w-vision-0.3.2.tgz
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

cd ..\dsh-w-route-primer
npm test

cd ..\dsh-w-teacher-help-me
npm test

cd ..\dsh-w-wallpaper
npm test

cd ..\dsh-w-archive-manager
npm test

cd ..\dsh-w-assistant-refresh
npm test

cd ..\dsh-w-knowledge-base
npm test

cd ..\dsh-w-noval-write
npm test

cd ..\dsh-w-reasoning-bridge
npm test
```

发布前应至少执行：

```powershell
node --check .\index.js
pnpm pack --config.ignore-scripts=true
```

## 仓库范围

本仓库只包含 `dsh-w-*` W 系列插件，不包含第三方插件。
