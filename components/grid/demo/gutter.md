<cn>
#### 分栏间隔
使用 `gutter` 熟悉来设置分栏的间隔
</cn>

```tsx
import { Row ,Col  } from 'react-kui';

ReactDOM.render(
  <div className="demo-grid">
    <Row gutter={10} className="row-gutter">
      <Col span={6}>
        <div>col-6</div>
      </Col>
      <Col span={6}>
        <div>col-6</div>
      </Col>
      <Col span={6}>
        <div>col-6</div>
      </Col>
      <Col span={6}>
        <div>col-6</div>
      </Col>
    </Row>
  </div>,
  mountNode
)
```