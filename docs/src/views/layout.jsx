import React from 'react'
import { Kui, PropTypes } from '@/components/kui'
import code from '../code/layout'
import Demo from '../components/demo'
import { Layout, Alert, Menu, Breadcrumb, Icon } from '@/index'
const Header = Layout.Header
const Footer = Layout.Footer
const Sider = Layout.Sider
const Content = Layout.Content
export default class layout extends Kui {

  render() {
    return (<div>
      <h2>Layout 布局</h2>
      <p>协助进行页面级整体布局。</p>
      <h3>设计规则</h3>
      <h4>尺寸</h4>
      <p>一级导航项偏左靠近 logo 放置，辅助菜单偏右放置。</p>
      <ul className="k-item-list">
        <li>顶部导航（大部分系统）：一级导航高度 64px，二级导航 48px。</li>
        <li>顶部导航（展示类页面）：一级导航高度 80px，二级导航 56px。</li>
        <li>顶部导航高度的范围计算公式为：48+8n。</li>
        <li>侧边导航宽度的范围计算公式：200+8n。</li>
      </ul>
      <h4>交互</h4>
      <ul className="k-item-list">
        <li>一级导航和末级的导航需要在可视化的层面被强调出来；</li>
        <li>当前项应该在呈现上优先级最高；</li>
        <li>当导航收起的时候，当前项的样式自动赋予给它的上一个层级；</li>
        <li>左侧导航栏的收放交互同时支持手风琴和全展开的样式，根据业务的要求进行适当的选择。</li>
      </ul>
      <h4>视觉</h4>
      <p>导航样式上需要根据信息层级合理的选择样式：</p>
      <ul className="k-item-list">
        <li>
          <strong>大色块强调</strong>
          <p>建议用于底色为深色系时，当前页面父级的导航项。</p>
        </li>
        <li>
          <strong>高亮火柴棍</strong>
          <p>当导航栏底色为浅色系时使用，可用于当前页面对应导航项，建议尽量在导航路径的最终项使用。</p>
        </li>
        <li>
          <strong>字体高亮变色</strong>
          <p>从可视化层面，字体高亮的视觉强化力度低于大色块，通常在当前项的上一级使用。</p>
        </li>
        <li>
          <strong>字体放大</strong>
          <p>12px、14px 是导航的标准字号，14 号字体用在一、二级导航中。字号可以考虑导航项的等级做相应选择。</p>
        </li>
      </ul>
      <h3>组件概述</h3>
      <ul className="k-item-list">
        <li>
          <code>Layout</code>：布局容器，其下可嵌套
          <code>Header</code>
          <code>Sider</code>
          <code>Content</code>
          <code>Footer</code>或
          <code>Layout</code> 本身，可以放在任何父容器中。</li>
        <li>
          <code>Header</code>：顶部布局，自带默认样式，其下可嵌套任何元素，只能放在
          <code>Layout</code> 中。</li>
        <li>
          <code>Sider</code>：侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在
          <code>Layout</code> 中。</li>
        <li>
          <code>Content</code>：内容部分，自带默认样式，其下可嵌套任何元素，只能放在
          <code>Layout</code> 中。</li>
        <li>
          <code>Footer</code>：底部布局，自带默认样式，其下可嵌套任何元素，只能放在
          <code>Layout</code> 中。</li>
      </ul>
      <br />
      <br />
      <Alert>功能不多，他就是简单的布局。未采用
        <code>flex</code>
      </Alert>
      <h3>代码示例</h3>
      <Demo title="典型布局" layout="vertical">
        <div slot="content">
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
        <div slot="desc">典型的页面布局。</div>
        <div slot="code">{code.base}</div>
      </Demo>
      <Demo title="上中下布局" layout="vertical">
        <div slot="content">
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
        <div slot="desc">最基本的『上-中-下』布局。 一般主导航放置于页面的顶端，从左自右依次为：logo、一级导航项、辅助菜单（用户、设置、通知等）。通常将内容放在固定尺寸（例如：1200px）内，整个页面排版稳定，不受用户终端显示器影响；上下级的结构符合用户上下浏览的习惯，也是较为经典的网站导航模式。页面上下切分的方式提高了主工作区域的信息展示效率，但在纵向空间上会有一些牺牲。此外，由于导航栏水平空间的限制，不适合那些一级导航项很多的信息结构。
        </div>
        <div slot="code">{code.tmb}</div>
      </Demo>
      <Demo title="顶部-侧边布局-通栏" layout="vertical">
        <div slot="content">
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
        <div slot="desc">同样拥有顶部导航及侧边栏，区别是两边未留边距，多用于应用型的网站。 </div>
        <div slot="code">{code.tlc}</div>
      </Demo>
    </div >)
  }
}