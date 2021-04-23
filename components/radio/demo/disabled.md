<cn>
#### 可不用 / 可控
通过 `disabled` 设置不可用
</cn>

```tsx
import { Radio , Button } from 'react-kui';

class Demo extends React.Component{
  state = {
    disabled:false,
    checked:false
  }
  render(){
    const {disabled ,checked } =this.state
    return(
      <div>
        <Radio disabled>disabled</Radio>
        <Radio 
          disabled 
          checked={true} 
          onChange={(e)=>this.setState({checked:e.target.checked})}
        >disabled</Radio>
        <br/>
        <br/>
        <Radio 
          disabled={disabled} 
          checked={checked} 
          onChange={(e)=>this.setState({checked:e.target.checked})}
        >Radio</Radio>

        <Button 
          onClick={()=>this.setState({checked:!checked})} 
          size="small" 
          style={{marginRight:16}}
        >{checked?'Checked':'Uncheck'}</Button>

        <Button 
          onClick={()=>this.setState({disabled:!disabled})} 
          size="small"
        >{disabled?'Enable':'Disabled'}</Button>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,  mountNode)
```