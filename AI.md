# React KUI AI 辅助开发

图标属性注意：`Button.icon` 接收从 `kui-icons` 导入的 `IconType[]` 图标数据。例如 `import { Search } from 'kui-icons'` 后使用 `<Button icon={Search} />`，不要传 `<Icon type={Search} />`、组件函数或图标名称字符串。自定义 JSX 放在 Button 的 children 中；Input 的 prefix/suffix 接收渲染内容，与 Button.icon 不是同一种接口。

用于帮助 AI **使用 react-kui 开发 React 应用**。支持 React 19.2+，npm 包名为 `react-kui`；不是 `kui-react`，也不是 Vue 插件。

## 接入

```bash
pnpm add react-kui kui-icons
pnpm exec react-kui-ai init
```

初始化会追加项目 `AGENTS.md` 的 React KUI 使用约定，保留已有内容，重复执行不重复写入。Agent Skill 位于 `node_modules/react-kui/ai/skills/react-kui`，可按所用客户端的 Skill 安装方式接入。

在支持 stdio MCP 的客户端中添加服务，并将工作目录设置为已安装 react-kui 的应用目录：

```json
{
  "mcpServers": {
    "react-kui": {
      "command": "pnpm",
      "args": ["exec", "react-kui-mcp"]
    }
  }
}
```

不同客户端的配置位置不同；以上是服务启动参数，不要求编辑某个固定的全局配置文件。

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
