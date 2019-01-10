import React, { Component } from 'react'
import { Button, Select, Row, Col } from '@/'
const Option = Select.Option
import Demo from '../components/demo'
import code from '../code/select'

export default class select extends Component {
  constructor(props) {
    super(props)
    this.state = {
      select: "0", select1: 1, select2: 2, select3: 3, select4: 4,
      data: [
        { label: "苹果🍎", value: 0 },
        { label: "橘子🍊", value: 1 },
        { label: "香蕉🍌", value: 2 },
        { label: "栗子🌰", value: 3 },
        { label: "葡萄🍇", value: 4 }
      ]
    }
  }
  onClear() {
    this.setState({ select: '' })
  }

  onChange(key, value) {
    let obj = {}
    obj[key] = value
    this.setState(obj)
  }
  render() {
    return <div>
      <h2>Select 选择器</h2>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12">
          <Demo title="基础用法">
            <div>
              <Select width="200" value={this.state.select} onChange={v => this.onChange('select', v)}>
                {
                  this.state.data.map((child, index) => {
                    return (<Option key={index} value={child.value}>{child.label}</Option>)
                  })
                }
              </Select>
              <Button onClick={this.onClear.bind(this)}>清除</Button>
              <Button onClick={() => this.onChange('select', '1')}>选中橘子</Button>
            </div>
            <div><code>value</code>为当前选中的项</div>
            <div> {code.base}</div>
          </Demo>
          <Demo title="尺寸">
            <div>
              <Select width="200" value={this.state.select1} onChange={v => this.onChange('select1', v)}>
                {
                  this.state.data.map((child, index) => {
                    return (<Option key={index} value={child.value}>{child.label}</Option>)
                  })
                }
              </Select>
              <Select width="200" value={this.state.select1} mini onChange={v => this.onChange('select1', v)}>
                {
                  this.state.data.map((child, index) => {
                    return (<Option key={index} value={child.value}>{child.label}</Option>)
                  })
                }
              </Select>
            </div>
            <div>通过 <code>width</code>和 <code>mini</code>可控制组件尺寸大小</div>
            <div> {code.size}</div>
          </Demo>
          <Demo title="可清除">
            <div>
              <Select width="200" clearable value={this.state.select2} onChange={v => this.onChange('select2', v)}>
                {
                  this.state.data.map((child, index) => {
                    return (<Option key={index} value={child.value}>{child.label}</Option>)
                  })
                }
              </Select>
              <Select width="200" clearable mini value={this.state.select2} onChange={v => this.onChange('select2', v)}>
                {
                  this.state.data.map((child, index) => {
                    return (<Option key={index} value={child.value}>{child.label}</Option>)
                  })
                }
              </Select>
            </div>
            <div>通过<code>clearable</code>可控制组件是否显示清除按钮</div>
            <div> {code.clearable}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo title="可搜索">
            <div>
              <Select width="200" filterable value={this.state.select3} onChange={v => this.onChange('select3', v)}>
                {
                  this.state.data.map((child, index) => {
                    return (<Option key={index} value={child.value}>{child.label}</Option>)
                  })
                }
              </Select>
            </div>
            <div>通过<code>filterable</code>可设置组件是否呈现搜索模式</div>
            <div> {code.search}</div>
          </Demo>
          <Demo title="禁用">
            <div>
              <Select disabled width="200"></Select>
              <Select width="200" value={this.state.select4} onChange={v => this.onChange('select4', v)}>
                {
                  this.state.data.map((child, index) => {
                    return (<Option key={index} value={child.value} disabled={index == 3}>{child.label}</Option>)
                  })
                }
              </Select>
            </div>
            <div>通过<code>disabled</code>可设置组件是否被禁用</div>
            <div> {code.disabled}</div>
          </Demo>
        </Col>
      </Row>

      <h3>Select API</h3>
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
              <td>指定选中项目的 value 值</td>
              <td>String,Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>width</td>
              <td>组件宽度</td>
              <td>String,Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td>选择框默认文字</td>
              <td>String</td>
              <td>请选择</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>是否禁用当前项</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>clearable</td>
              <td>是否可以清空选项</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>在选项状态发生改变时触发，返回选择项 value</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Option API</h3>
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
              <td>选项值，默认根据此属性值进行筛选，必填</td>
              <td>String,Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>label</td>
              <td>选项显示的内容</td>
              <td>String,Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>mini</td>
              <td>组件尺寸大小</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>是否禁用当前项</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>transfer</td>
              <td>是否将弹层放置于 body 内，默认ture，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div >
  }
}

