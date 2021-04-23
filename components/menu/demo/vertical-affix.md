<cn>
#### 收藏模式
适用于菜单单繁杂的情况,可以尝试,把重要的经常使用的功能收藏起来直接展示,方便查找和使用
</cn>

```tsx
import {Switch, Menu ,SubMenu } from 'react-kui';

class Demo extends React.Component {
  state = {
    current: ['1-1'],
    theme:'dark'
  }
  change(checked){
    this.setState({theme : checked ? 'dark' : 'light'})
  }
  render(){
    let {current,theme } = this.state
    return(
      <div style={{width:256}}>
        <Switch trueText="dark" falseText="light" onChange={()=>this.change()} checked={theme=='dark'}/>
        <br/>
        <br/>
        <Menu selectedKeys={current} mode="vertical" vertical-affixed theme={theme}>
          <SubMenu key="sub1" icon="keypad" title="Navigation One">
            <Menu.Item key="1-1">Option 1</Menu.Item>
            <Menu.Item key="1-2">Option 2</Menu.Item>
            <Menu.Item key="1-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="1-4" affixed>Option 4</Menu.Item>
            <Menu.Item key="1-5" affixed>Option 5</Menu.Item>
            <Menu.Item key="1-6" affixed>Option 6</Menu.Item>
            <Menu.Item key="1-7">Option 7</Menu.Item>
            <Menu.Item key="1-8">Option 8</Menu.Item>
            <Menu.Item key="1-9">Option 9</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon="keypad" title="Navigation Two">
            <Menu.Item key="2-1">Option 1</Menu.Item>
            <Menu.Item key="2-2">Option 2</Menu.Item>
            <Menu.Item key="2-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="2-4" affixed>Option 4</Menu.Item>
            <Menu.Item key="2-5" affixed>Option 5</Menu.Item>
            <Menu.Item key="2-6" affixed>Option 6</Menu.Item>
            <Menu.Item key="2-7">Option 7</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon="settings" title="Navigation Three">
            <Menu.Item key="3-1">Option 1</Menu.Item>
            <Menu.Item key="3-2" affixed>Option 2</Menu.Item>
            <Menu.Item key="3-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="3-4">Option 4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub4"  icon="settings" title="Navigation Four">
            <Menu.Item key="4-1">Option 1</Menu.Item>
            <Menu.Item key="4-2">Option 2</Menu.Item>
            <Menu.Item key="4-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="4-4" affixed>Option 4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub5"   icon="settings" title="Navigation Five">
            <Menu.Item key="5-1" affixed>Option 1</Menu.Item>
            <Menu.Item key="5-2" affixed>Option 2</Menu.Item>
            <Menu.Item key="5-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="5-4" affixed>Option 4</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}
ReactDOM.render(<Demo />, mountNode)
```
