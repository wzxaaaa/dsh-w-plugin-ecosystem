# dsh-w-archive-manager

DeepSeek Harness 已归档对话管理插件。插件不修改 Harness 源码，而是在设置左侧新增“已归档”页面，提供恢复、永久删除、一键清理和真实的 30 天自动清理机制。

## 功能

- 在“设置”左侧底部新增“已归档”；
- 显示归档会话的真实标题、最近更新时间和剩余保留天数；
- 单条恢复到原 Workspace/未分组位置；
- 单条永久删除；
- 一键清理全部已归档会话；
- 会话归档满 30 天后自动永久删除；
- 正在运行或仍挂载的会话不会被强删，而是进入待删除状态，释放后自动完成；
- 永久删除会同步清理会话日志、Workspace 记账和会话投影缓存；
- 支持当前默认 JSONL 持久化后端，并对源码内 SQLite 后端做受保护适配；
- 源码内部接口发生不兼容变化时拒绝删除并保留数据。

## 数据与兼容性

官方归档集合目前只保存 Session ID，不保存归档时间，也没有公开的恢复或会话删除 API。本插件在当前 profile 目录保存 `.dsh-w-archive-manager.json`，只记录归档时间、待删除请求和安全收尾标记；会话正文仍由 Harness 官方持久化层管理。

恢复沿用官方归档集合，不改变 Workspace 中原有的 Session 排序。删除前会检查会话是否仍在 `sessions`/`agents` 中挂载，避免中断 Agent 或与持久化写入链竞争。

## 安装

```powershell
npm test
npm pack --ignore-scripts
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-archive-manager-0.1.2.tgz
```

覆盖安装后重启 DeepSeek Harness Desktop。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-archive-manager
```

卸载不会恢复已经永久删除的会话，也不会自动删除插件的归档时间元数据文件。
