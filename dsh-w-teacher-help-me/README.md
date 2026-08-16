# dsh-w-teacher-help-me

DeepSeek Harness 可配置老师插件。当主模型在任务执行中持续卡住时，它可以调用 `teacher_help_me`，把当前模型可见会话上下文交给配置的 `gpt-5.6-sol` 中转模型，获取诊断、缺失证据和下一步思路。

老师模型只提供建议，但可以使用受工作区边界约束的只读工具独立调查代码。它可以列目录、搜索文本和按行读取文件，不修改文件、不运行命令、不接管任务。最终判断和执行仍由主模型负责。

## 功能

- 注册模型工具 `teacher_help_me`；
- 自动读取调用 Agent 的 `session.deriveMessages()`，无需主模型手工复制整段历史；
- 老师可以多轮调用 `list_directory`、`search_files`、`read_file`，自行发现主模型上下文中没有提到的问题；
- 所有读取都限制在当前会话 `cwd` 内，并阻止 `..`、绝对路径和符号链接越界；
- 单次读取、搜索文件数、搜索字节数、工具输出和总调用轮数都有硬上限；
- `focused` 模式默认保留初始目标和最近工作，并按字符预算省略中间历史；
- `full` 模式渲染全部模型可见消息，但仍受 600,000 字符硬上限保护；
- 提取文本、推理、工具调用与工具结果，图片仅生成占位说明，不向老师发送图片字节；
- 请求跟随工具取消信号，默认 180 秒超时；
- 在“设置 -> 自定义插件 -> dsh-w-teacher-help-me”中配置 API Base URL、API Key 和模型名；
- API Key 不回显，留空保存会保留原值。

## 工具参数

- `problem`：当前卡点、症状和期望结果，必填；
- `attempts`：已经尝试的方法及失败原因，可选；
- `contextMode`：`focused` 或 `full`，默认 `focused`；
- `contextBudget`：上下文字符预算，限制在 8,000 到 600,000，默认 120,000。

老师返回的结构化结果包含建议、实际模型名、上下文模式、消息数量和字符数；模型可见渲染只显示建议正文。

## 安装

```powershell
npm test
pnpm pack --config.ignore-scripts=true
node "<桌面版安装目录>\DeepSeek-Harness-Desktop\resources\runtime\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add ./dsh-w-teacher-help-me-0.2.0.tgz
```

安装后重启桌面版，在自定义插件设置中填写与 `dsh-w-vision` 同类型的三个配置项。

## 配置文件

配置保存在当前 profile 下的 `.dsh-w-teacher-help-me.json`。Host 使用临时兄弟文件和原子 rename 写入；在支持 POSIX mode 的平台上临时文件以 `0600` 创建。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-teacher-help-me
```

卸载不会自动删除 profile 中的配置文件。
