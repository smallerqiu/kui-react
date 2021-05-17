<cn>
#### 切换菜单类型
展示动态切换模式。
</cn>

```tsx
import {Switch, Menu ,SubMenu } from 'react-kui';

class Demo extends React.Component {
  state = {
    current: ['1-1'],
    openKeys:['sub2'],
    theme:'light',
    mode:'inline'
  }
  changeMode(checked){
    this.setState({mode : checked ? 'vertical' : 'inline'})
  }
  changeTheme(checked){
    this.setState({theme : checked ? 'dark' : 'light'})
  }
  render(){
    let {current ,openKeys, theme ,mode } = this.state
    return(
      <div>
        <Switch onChange={this.changeMode.bind(this)}/> Change Mode
        <Switch trueText="dark" falseText="light" onChange={this.changeTheme.bind(this)}/> Change Theme
        <br/>
        <br/>
        <Menu selectedKeys={current} openKeys={openKeys} theme={theme} mode={mode}  style={{width:256}}>
          <Menu.Item key="1-1" icon="mail">Option 1</Menu.Item>
          <Menu.Item key="1-2" icon="calendar">Option 2</Menu.Item>
          <SubMenu key="sub2" icon="keypad" title="Navigation Two">
            <Menu.Item key="2-1">Option 5</Menu.Item>
            <Menu.Item key="2-2">Option 6</Menu.Item>
            <SubMenu key="sub2-1" icon="keypad" title="SubMenu">
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
ReactDOM.render(<Demo />, mountNode)
```
