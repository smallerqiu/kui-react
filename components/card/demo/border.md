<cn>
#### 边框
`bordered` 可以设置是否显示边框
</cn>

```ts
import { Card } from 'react-kui';

ReactDOM.render(
  <div style={{background:'#efefef',padding:20}}>
    <Card title="卡片标题" icon="heart" extra={<a href="#">More</a>} bordered={false}>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </Card>
  </div>,
  mountNode
)
```