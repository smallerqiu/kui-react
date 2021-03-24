<cn>
#### 可不用 / 可控
通过 `disabled` 设置不可用
</cn>

```ts
import { Checkbox , Button } from 'react-kui';

class Demo extends React.Component {
  state = {
    disabled:false,
    checked:false
  }

  render(){
    const {disabled , checked} = this.state
    return(
      <div>
        <Checkbox disabled>disabled</Checkbox>
        <Checkbox disabled checked={true} >disabled</Checkbox>
        <Checkbox indeterminate disabled>indeterminate</Checkbox>
        <br/>
        <br/>
        <Checkbox disabled={disabled} checked={checked} onChange={(e)=>this.setState({checked:e.target.checked})}>Checkbox</Checkbox>
        <Button onClick={()=>this.setState({checked:!checked})} size="small" style={{marginRight:10}}>{checked?'Checked':'Uncheck'}</Button>
        <Button onClick={()=>this.setState({disabled:!disabled})} size="small">{disabled?'Enable':'Disabled'}</Button>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,  mountNode)
```