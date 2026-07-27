<p align="center">
  <a href="https://react.k-ui.cn">
    <img width="100" src="https://cdn.chuchur.com/img/logo-kui.svg" alt="KUI Logo">
  </a>
</p>

<h1 align="center">React KUI</h1>

<div align="center">

A desktop UI component library built with React 19 and TypeScript

[![npm version](https://img.shields.io/npm/v/react-kui.svg?style=flat-square)](https://www.npmjs.com/package/react-kui)
[![npm downloads](https://img.shields.io/npm/dm/react-kui.svg?style=flat-square)](https://www.npmjs.com/package/react-kui)
[![license](https://img.shields.io/npm/l/react-kui.svg?style=flat-square)](./LICENSE)

English · [简体中文](README.zh-CN.md)

</div>

![React KUI theme preview](demo.png)

## Features

- Built for React 19 with modern React APIs
- Written in TypeScript with complete component type declarations
- 50+ desktop components covering general, layout, navigation, form, data display, and feedback scenarios
- Theme customization, dark mode, and multiple component sizes
- Built-in internationalization support and multilingual resources
- On-demand component usage for modern frontend toolchains such as Vite
- Support for modern browsers and Electron

## Documentation

- [Quick Start](https://react.k-ui.cn/guide/quick-started-en)
- [Components Overview](https://react.k-ui.cn/guide/components-en)
- [Dark Mode](https://react.k-ui.cn/guide/dark-mode-en)
- [Internationalization](https://react.k-ui.cn/guide/language-en)
- [Changelog](https://react.k-ui.cn/guide/change-log-en)

## Installation

Using pnpm:

```bash
pnpm add react-kui kui-icons
```

You can also use npm, Yarn, or Bun:

```bash
npm install react-kui kui-icons
yarn add react-kui kui-icons
bun add react-kui kui-icons
```

`react` and `react-dom` are peer dependencies. Your application should use React 19.

## Quick Start

Import the library stylesheet in your application entry, then use components directly:

```tsx
import { createRoot } from "react-dom/client";
import { Button, Space, message } from "react-kui";
import "react-kui/style/index.css";

function App() {
  return (
    <Space>
      <Button type="primary" onClick={() => message.success("Hello React KUI!")}>
        Primary
      </Button>
      <Button>Default</Button>
    </Space>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
```

Component props and events include TypeScript types and editor autocompletion:

```tsx
import { Cascader, type CascaderOption, type CascaderValue } from "react-kui";
import { useState } from "react";

const options: CascaderOption[] = [
  {
    value: "california",
    label: "California",
    children: [{ value: "san-francisco", label: "San Francisco" }],
  },
];

export default function Demo() {
  const [value, setValue] = useState<CascaderValue>([]);
  return <Cascader value={value} options={options} onChange={setValue} />;
}
```

## Local Development

```bash
git clone git@github.com:smallerqiu/kui-react.git
cd kui-react
pnpm install
pnpm dev
```

The documentation development server runs at [http://localhost:7006](http://localhost:7006) by default.

Common commands:

```bash
pnpm dev          # Start the documentation development server
pnpm typecheck    # Run TypeScript checks
pnpm build:docs   # Build the documentation site
pnpm build        # Build the component library and styles
```

## Browser Support

React KUI supports the latest two versions of major modern browsers, including Chrome, Edge, Firefox, and Safari. Internet Explorer is not supported.

## Contributing

Issues and pull requests are welcome. Before submitting code, please ensure that the type checks and relevant builds pass.

- [GitHub repository](https://github.com/smallerqiu/kui-react)
- [Gitee repository](https://gitee.com/chuchur/kui-react)
- [Issue tracker](https://gitee.com/chuchur/kui-react/issues)

## License

[MIT](./LICENSE)

Copyright © 2017-present Qiu
