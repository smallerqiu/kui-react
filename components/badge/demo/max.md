<cn>
#### 最大值 / 自定义
设置 `maxCount` 配合 `count` ，数字模式超出隐藏，`count` 不为数字时将不进行计算
</cn>

```tsx
import { Badge } from 'react-kui';

ReactDOM.render(
  <div className="demo-badge">
   <Badge count={99}>
      <div className="box"></div>
    </Badge>
    <Badge count={100}>
      <div className="box"></div>
    </Badge>
    <Badge count={20} maxCount={10}>
      <div className="box"></div>
    </Badge>
    <Badge count={1000} maxCount={999}>
      <div className="box"></div>
    </Badge>
    <Badge count="hot">
      <div className="box"></div>
    </Badge>
    <Badge count="new">
      <div className="box"></div>
    </Badge>
  </div>,
  mountNode
)
```