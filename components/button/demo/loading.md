<cn>
#### 加载中状态
添加 `loading` 属性即可让按钮处于加载状态
</cn>

```ts
import { Button } from 'react-kui';

class ButtonLoading extends React.Component {
  state = {
    loading: false,
    delayLoading: false
  }
  handleDelay = () =>{
    setTimeout(()=> this.setState({delayLoading:true}),1000)
  }
  setLoading = () =>{
    this.setState({loading:true})
  }
  render(){
    const {loading , delayLoading} = this.state
    return(
      <div>
        <Button type="primary" icon="search" loading>Loading</Button>
        <Button type="primary" icon="search" loading size="small">Loading</Button>
        <Button icon="search" loading circle/>
        <Button type="primary" loading={loading} onClick={this.setLoading}>Clike me</Button>
        <br/>
        <Button type="primary" icon="search" loading={delayLoading} onClick={this.handleDelay}>延迟1s加载</Button>
      </div>
    )
  }
}

ReactDOM.render(<ButtonLoading/>, mountNode)
```