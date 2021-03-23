<cn>
#### 上中下布局 
最基本的『上-中-下』布局。
一般主导航放置于页面的顶端，从左自右依次为：logo、一级导航项、辅助菜单（用户、设置、通知等）。通常将内容放在固定尺寸（例如：1200px）内，整个页面排版稳定，不受用户终端显示器影响；上下级的结构符合用户上下浏览的习惯，也是较为经典的网站导航模式。页面上下切分的方式提高了主工作区域的信息展示效率，但在纵向空间上会有一些牺牲。此外，由于导航栏水平空间的限制，不适合那些一级导航项很多的信息结构。
</cn>

```ts
import { Layout ,Menu, Breadcrumb } from 'react-kui';

class Layout3 extends React.Component {
  state = {
    top:['t1'],
    left:['0-1']
  }
  render(){
    return(
      <div className="k-demo-layout-3">
        <Layout>
          <Layout.Header>
            <div className="logo" />
            <Menu mode="horizontal" theme="dark" v-model="top" className="demo-top-menu">
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
            <Layout.Content>Conent</Layout.Content>
          </Layout.Content> 
          <Layout.Footer>KUI ©2018 Created by chuchur</Layout.Footer>
        </Layout>
      </div>
    )
  }
}
ReactDOM.render(<Layout3 />  , mountNode)
```