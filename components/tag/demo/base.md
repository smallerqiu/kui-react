<cn>
#### 基本用法
通过 `closeable` 显示关闭按钮，点击隐藏标签，触发 `close` 回调
</cn>

```tsx
import { Tag } from 'react-kui';

ReactDOM.render(
  <div>
    <Tag>标签1</Tag>
    <Tag>标签2</Tag>
    <Tag>标签3</Tag>
    <Tag closeable>标签4</Tag>
  </div>,
  mountNode
)
```