<cn>
#### 尺寸
通过 `small` `large` 来设置选择框的大小呈现
</cn>

```tsx
import { Radio, DatePicker } from 'react-kui';

const Demo = ()=>{
  const [size, setSize] = React.useState('default')
  return(
    <div>
      <Radio.Group value={size} onChange={setSize}>
        <Radio.Button value="large" label="Large"/>
        <Radio.Button value="default" label="Default"/>
        <Radio.Button value="small" label="Small"/>
      </Radio.Group>
      <br/>
      <DatePicker size={size}/>
      <br/>
      <DatePicker mode="month" placeholder="请选择月份" size={size} />
      <br/>
      <DatePicker size={size} mode="range"/>
    </div>
  )
}
ReactDOM.render(<Demo/>, mountNode)
```