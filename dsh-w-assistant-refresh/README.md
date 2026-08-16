# dsh-w-assistant-refresh

在每条已完成的 AI 回复操作栏中增加一个刷新按钮。按钮使用 Harness 的 `conversation.chat.assistant-actions` 官方插槽，默认排在现有分支/分享图标之后。

## 行为

点击刷新后，插件会：

1. 定位当前 assistant 回复对应的原用户消息。
2. 从该回复所属轮次之前创建一个新会话分支。
3. 重放原用户消息的文字和图片。
4. 打开新分支并显示新的模型回复。

这不会修改 Harness 源码，也不会把原问题再次追加到包含旧回复的同一轮。原会话仍保留在会话列表中，便于比较不同回答。

## 限制

按钮只出现在已定稿的 assistant 回复上。当前会话正在运行时按钮会暂时不可用。由于 Harness 当前公开 API 没有原地 `regenerate(messageId)`，插件通过官方 `session.fork` + `session.prompt` 实现刷新语义；多步骤工具调用会从该轮之前的分支边界重新开始，而不是复制旧工具执行结果。

首轮回复没有可供 `session.fork` 使用的历史前缀，插件会创建同一工作区和人设的空白会话后重放原问题。

## 安装

使用 `dsh-w-custom-plugins` 拖入：

```powershell
dsh plugin --profile web add .\dsh-w-assistant-refresh\dsh-w-assistant-refresh-0.1.0.tgz
```

安装后重启 Web profile。

## 开发验证

```powershell
npm test
node --check .\index.js
node --check .\client.js
```
