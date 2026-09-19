# 快速上手

KUI React 的 npm 包名是 `react-kui`。在 React 项目中直接导入组件，在应用入口引入一次样式即可使用。组件附带 TypeScript 类型声明，以下示例使用 TSX。

## 1. 准备 React 项目

已有项目可以跳到安装步骤。新项目可以使用 Vite 的 React + TypeScript 模板：

```bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
```

当前组件库面向 React 19，已有项目请将 `react` 和 `react-dom` 一起更新到最新的 19.x 版本：

```bash
pnpm add react@^19 react-dom@^19
```

TypeScript 项目同时使用对应的 React 类型：

```bash
pnpm add -D @types/react@^19 @types/react-dom@^19
```

## 2. 安装组件库并引入样式

```bash
pnpm add react-kui
```

在 `src/main.tsx` 中引入完整样式并挂载应用：

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-kui/style.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

这里的 `root` 对应 Vite 模板 `index.html` 中的 `<div id="root"></div>`。样式只需在入口加载一次，应用自己的覆盖样式可以放在它之后。

## 3. 使用组件和事件

将下面示例的内容保存为 `src/App.tsx`。组件通过具名导入使用，事件使用 `onClick` 等 JSX 属性传入函数；组件代码可以由支持 tree-shaking 的构建工具裁剪，上一步引入的是完整样式。

[组件与点击事件](./buttons.tsx?show=vertical)

启动开发服务：

```bash
pnpm dev
```

需要图标时，再在应用中声明图标依赖：

```bash
pnpm add kui-icons
```

```tsx
import { Plus } from "kui-icons";
import { Button } from "react-kui";

export default function AddButton() {
  return <Button icon={Plus}>新增</Button>;
}
```

图片组件导出名为 `KImage`，可以使用 React 的导入别名。Switch 也直接作为 JSX 组件使用，无需额外注册：

[组件名称与导入别名](./image.tsx?show=vertical)

## 4. 用 React state 同步组件值

输入组件的 `onChange` 通常直接返回值。以 Input 为例，参数是字符串，可以直接交给 `setState`，无需从 `event.target.value` 读取。

[输入值与开关状态](./value.tsx?show=vertical)

| 场景                        | 属性和回调              | 行为                                                                                                                                    |
| --------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Input、Select 等值输入组件  | `value` / `onChange`    | `value` 初始化组件，并在外部值变化时同步；用户操作也会更新组件内部值。需要父子同步时配合 React state 使用。                             |
| Switch、Checkbox 等勾选组件 | `checked` / `onChange`  | 传入 `checked` 后由父组件控制状态；只设置初始状态时使用 `defaultChecked`。Switch 回调直接返回值，Checkbox 回调返回含 `checked` 的对象。 |
| Modal、Drawer 等显隐组件    | `open` / `onOpenChange` | 传入 `open` 后由父组件控制显隐；只设置初始状态时使用 `defaultOpen`。                                                                    |

固定的 `value` 不会锁定 Input；要禁止编辑，请使用 `disabled` 或 `readOnly`。更新数组或对象值时创建新值，避免直接修改原对象。各组件的回调参数以其 API 为准，例如 Checkbox 可以写成 `onChange={({ checked }) => setChecked(checked)}`。

## 5. 通过 Form 绑定字段

Form 使用 `model` 和 `onChange` 同步表单对象，FormItem 的 `prop` 对应字段名。受支持的输入组件放在 FormItem 中后，由表单绑定值和变更事件，无需再为每个字段重复传入 `value`。

[表单字段与禁用状态](./form.tsx?show=vertical)

`Form disabled` 会传递给表单控件，包括没有 `prop` 的控件。子控件显式传入 `disabled={false}` 时可以覆盖表单设置。校验、嵌套字段和提交方法见 [Form 文档](/components/form)。

## 6. 可选的全局配置

使用 ConfigProvider 为组件树设置语言、尺寸和外观。配置只影响其后代组件，可以嵌套使用，组件自身的显式属性优先。

```tsx
import { Button, ConfigProvider } from "react-kui";
import en from "react-kui/locale/en";

export default function App() {
  return (
    <ConfigProvider locale={en} size="small" theme="outline">
      <Button>Default size: small</Button>
      <Button size="large">Override: large</Button>
    </ConfigProvider>
  );
}
```

`theme` 的 `fill`、`outline`、`plain` 表示组件外观；页面的深浅色切换见 [暗色模式](/guide/dark-mode)。更多配置见 [ConfigProvider](/components/config)，组件和类型都从 `react-kui` 导入，语言资源从 `react-kui/locale/*` 导入。
