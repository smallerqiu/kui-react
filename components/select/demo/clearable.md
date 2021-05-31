<cn>
#### 可清除
通过 `clearable` 可控制组件是否显示清除按钮
</cn>

```tsx
import { Select , Button } from 'react-kui';
let {Option} = Select

const Demo = ()=>{

  const [value1, setValue1] = React.useState();
  const [value2, setValue2] = React.useState();
  const [value3, setValue3] = React.useState(['1','2']);

  return(
    <div>
      <Select width={200} clearable value={value1} onChange={setValue1}>
        <Option value="1" label="Apple" />
        <Option value="2" label="Orange" />
        <Option value="3" label="Banana"/>
        <Option value="4" label="Pear" />
      </Select>
      {value1}
      <br />
      <Select width={200} size="small" clearable value={value2} onChange={setValue2}>
        <Option value="1" label="Apple" />
        <Option value="2" label="Orange" />
        <Option value="3" label="Banana" />
        <Option value="4" label="Pear" />
      </Select>
      {value2}
      <br />
      <Select width={200} clearable multiple value={value3} onChange={setValue3}>
        <Option value="1" label="Apple" />
        <Option value="2" label="Orange" />
        <Option value="3" label="Banana" />
        <Option value="4" label="Pear" />
      </Select>
    </div>
  )
}
ReactDOM.render(<Demo />  ,  mountNode)
```