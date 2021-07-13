<cn>
#### 颜色模式
可以切换颜色模式,使用 `showMode` 来展示 颜色模式
</cn>

```tsx
import { ColorPicker ,Form  } from 'react-kui'

ReactDOM.render(
  <div className="demo-color-picker">
   <Form>
    <Form.Item label="Default">
      <ColorPicker showMode value="#f44336"/>
    </Form.Item>
    <Form.Item label="Rgba">
      <ColorPicker showMode value="#03a9f4" mode="rgba"/>
    </Form.Item>
    <Form.Item label="Hsla">
      <ColorPicker showMode value="#03a9f4"  mode="hsla"/>
    </Form.Item>
   </Form>
  </div>,
  mountNode
)
```