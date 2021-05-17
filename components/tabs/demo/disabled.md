<cn>
#### 禁用
禁用某一项。
</cn>

```tsx
import { Tabs } from 'react-kui';

class Demo extends React.Component {
  state = {
    activeKey:'1'
  }
  render(){
    const {activeKey} = this.state
    return(
      <Tabs activeKey={activeKey}>
        <Tabs.Pane key="1" title="Tab 1">
          Content of Tab Pane 1
        </Tabs.Pane>
        <Tabs.Pane key="2" title="Tab 2" disabled>
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