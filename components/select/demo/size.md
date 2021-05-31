<cn>
#### 尺寸
通过 `width` 和 `size` 可控制组件尺寸大小
</cn>

```tsx
import { Select ,Radio } from 'react-kui';
let {Option} = Select

const Demo = ()=>{
  const [size,setSize] = React.useState('default')
  const [value,setValute] = React.useState(['1','3'])

  return (
  <>
    <Radio.Group value={size} onChange={setSize}>
      <Radio.Button value="large" label="large"/>
      <Radio.Button value="default" label="default"/>
      <Radio.Button value="small" label="small"/>
    </Radio.Group>
    <br/>
    <Select width={256} size={size} clearable>
      <Option value="1" label="Apple" />
      <Option value="2" label="Orange" />
      <Option value="3" label="Banana"/>
      <Option value="4" label="Pear" />
    </Select>
    <br/>
    <Select width={256} size={size} multiple value={value} onChange={setValute}>
      <Option value="1" label="Apple" />
      <Option value="2" label="Orange" />
      <Option value="3" label="Banana"/>
      <Option value="4" label="Pear" />
    </Select>
  </>
  )
}
ReactDOM.render(<Demo />,  mountNode)
```