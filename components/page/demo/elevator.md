<cn>
#### 跳转
快速跳转到某一页。
</cn>

```tsx
import { Page } from 'react-kui';

ReactDOM.render(
  <div className="demo-collapse">
    <Page current={10} total={200} showElevator />
  </div>,
  mountNode
)
```