
<p align="center">
    <a href="https://react.k-ui.cn">
        <img width="100" src="https://chuchur.com/kui/react/logo.svg">
    </a>
</p>
<h1 align="center">
   KUI for React   
</h1>

<div align="center">

A high quality UI components Library with React.js

[![View UI](https://img.shields.io/npm/v/react-kui.svg?style=flat-square)](https://www.npmjs.org/package/react-kui)
[![NPM downloads](http://img.shields.io/npm/dm/react-kui.svg?style=flat-square)](https://npmjs.org/package/react-kui)
[![NPM downloads](https://img.shields.io/npm/dt/react-kui.svg?style=flat-square)](https://npmjs.org/package/react-kui)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/react-kui/dist/k-ui.js?compression=gzip&label=gzip%20size:%20JS&style=flat-square)
![CSS gzip size](http://img.badgesize.io/https://unpkg.com/react-kui/dist/k-ui.css?compression=gzip&label=gzip%20size:%20CSS&style=flat-square)

![](https://k-ui.cn/img/theme.jpg)
</div>

## Docs   
[2.x](https://react.k-ui.cn)

## Features
Dozens of useful and beautiful components.    
Friendly API. It's made for people with any skill level.    
Extensive documentation and demos.    
It is quite beautiful.   


## Compatibility
Supports React.js 16.x +
Supports SSR   
Supports TypeScript   
Supports Electron   
Most components and features support IE9 and above browsers, some   components and features do not support IE


## Install

Using npm:
```bash
npm install react-kui
```


Example :

```tsx
import React from 'react'
import {render} from 'react-dom'
import { Button ,Message } from 'react-kui'
import 'react-kui/dist/k-ui.css'

class App extends React.Component {

  test = ()=>{
    Message.info('Hello World !!')
  }

  render(){
    <Button onClick={()=>this.test()}>Hello</Button>
  }
}

render(<App />,document.getElementById('app'))
```


## Ecosystem Links
[KUI for Vue.js](https://k-ui.cn)    

[KUI for mobile](https://gitee.com/chuchur/kui-vue-mobile)


## License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, Chuchur