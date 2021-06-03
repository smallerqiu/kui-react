<cn>
#### 基础用法
最简单的用法，在浮层中可以选择或者输入日期。
</cn>

```tsx
import { DatePicker } from 'react-kui';

ReactDOM.render(
  <div>
    <DatePicker />
    <br/>
    <DatePicker mode="month" placeholder="请选择月份"/>
    <br/>
    <DatePicker mode="range" />
  </div>,
  mountNode
)
```