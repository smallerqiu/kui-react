import React from 'react'
import Code from '../components/code'
import ColorPicker from '@/components/colorPicker'
export default class colorpicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: "#eeece1",
      code: `import {ColorPicker} from 'react-kui'
constructor(props) {
  super(props)
  this.state = {
    color: "#eeece1",
  }
}      
ReactDOM.render() {
  return <ColorPicker value={this.state.color} onChange={(color)=>this.setState({color})}></ColorPicker>
}`
    }
  }
  render() {
    let { color, code } = this.state
    return (<div>
      <h2>ColorPicker 颜色</h2>
      <h3>基础</h3>
      <p>数据模型是从offce 颜色组件扒下来的。</p>
      <p>{color}</p>
      <ColorPicker value={color} onChange={(color)=>this.setState({color})}></ColorPicker>
      <Code>{code}</Code>
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
              <td>绑定的值， </td>
              <td>String</td>
              <td>'#000000'</td>
            </tr>
            <tr>
              <td>transfer</td>
              <td>是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果</td>
              <td>Boolean</td>
              <td>true</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>当绑定值变化时触发，返回当前值</td>
              <td>Function</td>
              <td>-</td>
            </tr></tbody>
        </table>
      </div>
    </div>)
  }
}


