# dsh-w-persona

DeepSeek Harness 人设（人格）管理插件：在「设置」左侧 **Agent预设** 下面新增一个「**人设**」页面。

## 功能

- **展示** Harness 默认的 system 提示词（只读，含 `{{model}}` 等变量模板）；
- **编辑** 当前生效的 system 提示词（textarea）；
- 输入框右上角的 **↺ 回旋箭头**：一键把输入框重置为默认提示词；
- **保存**：把自定义提示词写入 profile 的 `cordis.patch.yml`（覆盖 `system-prompt` 行的 `config.persona`），保存与默认一致时自动移除覆盖（干净回退）；
- **即时生效**：插件注册了一个全局 `system-prompt/assemble` 监听器，在每次模型回合把组装好的 `deployment:persona` 段改写为已保存的人设，因此**无需重启**，当前会话的下一次模型请求也会使用新 Persona（这会覆盖各 Agent 预设自带的 persona，否则预设 persona 会遮蔽全局设置）。
- **DeepSeek 对话预设**：在人设提示词下方打开开关后，可配置两轮空白的 `用户输入 / AI 输出`。启用且四项都填写后，插件会在模型请求中前置四条真实的 `user / assistant / user / assistant` 消息；它们只存在于请求上下文，不写入会话记录，也不会显示为聊天行。虽然名称保留为「DeepSeek 对话预设」，实际会对所有模型生效；如果其他模型不兼容，请关闭开关。
- **人设模板库**：把当前 System 提示词与完整对话预设保存成一个具名模板。可保存为新模板、覆盖/改名、删除，并一键应用；不再需要用外部 TXT 手工复制粘贴。

模板和当前设置都属于当前 profile，全工作区共享。应用模板后 Persona 从下一次模型请求立即生效；隐藏对话预设继续遵循稳定会话语义，从新对话开始使用。

模板库默认保存在：

```text
<profile>/.dsh-w-persona-templates.json
```

## 安装

```powershell
pnpm pack
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-persona-0.3.1.tgz
```

重启桌面版（或 `dsh web`）后，设置 → 左侧「人设」即可使用。

`0.3.1` 已迁移到 Harness `0.1.2-alpha.4` 的 `@deepseek-ai/dsh-util-values`，修复旧版
`@deepseek-ai/dsh-llm` 不再导出 `deepFreeze` 导致的启动失败。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-persona
```

> 卸载不会删除已保存的人设覆盖（它写在 profile 的 `cordis.patch.yml` 里）；如想恢复默认，在保存框里点 ↺ 后再保存，或手动删掉 patch 里的 `system-prompt` 行。
