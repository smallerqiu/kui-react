<cn>
#### Spin类型
可以直接把内容内嵌到 Spin 中，将现有容器变为加载状态。
</cn>

```tsx
import { Spin , Switch ,Radio } from 'react-kui';

class Demo extends React.Component {
  state = {
    spinning:false,
    mode:"bounce"
  }

  change = (spinning)=>{
    this.setState({spinning})
  }

  changeMode = (mode)=> {
    this.setState({mode})
  }

  render(){
    let { spinning , mode } = this.state
    return(
      <div>
        <Spin visible={spinning} mode={mode} style={{padding:'100px 50px',background:'#f5f5f5',marginBottom:30}}>
          <div>
              床前明月光，疑是地上霜。<br />
              举头望明月，低头思故乡。
          </div>
        </Spin>
        <br/>
        Loading state：<Switch checked={spinning} onChange={this.change}/>
        <br />
        <Radio.Group value={mode} onChange={this.changeMode}>
          <Radio value="bounce" label="type1"/>
          <Radio value="flip" label="type2"/>
          <Radio value="rotate" label="type3"/>
          <Radio value="zoom" label="type4"/>
        </Radio.Group>
      </div>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)
```