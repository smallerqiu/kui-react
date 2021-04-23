<cn>
#### 顶部导航
水平的顶部导航菜单。
</cn>

```tsx
import { Menu ,SubMenu } from 'react-kui';

class Demo extends React.Component {
  state = {
    current: ['1']
  }
  render(){
    return(
      <div>
        <Menu mode="horizontal" selectedKeys={this.state.current}>
          <Menu.Item key="1" icon="mail">Navigation One</Menu.Item>
          <Menu.Item key="2" icon="keypad" disabled>Navigation Two</Menu.Item>
          <SubMenu key="3" icon="settings" title="Navigation - Submenu"> 
            <Menu.Group title="Item 1">
              <Menu.Item key="3-1">Option 1</Menu.Item>
              <Menu.Item key="3-2">Option 2</Menu.Item>
            </Menu.Group>
            {/*<Menu.Group title="Item 2">
              <Menu.Item key="3-3">Option 1</Menu.Item>
              <Menu.Item key="3-4">Option 2</Menu.Item>
              <SubMenu key="3-5" icon="settings" title="Submenu">
                <Menu.Group title="Item 1">
                  <Menu.Item key="3-5-1">Option 1</Menu.Item>
                  <Menu.Item key="3-5-2">Option 2</Menu.Item>
                </Menu.Group>
                <Menu.Group title="Item 2">
                  <Menu.Item key="3-5-3">Option 1</Menu.Item>
                  <Menu.Item key="3-5-4">Option 2</Menu.Item>
                </Menu.Group>
              </SubMenu>
            </Menu.Group>*/}
          </SubMenu>
          <Menu.Item key="4">
          <a href="https://k-ui.cn" target="_blank">Navigation -Link</a>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}
ReactDOM.render(<Demo />, mountNode)
```
