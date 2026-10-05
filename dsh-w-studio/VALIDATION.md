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
