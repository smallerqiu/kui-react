<cn>
#### 额外节点
可以同时展开多个面板。
</cn>

```tsx
import { Collapse ,Icon } from 'react-kui';

const text =  'A long time ago, In a beautiful kingdom, '+
  'there lived a young king and queen, '+
  'the people loved them so much; '

ReactDOM.render(
  <div className="demo-collapse">
    <Collapse activeKey={['1','2']}>
      <Collapse.Panel title="Panel title" key="1" extra={<Icon type="settings-outline"/>}>
        <div>{text}</div>
      </Collapse.Panel>
      <Collapse.Panel title="Panel title" key="2" extra={<Icon type="settings-outline"/>}>
        <div>{text}</div>
      </Collapse.Panel>
      <Collapse.Panel title="Panel title" key="3" extra={<Icon type="settings-outline"/>}>
        <div>{text}</div>
      </Collapse.Panel>
    </Collapse>
  </div>,
  mountNode
)
```