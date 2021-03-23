<cn>
#### 基本用法
通过 `type` 来控制展示类型
</cn>

```ts
import { Alert } from 'react-kui';

ReactDOM.render(
  <div>
    <Alert type="success">Success Text</Alert>
    <Alert type="info">Info Text</Alert>
    <Alert type="warning">Warning Text</Alert>
    <Alert type="error">Error Text</Alert>
  </div>,
  mountNode
)
```