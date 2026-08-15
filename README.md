# dsh-w-plugin-ecosystem

`wzxaaaa` 的 DeepSeek Harness W 系列插件合集。这里集中维护可直接安装的插件源码和当前版本 `.tgz` 包。

> 这些插件面向 Windows 桌面版 / Web profile。插件拥有本机代码执行权限，请只安装你信任的版本。

## 插件列表

| 插件 | 当前版本 | 作用 |
| --- | ---: | --- |
| [`dsh-w-chatflow`](./dsh-w-chatflow) | `0.2.1` | 用 `content-visibility` 降低长会话滚动与绘制卡顿 |
| [`dsh-w-computer-use`](./dsh-w-computer-use) | `0.3.2` | Windows 鼠标、键盘、窗口和安全边框控制 |
| [`dsh-w-custom-plugins`](./dsh-w-custom-plugins) | `0.3.1` | 自定义插件管理、启停和拖拽安装 |
| [`dsh-w-persona`](./dsh-w-persona) | `0.2.0` | 查看、编辑、保存和恢复全局人设提示词 |
| [`dsh-w-vision`](./dsh-w-vision) | `0.2.1` | 屏幕视觉识别与物理桌面坐标输出 |

## 安装当前版本

进入对应插件目录，使用目录中同名的 `.tgz` 包通过官方 CLI 安装。例如：

```powershell
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add .\dsh-w-vision\dsh-w-vision-0.2.1.tgz
```

如果已经配置了全局 `dsh`，也可以使用：

```powershell
dsh plugin --profile web add .\dsh-w-vision\dsh-w-vision-0.2.1.tgz
```

每个插件目录的 README 都有自己的功能说明、依赖和卸载命令。安装后重启桌面版（或 `dsh web`）即可加载。

## 开发与验证

每个插件保留可安装源码；`dsh-w-computer-use` 还包含不执行点击的控制器 smoke test：

```powershell
cd .\dsh-w-computer-use
node .\test\controller-smoke.mjs
```

发布前应至少执行：

```powershell
node --check .\index.js
pnpm pack --config.ignore-scripts=true
```

## 仓库范围

本仓库只包含 `dsh-w-*` W 系列插件，不包含第三方 `dsh-deep-whale` 插件，也不包含本机 profile、API Key、运行时状态或桌面版构建目录。