<cn>
#### 基础用法
最简单的用法，浮层的大小由内容区域决定。
</cn>

```tsx
import { Tooltip } from 'react-kui';

const title = <div>
      <p>明月几时有,把酒问青天!</p>
      <p>明月几时有,把酒问青天!</p>
    </div>

class Demo extends React.Component {
  state = {
    change : false
  }

  clickHandle = ()=>{
    this.setState({change:!this.state.change})
  }
  render(){
    return(
      <>
        <Tooltip title={title}>
          <a>月几时有,把酒问青天</a>
        </Tooltip>
        <br/>
        <br/>
        <br/>
        <Tooltip title={this.state.change?'窗前明月光':'凝视地上霜'}>
          <a onClick={this.clickHandle}>Click me!</a>
        </Tooltip>
      </>
    )
  }
}
ReactDOM.render(<Demo />, mountNode)
```