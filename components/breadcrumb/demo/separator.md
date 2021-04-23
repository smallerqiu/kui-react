<cn>
#### 分隔符
通过 `separator` 设置分隔符
</cn>

```tsx
import { Breadcrumb } from 'react-kui';

ReactDOM.render(
  <div>
    <Breadcrumb>
      <Breadcrumb.Item to="/" icon="home" separator="~">Home</Breadcrumb.Item>
      <Breadcrumb.Item to="/components/breadcrumb" icon="logo-buffer" separator="~">breadcrumb</Breadcrumb.Item>
      <Breadcrumb.Item icon="heart" separator="~">other</Breadcrumb.Item>
    </Breadcrumb>
  </div>,
  mountNode
)
```