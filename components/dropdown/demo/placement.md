<cn>
#### 弹出位置
支持 6 个弹出位置。
</cn>

```tsx
import { Dropdown, Menu ,Button} from 'react-kui';

class Demo extends React.Component {
  render(){
    const placements = ['bottom-left', 'bottom', 'bottom-right', 'top-left', 'top', 'top-right']
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.chuchur.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.k-ui.cn/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://react.k-ui.cn/">3rd menu item</a>
        </Menu.Item>
      </Menu>
    )
    return(
      <div id="dropdown-demo-placement">
        {
          placements.map(placement=>{
            return (
              <Dropdown placement={placement} content={menu} showPlacementArrow key={placement}>
                <Button>{placement}</Button>
              </Dropdown>
            )
          })
        }
      </div>
    )
  }
}  
ReactDOM.render(<Demo /> , mountNode)
```