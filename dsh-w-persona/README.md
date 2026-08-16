# dsh-w-persona

DeepSeek Harness 人设（人格）管理插件：在「设置」左侧 **Agent 预设** 下面新增一个「**人设**」页面。

## 功能

- **展示** Harness 默认的 system 提示词（只读，含 `{{model}}` 等变量模板）；
- **编辑** 当前生效的 system 提示词（textarea）；
- 输入框右上角的 **↺ 回旋箭头**：一键把输入框重置为默认提示词；
- **保存**：把自定义提示词写入 profile 的 `cordis.patch.yml`（覆盖 `system-prompt` 行的 `config.persona`），保存与默认一致时自动移除覆盖（干净回退）；
- **即时生效并截断后续提示词**：插件注册全局 `system-prompt/assemble` 监听器，在每次模型回合把组装好的 `deployment:persona` 改写为已保存的人设，保留它前面的 sections，并删除它后面的普通 prompt sections；
- **保留前置、删除后续**：如果当前顺序是 `router-persona → deployment:persona → tools:guidance`，启用自定义覆盖后会保留 `router-persona → deployment:persona`，删除 Persona 后面的 `tools:guidance` 及其他普通 prompt sections；工具 schemas、runtime contexts 和 variables 仍保留在 assembly 元数据中；
- **外部修改自动检测**：每次装配或读取状态时检查 `cordis.patch.yml` 的文件签名，直接编辑该文件后无需重启即可刷新缓存；
- **刷新 Harness 默认提示词**：没有自定义覆盖时，可从当前 Harness `system-prompt` loader 重新捕获默认提示词；有覆盖时按钮会禁用，避免把覆盖内容误当成 Harness 默认值；
- **实际装配诊断**：设置页显示当前是否使用自定义覆盖，以及最近一次请求保留了哪些前置 prompt、删除了多少个后续 prompt sections。

> [!NOTE]
> 自定义覆盖处于启用状态时，插件只删除 `deployment:persona` 后面的普通 system prompt sections；它前面的 sections 会保留。这对应 route-primer standard 模式的“移除后续提示词”行为，但不会主动裁剪独立传输的工具 schemas。

## 安装

```powershell
pnpm pack
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-persona-0.6.0.tgz
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
