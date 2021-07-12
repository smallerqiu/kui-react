# 在 react 中使用
## 安装和初始化

[create-react-app](https://github.com/facebookincubator/create-react-app) 是业界最优秀的 React 应用开发工具之一，本文会尝试在 create-react-app 创建的工程中使用 antd 组件，并自定义 webpack 的配置以满足各类工程化需求。

```sh
$ npm install -g create-react-app
# OR
$ yarn global add create-react-app
```

初始化一个项目

```sh
$ npm init react-app kui-demo
# OR
$ npx create-react-app kui-demo
# OR
$ yarn create react-app kui-demo
```

#### 初始化完成目录结构
```
kui-demo
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── logo.svg
└── yarn.lock
```

从 yarn 或 npm 安装并引入 react-kui。

```sh
$ npm install react-kui
#or
$ yarn add react-kui
```

修改 src/App.js，引入 kui 的按钮组件。

```js
import React from 'react';
import { Button } from 'react-kui';


const App = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export default App;
```

修改 src/App.css，在文件顶部引入 react-kui/dist/k-ui.css。

```css
@import '~react-kui/dist/k-ui.css';
```

接下来就可以继续选用其他组件开发应用了。其他开发流程你可以参考 [create-react-app](https://create-react-app.dev/docs/getting-started) 的官方文档。

 
## 自定义主题

首先把 `src/App.css` 文件修改为 `src/App.less`，然后修改样式引用为 less 文件。

```js
/* src/App.js */
- import './App.css';
+ import './App.less';
```

```css
/* src/App.less */
- @import '~react-kui/dist/k-ui.css';
+ @import '~react-kui/components/style/index.less';
```