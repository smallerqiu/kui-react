# 快速上手

在开始之前，如果您刚开始接触React，建议您先细看 React及其相关文档： [react](https://reactjs.org)，[redux](https://redux.js.org/)，[react-router](https://reactrouter.com/web/guides/quick-start)，[create-react-app](https://create-react-app.dev/docs/getting-started/),[css-transition](http://reactcommunity.org/react-transition-group/css-transition)


#### 1.安装脚手架

[create-react-app](https://create-react-app.dev/docs/getting-started/)

```sh
$ npm install -g create-react-app
# OR
$ yarn global add create-react-app
```

#### 2. 初始化一个项目

#### 使用 npx 
```sh
$ npx create-react-app kui-demo
```
#### 使用 npm

```sh
$ npm init react-app kui-demo
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

#### 安装 KUI
从 yarn 或 npm 安装并引入 kui-vue。

```sh
$ npm install react-kui
#or
$ yarn add react-kui
```
#### 3. 使用组件

直接用下面的代码替换 `index.js` 的内容:

```js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import 'react-kui/dist/k-ui.css';
import { Button, Modal } from 'react-kui';

const App = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setVisible(true)} type="primary">Open Modal</Button>
      <Modal title="Title"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >Content</Modal>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

以上代码便完成了 Kui 的引入。注意: 样式文件需要单独引入。

### 兼容性
Kui React 支持所有的现代浏览器和 IE9+。

对于 IE 系列浏览器，需提供 [es5-shim](https://github.com/es-shims/es5-shim) 和 [es6-shim](https://github.com/paulmillr/es6-shim) 等 Polyfills 的支持。

如果你使用了 babel，强烈推荐使用 [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) 和 [babel-plugin-transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) 来替代以上两个 shim。

### 按需加载 

可以通过以下的写法来按需加载组件。

```js
import { Button } from 'react-kui';
```