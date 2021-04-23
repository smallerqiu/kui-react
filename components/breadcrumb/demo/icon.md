<cn>
#### 设置图标
通过 `icon` 设置图标
</cn>

```tsx
import { Breadcrumb } from 'react-kui';

ReactDOM.render(
  <div>
    <Breadcrumb>
      <Breadcrumb.Item to="/" icon="home">Home</Breadcrumb.Item>
      <Breadcrumb.Item to="/components/breadcrumb" icon="logo-buffer">breadcrumb</Breadcrumb.Item>
      <Breadcrumb.Item icon="heart">other</Breadcrumb.Item>
    </Breadcrumb>
  </div>,
  mountNode
)
```