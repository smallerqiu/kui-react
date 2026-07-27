<p align="center">
  <a href="https://react.k-ui.cn">
    <img width="100" src="https://cdn.chuchur.com/img/logo-kui.svg" alt="KUI Logo">
  </a>
</p>

<h1 align="center">React KUI</h1>

<div align="center">

基于 React 19 和 TypeScript 的桌面端 UI 组件库

[![npm version](https://img.shields.io/npm/v/react-kui.svg?style=flat-square)](https://www.npmjs.com/package/react-kui)
[![npm downloads](https://img.shields.io/npm/dm/react-kui.svg?style=flat-square)](https://www.npmjs.com/package/react-kui)
[![license](https://img.shields.io/npm/l/react-kui.svg?style=flat-square)](./LICENSE)

[English](README.md) · 简体中文

</div>

![React KUI 主题预览](demo.png)

## 特性

- 基于 React 19，使用现代 React API 构建
- 使用 TypeScript 开发，提供完整的组件类型声明
- 50+ 桌面端组件，覆盖通用、布局、导航、表单、数据展示和反馈场景
- 支持主题定制、暗色模式和多种组件尺寸
- 内置国际化能力及多语言资源
- 支持按需使用组件，适用于 Vite 等现代前端工程
- 支持现代浏览器和 Electron

## 文档

- [快速开始](https://react.k-ui.cn/guide/quick-started)
- [组件总览](https://react.k-ui.cn/guide/components)
- [暗色模式](https://react.k-ui.cn/guide/dark-mode)
- [国际化](https://react.k-ui.cn/guide/language)
- [更新日志](https://react.k-ui.cn/guide/change-log)

## 安装

使用 pnpm：

```bash
pnpm add react-kui kui-icons
```

也可以使用 npm、Yarn 或 Bun：

```bash
npm install react-kui kui-icons
yarn add react-kui kui-icons
bun add react-kui kui-icons
```

`react` 和 `react-dom` 是 peer dependencies，项目需要使用 React 19。

## 快速开始

在应用入口引入组件库样式，然后直接使用组件：

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

组件 Props 和事件都带有 TypeScript 类型，可直接获得编辑器提示：

```tsx
import { Cascader, type CascaderOption, type CascaderValue } from "react-kui";
import { useState } from "react";

const options: CascaderOption[] = [
  {
    value: "hubei",
    label: "湖北省",
    children: [{ value: "wuhan", label: "武汉市" }],
  },
];

export default function Demo() {
  const [value, setValue] = useState<CascaderValue>([]);
  return <Cascader value={value} options={options} onChange={setValue} />;
}
```

## 本地开发

```bash
git clone git@github.com:smallerqiu/kui-react.git
cd kui-react
pnpm install
pnpm dev
```

文档开发服务器默认运行在 [http://localhost:7006](http://localhost:7006)。

常用命令：

```bash
pnpm dev          # 启动文档开发服务器
pnpm typecheck    # TypeScript 类型检查
pnpm build:docs   # 构建文档站
pnpm build        # 构建组件库及样式
```

## 浏览器支持

支持主流现代浏览器的最近两个版本，包括 Chrome、Edge、Firefox 和 Safari；不支持 Internet Explorer。

## 参与贡献

欢迎提交 Issue 和 Pull Request。在提交代码前，请确保类型检查和相关构建能够通过。

- [GitHub 仓库](https://github.com/smallerqiu/kui-react)
- [Gitee 仓库](https://gitee.com/smallerqiu/kui-react)
- [问题反馈](https://gitee.com/smallerqiu/kui-react/issues)

## 开源协议

[MIT](./LICENSE)

Copyright © 2017-present Qiu
