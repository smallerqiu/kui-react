# Quick Start

KUI React is a desktop component library built with React 19 and TypeScript.

## 1. Initialize a Project

```bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
```

## 2. Install and Use Components

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

Components support named imports. Import the stylesheet once from your application entry.

[Usage conventions](./buttons.tsx)

[Special components](./image.tsx)
