<cn>
#### 菜单隐藏方式
默认是点击关闭菜单，可以关闭此功能。
</cn>

```tsx
import { Dropdown, Menu,Icon } from 'react-kui';

class Demo extends React.Component {
  state = {
    visible: false,
  }

  handleMenuClick(e) {
    if (e.key === '3') {
      this.setState({visible:false})
    }
  }
  
  render(){
    const menu = (
      <Menu slot="content" onClick={this.handleMenuClick.bind(this)}>
        <Menu.Item key="1">
          Not close the menu.
        </Menu.Item>
        <Menu.Item key="2">
          Not close the menu also.
        </Menu.Item>
        <Menu.Item key="3">
          Close the menu
        </Menu.Item>
      </Menu>
    )
    return(
      <Dropdown visible={visible} content={menu}>
        <a>
          Hover me <Icon type="chevron-down" />
        </a>
      </Dropdown>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)
```