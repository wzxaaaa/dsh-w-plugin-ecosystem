# dsh-w-persona

DeepSeek Harness 人设（人格）管理插件：在「设置」左侧 **Agent预设** 下面新增一个「**人设**」页面。

## 功能

- **展示** Harness 默认的 system 提示词（只读，含 `{{model}}` 等变量模板）；
- **编辑** 当前生效的 system 提示词（textarea）；
- 输入框右上角的 **↺ 回旋箭头**：一键把输入框重置为默认提示词；
- **保存**：把自定义提示词写入 profile 的 `cordis.patch.yml`（覆盖 `system-prompt` 行的 `config.persona`），保存与默认一致时自动移除覆盖（干净回退）；
- **即时生效**：插件注册了一个全局 `system-prompt/assemble` 监听器，在每次模型回合把组装好的 `deployment:persona` 段改写为已保存的人设，因此**无需重启**即可对新会话生效（这会覆盖各 Agent 预设自带的 persona，否则预设 persona 会遮蔽全局设置）。

## 安装

```powershell
pnpm pack
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-persona-0.2.0.tgz
```

重启桌面版（或 `dsh web`）后，设置 → 左侧「人设」即可使用。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-persona
```

> 卸载不会删除已保存的人设覆盖（它写在 profile 的 `cordis.patch.yml` 里）；如想恢复默认，在保存框里点 ↺ 后再保存，或手动删掉 patch 里的 `system-prompt` 行。
