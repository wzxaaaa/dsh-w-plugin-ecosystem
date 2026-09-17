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
- 同时兼容旧版 `SessionHeader[]` 和新版 `SessionPersistenceSnapshot[]` 会话列表；
- 插件升级时自动迁移 v1 状态，重新挂回被旧版兼容故障误清的归档标记，并续跑待删除记录；
- 新版 JSONL 删除会清理完整的会话目录（包含多代日志和锁文件），不是只删当前代文件；
- 支持当前默认 JSONL 持久化后端，并对旧版 SQLite 后端保留受保护适配；
- 源码内部接口发生不兼容变化时拒绝删除并保留数据。

## 数据与兼容性

官方归档集合目前只保存 Session ID，不保存归档时间，也没有公开的恢复或会话删除 API。本插件在当前 profile 目录保存 `.dsh-w-archive-manager.json`，只记录归档时间、待删除请求和安全收尾标记；会话正文仍由 Harness 官方持久化层管理。v2 状态会把删除过程分为“已请求”和“已清理日志、待收尾”两个可重试阶段，进程中断后由下一次启动或定时维护继续执行。

恢复沿用官方归档集合，不改变 Workspace 中原有的 Session 排序。删除前会同时检查旧版 coordinator 与新版 tracker，避免中断 Agent 或与持久化写入链竞争。插件不会因为一次列表缺失就擅自移除官方归档 ID；遇到未知持久化结构或不安全路径会保留队列并报错，等待兼容升级。

如果旧版已经同时清空了官方 `archivedSessionIds` 和插件 sidecar 中的 `entries/tombstones`，本地就不再有足够证据区分“曾经归档失败的对话”和普通对话。v0.2.0 会自动修复仍有任一侧证据的记录，但不会凭标题、日期或文件位置猜测后删除普通对话。

## 安装

```powershell
npm test
npm pack --ignore-scripts
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-archive-manager-0.2.0.tgz
```

覆盖安装后重启 DeepSeek Harness Desktop。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-archive-manager
```

卸载不会恢复已经永久删除的会话，也不会自动删除插件的归档时间元数据文件。
