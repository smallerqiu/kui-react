<cn>
#### 基础用法
单独使用 `checked` 表示是否为选中状态。
</cn>

```tsx
import { Checkbox , Button } from 'react-kui';

const Demo = () => {
  const [ checked , setCheck ] = React.useState(true)
  return (
    <div>
      <p>{checked.toString()}</p>
      <Checkbox 
        checked={checked} 
        onChange={(e)=>setCheck(e.target.checked)}>Checkbox</Checkbox>
      <Button onClick={()=>setCheck(!checked)} size="small">{checked?'Uncheck':'Check'}</Button>
      <br/>
      <br/>
      <Checkbox label="Checkbox"/>
    </div>
  )
}
ReactDOM.render(<Demo /> , mountNode)
```