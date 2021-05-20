<cn>
#### 基础用法
最简单的用法，浮层的大小由内容区域决定。
</cn>

```tsx
import { Poptip , Button } from 'react-kui';

const content = <div>
      <p>明月几时有,把酒问青天!</p>
      <p>明月几时有,把酒问青天!</p>
    </div>

ReactDOM.render(
  <Poptip title="标题" content={content}>
    <Button type="primary">Hover me</Button>
  </Poptip>,
  mountNode
)
```