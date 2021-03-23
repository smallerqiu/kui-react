<cn>
#### Flex 对齐
Flex 子元素垂直对齐。
</cn>

```ts
import { Row ,Col } from 'react-kui';

ReactDOM.render(
  <div className="demo-grid">
    <p>Align Top</p>
    <Row type="flex" align="top" justify="space-around">
      <Col span={4}><div className="h-96">col-4</div></Col>
      <Col span={4}><div className="h-64">col-4</div></Col>
      <Col span={4}><div className="h-128">col-4</div></Col>
      <Col span={4}><div className="h-72">col-4</div></Col>
    </Row>
    <p>Align Middle</p>
    <Row type="flex" align="middle"  justify="space-around">
      <Col span={4}><div className="h-96">col-4</div></Col>
      <Col span={4}><div className="h-64">col-4</div></Col>
      <Col span={4}><div className="h-128">col-4</div></Col>
      <Col span={4}><div className="h-72">col-4</div></Col>
    </Row>
    <p>Align Bottom</p>
    <Row type="flex" align="bottom" justify="space-around">
      <Col span={4}><div className="h-96">col-4</div></Col>
      <Col span={4}><div className="h-64">col-4</div></Col>
      <Col span={4}><div className="h-128">col-4</div></Col>
      <Col span={4}><div className="h-72">col-4</div></Col>
    </Row>
  </div>,
  mountNode
)
```