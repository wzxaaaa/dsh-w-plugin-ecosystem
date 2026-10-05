# 工作室插件设计与交付

本插件按 W 系列独立插件方式发布，规范来源为仓库根 `AGENTS.md`、`README.md`、现有 `dsh-w-right-sidebar` / `dsh-w-custom-plugins` 的 package 与 bundle 配置，以及 `OFFICIAL_HARNESS_COMPATIBILITY.md` 的实际验证记录。

公司工作区、员工、项目、任务、交接和成果由 Host 的 `Studio` 管理，记录版本为 2。Client 控制器按 revision 提交命令并轮询 Host；页面始终使用实际执行状态。工作说明及成果跨员工交接，各员工分别保留原生会话。

代码不进入官方主循环。W 插件的 Host 与 Client 通过同一 bundle loader 行挂载；Client 使用 `window.__ModuleLoader__.load` 的 closure factory，由 Harness 共享 React。插件通过现有 UI slots、locale、layout 和目录选择服务挂载全局工作台。

本版本只声明已验证的 Web 体验。向官方桌面版本移植时，需要按其实际通信服务调整 HTTP 控制器并重新验证；原有 Web 构建结果不能作为桌面验收。SDK 持久会话扩展单独记录于 `compat/`。

发布目录保留可编辑的 TypeScript/React/CSS 源码和行为测试，安装包只包含已构建入口、bundle 和运行说明。改动源码之后执行构建、测试、打包，并核对解包后的入口与源码构建产物一致。
