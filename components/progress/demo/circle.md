<cn>
#### 进度圈
圆形的进度条。
</cn>

```tsx
import { Progress } from 'react-kui';

ReactDOM.render(
  <>
    <Progress type="circle" percent={50} />
    <Progress type="circle" percent={70} status="exception" />
    <Progress type="circle" percent={100} />
  </>,
  mountNode
)
```