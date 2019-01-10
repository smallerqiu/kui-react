import React from 'react'
import Code from '../components/code'
export default class theme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: `//引入 styles
@import '/react-kui/src/styles/index.less';

// 主色覆盖为 ff0055
@main :#ff0055;

// 组件的圆角覆盖为5px
@radius:~'5px';`,
      b: `import React from 'react'
import Render from 'react-dom'
import {Button} from 'react-kui';
import 'assets/styles/custom.less';

Render.render(<Button>React KUI</Button>, document.getElementById('app')`
    }
  }
  render() {
    let { a, b } = this.state;
    return <div className="theme">
      <h2>定制主题</h2>
      <p>主题可以根据自己的喜好，和项目定制的风格来开发，可以定制颜色和圆角风格。</p>
      <img src={require('../assets/theme.jpg')} />
      <br />
      <h3>覆盖定制</h3>
      <p>如果项目使用webpack构建，可以通过覆盖less变量来定制主题</p>
      <p>新建一个less 文件 如：'assets/styles/custom.less',写下如下内容：</p>
      <Code>
        {a}
      </Code>
      <p>然后在入口文件 app.jsx 内导入这个 less 文件即可：</p>
      <Code>
        {b}
      </Code>
    </div>
  }
}