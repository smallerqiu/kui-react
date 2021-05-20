<cn>
#### 从浮层内关闭
使用 visible 属性控制浮层显示。
</cn>

```tsx
import { Poptip, Button } from 'react-kui';

class Demo extends React.Component {
  state = {
    visible:false
  }
  hide(){
    this.setState({visible:false})
  }
  onVisibleChange = visible=>{
    this.setState({visible})
  }
  render(){
    const { visible } = this.state
    const content = <a onClick={()=>this.hide()}>Close</a>
    return(
      <Poptip 
        title="标题" 
        content={content} 
        trigger="click" 
        visible={visible}
        onVisibleChange={this.onVisibleChange}
        >
        <Button type="primary">Click me</Button>
      </Poptip>
    )
  }
} 
ReactDOM.render(<Demo /> , mountNode)
```