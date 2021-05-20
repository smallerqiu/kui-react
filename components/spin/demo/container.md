<cn>
#### 卡片加载中
可以直接把内容内嵌到 Spin 中，将现有容器变为加载状态。
</cn>

```tsx
import { Spin , Switch } from 'react-kui';

class Demo extends React.Component {

  state = {
    spinning:false
  }

  change = (spinning)=>{
    this.setState({spinning})
  }

  render(){
    let {spinning} = this.state
    return(
      <div>
        <Spin visible={spinning}  style={{padding:'100px 50px',background:'#f5f5f5',marginBottom:30}}>
          <div>
              床前明月光，疑是地上霜。<br />
              举头望明月，低头思故乡。
          </div>
        </Spin>
        <br />
        Loading state：<Switch checked={spinning} onChange={this.change}/>
      </div>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)
```