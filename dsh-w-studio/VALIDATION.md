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
