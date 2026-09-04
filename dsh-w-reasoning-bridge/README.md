# dsh-w-reasoning-bridge

让 DeepSeek Harness 的中转站、自建端点和未进入内置模型目录的平台接入 DSH 官方“推理等级”选择器。

插件不再提供单独的“推理兼容”设置页，也不仿制对话框菜单。它只在官方“设置 → 模型”的提供方卡片
内补充一次性能力配置，并通过 Harness 官方 `settings` Remote 写入
`llm-pi-ai.providers.<provider>` 下对应模型的 `reasoningEfforts` 和 `compat`。模型解析、菜单渲染、
会话选择与请求转换仍全部由 DSH 官方组件负责。

## 使用

1. 先在 Harness 的“设置 → 模型”配置中转提供方、地址、密钥和模型。
2. 在同一提供方卡片底部找到“推理等级”，点击“配置”。
3. 选择具体模型和最接近中转站文档的协议，点击“启用官方推理等级”。
4. 回到对话并点击输入框底部的模型名称。官方菜单会新增“推理等级”一行，可直接切换
   Off、Low、High 等该协议声明的等级。

设置实时生效，但已经写入会话日志的旧请求不会被改写。一个提供方包含能力不同的多个模型时，
需要逐个模型启用；日常强度直接在对话框的官方菜单里逐会话选择。

## 协议预设

- OpenAI：顶层 `reasoning_effort`
- DeepSeek：`thinking.type = enabled/disabled`
- OpenRouter：`reasoning.effort`
- Qwen：`enable_thinking`
- Z.ai / GLM：`thinking.type`
- Together：`reasoning.enabled`
- 字符串 thinking：`thinking = "..."`
- Anthropic 原生推理

预设只是安全起点，不会探测或猜测私有中转协议。中转站若改写字段，以上游文档和实际请求日志为准。

## 边界

- 当前只编辑 `dsh-llm-pi-ai` 管理的路由；其他 Adapter 的私有协议不应被跨层修改。
- “恢复平台默认”只移除本插件管理的能力字段，不会覆盖该模型的其他自定义配置。
- 插件能让 DSH 正确展示并发送等级字段，但不能改变一个完全忽略请求参数、始终强制思考的上游。
- `off` 是否需要显式值由上游决定：OpenAI 类端点通常使用 `none`，DeepSeek/Qwen 开关类协议通常留空。
