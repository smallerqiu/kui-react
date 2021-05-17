<cn>
#### 基本用法
默认选中第一项。
</cn>

```tsx
import { Tabs } from 'react-kui';

class Demo extends React.Component {
  state = {
    current:'1'
  }
  change(key){
    console.log(key)
  }
  render(){
    const {current} = this.state
    return(
      <Tabs activeKey={current} onChange={()=>this.change()}>
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