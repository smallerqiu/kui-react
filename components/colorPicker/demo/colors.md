<cn>
#### 自定义颜色盘
可以定义默认的颜色盘
</cn>

```tsx
import { ColorPicker } from 'react-kui'

ReactDOM.render(
  <div className="demo-color-picker">
    <ColorPicker showMode value="#f44336" defalutColors={['#9c27b0','red','blue']} />
  </div>,
  mountNode
)
```