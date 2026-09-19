# 验证与发布

仓库使用 `package.json` 中指定的 pnpm 版本及 Node.js 24。CI 不再单独指定不同的 pnpm 版本。

## 日常检查

```bash
pnpm install --frozen-lockfile
pnpm check
```

`check` 包含零警告 lint、API 文档、项目/业务模板类型检查、AI 资源一致性及全部测试。
修改 Props、示例、版本号或行为约定后，先执行 `pnpm generate:ai`，再检查并提交生成文件。

`pnpm verify` 依次执行检查、库构建、文档构建及包内容检查。Node 重任务堆限制为 2 GiB，测试单 worker，Terser 单 worker，Less 不启动 worker。此限制不是整机内存上限；8 GB 机器仍建议关闭其他重任务，或让 GitHub CI 完成构建。

`pnpm package:smoke` 会打包当前产物，在临时目录安装 tarball，并使用 React 19.2.0 验证 ESM/CJS、Select 空值渲染、样式导出、类型声明、AI CLI 和 MCP。需要联网安装依赖，运行前先 `pnpm build:lib`。设置 `SMOKE_REACT_VERSION` 可验证其他 React 19.x 版本。

## 首次配置 npm 发布

1. 在 GitHub 仓库创建 `npm` environment，配置 required reviewers 和允许的版本 tag。
2. 在 npm 的 `react-kui` 包设置中添加 GitHub Actions trusted publisher：owner `smallerqiu`，repository `kui-react`，workflow `release.yml`，environment `npm`，允许 publish。
3. 流程使用 GitHub-hosted runner 和 Node 24 所带的新版 npm，通过 OIDC 发布，不需要保存长期 npm token。npm 的 trusted publisher 和 GitHub environment 配置需要仓库/包管理员在网页完成。

参考：[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)。

## 发布步骤

1. 选择尚未发布的版本号，更新 `package.json` 和中英文更新日志。正式版移除 prerelease 后缀；测试版例如 `3.1.0-rc.1` 使用 `next`。
2. 执行 `pnpm generate:ai`，提交全部源码、锁文件和 AI 资源。让 CI 通过。
3. 在 Actions → Release 手动运行，保持 `publish=false`，下载并检查 `npm-package` 产物。
4. 为审核后的提交创建与包版本相同的 tag（例如 `v3.1.0`），推送 tag。
5. 使用 CLI 在该 tag 上运行流程：

   ```bash
   gh workflow run release.yml --ref v3.1.0 -f publish=true -f dist_tag=latest
   ```

   将示例版本替换为实际版本；测试版使用 `dist_tag=next`。推送 tag 本身不会自动发布。

6. 审批 `npm` environment 中的发布任务。流程重新验证 tag、版本、更新日志，构建并测试 tarball，再发布同一个产物；不会在发布任务重新打包。

当前修改不自动确定新版本号，不创建 tag，也不触发 npm 发布。版本占用由 npm 最终检查，同一个版本不能覆盖发布。
