<cn>
#### 典型布局
典型的页面布局。
</cn>

```tsx
import { Layout } from 'react-kui';

ReactDOM.render(
  <div className="demo-k-layout-0">
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout.Content>Content</Layout.Content>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Sider>Sider</Layout.Sider>
        <Layout.Content>Content</Layout.Content>
      </Layout>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Content>Content</Layout.Content>
        <Layout.Sider>Sider</Layout.Sider>
      </Layout>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
    <Layout>
      <Layout.Sider>Sider</Layout.Sider>
      <Layout>
        <Layout.Header>Header</Layout.Header>
        <Layout.Content>Content</Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    </Layout>
  </div>,
mountNode)
```