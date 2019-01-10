import code from '../code/affix'
import Demo from '../components/demo'
import React from 'react';
import { Row, Col, Affix, Button, Message } from '@/index'
export default class affix extends React.Component {
  onChange(state) {
    if (state) {
      Message.success('当前状态：' + state)
    } else {
      Message.error('当前状态：' + state)
    }
  }
  render() {
    return (<div>
      <h2>Affix 图钉</h2>
      <p>将页面元素钉在可视范围。</p>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12">
          <Demo title="基本" layout="vertical">
            <div>
              <Affix>
                <Button>Affix top</Button>
              </Affix>
              <Affix offsetBottom="0">
                <Button>Affix Bottom</Button>
              </Affix>
            </div>
            <div>通过
                        <code>offsetTop</code>和
                        <code>offsetBottom</code>来设定固定位置</div>
            <div>{code.base}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo title="偏移" layout="vertical">
            <div>
              <Affix offsetTop="200">
                <Button>200px to Affix top</Button>
              </Affix>
              <Affix offsetBottom="100">
                <Button>100px to Affix bottom</Button>
              </Affix>
            </div>
            <div>默认
                        <code>offsetTop</code>值为0</div>
            <div>{code.offset}</div>
          </Demo>
        </Col>
      </Row>

      <Demo title="事件回调">
        <div>
          <Affix offsetTop="150" onChange={this.onChange.bind(this)}>
            <Button>150px to Affix top</Button>
          </Affix>
          <Affix offsetBottom="100" onChange={this.onChange.bind(this)}>
            <Button>100px to Affix bottom</Button>
          </Affix>
        </div>
        <div>当固定状态发生改变时触发回调</div>
        <div>{code.callback}</div>
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
              <td>offsetTop</td>
              <td>距离窗口顶部达到指定偏移量后触发 </td>
              <td>String,Number</td>
              <td>0</td>
            </tr>
            <tr>
              <td>offsetBottom</td>
              <td>距离窗口底部达到指定偏移量后触发 </td>
              <td>String,Number </td>
              <td>-</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>在固定状态发生改变时触发,返回当前固定状态 false | true</td>
              <td>Function </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
} 
