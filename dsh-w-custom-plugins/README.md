# dsh-w-custom-plugins

DeepSeek Harness 插件管理器：在「设置 → 插件」页新增「自定义插件」标签页，管理你自己挂载的插件。

## 功能

- 列出所有非 `@deepseek-ai/*` 的已安装包插件，并隐藏 preset 内部的相对路径实现模块；
- 自动读取 GitHub 仓库 `wzxaaaa/dsh-w-plugin-ecosystem` 的所有 W 系列插件：未安装时显示小下载图标，点击后下载并安装；已安装时保留更新、设置和启停布局；
- 新版官方 Desktop/Web 通过共用 `pluginManager.installBundle()` 服务安装，等同官方「添加插件」入口的安装流程；旧源码版保留 CLI 安装方式；
- 目录和安装包从 GitHub 的仓库压缩快照读取，不使用 GitHub REST API，也不需要令牌；目录缓存十分钟，支持手动刷新，安装时复用已下载的快照；
- 断网时保留已安装插件和缓存；首次使用且没有缓存时，显示随插件提供的目录并提示连接失败。未发布对应版本 `.tgz` 的插件会显示禁用的下载图标；
- 快照在内存中读取，限制下载和解压大小，校验固定提交及安装包 Git blob 摘要，再执行原有的插件压缩包安全校验；
- 已安装的插件保留启/停开关，**切换即时生效**；管理器自身的停用开关受保护；
- 已安装的插件卡片提供“检查并更新”图标：W 系列插件从 `wzxaaaa/dsh-w-plugin-ecosystem` 获取最新版，其他包尝试 npm `latest`；下载后复用安全校验与官方安装流程，按实际结果提示生效、重启或加载警告；
- **拖拽安装**：把 `.tgz` / `.tar.gz` / `.zip` 插件压缩包拖进标签页（或点选），自动校验并调用 Harness 安装服务（旧版使用 `dsh plugin add`）；
- 解压前校验包内**恰好一个**带合法 `dsh.bundle.patch` 的插件，拒绝路径穿越、链接、Windows 非法路径及超限压缩包；
- 上传失败或离开页面时自动取消并清理临时文件，过期会话也会后台回收。

> ⚠️ 插件拥有本机代码执行权限，请只安装可信来源的压缩包。

## 安装

```powershell
pnpm pack
dsh plugin --profile web add ./dsh-w-custom-plugins-0.5.1.tgz
```

安装后重启桌面版（或 `dsh web`）即随 `web` profile 自启。

官方桌面版使用 `desktop` profile，安装时将上面的 `--profile web` 改为 `--profile desktop`。

官方桌面版也可直接在「添加插件」中填写本插件的 `.tgz` 绝对路径完成首次安装或升级。安装后打开「设置 → 内置插件 → 自定义插件」，再点击仓库插件卡片的下载图标安装其余插件。是否需要重启、是否出现加载警告以官方服务的实际结果为准。目录中出现插件只代表仓库已发布，不代表该插件已经适配当前 Harness；已验证的八个插件见仓库根目录的官方版兼容说明。

`0.4.2` 修复新版官方 Harness 的 `strict codec has no create() factory` 加载错误，同时保留旧版源码运行时需要的 `schema.parse()` 接口。

`0.5.1` 修复首次读取仓库时因 GitHub API 额度耗尽而只显示管理器的问题；刷新目录和下载插件均改用 `codeload.github.com`，并内置仓库目录作为无缓存时的兜底。随包目录记录的是发布时的仓库状态，连接恢复后可刷新获取新增插件。

升级管理器自身后请重启 Harness：官方服务可能已更新页面，但当前 Host 中的管理器实例仍保留升级前的后台代码。通过管理器升级自身时会提示需要重启。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-custom-plugins
```
