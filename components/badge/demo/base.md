<cn>
#### 基本用法
`Badge` 基础使用
</cn>

```tsx
import { Badge , Button } from 'react-kui';

ReactDOM.render(
  <div className="demo-badge">
    <Badge count={3}>
      <Button>最新消息</Button>
    </Badge>
    <Badge count={15} color="orange">
      <Button>最新评论</Button>
    </Badge>
  </div>,
  mountNode
)
```