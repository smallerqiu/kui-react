import React from 'react'
import { Alert } from '@/index'
import Demo from '../components/demo'
// import Code from '../components/code'
import code from '../code/alert'
export default class alert extends React.Component {
  render() {
    return <div>
      <h2>Alert 警告提示</h2>
      <h3>代码示例</h3>
      <Demo title="基础">
        <div>
          <Alert type="success">Success Text</Alert>
          <Alert type="info">Info Text</Alert>
          <Alert type="warning">Warning Text</Alert>
          <Alert type="error">Error Text</Alert>
        </div>
        <div>通过
        <code>type</code>来控制展示类型</div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="图标">
        <div>
          <Alert type="success" showIcon>Success Text</Alert>
          <Alert type="info" showIcon>Info Text</Alert>
          <Alert type="warning" showIcon>Warning Text</Alert>
          <Alert type="error" showIcon>Error Text</Alert>
        </div>
        <div>
          <code>showIcon</code>来设置是否显示图标</div>
        <div>{code.icon}</div>
      </Demo>
      <Demo title="可关闭">
        <div>
          <Alert type="success" showIcon closable>Success Text</Alert>
          <Alert type="info" showIcon closable>Info Text</Alert>
          <Alert type="warning" showIcon closable>Warning Text</Alert>
          <Alert type="error" showIcon closable>Error Text</Alert>
        </div>
        <div>
          <code>closable</code>来控制是否显示可关闭按钮</div>
        <div>{code.close}</div>
      </Demo>
      <h3>API</h3>
      <div className="table-border">
        <table>
          <tbody>
            <tr>
              <th>属性</th>
              <th>说明</th>
              <th>类型</th>
              <th>默认值</th>
            </tr>
            <tr>
              <td>type</td>
              <td>按钮类型，可选值为success、info、warning、error或者不设置</td>
              <td>String</td>
              <td>warning</td>
            </tr>
            <tr>
              <td>showIcon</td>
              <td>是否显示图标</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>closable</td>
              <td>是否显示关闭按钮</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>onClose</td>
              <td>关闭时触发的回调函数 </td>
              <td>Function </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  }
}
