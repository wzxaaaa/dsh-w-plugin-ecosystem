# 0.3.2 验证记录

验证日期：2026-10-05。修复：点了「结束会议」后不能再整理纪要、无法从会议建项目。

- 尚未创建项目的已结束会议可以整理纪要、在已有纪要时继续编辑（新增 `reviewMinutes`），或重新开启会议；已创建项目的会议保持结束，三种操作都拒绝。界面在已结束且未建项目的会议上显示说明和对应按钮。
- 3 个文件、39 项源码测试通过（新增 1 项覆盖上述路径）；Host、Client 类型检查无错误。
- 隔离开发服务与测试 CLI 中，通过界面完成：会议中发言 → 结束会议 → 整理会议纪要 → 补充目标和任务 → 按纪要创建项目 → 查看项目 → 开始工作 → 任务执行完成，6 项检查通过，无控制台错误。

# 0.3.1 验证记录

验证日期：2026-10-05。修复：Codex 只以桌面版（Microsoft Store）安装、PATH 中没有 `codex` 时，员工任务与会议发言报 `spawn codex ENOENT`。

- 新增 `src/native-command.ts`：PATH（含 PATHEXT）中找不到默认的 `codex` 时，通过 `Get-AppxPackage OpenAI.Codex` 定位安装目录内的 `app\resources\codex.exe`；缓存结果，桌面版更新导致旧路径失效时重新定位；显式路径或多段命令按配置使用；ENOENT 错误改为说明缺少的工具和 `codexCommand` / `claudeCommand` 配置项。
- 3 个文件、38 项源码测试通过（新增 3 项：PATH 优先与显式配置不被替换、缓存与更新后重新定位、缺少可执行文件的说明）；Host、Client 类型检查无错误。
- 本机（PATH 中只有 `claude.exe`，Codex 为桌面版 26.930）使用默认配置启动隔离开发服务，`/api/studio/health` 返回 Codex `codex-cli 0.160.0`、Claude Code `2.1.118` 均可用。该检查只运行 `--version`，未调用模型。

# 0.3.0 验证记录

验证日期：2026-10-05。环境：Windows、Node 22.19.0、本地 Harness 0.1.5-rc.2 Web profile。官方 desktop profile 未列入本次验证。

本版本内容：团队模板改为替换当前团队（不再追加），模板可编辑并存入持久记录；员工批量删除与重复员工选择；持久记录升级为 `studio.v4.json`。

- Client、Host 源码按 Harness 严格 TypeScript 配置类型检查无错误。
- `node scripts/test-source.mjs E:\deepseek-harness`：2 个文件、35 项源码行为测试通过（连续三次）；新增测试覆盖模板替换且重复应用无变化、保留员工沿用自身设置、有历史记录的员工停用、成员运行任务时拒绝替换、模板保存校验（空成员、兼容模型缺字段、额外私有字段）、模板删除、v3→v4 迁移且旧文件逐字节保留、批量删除重复员工并拒绝删除有历史记录的员工。
- `node --test test/*.test.mjs`：2 项通过；Host、Client 通过 `node --check`。
- 用户现有 v3 数据的副本（41 名员工，其中 30 名为重复追加的模板员工）在隔离 Harness home 与隔离存储中启动：生成 v4 文件且 v3 副本哈希不变；原数据文件未被读取以外的任何方式使用。
- 无头 Edge 驱动真实界面 19 项检查全部通过，无控制台错误：选中重复员工 30 名、4 名有历史记录员工不可勾选、删除后恢复原始 11 名且模型设置不变；编辑模板成员模型与思考等级并保存；替换预览（保留 4、删除 7）、确认替换、再次应用提示无需更改；当前团队存为模板并删除；390px 无横向溢出。测试中隐藏了隔离 Harness home 的首次启动设置弹窗，未填写任何凭据。

# 0.2.0 验证记录

验证日期：2026-10-05。环境：Windows、Node 22.19.0、本地 Harness 0.1.5-rc.2 Web profile。官方 desktop profile 未列入本次验证。

本版本内容：Web UI 重做（工作台布局、可搜索模型列表、任务筛选与返工关系、成果预览、交接时间线、深色主题、窄屏布局）；新增会议室；持久记录升级为 `studio.v3.json`。

- `node scripts/build.mjs E:\deepseek-harness`：生成 Host/Client 入口。
- Client、Host 源码按 Harness 严格 TypeScript 配置（`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`）类型检查无错误。
- `node scripts/test-source.mjs E:\deepseek-harness`：2 个文件、31 项源码行为测试通过；新增会议测试覆盖 v2→v3 迁移且旧文件逐字节保留、主持人默认回复、点名与员工交接接力、会议发言强制只读并使用公司目录、每条甲方消息后 6 轮员工发言上限、纪要建项目与依赖链、非结构化纪要保留原文、停止发言、重启后清理发言状态、会议操作不受后台修订号变化影响。
- `node --test test/*.test.mjs`：2 项通过；Host、Client 和脚本通过 `node --check`。
- `pnpm pack --config.ignore-scripts=true` 生成 `dsh-w-studio-0.2.0.tgz`；解包后入口、文档、构建记录和兼容补丁与源码构建产物逐字节一致。隔离 Harness home 中 `plugin --profile web add <tgz> --ignore-scripts --offline` 安装成功。
- 隔离存储的开发 Web 服务（3083）中，用现有 v2 数据启动，生成 v3 文件且 `studio.v2.json` 哈希不变。
- 无头 Edge 驱动真实界面：项目与员工流程 27 项检查（含模型与思考等级到达 Codex 命令行 `-m gpt-6.1-sol`、`model_reasoning_effort="medium"`）、会议室流程 22 项检查（连续两次）全部通过，无控制台错误；1440px 与 390px 无横向溢出，浅色/深色主题截图检查。
- 以上界面流程使用确定性测试 CLI，不计作真实模型调用；会议中真实 Codex / Claude Code / Harness 员工的发言与纪要质量尚未验证。

# 0.1.0 验证记录

验证日期：2026-10-05。环境：Windows、Node 22.19.0、本地 Harness 0.1.5-rc.2 Web profile。官方 desktop profile 未列入本次验证。

- `node scripts/build.mjs E:\deepseek-harness`：生成独立 Host/Client 入口。
- `node scripts/test-source.mjs E:\deepseek-harness`：2 个文件、26 项源码行为测试通过。
- `node --test test/*.test.mjs`：2 项发布名称和浏览器工厂测试通过。
- Host、Client 和开发脚本通过 `node --check`。
- `pnpm pack --config.ignore-scripts=true`：生成 `dsh-w-studio-0.1.0.tgz`。
- 隔离 Harness home 中，通过已构建 CLI 的 `plugin --profile web add <tgz> --ignore-scripts --offline` 安装成功；profile 自动登记 W 插件 bundle。
- 使用安装后的包和已构建 CLI 启动 Web，自动定位 dshBin，完成工作区创建、4 人模板、原生测试员工任务、返工、同员工会话续接、项目验收与文档导出。
- 安装后浏览器在 390px 窄屏无横向溢出，页面无错误。上述原生员工执行使用确定性测试 CLI，不计作真实模型调用。
- 解包后，Host、Client、bundle、文档、构建记录和兼容补丁与待发布文件逐字节一致；安装包 manifest 字段与源码一致，允许打包工具调整 JSON 排版。
- SDK 兼容补丁的反向应用检查通过，确认它对应本地已有实现。

真实 Codex、Claude Code 两轮会话续接，以及兼容模型 SDK 工具执行和续接，已在此前本地工作室开发阶段另行验证。正式 W 包本次重点验证独立命名、打包、安装和实际 Web 运行。
