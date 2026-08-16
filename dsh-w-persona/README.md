# dsh-w-persona

DeepSeek Harness 人设（人格）管理插件：在「设置」左侧 **Agent 预设** 下面新增一个「**人设**」页面。

## 功能

- **展示** Harness 默认的 system 提示词（只读，含 `{{model}}` 等变量模板）；
- **编辑** 当前生效的 system 提示词（textarea）；
- 输入框右上角的 **↺ 回旋箭头**：一键把输入框重置为默认提示词；
- **保存**：把自定义提示词写入 profile 的 `cordis.patch.yml`（覆盖 `system-prompt` 行的 `config.persona`），保存与默认一致时自动移除覆盖（干净回退）；
- **即时生效并强制置顶**：插件注册全局 `system-prompt/assemble` 监听器，在每次模型回合把组装好的 `deployment:persona` 改写为已保存的人设，并移动到普通 system prompt 的第一个 section，因此无需重启即可对新会话生效；
- **绝对第一段**：无论原 Persona 位于何处，都会先删除已有 Persona section，再在 `sections[0]` 插入唯一的自定义 Persona；因此它位于 Harness identity、route-primer persona 和工具规则之前；
- **外部修改自动检测**：每次装配或读取状态时检查 `cordis.patch.yml` 的文件签名，直接编辑该文件后无需重启即可刷新缓存；
- **刷新 Harness 默认提示词**：没有自定义覆盖时，可从当前 Harness `system-prompt` loader 重新捕获默认提示词；有覆盖时按钮会禁用，避免把覆盖内容误当成 Harness 默认值；
- **实际装配诊断**：设置页显示当前是否使用自定义覆盖，以及最近一次请求是否已把 Persona 放到 system prompt 最前面，或仍在使用默认值。

> [!NOTE]
> “第一段”指 Harness 普通 `system-prompt/assemble` 结果中发送给模型的第一段文本。Harness 的 `complete: true` 最终约束及模型服务商自身的上层策略不属于普通 section，插件不会通过删除工具协议来绕过它们。

## 安装

```powershell
pnpm pack
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-persona-0.4.0.tgz
```

重启桌面版（或 `dsh web`）后，设置 → 左侧「人设」即可使用。

## 开发与测试

```powershell
npm test
node --check .\index.js
node --check .\client.js
```

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-persona
```

> 卸载不会删除已保存的人设覆盖（它写在 profile 的 `cordis.patch.yml` 里）；如想恢复默认，在保存框里点 ↺ 后再保存，或手动删掉 patch 里的 `system-prompt` 行。
