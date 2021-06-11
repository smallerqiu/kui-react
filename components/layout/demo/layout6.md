<cn>
#### 侧边布局/收藏模式
侧边两列式布局。页面横向空间有限时，侧边导航可收起。
侧边导航在页面布局上采用的是左右的结构，一般主导航放置于页面的左侧固定位置，辅助菜单放置于工作区顶部。内容根据浏览器终端进行自适应，能提高横向空间的使用率，但是整个页面排版不稳定。侧边导航的模式层级扩展性强，一、二、三级导航项目可以更为顺畅且具关联性的被展示，同时侧边导航可以固定，使得用户在操作和浏览中可以快速的定位和切换当前位置，有很高的操作效率。但这类导航横向页面内容的空间会被牺牲一部份。
</cn>

```tsx
import { Layout ,Menu,SubMenu, Breadcrumb, Icon } from 'react-kui';

ReactDOM.render(
  <div className="k-demo-layout-6">
    <Layout>
      <Layout.Sider className="demo-sider" style={{width:200}}>
        <div className="logo" />
        <Menu selectedKeys={['1-1']}  mode="vertical" verticalAffixed theme="dark">
          <Menu.Item key="dashboard" icon="speedometer">Dashboard</Menu.Item>
          <SubMenu key="sub1" title="Navigation One" icon="keypad">
            <Menu.Item key="1-1" affixed>Option 1</Menu.Item>
            <Menu.Item key="1-2">Option 2</Menu.Item>
            <Menu.Item key="1-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="1-4" affixed>Option 4</Menu.Item>
            <Menu.Item key="1-5" affixed>Option 5</Menu.Item>
            <Menu.Item key="1-6" affixed>Option 6</Menu.Item>
            <Menu.Item key="1-7">Option 7</Menu.Item>
            <Menu.Item key="1-8">Option 8</Menu.Item>
            <Menu.Item key="1-9">Option 9</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title="Navigation Two" icon="keypad">
            <Menu.Item key="2-1">Option 1</Menu.Item>
            <Menu.Item key="2-2">Option 2</Menu.Item>
            <Menu.Item key="2-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="2-4" affixed>Option 4</Menu.Item>
            <Menu.Item key="2-5" affixed>Option 5</Menu.Item>
            <Menu.Item key="2-6" affixed>Option 6</Menu.Item>
            <Menu.Item key="2-7">Option 7</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" title="Navigation Three" icon="settings">
            <Menu.Item key="3-1">Option 1</Menu.Item>
            <Menu.Item key="3-2" affixed>Option 2</Menu.Item>
            <Menu.Item key="3-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="3-4">Option 4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" title="Navigation Four" icon="settings">
            <Menu.Item key="4-1">Option 1</Menu.Item>
            <Menu.Item key="4-2">Option 2</Menu.Item>
            <Menu.Item key="4-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="4-4" affixed>Option 4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" title="Navigation Five" icon="settings">
            <Menu.Item key="5-1" affixed>Option 1</Menu.Item>
            <Menu.Item key="5-2" affixed>Option 2</Menu.Item>
            <Menu.Item key="5-3" affixed>Option 3</Menu.Item>
            <Menu.Item key="5-4" affixed>Option 4</Menu.Item>
          </SubMenu>
        </Menu>
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
, mountNode)
```