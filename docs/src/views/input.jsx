import React from 'react'
import Demo from '../components/demo'

import code from '../code/input'
import { Input, Row, Col, Message } from '@/'
export default class input extends React.Component {
  iconClick() {
    Message.info("点击图标事件");
  }
  render() {
    return <div>
      <h2>Input 输入框</h2>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12" >
          <Demo title="基础用法" layout='vertical'>
            <div>
              <Input width="200" placeholder="请输入内容..." /> <br/>
              <Input width="200" placeholder="disabled..." disabled />
            </div>
            <div>基础用法</div>
            <div>{code.base}</div>
          </Demo>
          <Demo title="可清除" layout='vertical'>
            <div>
              <Input width="200" placeholder="请输入内容..." clearable />
            </div>
            <div>通过设置
          <code>clearble</code>属性可控制是否显示清空按钮</div>
            <div>{code.clearable}</div>
          </Demo>
          <Demo title="带图标" layout='vertical'>
            <div>
              <Input width="200" placeholder="请输入用户名" icon="ios-person" iconAlign='left' onIconClick={this.iconClick} /><br />
              <Input width="200" placeholder="请输入内容..." icon="ios-search" onIconClick={this.iconClick} />
            </div>
            <div>通过设置
          <code>icon</code>属性，可设置按钮图标，
          <code>iconClick</code>可触发图标点击事件</div>
            <div>{code.withIcon}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo title="尺寸" layout='vertical'>
            <div>
              <Input width="200" placeholder="请输入内容..." /><br />
              <Input width="200" mini placeholder="mini..." icon="ios-person" onIconClick={this.iconClick} />
            </div>
            <div>通过设置
          <code>mini</code>可设置组件大小，
          <code>width</code>属性可控制组件宽度</div>
            <div>{code.size}</div>
          </Demo>
          <Demo title="文本域" layout='vertical'>
            <div>
              <Input width="300" type="textarea" rows="4" placeholder="请输入内容..." /> <br />
              <Input width="300" type="textarea" rows="1" placeholder="请输入内容..." />
            </div>
            <div>当
          <code>type</code>属性取值为
          <code>textarea</code>时组件呈现文本玉</div>
            <div>{code.textArea}</div>
          </Demo>
        </Col>
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
              <td>type</td>
              <td>输入框类型，可选值为 text、password、textarea、url、email、date</td>
              <td>String</td>
              <td>text</td>
            </tr>
            <tr>
              <td>width</td>
              <td>组件的宽度</td>
              <td>String,Number</td>
              <td>200</td>
            </tr>
            <tr>
              <td>value </td>
              <td>组件取值 </td>
              <td>String | Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>icon </td>
              <td>输入框尾部图标，仅在 text 类型下有效 </td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>iconAlign</td>
              <td>输入框图标位置，可选值为left、right，仅在 type=text 类型下有效 </td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td>占位文本 </td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>设置输入框为禁用状态</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>readonly</td>
              <td>设置输入框为只读</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>maxlength</td>
              <td>最大输入长度</td>
              <td>Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>rows</td>
              <td>文本域默认行数，仅在 textarea 类型下有效</td>
              <td>Number</td>
              <td>2</td>
            </tr>
            <tr>
              <td>number</td>
              <td>将用户的输入转换为 Number 类型</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>autoComplete</td>
              <td>原生的自动完成功能，可选值为 off 和 on</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>onIconClick</td>
              <td>icon的点击事件</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div >
  }
}

