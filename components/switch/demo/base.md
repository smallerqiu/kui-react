<cn>
#### 基本用法
可使用 `v-model` 进行数据双向绑定
</cn>

```ts
import { Switch , Button } from 'react-kui';

class Demo extends React.Component {
  state = {
    checked:false
  }
  render(){
    const { checked } = this.state
    return(
      <div>
        <p>value: {checked.toString()}</p>
        <Switch /> <br/>
        <Switch 
          onChange= {checked=> this.setState({checked})}
          checked={checked}  
          style={{marginRight:10}}/>
        <Button 
          onClick= {()=> this.setState({checked:!checked})}
          size="small">{checked?'Uncheck':'Check'}</Button>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```