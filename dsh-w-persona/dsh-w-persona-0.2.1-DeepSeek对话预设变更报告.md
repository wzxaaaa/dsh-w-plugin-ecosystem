# dsh-w-persona 0.2.1 功能变更报告

日期：2026-08-20

## 新增：DeepSeek 对话预设

- 设置 → 人设页面新增「DeepSeek 对话预设」开关。
- 开启后显示四个可配置字段：用户输入 1、AI 输出 1、用户输入 2、AI 输出 2。
- 四项完整填写后，模型请求前置真实的 `user / assistant / user / assistant` 四条消息。
- 按用户最终要求，不做模型识别，所有模型都会注入；其他模型不兼容时关闭开关即可。
- 预设只存在于模型请求副本，不写入持久会话日志，不显示为聊天消息。
- 每个会话首次请求时捕获当时的预设，后续请求继续携带同一组前置上下文；新会话使用最新配置。

## 保留的旧行为

- Persona 仍然覆盖每次组装后的 `deployment:persona`。
- Persona 保存与恢复默认提示词的行为保持 0.2.0 语义。

## 验证

- `node --check index.js`
- `node --check client.js`
- `node --test test/*.test.mjs`：4 项通过
- `pnpm pack --config.ignore-scripts=true`：生成 `dsh-w-persona-0.2.1.tgz`
- 当前 web Profile 已安装并能从运行时加载插件入口。

## 备注

本次没有推送 GitHub；仓库工作树保留改动，等待后续明确的提交/推送指令。
