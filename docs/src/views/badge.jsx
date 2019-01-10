
import React from 'react'
import { Badge, Row, Col, Icon, Button, Input } from '@/index'
import Demo from '../components/demo'
import code from '../code/badge'
export default class badge extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 4
    }
    this.getChildren.bind(this)
  }
  onAdd() {
    this.setState({ count: this.state.count + 1 })
  }
  onDel() {
    if(this.state.count==1) return;
    this.setState({ count: this.state.count - 1 })
  }
  getChildren() {
    let childs = []
    for (let i = 0; i < this.state.count; i++) {
      childs.push(<div key={i} style={{marginBottom:15}}>
       Item{i}:
        <Badge count="-" onClick={this.onDel.bind(this)} style={{ marginLeft: 20 }}>
          <Input width="200"></Input>
        </Badge></div>)
    }
    return childs
  }
  render() {
    return <div>
      <h2>Badge 徽标</h2>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12">
          <Demo layout="vertical" title="基础">
            <div>
              <Badge count="3">
                <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
              </Badge>
            </div>
            <div>
              <code>Badge</code>基础使用</div>
            <div>{code.base}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo layout="vertical" title="点">
            <div>
              <Badge dot>
                <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
              </Badge>
              <Badge dot style={{ marginLeft: 20 }}>
                <Icon type="ios-calendar-outline" size="50" color="orange"></Icon>
              </Badge>
              <Badge dot style={{ marginLeft: 20 }}>
                <a href="#">我是一个连接</a>
              </Badge>
            </div>
            <div>设置
          <code>dot</code>来展示一个点</div>
            <div>{code.dot}</div>
          </Demo>
        </Col>
      </Row>
      <Row gutter="8">
        <Col span="12">
          <Demo layout="vertical" title="数字隐藏">
            <div>
              <Badge count="100" maxCount="99">
                <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
              </Badge>
              <Badge count="10055" maxCount="999" style={{ marginLeft: 60 }}>
                <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
              </Badge>
            </div>
            <div>数字模式超出隐藏，设置
          <code>maxCount</code>配合
          <code>count</code>
            </div>
            <div>{code.maxCount}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo layout="vertical" title="颜色">
            <div>
              <Badge count="100" maxCount="99" color="orange">
                <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
              </Badge>
              <Badge dot color="green" style={{ marginLeft: 60 }}>
                <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
              </Badge>
            </div>
            <div>
              <code>color</code>属性可以自定义颜色</div>
            <div>{code.color}</div>
          </Demo>
        </Col>
      </Row>
      <Row gutter="8">
        <Col span="12">
          <Demo layout="vertical" title="单独使用">
            <div>
              <Badge count="10" style={{ marginLeft: 20 }}></Badge>
              <Badge count="20" color="blue" style={{ marginLeft: 40 }}></Badge>
            </div>
            <div></div>
            <div>{code.badge}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo layout="vertical" title="组合使用">
            <div>
              {this.getChildren()}
              <Button onClick={this.onAdd.bind(this)}>Add</Button>
            </div>
            <div>Badge的使用场景不光是数字或者是提醒的展示，在很多场合可以当按钮使用</div>
            <div>{code.other}</div>
          </Demo>
        </Col>
      </Row>
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
              <td>count</td>
              <td>显示的文字</td>
              <td>String，Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>maxCount</td>
              <td>展示封顶的数字值，高于的部分会以+号显示</td>
              <td>String，Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>dot</td>
              <td>不展示数字，只有一个小红点</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>onClick</td>
              <td>点击事件的回调</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  }
}
