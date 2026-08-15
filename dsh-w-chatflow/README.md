# dsh-w-chatflow

DeepSeek Harness 长对话性能插件。所有优化都由插件在运行时提供，不修改 Harness 源码或安装文件。

## 功能

### 可选的屏外消息延迟渲染

显式启用后，插件向每个带 `data-chat-anchor-key` 的聊天行注入：

```css
[data-chat-anchor-key] {
  content-visibility: auto;
  contain-intrinsic-size: auto 260px;
}
```

屏外消息会跳过布局与绘制。此功能从 `0.3.1` 起默认关闭：超长消息的真实高度可能远大于估算占位高度，进入视口时会触发重排，并与 Harness 自己的滚动锚定叠加，造成向上滚动时内容向下回弹。

### 超长流式输出优化

Harness 的内置 `assistant-step` 在每个 reasoning/text delta 后会检查完整累计文本是否可见。模型产生数万细粒度 chunk 时，这会反复扫描越来越长的字符串。

客户端插件等待内置 Conversation Definition 注册后，可逆地包装其 `update`：

- 每个 block 单独记录可见状态；
- 新 delta 只检查本次新增文本；
- block 被替换时只重新检查该 block；
- 保留原有 block、首 token、首可见时间和 usage 语义；
- 插件卸载时恢复原始函数引用；
- Harness 内部结构不兼容时立即恢复原实现并警告一次。

真实的 3D 机械表会话包含 `88,383` 个首步 chunk。插件实际代码回放该步骤约耗时 `21 ms`，最终 `258,894` 字符与持久化 assistant message 完全一致。

## 配置

在 profile 的 `cordis.patch.yml` 中按插件 id 覆盖：

```yaml
- id: dsh-w-chatflow
  config:
    enabled: true
    intrinsicSize: 260
    deferOffscreenRows: false
    optimizeStreaming: true
```

- `enabled`：总开关；关闭后不注入 CSS，也不安装客户端运行时优化。
- `deferOffscreenRows`：是否使用 `content-visibility` 延迟渲染屏外消息，默认关闭以保证滚动稳定。
- `intrinsicSize`：启用 `deferOffscreenRows` 时的初始占位高度，范围 `40` 到 `4000`，默认 `260`。
- `optimizeStreaming`：超长 assistant 流式输出优化，默认开启。

## 安装

```sh
npm pack
dsh plugin --profile web add ./dsh-w-chatflow-0.3.1.tgz
```

本插件 Host 端使用 `@deepseek-ai/schemastery`，请安装 tarball，不要把源码目录作为 `link:` 依赖。

安装后重启桌面版或 `dsh web`。卸载命令：

```sh
dsh plugin --profile web remove dsh-w-chatflow
```

## 验证

```sh
npm test
```

测试覆盖：

- reasoning/text/tool-call/block-end 的增量折叠；
- 首 token、首可见时间和 usage；
- 10 万 reasoning chunk 性能回归；
- 不兼容状态自动恢复；
- 插件卸载恢复原实现；
- HTML 配置和 CSS 注入幂等性。
- 屏外消息延迟渲染保持显式 opt-in，默认不影响滚动几何。

## 边界

- 插件不会修改 `deepseek-harness` 仓库源码。
- 当前版本主要消除超长 reasoning 的累计全文扫描。Harness 的 Turn/Step LocationIndex 在极端单 Turn、多 Step 会话中仍可能产生约几十毫秒的边界停顿。
- 可选的 `content-visibility` 不是完整列表虚拟化；它减少布局和绘制，但已加载节点仍保留在 DOM 中，而且不适合高度差异极大的消息流。
