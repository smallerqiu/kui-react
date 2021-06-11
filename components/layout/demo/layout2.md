<cn>
#### 顶部-侧边布局
拥有顶部导航及侧边栏的页面，多用于展示类网站。
</cn>

```tsx
import { Layout ,Menu,SubMenu, Breadcrumb, Icon } from 'react-kui';

ReactDOM.render(
  <div className="k-demo-layout-2">
    <Layout>
      <Layout.Header>
        <div className="logo" />
        <Menu mode="horizontal" theme="dark" selectedKeys={['t1']} className="demo-top-menu">
          <Menu.Item key="t1" icon="home">nav1</Menu.Item>
          <Menu.Item key="t2" icon="logo-buffer">nav2</Menu.Item>
          <Menu.Item key="t3" icon="heart">nav3</Menu.Item>
        </Menu>
      </Layout.Header> 
      <Layout.Content className="k-demo-main">
        <Breadcrumb className="nav">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
        <Layout style={{padding:'24px 0',background:'#fff'}}>
          <Layout.Sider>
            <Menu  selectedKeys={['0-1']} openKeys={['al0']} className="demo-left-menu" mode="inline">
              <SubMenu key="al0" title="subnav1" icon="newspaper">
                <Menu.Item key="0-1">option1</Menu.Item>
                <Menu.Item key="0-2">option2</Menu.Item>
                <Menu.Item key="0-3">option3</Menu.Item>
                <Menu.Item key="0-4">option4</Menu.Item>
              </SubMenu>
              <SubMenu key="l1"  title="subnav2" icon="keypad">
                <Menu.Item key="1-1">option1</Menu.Item>
                <Menu.Item key="1-2">option2</Menu.Item>
                <Menu.Item key="1-3">option3</Menu.Item>
                <Menu.Item key="1-4">option4</Menu.Item>
              </SubMenu>
              <SubMenu key="l2"  title="subnav3" icon="settings">
                <Menu.Item key="2-1">option1</Menu.Item>
                <Menu.Item key="2-2">option2</Menu.Item>
                <Menu.Item key="2-3">option3</Menu.Item>
                <Menu.Item key="2-4">option4</Menu.Item>
              </SubMenu>
            </Menu>
          </Layout.Sider>
          <Layout.Content>Conent</Layout.Content>
        </Layout> 
      </Layout.Content> 
      <Layout.Footer>KUI ©2018 Created by chuchur</Layout.Footer>
    </Layout>
  </div>
, mountNode)
```