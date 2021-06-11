<cn>
#### 内嵌菜单
垂直菜单，子菜单内嵌在菜单区域。
</cn>

```tsx
import { Menu ,SubMenu } from 'react-kui';

ReactDOM.render(
  <div style={{width:256}}>
    <Menu selectedKeys={['1-1']} openKeys={['sub1']} mode="inline">
      <SubMenu key="sub1" icon="mail" title="Navigation One">
        <Menu.Group title="Item 1">
          <Menu.Item key="1-1">Option 1</Menu.Item>
          <Menu.Item key="1-2">Option 2</Menu.Item>
        </Menu.Group>
        <Menu.Group title="Item 2">
          <Menu.Item key="1-3">Option 3</Menu.Item>
          <Menu.Item key="1-4">Option 4</Menu.Item>
        </Menu.Group>
      </SubMenu>
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
, mountNode)
```
