# dsh-w-custom-plugins

DeepSeek Harness 插件管理器：在「设置 → 插件」页新增「自定义插件」标签页，管理你自己挂载的插件。

## 功能

- 列出所有非 `@deepseek-ai/*` 的自定义插件；
- 每个插件一个启/停开关，**切换即时生效**（无需重启）；
- **拖拽安装**：把 `.tgz` / `.tar.gz` / `.zip` 插件压缩包拖进标签页（或点选），自动校验并调用官方 `dsh plugin add` 安装；
- 解压前校验包内**恰好一个**带合法 `dsh.bundle.patch` 的插件，拒绝路径穿越、链接、Windows 非法路径及超限压缩包；
- 上传失败或离开页面时自动取消并清理临时文件，过期会话也会后台回收。

> ⚠️ 插件拥有本机代码执行权限，请只安装可信来源的压缩包。

## 安装

```powershell
pnpm pack
dsh plugin --profile web add ./dsh-w-custom-plugins-0.3.1.tgz
```

安装后重启桌面版（或 `dsh web`）即随 `web` profile 自启。

## 卸载

```powershell
dsh plugin --profile web remove dsh-w-custom-plugins
```
