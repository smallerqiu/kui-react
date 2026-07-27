# 快速上手

KUI React 是基于 React 19 和 TypeScript 的桌面端组件库。

## 1. 初始化项目

```bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
```

## 2. 安装并使用组件

```bash
pnpm add react-kui kui-icons
```

```tsx
import { createRoot } from "react-dom/client";
import { Button } from "react-kui";
import "react-kui/style/index.css";

createRoot(document.getElementById("root")!).render(
  <Button type="primary">Hello KUI</Button>
);
```

组件支持按需导入，样式文件需要在应用入口中引入。

[使用规范](./buttons.tsx)

[特殊组件](./image.tsx)
