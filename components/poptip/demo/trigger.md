<cn>
#### 触发模式
通过 `trigger`来控制触发模式, 鼠标移入 `hover`、点击 `click`。
</cn>

```tsx
import { Poptip , Button } from 'react-kui';

const content = <div>
      <p>明月几时有,把酒问青天!</p>
      <p>明月几时有,把酒问青天!</p>
    </div> 

ReactDOM.render(
  <>
    <Poptip title="标题" content={content}>
      <Button type="primary">Hover me</Button>
    </Poptip>
    <Poptip title="标题" trigger="click" content={content}>
      <Button type="primary">Click me</Button>
    </Poptip>
  </>,
  mountNode
)
```