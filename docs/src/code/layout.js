let code = {}

code.base =`
import {Layout} from 'react-kui'
const Header = Layout.Header
const Footer = Layout.Footer
const Sider = Layout.Sider
const Content = Layout.Content

ReactDOM.render() {
  return (
    <div>
    <Layout className="demo-k-layout">
      <Header>Header</Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
    <Layout className="demo-k-layout">
      <Header>Header</Header>
      <Layout>
        <Sider>Sider</Sider>
        <Content>Content</Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
    <Layout className="demo-k-layout">
      <Header>Header</Header>
      <Layout>
        <Content pull-left>Content</Content>
        <Sider>Sider</Sider>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>

    <Layout className="demo-k-layout">
      <Sider>Sider</Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
    </div>
  )
}
`

code.tmb =`import {Layout} from 'react-kui'
const Header = Layout.Header
const Footer = Layout.Footer
const Sider = Layout.Sider
const Content = Layout.Content
ReactDOM.render() {
  return (
    <div>
      <Layout>
        <Header>
          <div style={{ width: '120px', height: '31px', position: 'relative', zIndex: 999, backgroundColor: '#848b9c', float: 'left', margin: '15px 30px 0 0' }}></div>
          <Menu mode="horizontal" theme="dark" activeName="1" style={{ lineHeight: '62px' }}>
            <Menu.Item name="1" icon="home">首页</Menu.Item>
            <Menu.Item name="2" icon="social-buffer">文章</Menu.Item>
            <Menu.Item name="3" icon="heart">评论</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '20px 0' }}>
            <Breadcrumb.Item to="/" icon="home">Home</Breadcrumb.Item>
            <Breadcrumb.Item to="/breadcrumb" icon="social-buffer">breadcrumb</Breadcrumb.Item>
            <Breadcrumb.Item icon="heart">other</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ border: '1px solid #eee', padding: '20px', height: '200px', backgroundColor: '#fff' }}>
            Content
          </div>
        </Content>
        <Footer>
          2009-2018 &copy; KUI
        </Footer>
      </Layout>
    </div>
  )
}`

code.tlc =`import { Layout, Menu, Breadcrumb, Icon } from 'react-kui'
const Header = Layout.Header
const Footer = Layout.Footer
const Sider = Layout.Sider
const Content = Layout.Content
ReactDOM.render() {
  return (
    <div>
    <Layout>
        <Header>
          <div style={{ width: '120px', height: '31px', position: 'relative', zIndex: 999, backgroundColor: '#848b9c', float: 'left', margin: '15px 30px 0 0' }}></div>
          <Menu mode="horizontal" theme="dark" activeName="1" style={{ lineHeight: '62px' }}>
            <Menu.Item name="1" icon="home">首页</Menu.Item>
            <Menu.Item name="2" icon="social-buffer">文章</Menu.Item>
            <Menu.Item name="3" icon="heart">评论</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider>
            <Menu theme='dark' active-name="1" width="auto">
              <Menu.SubMenu name="0" title={<React.Fragment><Icon type="ios-paper" />我的产品</React.Fragment>}>
                <Menu.Item name="0-1">我的产品1</Menu.Item>
                <Menu.Item name="0-2">我的产品2</Menu.Item>
                <Menu.Item name="0-3">我的产品3</Menu.Item>
                <Menu.Item name="0-4">我的产品4</Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu name="1" title={<React.Fragment><Icon type="social-apple" />商品管理</React.Fragment>}>
                <Menu.Item name="1-1">商品信息</Menu.Item>
                <Menu.Item name="1-2">商品列表</Menu.Item>
                <Menu.Item name="1-3">商品新增</Menu.Item>
                <Menu.Item name="1-4">商品筛选</Menu.Item>
              </Menu.SubMenu>

              <Menu.SubMenu name="2" title={<React.Fragment><Icon type="android-walk" />用户管理</React.Fragment>}>
                <Menu.Group title="超级管理">
                  <Menu.Item name="2-1">用户信息</Menu.Item>
                  <Menu.Item name="2-2">用户列表</Menu.Item>
                </Menu.Group>
                <Menu.Group title="普通管理">
                  <Menu.Item name="2-3">用户新增</Menu.Item>
                  <Menu.Item name="2-4">用户筛选</Menu.Item>
                </Menu.Group>
              </Menu.SubMenu>
            </Menu>
          </Sider>
          <Content style={{ padding: '20px 50px' }}>
            <Breadcrumb style={{ margin: '0 0 20px 0' }}>
              <Breadcrumb.Item to="/" icon="home">Home</Breadcrumb.Item>
              <Breadcrumb.Item to="/breadcrumb" icon="social-buffer">breadcrumb</Breadcrumb.Item>
              <Breadcrumb.Item icon="heart">other</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ border: '1px solid #eee', padding: '20px', height: '200px', background: '#fff' }}>
              Content
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}`
export default code