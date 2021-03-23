<cn>
#### 基本用法
通过 `title` 和 `icon` 可设置标题和图标
</cn>

```ts
import { Tooltip , Card } from 'react-kui';

ReactDOM.render(
  <div>
    <Card title="卡片标题" icon="heart" extra={<a href="#">More</a>}>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </Card>
  </div>,
  mountNode
)
```