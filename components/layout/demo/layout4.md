<cn>
#### 固定侧边栏
当内容较长时，使用固定侧边栏可以提供更好的体验。
</cn>

```tsx
import { Layout ,Menu, Breadcrumb } from 'react-kui';

ReactDOM.render(
  <div className="k-demo-layout-4">
    <Layout>
      <Layout.Sider className="demo-sider">
        <div className="logo" />
        <Menu mode="inline" theme="dark" selectedKeys={['t1']} className="demo-top-menu">
          <Menu.Item key="t1" icon="home">nav1</Menu.Item>
          <Menu.Item key="t2" icon="logo-buffer">nav2</Menu.Item>
          <Menu.Item key="t3" icon="heart">nav3</Menu.Item>
          <Menu.Item key="t5" icon="albums">nav4</Menu.Item>
          <Menu.Item key="t6" icon="calculator">nav5</Menu.Item>
          <Menu.Item key="t7" icon="call">nav6</Menu.Item>
          <Menu.Item key="t8" icon="cloud">nav7</Menu.Item>
          <Menu.Item key="t9" icon="color-palette">nav8</Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content className="k-demo-main">
        <Breadcrumb className="nav">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> 
        <div style={{padding:'300px 0',textAlign:'center',color:'#ddd',background:'#fff',margin:20}}>我是打酱油的</div>
        <Layout.Footer>KUI ©2018 Created by chuchur</Layout.Footer>
      </Layout.Content> 
    </Layout>
  </div>
,  mountNode)
```