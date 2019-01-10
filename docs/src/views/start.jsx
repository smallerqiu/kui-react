import React from 'react'
import Code from '../components/code'
import code from '../code/start'
export default class start extends React.Component {
  render() {
    return <div>
      <h2>快速上手</h2>
      <h3>安装</h3>
      <p>使用npm方式安装</p>
      <Code lang="js javascript">
      npm install react-kui
      </Code>
      <h3>使用</h3>
      <Code lang="js javascript">
      {code.webpack}
      </Code>
    </div>
  }
}
