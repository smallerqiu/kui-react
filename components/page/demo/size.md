<cn>
#### 尺寸
展示小尺寸。
</cn>

```tsx
import { Page } from 'react-kui';

ReactDOM.render(
  <div className="demo-collapse">
    <Page current={1} total={50} size='small'/>
    <Page current={1} total={50} size='small' showSizer/>
    <Page current={1} total={50} size='small' showElevator/>
    <Page current={1} total={50} size='small' showElevator showTotal/>
  </div>,
  mountNode
)
```