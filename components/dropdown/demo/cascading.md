<cn>
#### 多级菜单
传入的菜单里有多个层级。
</cn>

```tsx
import { Dropdown, Menu ,SubMenu ,Icon} from 'react-kui';

const menu = (
  <Menu>
    <Menu.Item>1st menu item</Menu.Item>
    <Menu.Item>2nd menu item</Menu.Item>
    <SubMenu key="test" title="sub menu">
      <Menu.Item>3rd menu item</Menu.Item>
      <Menu.Item>4th menu item</Menu.Item>
    </SubMenu>
    <SubMenu title="disabled sub menu" disabled>
      <Menu.Item>5d menu item</Menu.Item>
      <Menu.Item>6th menu item</Menu.Item>
    </SubMenu>
  </Menu>
)

ReactDOM.render(
  <Dropdown content={menu}>
    <a>
      Cascading menu <Icon type="chevron-down" />
    </a>
  </Dropdown>,
  mountNode
)
```