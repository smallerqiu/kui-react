# Server-side Rendering

KUI React can be used with React server-rendering frameworks. This example uses the Next.js App Router.

## Install

```bash
pnpm add react-kui kui-icons
```

Import the global stylesheet from the root layout:

```tsx
// app/layout.tsx
import "react-kui/style/index.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
```

Use interactive components from a Client Component:

```tsx
"use client";

import { Button } from "react-kui";

export default function Demo() {
  return <Button type="primary">KUI React</Button>;
}
```
