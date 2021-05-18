<cn>
#### 极简式页签
简单的卡片呈现模式。
</cn>

```tsx
import { Tabs } from 'react-kui';

class Demo extends React.Component {
  state = {
    activeKey:'1'
  }
  change(key){
    console.log(key)
  }
  render(){
    const {activeKey} = this.state
    return(
      <div style={{background:'#f2f2f2',padding:'10px'}}>
        <Tabs activeKey={activeKey} sample onChange={this.change.bind(this)}>
          <Tabs.Pane key="1" title="Tab 1">
            <p>Content of Tab Pane 1</p>
            <p>Content of Tab Pane 1</p>
            <p>Content of Tab Pane 1</p>
          </Tabs.Pane>
          <Tabs.Pane key="2" title="Tab 2">
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
          </Tabs.Pane>
          <Tabs.Pane key="3" title="Tab 3">
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
          </Tabs.Pane>
        </Tabs>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```