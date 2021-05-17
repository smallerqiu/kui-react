import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { Switch, Button, Menu, SubMenu } from 'react-kui';

class Demo extends React.Component {
  state = {
    current: ['1-1'],
    openKeys: ['sub2'],
    collapsed: false
  }
  change() {
    this.setState({ collapsed: !this.state.collapsed })
  }
  render() {
    let { collapsed, current, openKeys } = this.state
    return (
      <div style={{ width: 256 }}>
        <Button onClick={() => this.change()} icon={collapsed ? 'list' : 'menu'} type="primary"></Button>
        <br />
        <br />
        <Menu selectedKeys={current} openKeys={openKeys} theme="dark" inlineCollapsed={collapsed} mode="inline">
          <Menu.Item key="1-1" icon="mail">Option 1</Menu.Item>
          <Menu.Item key="1-2" icon="calendar"><span>Option 2</span></Menu.Item>
          <SubMenu key="sub2" icon="keypad" title="Navigation Two">
            <Menu.Item key="2-1">Option 5</Menu.Item>
            <Menu.Item key="2-2">Option 6</Menu.Item>
            <SubMenu title="SubMenu" key="sub2-1" icon="keypad">
              <Menu.Item key="2-3">Option 7</Menu.Item>
              <Menu.Item key="2-4">Option 8</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu key="sub3" icon="settings" title="Navigation Three">
            <Menu.Item key="3-1">Option 9</Menu.Item>
            <Menu.Item key="3-2">Option 10</Menu.Item>
            <Menu.Item key="3-3">Option 11</Menu.Item>
            <Menu.Item key="3-4">Option 12</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}
ReactDOM.render(<Demo />, document.getElementById('app'))
