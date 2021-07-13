<cn>
#### 尺寸大小
`small` 为小尺寸， `large` 为大尺寸
</cn>

```tsx
import { ColorPicker ,Form } from 'react-kui'

ReactDOM.render(
  <div className="demo-color-picker">
    <Form>
      <Form.Item label="large">
        <ColorPicker showMode value="#f44336" size="large"/>
      </Form.Item>
      <Form.Item label="Default">
        <ColorPicker showMode value="#9c27b0" mode="rgba"/>
      </Form.Item>
      <Form.Item label="small">
        <ColorPicker showMode value="#03a9f4"  mode="hsla" size="small" />
      </Form.Item>
    </Form>
  </div>,
  mountNode
)
```