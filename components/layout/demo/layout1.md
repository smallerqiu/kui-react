<cn>
#### 顶部-侧边布局-通栏
同样拥有顶部导航及侧边栏，区别是两边未留边距，多用于应用型的网站。
</cn>

```tsx
import { Layout, Menu, SubMenu, Breadcrumb, Icon } from 'react-kui';

class Layout1 extends React.Component {
  state = {
    top:['t1'],
    left:['0-1']
  }
  render(){
    const { top,left } = this.props
    return(
      <div className="k-demo-layout-1">
        <Layout>
          <Layout.Header>
            <div className="logo" />
            <Menu mode="horizontal" theme="dark" value={top} className="demo-top-menu">
              <Menu.Item key="t1" icon="home">nav1</Menu.Item>
              <Menu.Item key="t2" icon="logo-buffer">nav2</Menu.Item>
              <Menu.Item key="t3" icon="heart">nav3</Menu.Item>
            </Menu>
          </Layout.Header>
          <Layout>
            <Layout.Sider>
              <Menu value={left} className="demo-left-menu" mode="inline">
                <SubMenu key="l0">
                  <template slot="title">
                    <Icon type="newspaper" />subnav1
                  </template>
                  <Menu.Item key="0-1">option1</Menu.Item>
                  <Menu.Item key="0-2">option2</Menu.Item>
                  <Menu.Item key="0-3">option3</Menu.Item>
                  <Menu.Item key="0-4">option4</Menu.Item>
                </SubMenu>
                <SubMenu key="l1">
                  <template slot="title">
                    <Icon type="keypad" />subnav2
                  </template>
                  <Menu.Item key="1-1">option1</Menu.Item>
                  <Menu.Item key="1-2">option2</Menu.Item>
                  <Menu.Item key="1-3">option3</Menu.Item>
                  <Menu.Item key="1-4">option4</Menu.Item>
                </SubMenu>
                <SubMenu key="l2">
                  <template slot="title">
                    <Icon type="settings" />subnav3
                  </template>
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