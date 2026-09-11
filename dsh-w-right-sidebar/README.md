# dsh-w-right-sidebar

`dsh-w-right-sidebar` 是 W 系列插件共用的右侧 Sidebar 宿主（当前版本 `0.8.1`）：

- 点击顶部展开按钮时，先显示已挂载插件的工具卡片列表。
- 点击工具卡片后进入对应功能页面，左上角返回按钮回到工具列表。
- 工具列表标题为“工具栏”；进入具体工具后，标题切换为该工具的名称。
- 从收缩状态直接点击某个插件入口时，跳过工具列表直接进入该工具页面。
- 收缩时保留一条右侧竖栏。
- 竖栏中的每个图标/入口由其他 W 插件注册；入口点击代表“直达工具页面”。
- 当前 `dsh-w-whale-tail` 会作为第一个功能页挂载到这里。
- 展开状态下，功能页面位于左侧，入口竖栏固定在最右侧；收缩后只保留最右侧竖栏。
- 右侧栏展开或收缩时会同步预留/释放布局宽度，中间对话区域随之被挤压，不会被右侧页面遮挡。

这个插件本身不提供业务功能，也不替换 Harness 左侧导航栏或官方工具详情逻辑。

## Better Sidebar 兼容

安装第三方 `dsh-better-sidebar` 后，本插件会自动检测其公开的
`ctx.betterSidebar` 服务，并把一个 **Better Sidebar** 入口挂载到自己的工具卡片列表和
收缩栏。点击入口时，本侧栏自动收起，并把控制权交给 Better Sidebar；切回任意 W
系列工具时，Better Sidebar 会自动收起，避免两个面板重叠。

兼容层会根据能力特征自动选择协议：

- `dsh-better-sidebar >= 0.19.0`：其右侧页面已经迁移到 DSH 0.1.5 原生右栏。本插件入口
  通过公开服务打开默认页面，并通过 DSH 原生 `sidebarRight` 控制器完成面板交接；不会再
  修改 Better Sidebar 的底部工作台几何或寻找已经删除的旧按钮。
- `dsh-better-sidebar <= 0.18.x`：继续使用其公开服务和旧版稳定 DOM 锚点控制自绘右面板；
  原生的“底部面板”和“右侧面板”悬浮按钮仅在交接给 Better Sidebar 时显示。

兼容层不会修改或复制第三方插件源码。身份识别使用公开服务的能力特征；面板交接仅使用
新版身份识别使用服务能力 `fileIcons`、`data-dsh-panel-host` 和
`data-dsh-bottom-panel`；旧版使用 `data-dsh-panel` 和 `data-dsh-toggle-cluster`。
未安装、接口不完整或插件暂未挂载时，不显示入口且不影响原侧栏。

Better Sidebar 自身的标签页和布局仍按对话保存；兼容层不会把它改造成工作区级数据。
功能插件通过以下三个 slot 提供自己的入口、工具卡片和页面：

- `right-sidebar.rail`：收缩栏中的直达入口。
- `right-sidebar.card`：展开后的工具列表卡片。
- `right-sidebar.page`：工具页面。

## 安装

```powershell
pnpm pack
dsh plugin --profile web add ./dsh-w-right-sidebar-0.8.1.tgz
```

建议先安装本插件，再安装依赖它的右侧功能插件。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-right-sidebar
```
