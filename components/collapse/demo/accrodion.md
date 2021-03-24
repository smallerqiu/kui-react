<cn>
#### 手风琴
设置 `accrodion` 只允许同时展开一个面板
</cn>

```ts
import { Collapse } from 'react-kui';

const text =  'A long time ago, In a beautiful kingdom, '+
  'there lived a young king and queen, '+
  'the people loved them so much; '

ReactDOM.render(
  <div className="demo-collapse">
    <Collapse activeKey={['1']} accrodion>
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