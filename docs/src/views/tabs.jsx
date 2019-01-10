import React from 'react'
import Demo from '../components/demo'
import code from '../code/tabs'
import { Tabs, Button, Checkbox } from '@/'

export default class tabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 5,
      animated: true
    }
  }
  onClick() {
    this.setState({
      count: this.state.count + 1
    })
  }
  onClose() {
    this.setState({
      count: this.state.count - 1
    })
  }
  render() {
    let { animated } = this.state
    return <div>
      <h2>Tabs 标签页</h2>
      <p>选项卡切换组件。</p>
      <h3>代码示例</h3>
      <Demo title="基础">
        <div>
          <Checkbox checked={animated} onChange={(v) => this.setState({ animated: v })}>aminiated</Checkbox>
          <Tabs value="3" animated={animated}>
            <Tabs.Pane label="Tab1" name="1">我是内容1....</Tabs.Pane>
            <Tabs.Pane label="Tab2" name="2">我是内容2....</Tabs.Pane>
            <Tabs.Pane label="Tab3" name="3">我是内容3....</Tabs.Pane>
          </Tabs>
        </div>
        <div>
          <code>Value</code>和
                <code>Tabs.Pane</code>的
                <code>name</code>值匹配,默认选中第一项。</div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="禁用">
        <div>
          <Tabs>
            <Tabs.Pane label="Tab1">我是内容1....</Tabs.Pane>
            <Tabs.Pane label="Tab2" disabled>我是内容2....</Tabs.Pane>
            <Tabs.Pane label="Tab3">我是内容3....</Tabs.Pane>
          </Tabs>
        </div>
        <div>禁用某一项。</div>
        <div>{code.disabled}</div>
      </Demo>
      <Demo title="图标">
        <div>
          <Tabs>
            <Tabs.Pane label="Tab1" icon="social-windows">我是内容1....</Tabs.Pane>
            <Tabs.Pane label="Tab2" icon="social-apple">我是内容2....</Tabs.Pane>
            <Tabs.Pane label="Tab3" icon="social-android">我是内容3....</Tabs.Pane>
          </Tabs>
        </div>
        <div>有图标的标签。</div>
        <div>{code.icon}</div>
      </Demo>
      <Demo title="卡片式页签">
        <div>
          <Tabs card extra={<Button mini>Action</Button>}>
            <Tabs.Pane label="Tab1" icon="social-windows">我是内容1....</Tabs.Pane>
            <Tabs.Pane label="Tab2" icon="social-apple">我是内容2....</Tabs.Pane>
            <Tabs.Pane label="Tab3" icon="social-android">我是内容3....</Tabs.Pane>
          </Tabs>
        </div>
        <div>设置 slot extra 可以在页签右边添加附加操作。</div>
        <div>{code.card}</div>
      </Demo>
      <Demo title="新增和关闭页签">
        <div>
          <Tabs card closable extra={<Button slot="extra" mini onClick={this.onClick.bind(this)}>+</Button>} onClose={this.onClose.bind(this)}>
            {
              (() => {
                let tabs = [], count = this.state.count;
                for (let n = 1; n < count; n++) {
                  tabs.push(<Tabs.Pane label={'Tab ' + n} closable={n != 1} key={n}>我是内容{n}....</Tabs.Pane>)
                }
                return tabs
              })()
            }
          </Tabs>
        </div>
        <div>只有卡片样式支持新增和关闭。使用
                <code>closable=false</code>禁止关闭。</div>
        <div>{code.closable}</div>
      </Demo>
      <Demo title="简洁模式">
        <div slot="content" style={{ padding: 10, backgroundColor: '#eee' }}>
          <Tabs value="1" sample>
            <Tabs.Pane label="TabTitle 1" name="1">
              <p>我是内容1....</p>
              <p>我是内容1....</p>
              <p>我是内容1....</p>
            </Tabs.Pane>
            <Tabs.Pane label="TabTitle 2" name="2">
              <p>我是内容2....</p>
              <p>我是内容2....</p>
              <p>我是内容2....</p>
            </Tabs.Pane>
            <Tabs.Pane label="TabTitle 3" name="3">
              <p>我是内容2....</p>
              <p>我是内容2....</p>
              <p>我是内容2....</p>
            </Tabs.Pane>
          </Tabs>
        </div>
        <div><code>sample=true</code>开启简洁模式</div>
        <div>{code.sample}</div>
      </Demo>
      <h3>Tabs API</h3>
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
              <td>当前激活 tab 面板的 name</td>
              <td>[String,Number]</td>
              <td>默认为第一项的 name</td>
            </tr>
            <tr>
              <td>card</td>
              <td>是否为卡片样式</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>closable</td>
              <td>是否可以关闭页签，仅在 card=true 时有效</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>click</td>
              <td>tab 被点击时触发，返回 name</td>
              <td>Fucntion</td>
              <td>-</td>
            </tr>
            <tr>
              <td>colose</td>
              <td>tab 被关闭时触发，返回 name</td>
              <td>Fucntion</td>
              <td>-</td>
            </tr>
            <tr>
              <td>extra</td>
              <td>附加内容 </td>
              <td>node</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>TabsPane API</h3>
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
              <td>name</td>
              <td>用于标识当前面板，对应 value，默认为其索引值</td>
              <td>[String,Number]</td>
              <td>-</td>
            </tr>
            <tr>
              <td>label</td>
              <td>选项卡头显示文字</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>icon</td>
              <td>选项卡图标</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>是否禁用该选项卡</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>closable</td>
              <td>是否可以关闭页签，仅在 card=true 时有效</td>
              <td>Boolean</td>
              <td>true</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  }
}