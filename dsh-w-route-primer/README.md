# dsh-w-route-primer

为 DeepSeek Harness 增加“路由预热模式”。感谢风神开源 `dsh-routing-suite`，也感谢社区持续贡献的开源成果；`0.3.0` 的路由行为基于该套件当前锁定的 `dsh-router-standard v0.2.0`，并针对本地插件生态做了一项核心适配：每次受控请求都按顺序发送 RL 路由锚点和 `dsh-w-persona` 的实时自定义人设。

## 请求形状

首次持久化 `tool/call` 之前：

1. 保留 Plan 模式 section（若存在）；
2. 第一段 persona：`You are a helpful software engineer assistant.`；
3. 第二段 persona：保留 `deployment:persona`，由 `dsh-w-persona` 实时改写；
4. 清空动态 `contexts`；
5. 工具只开放当前平台 shell（`pwsh`/`bash`）与 `str_replace_editor`。

首次持久化 `tool/call` 之后：

- 恢复本 preset 的完整工具目录；
- 继续保持“RL 锚点 → w-persona”双 persona；
- 继续清空动态 `contexts`，与上游 `router-standard` 的会话轨迹保持一致。

## 与 routing-suite 对齐的能力

- 按首条真实用户消息分类为 `spec`、`weak`、`mixed` 或 `react`；
- 中英文 build/fix 关键词分类，无法确定时进入 weak 内路由；
- weak 会话在每条真实用户消息后注入固定近场引导；
- 简单任务使用快速收敛引导，复杂任务使用架构/边界/集成点深度引导；
- `dev_router_status`：查看当前模式、行为带、persona、核心工具和 override；
- `dev_router_mode`：手动设置 `spec/weak/mixed/react/auto` 或数值模式；
- `dev_mode_subagent`：用独立 LLM 请求运行另一种 reasoning mode；若 `dsh-w-persona` 可用，也会作为第二段 system prompt；
- 首条消息在首次 assembly 之前到达时仍能正确分类；
- 阶段和自动分类从持久化 session events 恢复；
- 会话销毁时释放内存中的 agent、首条消息和 override 状态。

## 与完整套件的边界

本插件对齐的是套件实际安装链中的 `router-standard` 路由功能，不复制 `dsh-super-injector` 的插件开发/热重载管理能力。套件仓库中的独立 `mode-boost` 当前不在其一键安装脚本中，而且在检测到 `dev_router_status` 时会主动 no-op，因此不重复合并。

## 安全边界

- 只在选择“路由预热模式”的 agent preset 内挂载路由器和 `dev_router_*` 工具；
- 标准、PTC、极简、创造模式不注册这些路由工具，也不接受近场引导；
- 不修改 Harness 源码；
- 启动时复制当前安装的 Standard preset，并额外挂载 editor 与路由模块；
- 受管 preset 和路由模块均带标记，拒绝覆盖同名的非受管文件。

## 安装

```powershell
npm test
pnpm pack --config.ignore-scripts=true
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-route-primer-0.3.0.tgz
```

覆盖安装后重启 DeepSeek Harness Desktop，新建会话并选择“路由预热模式”。

## 来源

路由分类、行为带、近场引导和模式工具改编自 `dsh-router-standard`，具体提交与许可见 `NOTICE`。
