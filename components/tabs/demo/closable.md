<cn>
#### 新增和关闭页签 
只有卡片样式的页签支持新增和关闭选项。
使用 `closable={false}` 禁止关闭。
</cn>

```tsx
import { Tabs } from 'react-kui';

const panes = [
      { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
      { title: 'Tab 2', content: 'Content of Tab 2', key: '2', closable:true },
      { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable:true },
    ];
class Demo extends React.Component {
  state = {
    panes,
    activeKey: panes[0].key,
    newTabIndex: 0
  }
  onClose(key){
    // let panes = this.panes

    const pane = panes.filter(pane=>pane.key == key)[0]
    const index = panes.indexOf(pane)

    if (this.activeKey == key) {
      if(index == panes.length-1) {
        this.activeKey = panes[index-1].key
      } else {
        this.activeKey = panes[index+1].key
      }

    }
    panes.splice(index,1)

  }
  add() {
    // const panes = this.panes;
    let {newTabIndex} = this.state
    newTabIndex++
    const activeKey = 'A'+newTabIndex;
    panes.push({ 
      title: 'New Tab'+ newTabIndex, 
      content: 'Content of new Tab ' + activeKey, 
      key: activeKey, 
      closable:true 
    });
    this.setState({activeKey,newTabIndex})
  }
  render(){
    const {activeKey} = this.state
    const extra = <Button icon="add" size="small" onClick={()=>this.add()}/>

    return(
      <Tabs activeKey={activeKey} card extra={extra} onClose={(key)=>this.onClose(key)}>
        {
          panes.map((pane)=>{
            return(
              <Tabs.Pane title={pane.title} key={pane.key} closable={pane.closable}>
                {pane.content}
              </Tabs.Pane>
            )
          })
        }
      </Tabs>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```