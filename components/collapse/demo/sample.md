<cn>
#### 简洁模式
设置 `sample` 呈现没有边框的简洁样式。
</cn>

```ts
import { Collapse } from 'react-kui';

const text =  'A long time ago, In a beautiful kingdom, '+
  'there lived a young king and queen, '+
  'the people loved them so much; '
  
ReactDOM.render(
  <div className="demo-collapse">
    <Collapse activeKey={['1']} sample>
      <Collapse.Panel title="Panel title" key="1">
        <div>{text}</div>
      </Collapse.Panel>
      <Collapse.Panel title="Panel title" key="2">
        <div>{text}</div>
      </Collapse.Panel>
      <Collapse.Panel title="Panel title" key="3">
        <div>{text}</div>
      </Collapse.Panel>
    </Collapse>
  </div>,
  mountNode
)
```