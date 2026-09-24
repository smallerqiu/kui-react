# React KUI AI 辅助开发

用于帮助 AI **使用 react-kui 开发 React 应用**。支持 React 19.2+。

## 接入

```bash
pnpm add react-kui kui-icons
pnpm exec react-kui-ai init
```

初始化会追加项目 `AGENTS.md` 的 React KUI 使用约定，保留已有内容，重复执行不重复写入。Agent Skill 位于 `node_modules/react-kui/ai/skills/react-kui`，可按所用客户端的 Skill 安装方式接入。

先确认项目已安装提供 MCP 命令的 `react-kui` 版本，并在终端查询 Node 可执行文件的绝对路径：

```bash
node -p "process.execPath"
```

下面适用于支持 `mcpServers` JSON 格式的 stdio MCP 客户端：

```json
{
  "mcpServers": {
    "react-kui": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/project/node_modules/react-kui/ai/mcp.mjs"]
    }
  }
}
```

将 `command` 替换为查询到的 Node 路径，将 `args` 中的脚本路径替换为你项目中的绝对路径。路径含空格也保持为一个字符串；Windows 路径可使用正斜杠，例如 `C:/Program Files/nodejs/node.exe`。这种方式不依赖客户端的启动目录，也不要求使用 pnpm。如果客户端能找到 Node，也可以将 `command` 写成 `node`。

只有在客户端能找到 Node 和 pnpm，且工作目录明确设为已安装该包的应用目录时，才使用 `"command": "pnpm"` 和 `"args": ["exec", "react-kui-mcp"]`。

配置文件的位置和格式取决于客户端；不支持 `mcpServers` 格式的客户端，请在 MCP 设置中填写相同的启动命令和参数。保存后重新连接，确认工具列表包含 `search_components` 和 `get_component_api`。服务通过标准输入/输出通信，不会打开网页；在终端启动后等待输入是正常状态。

## React 的使用约定

- 使用具名导入，并在入口引入一次 `react-kui/style/index.css`。
- 使用 JSX/TSX、`className` 和回调属性。
- Input 的 `onChange` 接收值，不是 DOM Event；它采用同步本地状态机制，不要假设所有输入组件都等同于原生严格受控输入。
- Switch 使用 `checked/onChange`；Modal 使用 `open/onOpenChange`。
- Form 传入 `model` 后，需要在 `onChange(nextModel)` 中更新 React state。FormItem 的 `prop` 负责字段绑定。`onSubmit` 接收 `{ valid }`。
- Button 的原生表单类型是 `htmlType`；图片组件导出名为 `KImage`。

这些约定随版本发布在 `ai/behaviors.json` 和生成的元数据中。

## 查询和验证

MCP 提供分页搜索、按章节查询 API、单个示例读取和业务模板。默认 API 响应不包含全部示例源码和庞大的原生属性列表。

- `search_components({ query, offset?, limit? })`：默认 10 条，最多 20 条。
- `get_component_api({ name, section? })`：`all`、`props`、`events`、`renderProps`、`behavior`。
- `list_component_examples({ name })` → `get_component_example({ name, id })`：按需读取原有文档示例；相对导入按示例原目录解析。
- `list_templates()` → `get_template({ id })`：获取完整业务模板。
- `validate_kui_usage({ source })`：解析 JSX/TSX，检查已知组件导入、属性名、回调属性、字面量值、明确必填项，支持具名导入别名及命名空间导入。

校验器不会执行表达式，也不替代 TypeScript。`valid` 只表示未发现静态错误；`complete: false`、`skipped` 和 `nextStep` 会说明动态表达式、展开属性、自定义包装组件等限制。应用仍需运行 `tsc --noEmit` 和交互测试。

## 可运行的业务模板

`ai/templates/` 包含三个使用局部导入的 TSX 文件：

- `form`：必填/邮箱校验、保存、防重复提交、重置和禁用。
- `table`：搜索、分页、加载/错误状态和过期请求保护。
- `modal-editor`：新增/编辑、草稿隔离、校验、保存和取消。

入口引入样式后，可将模板保存为 `App.tsx` 直接运行。请求使用本地模拟，接入生产业务时替换为自己的 API。

## 版本化资源与维护

npm 导出：`react-kui/metadata`、`react-kui/metadata/schema`、`react-kui/skill`。

站点构建会发布 `llms.txt`、`llms-full.txt`、`kui-components.json` 和 `schema/kui-components.schema.json`。优先读取安装版本的资源，线上资源可能对应更新的版本。

```bash
pnpm generate:ai
pnpm check:ai-assets
pnpm check:ai
```

元数据从 React 的公开导出、TypeScript Props 和真实文档示例生成。默认表达式只在可确定提取时提供，不代表所有运行时默认行为。行为约定重点覆盖表单、输入、弹层、表格、分页、菜单等核心组件。

AI 生成与校验命令限制 Node 堆，测试按单工作进程运行，避免在低内存机器上并发启动重任务。无需运行完整构建即可更新 AI 资源。

## AI 场景评测

`pnpm check:ai-evals` 检查 26 个固定场景的组件使用、API 和完整源码类型（Vue 使用 vue-tsc），已接入仓库验证。现有 AI 模板测试另行验证表单、分页表格和弹窗交互；静态通过不等于业务行为正确。

模型评测按需运行，可接入自己的模型工具：

```bash
pnpm eval:ai --generator /absolute/path/to/model-adapter --model your-model-version
```

可信 adapter 从 stdin 接收 JSON（需求、Skill 和相关组件 API，不含参考答案），在 stdout 返回完整源码；由 adapter 管理凭证并调用模型。CI 不调用付费模型。生成代码只解析和类型检查，不会被直接执行。

也可以先导出需求，再评测保存的模型回答：

```bash
pnpm eval:ai --export-prompts .ai-eval-results/prompts.json
pnpm eval:ai --responses /path/to/responses.json --model your-model-version
```

responses.json 是以用例名为键、源码字符串为值的对象。`--case primary-action` 选择单例，`--out report.json` 保存不同版本报告。报告记录模型、场景/上下文哈希、逐例错误、跳过项、源码和静态通过率，不将其表述为语义或运行时通过率。完整接入协议见仓库 `ai/evals/README.md`。
