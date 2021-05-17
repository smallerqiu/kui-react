<cn>
#### 基础用法
最简单的下拉菜单。
</cn>

```tsx
import { Dropdown , Menu ,Icon ,Button} from 'react-kui';

const menu1 = (
  <Menu>
    <Menu.Item>
      <a>1st menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a>2nd menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a>3rd menu item</a>
    </Menu.Item>
  </Menu>
)

const menu2 = (
  <Menu>
    <Menu.Item>
      <a>1st menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a>2nd menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a>3rd menu item</a>
    </Menu.Item>
  </Menu>
)

const menu3 = (
  <Menu>
    <Menu.Item>
      <a>1st menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a>2nd menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a>3rd menu item</a>
    </Menu.Item>
  </Menu>
)
ReactDOM.render(
  <>
    <Dropdown content={menu1} key="d1">
      <a>
        Hover me <Icon type="chevron-down" />
      </a>
    </Dropdown>

    <Dropdown showPlacementArrow  placement="bottom"  content={menu2}  key="d2">
      <Button>
        show arrow <Icon type="chevron-down" />
      </Button>
    </Dropdown>

    <Dropdown trigger="click"  content={menu3}  key="d3">
      <Button>
        Click me <Icon type="chevron-down" />
      </Button>
    </Dropdown>
  </>,
  mountNode
)
```