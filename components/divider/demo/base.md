
<cn>
#### 垂直分割线
使用 type="vertical" 设置为行内的垂直分割线。
</cn>

```tsx
import { Divider } from 'react-kui';

ReactDOM.render(
  <div>
    Text
    <Divider type="vertical" />
    <a href="#">Link</a>
    <Divider type="vertical" />
    <a href="#">Link</a>
  </div>,
  mountNode
)
```