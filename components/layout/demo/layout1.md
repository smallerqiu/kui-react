<cn>
#### 顶部-侧边布局-通栏
同样拥有顶部导航及侧边栏，区别是两边未留边距，多用于应用型的网站。
</cn>

```tsx
import { Layout, Menu, SubMenu, Breadcrumb, Icon } from 'react-kui';

class Layout1 extends React.Component {
  state = {
    top:['t1'],
    left:['0-1'],
    openKeys:['al0']
  }
  render(){
    const { top,left ,openKeys} = this.state
    return(
      <div className="k-demo-layout-1">
        <Layout>
          <Layout.Header>
            <div className="logo" />
            <Menu mode="horizontal" theme="dark" selectedKeys={top} className="demo-top-menu">
              <Menu.Item key="t1" icon="home">nav1</Menu.Item>
              <Menu.Item key="t2" icon="logo-buffer">nav2</Menu.Item>
              <Menu.Item key="t3" icon="heart">nav3</Menu.Item>
            </Menu>
          </Layout.Header>
          <Layout>
            <Layout.Sider>
              <Menu selectedKeys={left}  openKeys={openKeys} className="demo-left-menu" mode="inline">
                <SubMenu key="al0" title="subnav1" icon="newspaper">
                  <Menu.Item key="0-1">option1</Menu.Item>
                  <Menu.Item key="0-2">option2</Menu.Item>
                  <Menu.Item key="0-3">option3</Menu.Item>
                  <Menu.Item key="0-4">option4</Menu.Item>
                </SubMenu>
                <SubMenu key="al1" title="subnav2" icon="keypad">
                  <Menu.Item key="1-1">option1</Menu.Item>
                  <Menu.Item key="1-2">option2</Menu.Item>
                  <Menu.Item key="1-3">option3</Menu.Item>
                  <Menu.Item key="1-4">option4</Menu.Item>
                </SubMenu>
                <SubMenu key="al2"  title="subnav3" icon="settings">
                  <Menu.Item key="2-1">option1</Menu.Item>
                  <Menu.Item key="2-2">option2</Menu.Item>
                  <Menu.Item key="2-3">option3</Menu.Item>
                  <Menu.Item key="2-4">option4</Menu.Item>
                </SubMenu>
              </Menu>
            </Layout.Sider>
            <Layout className="k-demo-main">  
              <Breadcrumb className="nav">
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Layout.Content>
                  Content
              </Layout.Content>
            </Layout>  
          </Layout>
        </Layout>
      </div>
    )
  }
}
ReactDOM.render(<Layout1 /> , mountNode)
```