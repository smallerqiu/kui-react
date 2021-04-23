<cn>
#### 禁用 / 可控
通过 `disabled` 属性设置组件是否被禁用
</cn>

```tsx
import { Switch , Button } from 'react-kui';

class Demo extends React.Component {
  state = {
    checked: false,
    disabled: false
  }
  render(){
    const { checked, disabled } = this.state
    return(
      <div>
        <Switch disabled />
        <br />
        <Switch 
          onChange={checked=> this.setState({checked})}
          disabled={disabled} 
          checked={checked} />
        <Button 
          size="small" 
          onClick={()=> this.setState({checked:!checked})}>{checked?'Uncheck':'Check'}</Button>
        <Button 
          size="small" 
          onClick={()=> this.setState({disabled:!disabled})}>{disabled?'Enable':'Disabled'}</Button>
        <br />
        <Switch disabled trueText="Yes" falseText="No" />
        <br />
        <Switch disabled trueText="Yes" falseText="No" checked />
        <br />
        <Switch disabled trueText="Yes" falseText="No" checked size="small"/>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```