<cn>
#### 无边框
无边框样式。
</cn>

```tsx
import { Select , Button } from 'react-kui';
let {Option} = Select

const Demo = ()=>{

  return(
    <div>
      <Select width={200} clearable bordered={false} value="2">
        <Option value="1" label="Apple" />
        <Option value="2" label="Orange" />
        <Option value="3" label="Banana"/>
        <Option value="4" label="Pear" />
      </Select>
      <Select width={200}  disabled bordered={false}  value="2">
        <Option value="1" label="Apple" />
        <Option value="2" label="Orange" />
        <Option value="3" label="Banana" />
        <Option value="4" label="Pear" />
      </Select>
      <Select width={200} showArrow={false} placeholder="隐藏下拉箭头" />
    </div>
  )
}
ReactDOM.render(<Demo />  ,  mountNode)
```