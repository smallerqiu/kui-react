<cn>
#### 基本用法
使用 `type`、`hollow`、`circle` 属性来定义 `Button` 的样式。
</cn>

```tsx
import { Button } from 'react-kui';

ReactDOM.render(
  <div>
    <Button type="primary">Primary</Button>
    <Button type="danger">Danger</Button>
    <Button>Default</Button>
    <Button type="dashed">Dashed</Button>
    <Button type="link">Link</Button>
  </div>,
  mountNode
)
```