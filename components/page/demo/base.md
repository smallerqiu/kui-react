<cn>
#### 基本用法
基础分页。
</cn>

```ts
import { Page } from 'react-kui';

ReactDOM.render(
  <div className="demo-collapse">
    <Page current={1} total={50}/>
  </div>,
  mountNode
)
```