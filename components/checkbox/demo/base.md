<cn>
#### 基础用法
单独使用 `checked` 表示是否为选中状态 ,使用 `v-model` 可以双向绑定数据。
</cn>

```ts
import { Checkbox , Button } from 'react-kui';

// const []
class Demo extends React.Component {
  state = {
    checked:true
  }

  render(){
    const {checked} = this.state
    return (
      <div>
        <p>{checked.toString()}</p>
        <Checkbox checked={checked} onChange={(e)=>this.setState({checked:e.target.checked})}>Checkbox</Checkbox>
        <Button onClick={()=>this.setState({checked:!checked})} size="small">{checked?'Uncheck':'Check'}</Button>
        <br/>
        <br/>
        <Checkbox label="Checkbox"/>
      </div>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)
```