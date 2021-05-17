<cn>
#### 其他元素
分割线和不可用菜单项。
</cn>

```tsx
import { Dropdown, Menu,Icon } from 'react-kui';

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a target="_blank" href="https://www.chuchur.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a target="_blank" href="https://react.k-ui.cn/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3" disabled>
      3rd menu item（disabled）
    </Menu.Item>
  </Menu>
)
ReactDOM.render(
  <Dropdown content={menu}>
    <a>
      Hover me <Icon type="chevron-down" />
    </a>
  </Dropdown>,
  mountNode
)
```