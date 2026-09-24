# React KUI AI 辅助开发

图标属性注意：`Button.icon` 接收从 `kui-icons` 导入的 `IconType[]` 图标数据。例如 `import { Search } from 'kui-icons'` 后使用 `<Button icon={Search} />`，不要传 `<Icon type={Search} />`、组件函数或图标名称字符串。自定义 JSX 放在 Button 的 children 中；Input 的 prefix/suffix 接收渲染内容，与 Button.icon 不是同一种接口。

用于帮助 AI **使用 react-kui 开发 React 应用**。支持 React 19.2+，npm 包名为 `react-kui`；不是 `kui-react`，也不是 Vue 插件。

## 接入

```bash
pnpm add react-kui kui-icons
pnpm exec react-kui-ai init
```

初始化会追加项目 `AGENTS.md` 的 React KUI 使用约定，保留已有内容，重复执行不重复写入。Agent Skill 位于 `node_modules/react-kui/ai/skills/react-kui`，可按所用客户端的 Skill 安装方式接入。

先在应用项目中安装 `react-kui` 及其依赖（见上面的安装命令），并确认安装版本包含
`node_modules/react-kui/ai/mcp.mjs`。不要只复制这个脚本，它还需要同包的元数据和依赖。

在项目终端中运行以下命令，取得 Node 的绝对路径：

```bash
node -p "process.execPath"
```

在支持 stdio MCP 的客户端中配置服务。下面是支持 `mcpServers` 格式的客户端示例；
其他客户端请通过 MCP 设置填写相同的 command 和 args，不要直接照搬整个 JSON：

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

将 command 替换为上面输出的 Node 路径，将 args 替换为你项目中脚本的绝对路径。
路径含空格也仍是一个字符串参数。Windows JSON 路径使用正斜杠或转义反斜杠，例如
`C:/Program Files/nodejs/node.exe`。该方式不依赖客户端的启动工作目录，也不要求使用 pnpm。

如果客户端能找到 Node，也可以使用 `"command": "node"`。
只有在客户端能找到 pnpm、且明确将工作目录设为已安装该包的项目目录时，
才使用 `"command": "pnpm"` 和 `"args": ["exec", "react-kui-mcp"]`。

### 验证与排错

1. 先在终端用上述 Node 和脚本路径启动服务。它通过标准输入/输出通信，
   不会打开网页，也不会主动打印“启动成功”；等待输入是正常状态，按 Ctrl+C 退出。
2. 保存客户端配置并重新连接服务。确认初始化成功、工具列表包含
   `search_components` 和 `get_component_api`。
3. 查询 `get_component_api({ "name": "Button" })`，确认能返回组件 API。
   这验证连接和资源读取，不代表所有组件交互都已验证。

若提示找不到 node/pnpm，请检查 command 的绝对路径及客户端环境；
找不到脚本，请检查项目路径、依赖安装和包版本；
脚本缺少依赖或元数据，请用项目的包管理器恢复完整安装，不要单独搬运脚本。
终端可运行但客户端失败时，查看客户端日志中的启动命令和握手错误。
项目路径或 Node 安装路径变更后也需要更新配置。

## React 的使用约定

- 使用具名导入，并在入口引入一次 `react-kui/style/index.css`。
- 使用 JSX/TSX、`className` 和回调属性，不使用 Vue 的 `v-model`、插槽或 `app.use`。
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
- `validate_kui_usage({ source })`：解析 JSX/TSX，检查已知组件导入、属性名、回调属性、字面量值、明确必填项和 Vue 写法误用，支持具名导入别名及命名空间导入。

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

## 不配置 MCP 也可以查询

`react-kui/metadata` 和 `react-kui/skill` 是 npm 包的导出路径，**不是目录**。
可以运行 `node -p "require.resolve('react-kui/metadata')"` 定位文件，也可以使用
下面的 `paths` 命令。开始实现前先阅读返回路径中的 Skill。

```bash
pnpm exec react-kui-ai paths
pnpm exec react-kui-ai search Input --limit 5
pnpm exec react-kui-ai api Input --section props
pnpm exec react-kui-ai api Input --section behavior
pnpm exec react-kui-ai examples Input
pnpm exec react-kui-ai templates
pnpm exec react-kui-ai migration vue-to-react
pnpm exec react-kui-ai migration react-to-vue
pnpm exec react-kui-ai validate src/App.tsx
```

从 examples 结果取得 ID 后，用 `example Input <id>` 读取单个示例；
用 `template <id>` 读取业务模板。`query <工具名> '<JSON>'` 与 MCP 共用查询逻辑
和参数校验，无需启动 MCP。结果为 JSON；参数错误或校验不通过返回非零退出码。
`validate -` 可以读取标准输入，仍不能替代类型检查和交互测试。

升级依赖后重新执行 `init`，会更新 AGENTS.md 中带标记的托管区域，保留区域外的
项目规则。旧版没有标记的段落仅迁移能精确识别的生成行；修改过的自定义文本保留，
需要自行检查是否过时。项目规则应放在托管区域外，标记损坏时命令报错且不写入。

组件元数据不覆盖所有工具导出，例如 theme 还需查安装版本的声明。
迁移前按方向运行 `migration vue-to-react` 或 `migration react-to-vue` 阅读差异指南，核对绑定、回调、插槽与交互，
不要把类型检查通过当作迁移验收。
