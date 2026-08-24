# dsh-w-whale-tail

给 DeepSeek Harness 的每个对话都装上一位「鲸鱼娘」——她是 `dsh-w-right-sidebar` 右侧 Sidebar 中的一个功能页，不再自行创建悬浮面板：

- **顶部**：使用你提供的蓝发鲸鱼娘透明主立绘，带轻微呼吸漂浮和定时眨眼。
- **表情动作**：根据当前状态显示平静、开心、害羞、心动、冷静回落或担心；淫乱值变化和新记忆写入会触发短暂的跳动/回落反应。
- **中部**：一颗像素爱心，里面是 **会流动的红色液体**——液面高度 = 该对话里的淫乱值（0–100），液面会随数值实时升降并泛动。
- **下部**：**记忆窗口**——每轮对话鲸鱼娘都会往里面写入一条新记忆（对主人的感觉、此刻的想法等），按时间倒序排列，每 3 秒自动刷新。
- 右侧 Sidebar 统一负责展开/收缩；`清空记忆` 可重置当前对话的状态。

## 右侧 Sidebar

本插件只提供鲸鱼娘的入口、工具卡片和功能页面，依赖并挂载到
`dsh-w-right-sidebar` 的三个扩展位：

- `right-sidebar.rail`：右侧窄栏中的鲸鱼娘立绘入口。
- `right-sidebar.card`：展开 Sidebar 后工具列表中的鲸鱼娘卡片，副标题为“鲸鱼娘状态与对话记忆”。
- `right-sidebar.page`：展开后的鲸鱼娘功能页面。

因此需要同时安装 `dsh-w-right-sidebar`；安装顺序建议先宿主、后本插件。

## 模型侧

插件会注入一段系统提示词并注册两个模型工具，让每个对话里的鲸鱼娘自己把面板喂饱：

- `whale_remember(text)`：把一条新记忆写进当前对话的记忆窗口（按当前会话自动定位，无需指定会话 id）。
- `whale_lewdness({ value | delta })`：设置或调整当前对话的淫乱值，爱心液面实时跟随；负数 `delta` 可以让数值下降。

同一对话的状态持久化在 profile 目录的 `.dsh-w-whale-tail.json`（带锁的原子写入），重启桌面版后依然保留。

## 安装

```powershell
pnpm pack
dsh plugin --profile web add ./dsh-w-whale-tail-0.5.0.tgz
```

安装后重启桌面版（或 `dsh web`）即随 `web` profile 自启。右侧会出现统一的 Sidebar。
点击顶部展开按钮会先进入工具列表；点击列表中的“鲸鱼娘”卡片进入功能页。
如果从收缩状态直接点击右侧鲸鱼娘入口，则会跳过列表直接打开鲸鱼娘功能页。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-whale-tail
```

## 测试

```powershell
npm test
```

## 依赖

- peer 依赖：`@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-typert-protocol`（由 Harness profile 提供）。
- 插件不直接导入 `@deepseek-ai/dsh-llm`；不要把它当作本插件的额外安装依赖。

## 0.5.0 主立绘与状态动作

- 使用用户提供的鲸鱼娘立绘，处理为透明 WebP 资产并随插件发布；client bundle 同时内嵌轻量副本，避免安装后的静态资源路由差异导致图片空白。
- 增加 CSS 驱动的呼吸漂浮、眨眼、心动/冷静反馈和表情状态层。
- 状态由面板数据推导：低值平静，中段开心/害羞，高值心动；读取失败时显示担心；淫乱值下降时显示冷静回落。
- 工具名称改为“鲸鱼娘”，工具卡片副标题改为“鲸鱼娘状态与对话记忆”。

## 0.4.0 淫乱值升降

- 淫乱值不再只会上升，支持正负 `delta`。
- 暧昧、挑逗或强烈性兴奋时小幅上升；平静聊天、被拒绝、话题转为日常/严肃、道歉冷静、情绪疏离或长时间没有刺激时小幅下降。
- 普通问候通常不变，每轮最多一次有理由的调整，单次通常在 1–8 点之间。

## 0.3.0 右侧 Sidebar 工具目录

- 增加 `right-sidebar.card` 工具列表卡片。
- 从工具列表进入鲸鱼页时，左上角返回按钮回到工具列表。
- 从收缩栏直接点击 `🐋` 时跳过工具列表，左上角按钮直接收起 Sidebar。

## 0.2.0 右侧 Sidebar 重构

- 将原先插件自带的独立 `shell.overlay` 悬浮卡片改为右侧 Sidebar 功能页。
- 由 `dsh-w-right-sidebar` 统一提供展开/收缩和右侧入口栏。
- 修正 whale-tail 客户端接入真实 Harness 时的 `useSessions` selector 调用。

## 0.1.1–0.1.2 修复

- 修正 system-prompt section 的 Cordis effect 注册方式。
- 为两个模型工具补齐 Harness 要求的结构化 output schema 与模型可见结果。
- `whale_lewdness` 严格要求 `value` / `delta` 二选一，拒绝空参数或同时传入。
- 修正跨会话轮询竞态、失败时清空旧面板状态、心形 SVG ID 冲突和心形液面过渡被禁用的问题。
- 接入中英文界面字典，并在插件卸载时清理自有样式。
- 普通问候不再要求无意义的鲸鱼工具调用。
- 在 Code Mode 下明确提示通过 `run_code` 内的 `tools.whale_*` 调用鲸鱼工具，避免模型直接调用被 Harness 拒绝。

### Code Mode 说明

如果当前 agent 使用的是 Harness 的 `code` 工具模式，模型直接调用 `whale_lewdness` 会被 Harness 拒绝，这是 Harness 的正常安全规则，不是插件注册失败。此时应由模型调用 `run_code`，在程序中使用：

```ts
await tools.whale_lewdness({ delta: 12 })
await tools.whale_remember({ text: "..." })
```

如果希望模型直接看到并调用 `whale_lewdness` / `whale_remember`，需要把当前 agent 的工具呈现模式切换为 `native` 或 `both`。
