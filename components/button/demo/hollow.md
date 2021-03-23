<cn>
#### 幽灵按钮
颜色镂空模式
</cn>

```ts
import { Button } from 'react-kui';

ReactDOM.render(
  <div style={{background:'#b9c4d0',padding:10}}>
    <Button type="primary" hollow>Primary</Button>
    <Button type="danger" hollow>Danger</Button>
    <Button hollow>Default</Button>
    <Button type="dashed" hollow>Dashed</Button>
  </div>,
  mountNode
)
```