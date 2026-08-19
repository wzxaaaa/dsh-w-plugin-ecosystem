# dsh-w-assistant-refresh

在每条已完成的 AI 回复操作栏中增加刷新按钮。刷新按钮位于分支图标之后、时间与 token 统计之前。

## 行为

点击刷新后，插件会在当前会话内：

1. 定位该 AI 回复对应的原用户消息。
2. 使用 Harness 的 session surface replacement，让原回复以及它之后的可见历史退出当前模型上下文。
3. 在同一个 Agent、同一个 session 中重新放入原用户消息并重新执行。
4. 保持侧栏中的会话 ID 和会话分组不变，不创建子分支或新对话。

为了与模型上下文的改写保持一致，客户端会隐藏被替换范围内的旧回复行，以及用于唤醒同一个 Agent 的内部 regeneration context 行：刷新后旧回答从当前视图中消失，新回答在原位置重新生成，不会在下方多出一条重复请求。页面刷新或重新打开会话后，隐藏状态会通过宿主端的 `hiddenKeys` 从会话日志恢复。

## 限制

当前会话正在运行时按钮不可用。刷新较早的回复时，该回复之后的可见对话会一并被替换，这是在同一条会话内改写历史所必需的行为。底层 session log 仍保持 Harness 的追加式持久化设计，旧事件不会被直接篡改，但会退出 surface 和后续模型上下文。

## 安装

```powershell
node C:\Users\25024\.dsh\profiles\node_modules\@deepseek-ai\dsh\lib\bin.js plugin --profile web add .\dsh-w-assistant-refresh-0.2.2.tgz
```

安装后重启 Web profile 并刷新页面。

## 开发验证

```powershell
npm test
node --check .\index.js
node --check .\client.js
```
