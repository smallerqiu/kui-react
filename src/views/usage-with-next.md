# 服务端渲染支持

KUI React 可用于 React 的服务端渲染框架。以下以 Next.js App Router 为例。

## 安装

```bash
pnpm add react-kui kui-icons
```

在根布局中引入全局样式：

```tsx
// app/layout.tsx
import "react-kui/style";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
```

包含浏览器交互的组件应在 Client Component 中使用：

```tsx
"use client";

import { Button } from "react-kui";

export default function Demo() {
  return <Button type="primary">KUI React</Button>;
}
```
