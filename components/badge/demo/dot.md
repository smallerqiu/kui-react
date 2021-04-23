<cn>
#### 点
设置 `dot` 来展示一个点
</cn>

```tsx
import { Badge, Icon } from 'react-kui';

ReactDOM.render(
  <div className="demo-badge">
   <Badge dot>
      <div className="box"></div>
    </Badge>
    <Badge dot>
      <Icon type="notifications-outline" />
    </Badge>
    <Badge dot>
      <a href="#">我是一个连接</a>
    </Badge>
  </div>,
  mountNode
)
```