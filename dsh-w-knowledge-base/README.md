# dsh-w-knowledge-base

给 DeepSeek Harness 里的 AI 自己用的**跨会话知识库**插件。

会话结束、上下文压缩、桌面版重启都会清空 AI 的记忆；这个插件在 Harness home 下维护一批 Markdown 笔记，AI 用五个工具读写它们，并且每一轮都能在运行上下文里看到「我现在记住了什么」的简表——不用先花一次工具调用去确认知识库里有什么。

笔记就是普通的 `.md` 文件：你可以直接用编辑器改、用 `grep` 搜、用 Git 备份，插件下一次同步就会读到你的修改。

## 两种模式（可一键切换）

面板顶部有「助手模式 / 写作模式」开关，切换即时生效、无需重启，选择会持久化（存在 `knowledge-base/mode.json`）。

- **助手模式（默认，原有行为一字未改）**：给 AI 自己的跨会话技术记忆，笔记存在 `knowledge-base/notes/`。
- **写作模式**：把同一套工具变成**文风素材库**——你把别人写的参考小说 txt 喂进来，AI 动笔前用 `kb_search` 拉几段同类的真人文字做语感锚点，用来压掉"AI 腔"。写作库**完全独立**存放在 `knowledge-base/style-corpus/`，和助手笔记互不干扰。写作模式还会：
  - 注入一段**反 AI 腔的写作协议**（用具体动作/感官/潜台词表现情绪、别用四字套话、长短句交错、删解释性过渡、检索真人段落学语感而非抄情节）；
  - 注入一张**禁用套路表**（面板里可编辑，内置一份常见 AI 腔默认表如"五味杂陈""嘴角勾起一抹弧度"），让模型避开这些被写烂的表达；存在 `knowledge-base/style-corpus/banned-phrases.txt`，一行一个、可手改。

> 素材是用来学**怎么写**的，不是用来抄**写了什么**——借语感，别搬情节。

## 功能

- 五个模型工具：`kb_save`、`kb_search`、`kb_read`、`kb_list`、`kb_delete`，外加一个 `kb_import` 直接喂整份文档；
- 默认存放在 `$DSH_HOME/knowledge-base/notes/`，一条笔记一个文件，front matter 记录 id、标题、标签、创建/更新时间、来源会话和工作区；
- 注入一段提示词协议（何时搜索、何时保存、不要写入密钥），以及一段随笔记变化的**实时索引**（最近更新的若干条 id + 标题 + 标签），让模型主动想起来去查；
- 检索同时看标题、标签、正文、短语命中和更新时间；中文按二元组切词，所以「插件打包」能命中「插件打包踩坑」；
- 写入是原子的（临时文件 + rename），删除默认移进 `.trash/` 可恢复；
- 同标题重复创建会被拒绝并提示已有 id，避免同一个知识点散成好几条；
- 手工放进 `notes/` 的文件（没有 front matter 也行）会被自动编入索引，重复 id 会在界面上给出提示而不是静默覆盖；
- 「设置 → 知识库」里有一个浏览面板：搜索、按标签筛选、查看、编辑、新建、删除；装了 `dsh-w-right-sidebar` 时右侧工具栏里也会出现同一个面板；
- 窄侧栏采用两层工具栏和固定宽度笔记数徽标；存储路径不再占据可见空间，只在笔记数悬停提示中提供；
- 面板里还有**投喂模式**：把文档直接拖进窗口（或点「选择文件」），自动切段、自动起标题和标签、自动写入；重复投喂同一份文档会更新旧笔记而不是再建一堆；处理结果会逐份列出，删掉的章节会作为「旧笔记」提示而不是悄悄删掉。

## 工具

| 工具 | 作用 | 主要参数 |
| --- | --- | --- |
| `kb_save` | 新建或更新一条笔记 | `title`、`content`、`tags`、`id`（更新时）、`mode`（`replace`/`append`）、`allowDuplicateTitle` |
| `kb_search` | 按相关度检索 | `query`（必填）、`tags`、`limit` |
| `kb_read` | 按 id 读全文 | `id`、`ids`、`maxChars` |
| `kb_list` | 分页浏览 + 标签计数 | `tag`、`limit`、`offset`、`sort`、`order` |
| `kb_delete` | 退休一条笔记 | `id`（必填）、`hard` |
| `kb_import` | 把工作区里一份文本文件整份喂进知识库 | `path`（必填）、`tags`、`dryRun` |

只读的三个工具声明为可并行（`isConcurrencySafe`），写入工具串行执行；工具默认 20 秒协作超时，`kb_import` 为 60 秒。

## 投喂模式（`kb_import` 与拖拽导入）

不需要你当"整理员"：给它一份文档，它自己决定怎么切。

- **切段**：优先按 Markdown 标题切（选"至少能切出两段的最浅层级"，所以一个 H1 + 多个 H2 的 README 会按 H2 切）；没有 Markdown 标题的**中文小说 txt 会自动按章切**（识别「第 N 章/节/回/卷/篇」「楔子/序/番外/尾声」以及「Chapter N」，一章一条笔记）；两者都没有的日志/导出文本按段落切，默认每段约 6000 字符，超长段会拆成带编号的部分；
- **自动识别编码**：`kb_import` 和面板拖拽都会先探测文件编码，UTF-8 / 带 BOM / **GBK / GB2312 / GB18030 / Big5 / UTF-16** 都能正确读入，不会把 GBK 网文读成乱码；导入结果会标出实际识别到的编码；
- **起标题**：唯一的顶层标题做文档名，小节标题接在后面（"文档 · 小节"），没有标题的段落编号（"文档 · 第 N 段"），超长的加 (2/3) 这样的序号；
- **打标签**：每条笔记自动带 `import` 和文档 slug（如 `deepseek-插件开发经验`），你传的标签会追加；
- **重复投喂 = 更新**：每条笔记的前置元数据里写有稳定的 `origin` 键，同一份文档再喂一次就更新对应笔记（id 不变），章节被删掉时会报告为"旧笔记"让你决定是否 `kb_delete`；
- **拒绝非文本**：.pdf/.docx/.zip 等容器和含二进制字节的文件会直接报错，提示先转成文本；
- 面板里拖入多个文件会按顺序处理，每个文件一张结果卡，可以一键跳到该文档的笔记列表。

## 目录与文件格式

```
$DSH_HOME/knowledge-base/
├── notes/
│   └── kb-20260901-153012-a1b2__pnpm-pack-pitfalls.md
└── .trash/
    └── 20260902T081500Z__kb-...__stale-note.md
```

```markdown
---
id: kb-20260901-153012-a1b2
title: pnpm pack 之后必须先 remove 再 add
tags: dsh, packaging
created: 2026-09-01T15:30:12.345Z
updated: 2026-09-02T02:10:00.000Z
source: session:session-4a08c489
workspace: E:\deepseek-workspace\dsh-w-plugin-ecosystem
---

正文（Markdown）。
```

id 用 UTC 时间生成，所以文件名天然按时间排序；标题只用于生成可读的文件名后缀，改标题会连带重命名文件。

## 安装

```powershell
npm test
pnpm pack --config.ignore-scripts=true
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-knowledge-base-0.4.3.tgz
```

装好以后重启桌面版（或重新启动 `dsh web`）；重装同一个版本号之前记得先 `remove`，否则 pnpm 不会重新解包。

## 配置

在 profile 的 `cordis.patch.yml` 里按行覆盖：

```yaml
- id: dsh-w-knowledge-base
  config:
    root: ''                # 留空 = $DSH_HOME/knowledge-base，支持 ~ 前缀
    maxNoteChars: 60000     # 单条笔记正文上限
    importTargetChars: 6000 # 投喂切段的目标长度（下限 200）
    importMaxChars: 10000000 # 单份整本文档的安全上限；导入后仍会自动按章节/段落拆分
    searchLimit: 8          # kb_search 默认返回条数
    readChars: 20000        # kb_read 单条默认字符预算
    syncIntervalMs: 1500    # 两次磁盘校验之间的最小间隔
    promptGuidance: true    # 注入使用协议（order 150）
    promptIndex: true       # 注入实时索引（运行上下文）
    promptIndexNotes: 24    # 索引里最多列多少条
    promptIndexChars: 2400  # 索引的字符预算
```

如果某个 agent preset 用 `complete` persona 完全接管系统提示词，那段使用协议会被抑制；实时索引走的是运行上下文快照，仍然可见。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-knowledge-base
```

卸载不会删除 `$DSH_HOME/knowledge-base/`——笔记是你的资产，需要时自己删。

## 开发与测试

```powershell
node --check .\index.js
node --check .\client.js
npm test
```

`kb-format.js`（文件格式）、`kb-search.js`（打分）、`kb-store.js`（落盘）、`kb-ingest.js`（切段/中文章节识别）、`kb-encoding.js`（编码探测）、`kb-writing.js`（写作模式协议/禁用套路表）、`kb-tools.js`（工具定义）都不依赖 Harness 运行时，可以单独跑单元测试；`index.js` 只负责把它们接到 `ctx.tools`、`ctx.systemPrompt` 和 Typert Remote 上（助手/写作双 store + 一个按模式转发的代理）。编码探测依赖 `jschardet` + `iconv-lite` 两个纯 JS 包（已列入 `dependencies`，随 `dsh plugin add` 自动安装）。
