# dsh-w-chatflow

DeepSeek Harness 插件：用 CSS `content-visibility` 让聊天历史里屏外的消息行跳过布局与绘制，缓解打开长会话和滚动时的卡顿。

## 它做什么

Harness 的会话视图（`dsh-client-ui-conversation`）当前会一次性挂载全部已加载消息，没有列表虚拟化。本插件在每个消息行（带稳定 `data-chat-anchor-key` 属性的元素）上注入：

```css
[data-chat-anchor-key] {
  content-visibility: auto;
  contain-intrinsic-size: auto 260px;
}
```

- `content-visibility: auto`：屏外行的子树跳过布局/绘制；
- `contain-intrinsic-size: auto 260px`：给未渲染的行一个占位高度，保持滚动条稳定（`auto` 会在首次渲染后记住真实高度）。

## 配置

占位高度和开关都是可配置的（Schemastery）。在 profile 的 `cordis.patch.yml` 里按 `id` 覆盖即可：

```yaml
- id: dsh-w-chatflow
  config:
    intrinsicSize: 400   # 未渲染行的占位高度（默认 260）
    enabled: true        # false 则停用注入，但保留插件
```

## 安装（官方方式）

```sh
pnpm pack                                    # 生成 dsh-w-chatflow-0.2.1.tgz
dsh plugin --profile web add ./dsh-w-chatflow-0.2.1.tgz
```

> 本插件 host 半边 import 了 `@deepseek-ai/schemastery`，请用 **tarball 安装**（`file:` 复制）而不是 `add ./目录`（`link:` 软链接），否则 Node 无法从真实路径解析依赖。

安装后重启桌面版（或 `dsh web`）即随 `web` profile 自启。

如果本机没有全局 `dsh`，用桌面版自带 CLI：

```sh
node "<你的安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-chatflow-0.2.1.tgz
```

卸载：

```sh
dsh plugin --profile web remove dsh-w-chatflow
```

## 说明

- 这是**纯 CSS 止血**：削减屏外行的布局/绘制开销，能显著缓解滚动与部分打开开销。
- 它**不减少**打开时同步解析 Markdown / 语法高亮 / KaTeX 的 JS 开销——那一半需要在上游 `packages/client/ui-conversation/src/client/chat/ChatView.tsx` 的 `order.map` 处接入真正的窗口化虚拟化（作者在源码注释里已预留了该预期）。
