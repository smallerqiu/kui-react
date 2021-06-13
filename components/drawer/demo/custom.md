<cn>
#### 自定义
通过 `title` 来设置标题， `width` 控制宽度， 还有 `placement` 控制方向
</cn>

```tsx
import { Button, Drawer, Radio } from 'react-kui';

const Demo = () => {

  const [show, toggle] = React.useState(false)
  const [placement, setPlacement] = React.useState('left')

  return (
    <div>
      <Radio.Group value={placement} onChange={setPlacement}>
        <Radio label="left" value="left" />
        <Radio label="top" value="top" />
        <Radio label="right" value="right" />
        <Radio label="bottom" value="bottom" />
      </Radio.Group>
      <br />
      <br />
      <Button onClick={() => toggle(true)} >Open</Button>
      <Drawer visible={show}
        width="300"
        onCancel={() => toggle(false) }
        placement={placement}
        title="What's your name? "
        cancelText="cancel"
        okText="Ok">My name is chuchur.</Drawer>
    </div>
  )
}
ReactDOM.render(<Demo />,mountNode)
```