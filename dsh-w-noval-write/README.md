# dsh-w-noval-write

DeepSeek Harness 的工作区级小说写作插件。包名保留既有的 `noval` 拼写；界面名称为“小说写作 / Novel Writing”。

## 核心语义

- 一个 Harness 工作区共享一个小说项目。同一工作区下的所有对话和右侧栏看到的是同一份角色、关系、世界观、情节、场景与进展数据。
- 小说工作台始终可用，没有开启/关闭状态，也没有模式按钮。
- `/write` 像 `/goal` 一样是一项持久会话能力：写作任务按会话保存在插件自己的 `session-links.json` 中；重启后仍然有效，不污染 Harness 会话事件，也不影响其他对话。
- AI 对项目数据拥有完整能力：可以读取、局部修改、完整重写并推进进展。长期设定变化应回写项目，而不是只留在聊天文本里。

这和 `dsh-w-whale-tail` 的边界不同：Whale Tail 的状态按对话保存；本插件的数据按工作区保存。

## 使用

在输入框键入 `/`，选择 `write`：

| 输入 | 结果 |
| --- | --- |
| `/write` | 未联动时建立默认写作任务；已联动时显示当前工作区、任务和可用命令 |
| `/write <写作任务>` | 建立持久写作任务，并立刻把任务作为用户消息交给模型执行 |
| `/write edit <写作任务>` | 修改持久任务，并立刻让模型按新任务继续 |
| `/write clear` | 解除当前对话的联动；不会删除工作区小说数据 |

执行后，输入框上方会像 Goal Bar 一样持续显示 Novel Writing Bar，可直接编辑任务或解除联动；聊天流中会保留 `/write …` 命令输入气泡和结果。右侧栏页面无需执行命令即可随时编辑当前工作区数据。

命令不接受 `on`、`off` 或 `status` 参数。插件和工作区数据始终可用；`clear` 只清除当前对话的联动状态，不是关闭小说插件。

与 `dsh-w-knowledge-base 0.4.0+` 同时安装时，`/write` 会请求知识库切换到 writing mode：

- 本插件保存“这一本书是什么”：项目梗概、角色、关系、世界规则、情节因果、场景连续性和推进历史。
- 知识库 writing corpus 保存“参考文本怎样写”，供模型按需检索语言质感。
- 两边不复制存储；模型可以通过各自公开工具组合使用它们。

## 数据自由协议

模型工具全部按当前对话所属工作区解析：

| 工具 | 能力 |
| --- | --- |
| `novel_schema` | 返回权威项目 JSON Schema、空项目示例和参数失败后的重试协议 |
| `novel_read` | 读取完整项目或指定部分 |
| `novel_save_chapter` | 把完整章节正文原子写入工作区，并回读校验路径、字节数和 SHA-256 |
| `novel_patch` | 自由局部修改；对象部分深度合并，提供的数组整体替换 |
| `novel_character_patch` | 按角色 ID 局部更新一张角色卡，不重发角色数组 |
| `novel_relationship_patch` | 按关系 ID 局部更新关系线，并校验端点 |
| `novel_outline_read` | 按卷、章节和范围读取结构化大纲 |
| `novel_volume_upsert` | 按稳定 ID 创建或更新一卷 |
| `novel_chapter_upsert` | 按稳定 ID 创建或更新一章 |
| `novel_chapter_remove` | 删除指定章节 |
| `novel_chapter_reorder` | 调整章节在卷内的顺序 |
| `novel_write` | 完整重写项目，适合大规模重构 |
| `novel_advance` | 追加剧情进展、永久设定变化、待续线索，并可更新当前场景 |

`novel_read` 会把当前数据、revision、权威结构和重试协议一并返回给模型。所有写工具的对象参数都使用完整嵌套 JSON Schema；`project`、`patch` 和 `scene` 必须是直接 JSON 对象，不能是 JSON 字符串、Markdown 或再次包裹的整套工具参数。

0.8.0 将项目升级到 schema v4：新增题材配置和各层 `customFields`，加入结构化的卷—章—场景大纲，以及角色、关系、卷和章节的按 ID 局部工具。旧 schema v3 项目读取时会自动补齐新结构，不需要手工迁移；原有 `plot.chapterPlan` 与 `plot.outline` 保留为兼容概览字段。角色和关系不再要求模型为每个非核心字段提交空字符串，重名角色不能再通过姓名被静默绑定到错误关系。右侧工作台新增“大纲”Tab，并按工作区暂存未保存草稿。

0.7.2 将 `/write` 的会话绑定迁移到插件自有的原子持久化文件，避免第三方事件导致旧版 Harness 拒绝加载会话；输入栏状态通过插件远程接口自动同步。工作区共享的小说框架存储方式不变。

0.7.1 的工作台使用 schema v3，并新增“设置”页：可导出当前工作区的完整小说框架、校验并原子导入备份，以及在二次确认后重置为空白框架。导出文件是带格式版本的可移植 JSON，不绑定本机工作区 ID 或路径；导入也兼容完整的原始项目 JSON。工作台使用按侧栏自身宽度生效的容器响应式，角色关系等双列表单会在窄栏自动改为单列。

工作台的数据结构包括：

- 项目页增加目标读者、内容边界、文风指南和创作约束。
- 项目、角色、关系、卷、章和大纲场景都支持自由命名的 `customFields`，可承载题材专用路线、阶段、线索、境界或其他数据。
- 大纲页按卷、章和场景保存标题、字数、状态、概要、事件列表、对话备注、收束钩子与场景细纲；长篇大纲不再挤进一个字符串。
- 角色卡按身份、人物画像、欲望压力、能力信息、表现与弧光分组，覆盖别名、职业社会位置、现状、背景、动机、失败代价、能力弱点、认知、关键物品和行为习惯。
- 关系页明确 A → B 的方向，增加状态、共同历史、权力交换、公开层、真实层、共同秘密、关系转折和未来方向；角色端点无效或自指时会直接警告。
- 世界观按时间空间、制度资源、文化认知分组；情节按戏剧核心、主线结构、支线伏笔和节奏分组；场景按坐标、戏剧执行、状态变化分组。
- 角色 ID 支持 Unicode；关系端点可以用角色 ID 或姓名解析，不再把中文 ID 变成连字符并清空关系。

模型写入协议：

1. 写入前先调用 `novel_read`，取得最新 revision 和结构。
2. `novel_patch`、`novel_write`、`novel_advance` 必须传入该 revision 作为 `expected_revision`。
3. 参数结构或 revision 校验失败时，插件明确返回 `noDataWritten: true`、完整 contract 和重试步骤；模型应重新读取、按结构修正并重试一次。
4. 只有工具返回 `ok: true` 和更高 revision 才算写入成功。

重复调用保护：

- 相同项目不会重复写盘或增加 revision，而是返回 `changed: false, stop: true` 并结束工具循环。
- `novel_write` 默认保留追加式 progress 账本，避免和 `novel_advance` 交替时回退历史；只有显式 `replace_progress: true` 才允许重建进展。
- `novel_advance` 会忽略与最新一条完全相同的推进记录。
- 插件按 Harness 的 `turn/start` 记录同一模型轮次；该轮成功执行一次 `novel_write` 或 `novel_advance` 后，后续两种破坏性调用都会被硬阻断并结束工具循环，下一轮自动解锁。
- 提示词同时明确禁止为同一变化交替调用 `novel_write` 与 `novel_advance`。

章节文件落盘：

- `novel_write` 和 `novel_advance` 只维护结构化项目数据，并不创建 Markdown 正文文件。
- 用户要求生成、保存或导出章节文件时，模型必须调用 `novel_save_chapter`，传入完整正文和单个 `.md`/`.txt` 文件名。
- 工具只允许写入当前 Harness Workspace 根目录，拒绝绝对路径、子目录和路径穿越。
- 文件采用临时文件加原子重命名写入，随后回读全文；只有返回 `ok: true, verified: true` 才允许模型声称文件已经创建。
- 成功回执包含绝对路径、字符数、字节数和 SHA-256；同名不同内容默认拒绝覆盖，只有显式 `overwrite: true` 才会替换。

非法参数在任何归一化或落盘前都会被拒绝。所有合法写入仍使用 revision 乐观并发保护和原子落盘；页面、其他对话或模型工具已经更新数据时，旧页面不会静默覆盖新版本。

数据默认存放在：

```text
$DSH_HOME/noval-write/workspaces/<workspaceId>/project.json
$DSH_HOME/noval-write/session-links.json
```

`project.json` 是工作区共享的小说框架；`session-links.json` 只保存各会话的 `/write` 任务与工作区绑定。两者都采用临时文件加原子重命名写入。

可以在 profile 的 `cordis.patch.yml` 中改根目录和提示词上限：

```yaml
- id: dsh-w-noval-write
  config:
    root: 'D:/Writing/novel-data'
    promptMaxChars: 12000
```

## 右侧栏挂载协议

`dsh-w-right-sidebar 0.6.0` 提供三个 root scope 子槽：

| 槽位 | 类型 | 本插件的用法 |
| --- | --- | --- |
| `right-sidebar.rail` | `list` | 注册 `id: noval-write` 的快捷按钮，调用 `onSelect(id, title)` |
| `right-sidebar.card` | `list` | 注册工具卡片，调用 `onOpen(id, title)` |
| `right-sidebar.page` | `chain` | 仅在 `owner.activeId === 'noval-write'` 时接管页面 |

页面使用宿主标准注入的 `useSessions` 与 `useWorkspaces`，先根据当前会话的 workspace membership 解析工作区，再通过 Remote API 传入 `workspaceId`。Host 会再次用 `workspaceRegistry` 校验 ID，客户端不能任意读写其他工作区。

三个页面注册都通过 `ctx.slots.inject(...)` 等待宿主槽位。缺少右侧栏时，`/write`、工作区存储和模型工具仍可工作；宿主以后加载时页面会自动挂载。

## 安装

推荐顺序：

1. `dsh-w-right-sidebar >= 0.6.0`
2. `dsh-w-knowledge-base >= 0.4.0`（可选）
3. `dsh-w-noval-write`

```powershell
dsh plugin --profile web add .\dsh-w-noval-write-0.8.0.tgz
```

缺少知识库时，项目工作台与 AI 数据工具不受影响，`/write` 会明确报告知识库未挂载。

## 验证

```powershell
npm test
node --check .\index.js
node --check .\client.js
pnpm pack --config.ignore-scripts=true
```
