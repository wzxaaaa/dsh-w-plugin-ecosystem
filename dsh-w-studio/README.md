# dsh-w-studio

DeepSeek Harness W 系列工作室插件。在原有对话之外增加公司工作台：配置岗位与员工模型、选择共享工作区、建立项目与任务，通过工作报告、交接消息和文件协作，支持返工、验收与项目导出。

当前版本：`0.3.0`。发布包：`dsh-w-studio-0.3.0.tgz`（旧版本安装包保留在同目录）。已验证环境：Windows、本地 Harness `0.1.5-rc.2` Web profile。官方桌面 `desktop` profile 尚未验证；本版本的界面通信使用 Web Connection HTTP 接口。

## 功能

- 员工岗位、职责、工作目录和模型可配置；「批量管理」可一次删除重复员工（姓名、岗位、职责和执行工具与前面的员工相同，且没有历史记录）。
- 团队模板可编辑：新建、修改成员（与员工相同的模型和思考等级设置）、调整顺序、删除，或把当前团队存为模板；内置 4 人精简团队与 7 人完整团队作为可编辑模板。应用模板会替换当前团队而不是追加：姓名和岗位一致的员工保留并沿用自己的设置，其余没有历史记录的员工删除、有历史记录的停用，缺少的成员新增；应用前先预览变更，重复应用不会产生变化。
- 调用本机 Codex、Claude Code，以及 DeepSeek Harness 或兼容模型；模型列表读取本机目录，支持自定义 ID 和模型对应的思考等级。
- 公司工作区关联本地目录，项目包含目标、验收标准、参与员工与会话方式。
- 任务依赖、执行进度、暂停、停止、重试、返工和验收。
- 员工之间交接最终工作报告、消息和成果文件；员工自己的原生上下文分别保留。
- 查看实际原生会话 ID 和继续会话命令，可选按员工/项目续接或每项任务新开会话。
- 下载成果；向共享工作区导出项目简介、任务看板、交接记录和成果副本。
- 会议室：用户以甲方身份召集员工群聊沟通需求。未 @ 时由主持人回复，@ 员工后依次发言，员工也可在发言中点名同事（每条甲方消息后最多 6 轮员工发言）。每次发言以只读方式、在公司目录中调用该员工自己的执行工具和模型，并记录原生会话 ID。讨论后由主持人整理纪要，甲方确认或修改后一键建项目：目标、验收标准、按顺序依赖的任务，纪要同时作为团队消息交给项目员工。
- 中英文界面与窄屏布局。

## 安装与启动

先下载本目录中的 `.tgz`，通过自定义插件管理器安装，或使用 CLI：

```powershell
dsh plugin --profile web add .\dsh-w-studio-<版本>.tgz
dsh web
```

重启 Web 后，从左侧进入「工作室」。在现有本地源码开发环境中，也可以将下面的覆盖层传给 `dsh web --patch`；把示例路径替换为自己的插件及 CLI 位置：

```yaml
- insert:
    - id: dsh-w-studio
      name: 'E:/deepseek-workspace/dsh-w-plugin-ecosystem/dsh-w-studio/index.js'
      config:
        dshBin: 'E:/deepseek-harness/apps/cli/lib/bin.js'
```

正式安装包自动从当前安装环境解析 `@deepseek-ai/dsh` 的 CLI；`dshBin` 可以指定本地构建产物。需要完整的已构建 SDK profile，不能以源码文件替代这个执行入口。

默认数据位于 Harness home 下的 `studio/studio.v4.json`（v3 增加会议记录，v4 增加团队模板）。首次启动时如果只有较旧的 `studio.v3.json`、`studio.v2.json` 或 `studio.v1.json`，会读取最新的一份并写入 v4 文件，旧文件逐字节保留，旧版本插件仍可读取自己的文件；此后两个版本的数据各自独立，不会互相同步。不要同时启用内部 `experimental-studio` 和 `dsh-w-studio`，二者使用相同数据与 HTTP 路径。

## 配置

| 配置 | 默认值 | 用途 |
| --- | --- | --- |
| `storageRoot` | 当前 Harness home 下的 `studio` | 工作室记录及成果存储 |
| `dshBin` | 从当前 Harness 安装解析 | Harness 员工的已构建 CLI |
| `claudeCommand` | `["claude"]` | Claude Code 执行命令 |
| `codexCommand` | `["codex"]` | Codex 执行命令 |
| `maxParallel` | `2` | 不同员工及目录的并行任务上限 |
| `taskTimeoutMs` | `3600000` | 单次员工任务时限 |
| `pollIntervalMs` | `1500` | Web 状态刷新周期 |

其余资源参数见 `src/index.ts` 的 `Config`。同一员工或同一实际目录的任务按顺序执行。项目暂停后当前任务继续收尾；停止会取消当前任务。完成任务进入成果评审，项目要由用户明确验收。

## 会话兼容

Codex 与 Claude Code 使用各自 CLI 的会话方式。Harness/兼容模型的跨进程续接依赖 SDK server 的 `resumePersistedSessions` 功能；本地 Harness 开发环境已实现并验证。此支持不是安装 W 插件时自动修改官方程序。

本目录提供 [SDK 续接兼容说明](compat/README.md) 和对应补丁，供维护本地 Harness 源码时使用。未提供该功能的运行时，请为 Harness/兼容模型项目选择「每项任务新建会话」；Codex 和 Claude Code 的原生续接不依赖此 SDK 扩展。不能把尚未验证的官方版本列为完整兼容。

## 源码和 UI 接手

Host 为 `src/index.ts`，工作室业务为 `src/studio.ts`，员工执行为 `src/executor.ts`，模型目录为 `src/catalog.ts`。前端从 `src/client/mount.tsx` 挂载。`StudioPanel.tsx` 是页面骨架（公司工作区切换、页签、错误提示）；`TeamView.tsx` 为员工名单、搜索、模板与连接检查，`EmployeeEditor.tsx` 为员工表单、可搜索模型列表和思考等级；`ProjectView.tsx` 为项目切换、按状态显示的项目操作和项目摘要，`ProjectDialog.tsx` 为新建项目对话框；`TaskBoard.tsx` 为任务筛选、流水线列表和任务编辑，`TaskDetail.tsx` 为任务成果、返工关系、相关交接和执行信息，`ArtifactList.tsx` 为成果文件下载、图片缩略图和文本预览；`HandoffTimeline.tsx` 为交接时间线，`TemplatesView.tsx` 为团队模板编辑与应用预览，`MeetingRoom.tsx` 为会议室（会议列表、群聊、点名、纪要编辑与建项目）。Host 端会议逻辑在 `src/studio.ts` 的会议命令、`meetingTurn` 和 `parseMinutes`；模板替换计划、重复员工判断和历史记录判断在 Host 与界面共用的 `src/roster.ts`。`ui.ts` 放置从真实状态推导的显示逻辑（依赖等待、返工关系、统计、文件类型），`parts.tsx` 为头像、状态标签等小组件。样式在 `Studio.module.css`（使用 DSH 设计变量，随浅色/深色主题切换），中英文字典在 `locales.ts`。

本目录是 W 系列发布源码。Harness monorepo 中的 `packages/experimental/studio` 是之前的内部开发版本；UI 后续修改应以本目录源码为准。根 `index.js`、`client.js` 是构建产物，修改源文件后重新构建，不直接改产物。

## 开发和验证

构建使用一个已经装好依赖的 Harness 源码工作区。该工作区应包含之前的 Studio 开发依赖；构建脚本不向安装包写入本机绝对路径。

```powershell
node scripts/build.mjs E:\deepseek-harness
node scripts/start.mjs E:\deepseek-harness --port 3081
node scripts/test-source.mjs E:\deepseek-harness
node --test test/*.test.mjs
node --check index.js
node --check client.js
pnpm pack --config.ignore-scripts=true
```

`BUILD.json` 记录构建所用 Harness 版本和提交。源码测试包含真实 Cordis Loader 与 Web/原生测试执行器组合，以及调度、持久记录、工作区、返工、验收、导出和最终交接的行为测试。安装包测试核对发布身份和浏览器工厂。

开发启动命令使用已构建 `dsh` Web profile，只加载本目录 W 插件。若已有 Web 服务占用 3081，请选择其他端口；原开发启动脚本仍可能加载内部 Studio。

## 命名和发布约定

目录、npm 包、Host 插件名、bundle loader ID、Client module ID 均为 `dsh-w-studio`；侧栏与主面板 key 为 `w-studio`，语言命名空间为 `wStudio`。安装包使用 `<name>-<version>.tgz`，在 `wzxaaaa/dsh-w-plugin-ecosystem` 的本目录发布。
