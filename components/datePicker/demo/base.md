<cn>
#### 基础用法
通过 `v-model` 进行数据双向绑定
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