# Harness SDK 会话续接支持

工作室的 Harness/兼容模型员工通过独立的 `dsh --profile sdk` 进程执行任务。要让同项目员工跨任务保留原生上下文，SDK server 需要在首次接收已有会话 ID 时恢复持久会话。

本地实现增加 `resumePersistedSessions` 选项，默认 `false`；工作室的员工 SDK profile 明确启用它。创建遇到已有会话时，核对记录中的工作目录，再调用已有 `ctx.agents.resume()`，保留本次指定的模型与思考等级。默认 SDK 行为不变。

`harness-sdk-session-resume.patch` 只包含这项 SDK 支持及其测试、依赖和文档修改；对应本地 Harness `0.1.5-rc.2` 源码。补丁使用零上下文格式，先在自己的 Harness checkout 中执行 `git apply --check --unidiff-zero <补丁绝对路径>`，确认适用后用 `git apply --unidiff-zero <补丁绝对路径>` 应用并构建。已有本地工作室开发环境已经包含这些改动，无需重复应用。

建议验证：

```powershell
pnpm exec vitest run packages/sdk/server/tests/server.spec.ts packages/sdk/server/tests/plugin-apply.spec.ts
```

随后构建 SDK server，并通过员工的两次实际任务核对同一会话 ID。此补丁不属于插件安装事务；未打补丁的运行时会拒绝续接（`session … already exists`）；工作室 0.4.2 起会在同一次执行中改用新会话和完整任务指令重跑，并在本次 Host 运行期间不再为该引擎尝试续接。Codex、Claude Code 自己的 CLI 会话续接不需要此补丁。
