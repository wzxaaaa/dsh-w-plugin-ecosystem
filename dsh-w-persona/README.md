# dsh-w-persona

## 0.4.0 人设注入更新

- **同步切换**：正文、角色名、用户称呼、行为约束和两轮示例使用同一份配置。默认“当前及新对话”在下一次模型请求同步更新；“仅新对话”保留本次运行中已有会话捕获的完整配置。正在生成的请求不受影响。会话快照仅保存在内存，重启后按当前配置重新捕获。
- **完整提示词模式**：普通模式继续使用官方 `system-prompt/assemble`；官方 `complete` 模式恢复固定提示词后，在 `llm/stream` 请求副本上补入人设与行为约束，不修改官方源码或 profile patch。已识别的固定人设会被替换；无法识别的 System 保留原文并追加人设。
- **消息排序**：隐藏示例插在开头的 System/developer 消息之后，保留后续 System 更新、历史及工具消息的顺序。每次请求重新生成示例，压缩后也能继续使用，不写入聊天记录。
- **变量与普通文本**：变量模板支持 `{{char}}`、`{{user}}`、`{{model}}`、`{{provider}}`、`{{cwd}}`。角色名与用户称呼会作为独立信息注入；正文、行为约束与启用的示例均支持变量。保存前检查未知变量和缺失的姓名；普通文本原样保留双花括号。旧模板自动补齐空字段，不覆盖旧数据。
- **行为约束**：单独填写简短的称呼、语气及回答习惯，追加到 System 末尾，保留官方工具引导。
- **注入状态**：显示最近一次准备发送的请求所用模型、会话、人设版本、注入方式及示例条数；保存只显示等待验证，点击“刷新状态”查看。已有会话沿用旧配置时会提示。此状态不是服务器接收回执，也不保证模型遵循。
- **统一帮助**：新增表单项右侧均提供圆圈感叹号，鼠标悬停或键盘聚焦可阅读说明与示例。

示例：角色名填“小鲸”，用户称呼填“阿林”，正文填写“你是 {{char}}，擅长耐心解释问题”，行为约束填写“使用中文，称呼用户为 {{user}}；技术解释保持准确”。保存后发送一条消息，再刷新注入状态。

验证：插件单元与主机事件集成测试、官方 `dsh-system-prompt@0.2.1-rc.5` 组件的组装/严格渲染/完整提示词回退验证，以及桌面和窄屏表单交互验证。组件验证使用本机已有 Cordis/scope 运行时，不等同于整套最新版 Harness 或真实模型端到端验证。

## 官方 Harness 兼容

`0.3.7` 起适配官方 Windows Harness `0.2.0-rc.2`，并自动迁移旧 Web 人设。`0.4.0` 的新增兼容验证范围见上文。

安装后，官方 `desktop` profile 首次读取人设时，会从同一 Harness home 的旧 `web` profile 自动导入缺失的当前人设、对话预设和模板库。无需手工复制文件，你的朋友更新插件后也会执行相同迁移。已有的 desktop 数据和官方默认提示词不会被覆盖；旧 Web 文件保持原样，导入文件另存一份到 `<desktop>/.dsh-w-persona-backups/`。迁移只执行一次，之后删除的模板不会重新导入。文件损坏会报告错误，不会先导入一半数据；修复旧文件后重新打开人设页面即可重试。

自动迁移要求两个 profile 位于同一 Harness home；更换电脑时，需要先把旧 `web` profile 的人设文件保留在新电脑的对应目录。

官方桌面版使用独立的 `desktop` profile，旧 `web` profile 的插件不会自动迁入。可在官方「添加插件」填写本包 `.tgz` 的绝对路径，或通过 W 管理器拖入本包；安装后重启 Harness。以下 `--profile web` 命令用于旧版 Web 环境。

DeepSeek Harness 人设（人格）管理插件：在「设置」左侧 **Agent预设** 下面新增一个「**人设**」页面。

## 功能

- **展示** Harness 默认的 system 提示词（只读，含 `{{model}}` 等变量模板）；
- **编辑** 当前生效的 system 提示词（textarea）；
- 输入框右上角的 **↺ 回旋箭头**：一键把输入框重置为默认提示词；
- **保存**：把自定义提示词写入 profile 下的 `.dsh-w-persona-override.json`，保存与默认一致时清除覆盖（干净回退）。插件**不再写** `cordis.patch.yml`；旧版本留在 patch 里的 `system-prompt` 覆盖仍会被读取，但不会被改写；
- **即时生效**：插件注册了一个全局 `system-prompt/assemble` 监听器，在每次模型回合把组装好的 `deployment:persona-prefix` 段改写为已保存的人设，因此**无需重启**，当前会话的下一次模型请求也会使用新 Persona（同时兼容旧版 Harness 的 `deployment:persona` 段名）。
- **DeepSeek 对话预设**：在人设提示词下方打开开关后，可配置两轮空白的 `用户输入 / AI 输出`。启用且四项都填写后，插件会在模型请求中前置四条真实的 `user / assistant / user / assistant` 消息；它们只存在于请求上下文，不写入会话记录，也不会显示为聊天行。虽然名称保留为「DeepSeek 对话预设」，实际会对所有模型生效；如果其他模型不兼容，请关闭开关。
- **人设模板库**：把当前 System 提示词与完整对话预设保存成一个具名模板。可保存为新模板、覆盖/改名、删除，并一键应用；不再需要用外部 TXT 手工复制粘贴。

模板和当前设置都属于当前 profile，全工作区共享。`0.4.0` 起正文与隐藏示例一起遵循所选“生效范围”。

模板库默认保存在：

```text
<profile>/.dsh-w-persona-templates.json
```

## 安装

```powershell
pnpm pack
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-persona-0.4.0.tgz
```

重启桌面版（或 `dsh web`）后，设置 → 左侧「人设」即可使用。

`0.3.5` 修复保存/应用人设后，当前工作区「新建对话」输入框被禁用、只能重启恢复的问题。原因：旧版把人设写进 `cordis.patch.yml`，Harness 会热重载该文件；`system-prompt` 配置变化会重载 systemPrompt 服务，依赖它的 agent-loop 随之重启并销毁所有正在打开的会话。客户端把被销毁的会话永久标记为 removed，而该工作区的「新建对话」复用的正是那个空白会话，所以一直是禁用状态（其他工作区、旧对话不受影响）。现在人设只存插件自己的状态文件，由 `system-prompt/assemble` 监听器生效，不会再触发热重载。

`0.3.4` 修复删除人设模板后面板和对话输入框“卡死”的问题：删除改为在面板内二次确认（按钮变红，再点一次才删除），不再弹出系统确认框。Electron 在 Windows 上关闭系统确认框后会丢失键盘焦点，导致模板列表和聊天输入框都无法操作，只能切换窗口才能恢复。另外所有保存/应用/删除操作加了 30 秒超时，请求意外无响应时会报错并解锁面板。

`0.3.3` 适配新版 Harness 的 `personaPrefix` 配置与 `deployment:persona-prefix` 组装段，同时保留旧版段名和旧配置的读取兼容。

`0.3.1` 已迁移到 Harness `0.1.2-alpha.4` 的 `@deepseek-ai/dsh-util-values`，修复旧版
`@deepseek-ai/dsh-llm` 不再导出 `deepFreeze` 导致的启动失败。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-persona
```

> 卸载后插件的 `assemble` 监听器不再生效，`.dsh-w-persona-override.json` 里的覆盖自然失效。若 profile 的 `cordis.patch.yml` 里还有旧版本留下的 `system-prompt` 行，卸载后它仍会生效，需要手动删除。
