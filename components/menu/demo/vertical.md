<cn>
#### 垂直菜单
子菜单是弹出的形式。
</cn>

```tsx
import { Menu ,SubMenu } from 'react-kui';

class Demo extends React.Component {
  state = {
    current: ['1-1'],
    openKeys:['sub1']
  }
  render(){
    let {current,openKeys } = this.state
    return(
      <div style={{width:256}}>
        <Menu selectedKeys={current} openKeys={openKeys} mode="vertical">
          <Menu.Item key="1-1" icon="mail">Option 1</Menu.Item>
          <Menu.Item key="1-2" icon="calendar">Option 2</Menu.Item>
          <SubMenu key="sub2" icon="keypad" title="Navigation Two">
            <Menu.Item key="2-1">Option 5</Menu.Item>
            <Menu.Item key="2-2">Option 6</Menu.Item>
            <SubMenu key="sub2-1"  icon="keypad" title="SubMenu">
              <Menu.Item key="2-3">Option 7</Menu.Item>
              <Menu.Item key="2-4">Option 8</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu key="sub3"  icon="settings" title="Navigation Three">
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
ReactDOM.render(<Demo />, mountNode)
```
