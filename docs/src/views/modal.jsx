import React, { Component } from 'react'
import Demo from '../components/demo'
import { Button, Modal } from '@/' 

import code from '../code/modal'
export default class modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      color: "",
      icon: "success",
      d1: false,
      d2: false,
      d3: false,
      d4: false,
      d5: false,
      d6: false,
    }
  }
  onShow(type) {
    this.setState({
      icon: type,
      d6: true,
      color: type == "happy" ? "orange" : ""
    })
  }
  onOpen(key) {
    let obj = {}
    obj[key] = true
    this.setState(obj)
  }
  onClose(key) {
    let obj = {}
    obj[key] = false
    this.setState(obj)
  }
  render() {
    let { d1, d2, d3, d4, d5, d6, icon, color } = this.state
    return <div>
      <h2>Modal 对话框</h2>
      <h3> </h3>
      <Demo title="基础">
        <div>
          <Button onClick={this.onOpen.bind(this,'d1')}>普通对话框</Button>
          <Modal visible={d1} onClose={this.onClose.bind(this,'d1')}></Modal>
        </div>
        <div>通过
        <code>visible</code>控制
        <code>Modal</code>是否展示</div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="自定义">
        <div>
          <Button onClick={this.onOpen.bind(this,'d2')}>自定义宽度</Button>
          <Button onClick={this.onOpen.bind(this,'d3')}>内容和页脚</Button>
          <Button onClick={this.onOpen.bind(this,'d4')}>按钮文字</Button>
          <Modal visible={d2} width="300" onClose={this.onClose.bind(this,'d2')}></Modal>
          <Modal visible={d3}
            title="我是自定义标题"
            footer={[<Button type="danger" key="1">自定义1</Button>, <Button type="success" key="2">自定义2</Button>]}
            onClose={this.onClose.bind(this,'d3')}>
            <p>我是自定义内容</p>
          </Modal>
          <Modal visible={d4} width="300" cancelText="不要取消" okText="别点我" onClose={this.onClose.bind(this,'d4')}></Modal>
        </div>
        <div>通过
        <code>title</code>来设置标题，
        <code>width</code>控制宽度， 还有
        <code>footer</code>展示自定义按钮
      </div>
        <div>{code.custom}</div>
      </Demo>
      <Demo title="可拖动">
        <div>
          <Button onClick={this.onOpen.bind(this,'d5')}>普通对话框</Button>
          <Modal visible={d5} isMove onClose={this.onClose.bind(this,'d5')}>我可以拖动的</Modal>
        </div>
        <div>有人想要拖动
        <code>Modal</code>，真奇葩，
        <code>isMove</code>就可以搞定的</div>
        <div>{code.canMove}</div>
      </Demo>
      <Demo title="Toast">
        <div>
          <Button onClick={this.onShow.bind(this,'success')}>Success</Button>
          <Button onClick={this.onShow.bind(this,'error')}>Error</Button>
          <Button onClick={this.onShow.bind(this,'warning')}>Warning</Button>
          <Button onClick={this.onShow.bind(this,'info')}>Info</Button>
          <Button onClick={this.onShow.bind(this,'ios-happy')}>happy</Button>
          <Modal visible={d6} isMove type="toast" icon={icon} color={color} onClose={this.onClose.bind(this,'d6')}>恭喜你中了5000万...</Modal>
        </div>
        <div>这个模式只是用来展示最后的结果，
        <code>type=toast</code>就可以了</div>
        <div>{code.mode}</div>
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
              <td>value</td>
              <td>对话框是否显示</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>title</td>
              <td>对话框标题</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>width</td>
              <td>对话框宽度</td>
              <td>Number,String</td>
              <td>520</td>
            </tr>
            <tr>
              <td>okText</td>
              <td>确定按钮文字</td>
              <td>String</td>
              <td>确定</td>
            </tr>
            <tr>
              <td>cancelText</td>
              <td>取消按钮文字</td>
              <td>String</td>
              <td>取消</td>
            </tr>
            <tr>
              <td>isMove</td>
              <td>弹框是否可拖动，type 为modal可以用</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>type</td>
              <td>弹框的模式，可选值为 modal，toast </td>
              <td>String</td>
              <td>modal</td>
            </tr>
            <tr>
              <td>icon</td>
              <td>弹框的图标，type为toast可用 ，默认可选值为success，warning,error,info,也可以自定义，参照
            <a href="#/icon">Icon</a>值 </td>
              <td>String</td>
              <td>success</td>
            </tr>
            <tr>
              <td>color</td>
              <td>弹框的图标的颜色，type为toast可用 </td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>onOk</td>
              <td>点击确定的回调</td>
              <td>Function</td>
              <td>-</td>
            </tr>
            <tr>
              <td>onCancel</td>
              <td>点击取消的回调</td>
              <td>Function</td>
              <td>-</td>
            </tr>
            <tr>
              <td>onClose</td>
              <td>窗口关闭的回调</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  }
}