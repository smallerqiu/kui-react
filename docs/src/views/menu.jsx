import Demo from '../components/demo'
import code from '../code/menu'
import React from 'react'
import {  Menu, Icon, Radio, Row, Col } from '@/index'
const SubMenu = Menu.SubMenu
export default class menu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: "light",
    }
  }
  render() {
    let { theme } = this.state
    return (<div>
      <h2>Menu 导航菜单</h2>
      <h3>代码示例</h3>
      <Demo title="顶部导航" layout="vertical">
        <div>
          <Menu mode="horizontal" theme={theme} activeName="1">
            <Menu.Item name="1" icon="ios-paper">我的产品</Menu.Item>
            <SubMenu name="1"
              title={<React.Fragment> <Icon type="android-walk" />商品管理 </React.Fragment>} >
              <Menu.Item name="1-1">商品信息</Menu.Item>
              <Menu.Item name="1-2">商品列表</Menu.Item>
              <Menu.Item name="1-3">商品新增</Menu.Item>
              <Menu.Item name="1-4">商品筛选</Menu.Item>
            </SubMenu>
            <SubMenu name="2" title={<React.Fragment> <Icon type="android-walk" />用户管理 </React.Fragment>} >
              <Menu.Group title="超级管理">
                <Menu.Item name="2-1">用户信息</Menu.Item>
                <Menu.Item name="2-2">用户列表</Menu.Item>
              </Menu.Group>
              <Menu.Group title="普通管理">
                <Menu.Item name="2-3">用户新增</Menu.Item>
                <Menu.Item name="2-4">用户筛选</Menu.Item>
              </Menu.Group>
            </SubMenu>
            <Menu.Item name="4" icon="social-apple">新闻管理</Menu.Item>
            <Menu.Item name="5" icon="locked">权限管理</Menu.Item>
          </Menu>
          <br />
          <p>切换主题</p>
          <br />
          <Radio.Group value={theme} onChange={(v) => this.setState({ theme: v })}>
            <Radio value="light" label="light"></Radio>
            <Radio value="dark" label="dark"></Radio>
            <Radio value="primary" label="primary"></Radio>
          </Radio.Group>
        </div>
        <div>水平导航菜单，<br />可通过
          <code>theme</code>属性来设置菜单主题，水平导航提供3种， 垂直2种，<br /> 通过
          <code>select</code>事件可以取得点击菜单的name。
        </div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="侧栏导航" layout="vertical">
        <div>
          <Row>
            <Col span="8">
              <Menu theme={theme} activeName="0-1" openName="0">
                <SubMenu name="0" title={<React.Fragment> <Icon type="android-walk" /> 我的产品 </React.Fragment>} >
                  <Menu.Item name="0-1">我的产品1</Menu.Item>
                  <Menu.Item name="0-2">我的产品2</Menu.Item>
                  <Menu.Item name="0-3">我的产品3</Menu.Item>
                  <Menu.Item name="0-4">我的产品4</Menu.Item>
                </SubMenu>
                <SubMenu name="1" title={<React.Fragment> <Icon type="android-walk" />商品管理  </React.Fragment>} >
                  <Menu.Item name="1-1">商品信息</Menu.Item>
                  <Menu.Item name="1-2">商品列表</Menu.Item>
                  <Menu.Item name="1-3">商品新增</Menu.Item>
                  <Menu.Item name="1-4">商品筛选</Menu.Item>
                </SubMenu>

                <SubMenu name="2" title={<React.Fragment> <Icon type="android-walk" />用户管理  </React.Fragment>} >
                  <Menu.Group title="超级管理">
                    <Menu.Item name="2-1">用户信息</Menu.Item>
                    <Menu.Item name="2-2">用户列表</Menu.Item>
                  </Menu.Group>
                  <Menu.Group title="普通管理">
                    <Menu.Item name="2-3">用户新增</Menu.Item>
                    <Menu.Item name="2-4">用户筛选</Menu.Item>
                  </Menu.Group>
                </SubMenu>
              </Menu>
            </Col>
            <Col span="8">
              <Menu theme={theme} activeName="0-1" accordion openName={'0'}>
                <SubMenu name="0" title={<React.Fragment><Icon type="ios-paper" />我的产品 </React.Fragment>} >
                  <Menu.Item name="0-1">我的产品1</Menu.Item>
                  <Menu.Item name="0-2">我的产品2</Menu.Item>
                  <Menu.Item name="0-3">我的产品3</Menu.Item>
                  <Menu.Item name="0-4">我的产品4</Menu.Item>
                </SubMenu>
                <SubMenu name="1" title={<React.Fragment><Icon type="social-apple" />商品管理 </React.Fragment>} >
                  <Menu.Item name="1-1">商品信息</Menu.Item>
                  <Menu.Item name="1-2">商品列表</Menu.Item>
                  <Menu.Item name="1-3">商品新增</Menu.Item>
                  <Menu.Item name="1-4">商品筛选</Menu.Item>
                </SubMenu>

                <SubMenu name="2" title={<React.Fragment><Icon type="android-walk" />用户管理 </React.Fragment>} >
                  <Menu.Group title="超级管理">
                    <Menu.Item name="2-1">用户信息</Menu.Item>
                    <Menu.Item name="2-2">用户列表</Menu.Item>
                  </Menu.Group>
                  <Menu.Group title="普通管理">
                    <Menu.Item name="2-3">用户新增</Menu.Item>
                    <Menu.Item name="2-4">用户筛选</Menu.Item>
                  </Menu.Group>
                </SubMenu>
              </Menu>
            </Col>
            <Col span="8" >
              <Menu theme={theme} activeName="1">
                <Menu.Group title="超级管理">
                  <Menu.Item name="1">用户信息</Menu.Item>
                  <Menu.Item name="2">用户列表</Menu.Item>
                </Menu.Group>
                <Menu.Group title="普通管理">
                  <Menu.Item name="3">用户新增</Menu.Item>
                  <Menu.Item name="4">用户筛选</Menu.Item>
                </Menu.Group>
              </Menu>
            </Col>
          </Row>
        </div>
        <div>
          通过设置
          <code>mode</code>属性，切换菜单呈现。
        </div>
        <div>{code.theme}</div>
      </Demo>

      <h3>Menu API</h3>
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
              <td>mode</td>
              <td>菜单类型，可选值为 horizontal（水平） 和 vertical（垂直）</td>
              <td>String</td>
              <td>vertical</td>
            </tr>
            <tr>
              <td>theme</td>
              <td>主题，可选值为 light、dark、primary，其中 primary 只适用于 mode="horizontal"</td>
              <td>String </td>
              <td>light</td>
            </tr>
            <tr>
              <td>activeName</td>
              <td>激活菜单的 name 值</td>
              <td>String | Number </td>
              <td>-</td>
            </tr>
            <tr>
              <td>accordion</td>
              <td>是否开启手风琴模式，开启后每次至多展开一个子菜单</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>width</td>
              <td>导航菜单的宽度，只在 mode="vertical" 时有效, 自动宽度其值为 “auto”</td>
              <td>String|Number</td>
              <td>240</td>
            </tr>
            <tr>
              <td>onSelect</td>
              <td>选择菜单（Menu.Item）时触发,返回name</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Menu.Item API</h3>
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
              <td>菜单项的唯一标识，必填</td>
              <td>String | Number</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>SubMenu API</h3>
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
              <td>菜单项的唯一标识，必填</td>
              <td>String | Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>title</td>
              <td>子菜单标题，其slot对应值</td>
              <td>String</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Menu.Group API</h3>
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
              <td>title</td>
              <td>分组标题</td>
              <td>String | Number</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
}

