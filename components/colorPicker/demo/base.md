<cn>
#### 基本用法
默认可以同时展开一个或者多个面板
</cn>

```tsx
import { ColorPicker } from 'react-kui'

ReactDOM.render(
  <div className="demo-color-picker">
    <ColorPicker value="red"/>
    <br />
    <ColorPicker value="red" disabled/>
  </div>,
  mountNode
)
```