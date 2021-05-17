<cn>
#### 图标
有图标的标签。
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
        <Tabs.Pane key="1" title="Tab 1" icon="logo-apple">
          Content of Tab Pane 1
        </Tabs.Pane>
        <Tabs.Pane key="2" title="Tab 2" icon="logo-windows">
          Content of Tab Pane 2
        </Tabs.Pane>
      </Tabs>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```