<cn>
#### 无边框
无边框样式。
</cn>

```tsx
import { DatePicker } from 'react-kui';

ReactDOM.render(
  <div>
    <DatePicker bordered={false}/>
    <br/>
    <DatePicker mode="month" placeholder="请选择月份"  bordered={false}/>
    <br/>
    <DatePicker mode="range"  bordered={false}/>
    <br/>
    <DatePicker bordered={false} disabled/>
    <br/>
    <DatePicker mode="range"  bordered={false} disabled/>
  </div>,
  mountNode
)
```