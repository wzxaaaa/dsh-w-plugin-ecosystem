# 官方 Harness 兼容说明

验证环境：Windows 官方 DeepSeek Harness **0.2.0-rc.2**（2026-09-30），使用独立临时 profile，通过官方插件安装服务安装以下包。

| 插件 | 适配版本 | 安装包 |
| --- | --- | --- |
| assistant-refresh | 0.2.6 | [安装包](./dsh-w-assistant-refresh/dsh-w-assistant-refresh-0.2.6.tgz) |
| camera-watch | 0.2.4 | [安装包](./dsh-w-camera-watch/dsh-w-camera-watch-0.2.4.tgz) |
| deslop | 0.1.1 | [安装包](./dsh-w-deslop/dsh-w-deslop-0.1.1.tgz) |
| knowledge-base | 0.5.2 | [安装包](./dsh-w-knowledge-base/dsh-w-knowledge-base-0.5.2.tgz) |
| noval-write | 0.14.2 | [安装包](./dsh-w-noval-write/dsh-w-noval-write-0.14.2.tgz) |
| persona | 0.3.7 | [安装包](./dsh-w-persona/dsh-w-persona-0.3.7.tgz) |
| right-sidebar | 0.8.3 | [安装包](./dsh-w-right-sidebar/dsh-w-right-sidebar-0.8.3.tgz) |
| wallpaper | 0.2.1 | [安装包](./dsh-w-wallpaper/dsh-w-wallpaper-0.2.1.tgz) |

## 安装

1. 官方桌面版使用 `desktop` profile。原 `web` profile 中安装的插件不会自动迁入。
2. 首次安装管理器时，在官方「添加插件」填写 [dsh-w-custom-plugins-0.5.1.tgz](./dsh-w-custom-plugins/dsh-w-custom-plugins-0.5.1.tgz) 的本机绝对路径，安装后重启。
3. 打开 **设置 → 内置插件 → 自定义插件**，先拖入 right-sidebar，再逐个拖入所需插件的 `.tgz`，等待安装完成。最后重启官方 Harness。
4. 也可通过管理器刷新仓库列表，再点击下载或更新图标获取上面的版本。

## 修复与验证

- 六个有远程调用的客户端补齐严格编解码器的 `create()` 工厂，并保留旧环境的 `schema.parse()`。
- 显式声明独立 UI slots、会话和工作区依赖，避免官方模块加载顺序使功能入口缺失。
- 重答、目标监督和小说工作台兼容官方主视图会话选择，不将后台会话当成当前会话。
- 刷新插件兼容官方图标导出及 V4 消息来源；实际重答、旧回复隐藏和页面重载恢复已验证。该版本官方回复操作栏没有重新生成按钮，刷新插件提供这一功能。
- 小说工作台在临时工作区实际创建、绑定小说，保存设定并重载恢复。
- 人设保存和重开设置、知识库创建/保存/读取/搜索、去 AI 味扫描、右侧工具页及壁纸配置经过实际界面验证。
- 人设隐藏对话预设的四条消息已在本地模型适配器中核对；壁纸图片与模糊程度也已验证页面重载后恢复。
- 摄像头使用浏览器测试视频流，经过真实 Host 桥接验证截图。未启用用户真实摄像头或麦克风；Windows 本地语音识别仍需本机设备和语音包。

2026-09-30 桌面窗口补充验证：

- right-sidebar `0.8.3` 遵守官方标题栏留白，顶部按钮可点击，设置窗口覆盖工具栏。
- persona `0.3.7` 在 desktop 首次读取时自动导入同一 Harness home 下旧 web 的缺失人设文件，保留原文件和备份；已有 desktop 数据、官方默认提示词和之后删除的模板均受保护。
- knowledge-base `0.5.2` 在等待 RPC 连接时先注册独立设置入口；面板请求等待连接完成，右侧栏为可选入口。官方桌面 profile 移除 right-sidebar 后，设置中的知识库面板仍能正常打开。
- camera-watch `0.2.4` 绕过桌面壳未开放的视频权限：用户主动打开本机浏览器授权页，画面经随机凭据保护的回环连接交给原截图工具。Windows 官方壳的视频请求实际返回 `NotAllowedError`；Edge 测试摄像头经过授权页、Host 和桌面设置完整返回 **1280×720 JPEG**，停止后关闭视频流。没有修改官方程序。

测试没有使用用户的模型密钥，重答采用仅位于临时 profile 的本地模型适配器。该测试适配器不包含在任何插件安装包中。

上一轮八个插件加管理器的单元测试共 **279 项通过**。本轮受影响的四个插件加管理器回归测试共 **150 项通过**；Host/Client 入口通过语法检查，`git diff --check` 通过。四个新版本经官方 CLI 在全新隔离 desktop profile 安装，并通过桌面窗口和浏览器桥接验证；逐个解包核对安装包内容与最终源码一致。

通过管理器刷新仓库目录即可下载发布版本；安装完成后完全退出并重启官方 Harness。人设插件会自动导入同一 Harness home 下旧 web profile 的缺失人设文件并备份，无需手工复制模板。
