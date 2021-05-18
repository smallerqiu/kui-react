<cn>
#### 新增和关闭页签 
只有卡片样式的页签支持新增和关闭选项。
使用 `closable={false}` 禁止关闭。
</cn>

```tsx
import { Tabs ,Button ,Checkbox } from 'react-kui';

const panes = [
      { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
      { title: 'Tab 2', content: 'Content of Tab 2', key: '2', closable:true },
      { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable:true },
    ];
class Demo extends React.Component {
  state = {
    panes,
    activeKey: panes[0].key,
  }

  newTabIndex = 0
  onChange(activeKey){
    this.setState({activeKey})
  }
  onClose(key){
    let { panes , activeKey} = this.state

    const index = panes.map(p=>p.key).indexOf(key)
    if (activeKey == key) {
      if(index == panes.length-1) {
        activeKey = panes[index-1].key
      } else {
        activeKey = panes[index+1].key
      }
    }
    panes.splice(index,1)
    this.setState({panes , activeKey})
  }
  add() {
    let {panes} = this.state
    const activeKey = 'pane_' + this.newTabIndex++;
    panes.push({ 
      title: 'New Tab'+ this.newTabIndex, 
      content: 'Content of new Tab ' + this.newTabIndex, 
      key: activeKey, 
      closable:true 
    });
    this.setState({panes, activeKey })
  }
  
  render(){
    const {activeKey ,panes } = this.state
    const extra = <Button icon="add" size="small" onClick={()=>this.add()}/>

    return(
      <Tabs activeKey={activeKey} card extra={extra} onChange={this.onChange.bind(this)} onTabClose={(key)=>this.onClose(key)}>
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