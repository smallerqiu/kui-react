<cn>
#### 附加内容 
可以在页签右边添加附加操作。
</cn>

```tsx
import { Tabs , Button } from 'react-kui';

class Demo extends React.Component {
  state = {
    activeKey:'1'
  }
  render(){
    const {activeKey} = this.state
    const extra = <Button size="small">Extra Action</Button>
    return(
      <Tabs activeKey={activeKey} extra={extra}>
        <Tabs.Pane key="1" title="Tab 1">
          Content of Tab Pane 1
        </Tabs.Pane>
        <Tabs.Pane key="2" title="Tab 2">
          Content of Tab Pane 2
        </Tabs.Pane>
        <Tabs.Pane key="3" title="Tab 3">
          Content of Tab Pane 3
        </Tabs.Pane> 
      </Tabs>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```