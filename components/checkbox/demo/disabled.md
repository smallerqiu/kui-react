<cn>
#### 可不用 / 可控
通过 `disabled` 设置不可用
</cn>

```tsx
import { Checkbox , Button } from 'react-kui';

const Demo = ()=> {
  const [checked,setChecked] = React.useState(false)
  const [disabled,setDisabled] = React.useState(false)
  return(
    <div>
      <Checkbox disabled>disabled</Checkbox>
      <Checkbox disabled checked={true} >disabled</Checkbox>
      <Checkbox indeterminate disabled>indeterminate</Checkbox>
      <br/>
      <br/>
      <Checkbox disabled={disabled} checked={checked} onChange={(e)=>setChecked(e.target.checked)}>Checkbox</Checkbox>
      <Button onClick={()=>setChecked(!checked)} size="small" style={{marginRight:10}}>{checked?'Checked':'Uncheck'}</Button>
      <Button onClick={()=>setDisabled(!disabled)} size="small">{disabled?'Enable':'Disabled'}</Button>
    </div>
  )
}
ReactDOM.render(<Demo />  ,  mountNode)
```