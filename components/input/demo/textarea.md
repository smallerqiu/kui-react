<cn>
#### 文本域
通过设置 `rows` 来控制行数
</cn>

```tsx
import { TextArea } from 'react-kui';

ReactDOM.render(
  <div>
    <TextArea rows="4" placeholder="请输入内容..." />
    <TextArea rows="2" placeholder="请输入内容..." />
    <TextArea rows="2" placeholder="disabled..." disabled />
  </div>,
  mountNode
)
```