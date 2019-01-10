import React from 'react'
import { Button, Switch, Row, Col } from '@/'
import Code from '../components/code/'
import Demo from '../components/demo/'
import code from '../code/switch'
export default class _Switch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: true,
    }
  }
  onChange(checked) {
    this.setState({
      checked: checked
    })
  }

  render() {
    return <div>
      <h2>Switch 开关</h2>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12">
          <Demo title="基本用法" layout="vertical">
            <div>
              <span style={{padding:'0 10px',width:50,display:'inline-block'}}>{this.state.checked.toString()}</span>
              <Switch value={this.state.checked} onChange={this.onChange.bind(this)} />
              {/* <!-- <Button onClick={this.test" mini>test</Button> --> */}
            </div>
            <div>可使用
          <code>value</code>切换选中状态</div>
            <div>{code.base}</div>
          </Demo>
          <Demo title="主题" layout="vertical">
            <div>
              <Switch value={true} />
              <Switch value={true} type="success" />
              <Switch value={true} type="danger" />
              <Switch value={true} type="warning" />
            </div >
            <div>设置
          <code>type</code>属性可改变组件主题</div>
            <div>{code.theme}</div>
          </Demo >
        </Col >
        <Col span="12">
          <Demo title="文字" layout="vertical">
            <div>
              <Switch value={false} trueText="是" falseText="否" />
            </div>
            <div>通过
          <code>trueText</code>和
          <code>falseText</code>设置选中和非选中呈现文字</div>
            <div>{code.text}</div>
          </Demo>
          <Demo title="禁用" layout="vertical">
            <div>
              <Switch value={false} disabled />
              <Switch value={true} disabled />
              <Switch value={true} disabled trueText="是" falseText="否" />
            </div >
            <div>通过
          <code>disabled</code>属性设置组件是否被禁用</div>
            <div>{code.disabled}</div>
          </Demo >
        </Col >
      </Row >
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
              <td>value</td>
              <td>指定当前是否选中</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>禁用开关 </td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>type</td>
              <td>主题颜色 可传入 success，warning，danger，primary </td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>trueText</td>
              <td>当value为true时 ，显示的文字</td>
              <td>String </td>
              <td>-</td>
            </tr>
            <tr>
              <td>falseText</td>
              <td>当value为false时 ，显示的文字</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>当value 改变时触发,返回true | false</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div >
  }
}

