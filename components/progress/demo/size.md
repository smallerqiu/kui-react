<cn>
#### 小尺寸
适合放在较狭窄的区域内。
</cn>

```tsx
import { Progress } from 'react-kui';

ReactDOM.render(
  <>
    <div style={{width:300,marginBottom:30}}>
      <Progress size="small" percent={50} />
      <Progress size="small" percent={70} status="exception" />
      <Progress size="small" percent={100} />
    </div>
    <Progress type="circle" width={80} percent={50} />
    <Progress type="circle" width={80} percent={70} status="exception" />
    <Progress type="circle" width={80} percent={100} />
  </>,
  mountNode
)
```