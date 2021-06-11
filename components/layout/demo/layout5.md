<cn>
#### 侧边布局/折叠模式
侧边两列式布局。页面横向空间有限时，侧边导航可收起。
侧边导航在页面布局上采用的是左右的结构，一般主导航放置于页面的左侧固定位置，辅助菜单放置于工作区顶部。内容根据浏览器终端进行自适应，能提高横向空间的使用率，但是整个页面排版不稳定。侧边导航的模式层级扩展性强，一、二、三级导航项目可以更为顺畅且具关联性的被展示，同时侧边导航可以固定，使得用户在操作和浏览中可以快速的定位和切换当前位置，有很高的操作效率。但这类导航横向页面内容的空间会被牺牲一部份。
</cn>

```tsx
import { Layout ,Menu ,SubMenu, Breadcrumb, Icon } from 'react-kui';

const Layout5 = ()=> {
  const [collapsed,toggle] = React.useState(false)
  return(
    <div className="k-demo-layout-5">
      <Layout>
        <Layout.Sider className="demo-sider" style={{width:collapsed?'80px':'200px'}}>
          <div className="logo" />
          <Menu mode="inline" theme="dark" selectedKeys={['0-1']} openKeys={['l0']} className="demo-top-menu" inlineCollapsed={collapsed}>
            <Menu.Item key="1-1" icon="home"><span>option1</span></Menu.Item>
            <Menu.Item key="1-2" icon="logo-buffer"><span>option2</span></Menu.Item>
            <Menu.Item key="1-3" icon="heart"><span>option3</span></Menu.Item>
            <Menu.Item key="1-4" icon="albums"><span>option4</span></Menu.Item>
            <SubMenu key="l0" title="subnav1" icon="newspaper">
              <Menu.Item key="0-1">option1</Menu.Item>
              <Menu.Item key="0-2">option2</Menu.Item>
              <Menu.Item key="0-3">option3</Menu.Item>
              <Menu.Item key="0-4">option4</Menu.Item>
            </SubMenu> 
          </Menu>
          <div className="toggle-menu" onClick={()=>toggle(!collapsed)}>
            <Icon type={!collapsed?'chevron-back':'chevron-forward'} />
          </div>
        </Layout.Sider>
        <Layout.Content className="k-demo-main">
          <Menu mode="horizontal" theme="dark" selectedKeys={['t1']} className="demo-top-menu">
            <Menu.Item key="t1" icon="home">nav1</Menu.Item>
            <Menu.Item key="t2" icon="logo-buffer">nav2</Menu.Item>
            <Menu.Item key="t3" icon="heart">nav3</Menu.Item>
          </Menu>
          <Breadcrumb className="nav">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> 
          <div style={{padding:'200px 0',textAlign:'center',color:'#ddd',background:'#fff',margin:20}}>我是打酱油的</div>
          <Layout.Footer>KUI ©2018 Created by chuchur</Layout.Footer>
        </Layout.Content> 
      </Layout>
    </div>
  )
}
ReactDOM.render(<Layout5 />  ,  mountNode)
```