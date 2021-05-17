<cn>
#### 右键菜单
默认是移入触发菜单，可以点击鼠标右键触发。
</cn>

```tsx
import { Dropdown, Menu ,Message } from 'react-kui';

const menu= (
  <Menu >
    <Menu.Item key="news">New file</Menu.Item>
    <Menu.Item key="edit">Edit</Menu.Item>
    <Menu.Item key="save" icon="save-outline">Save</Menu.Item>
    <Menu.Item key="cut" icon="cut-outline">Cut</Menu.Item>
    <Menu.Divider />
    <Menu.Item key="exit">Exit</Menu.Item>
  </Menu>
)

class Demo extends React.Component {
  handle({key}){
    Message.info('Click on item '+ key)
  }
  render(){
    return(
      <Dropdown trigger="contextmenu" content={menu} onClick={this.handle.bind(this)}>
  <div style={{
        textAlign: 'center',
        background: '#f5f5f5',
        height: '200px',
        lineHeight: '200px',
        color: '#999',
      }}>Right Click on here</div>
      
  </Dropdown>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)
```