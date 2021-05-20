<cn>
#### 盘仪表进度条
盘仪表进度条。
</cn>

```tsx
import { Progress } from 'react-kui';

ReactDOM.render(
  <>
    <Progress type="dashboard" percent={50} />
    <Progress type="dashboard" percent={100} />
  </>,
  mountNode
)
```