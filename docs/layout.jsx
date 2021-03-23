import React from 'react'
import { Kui, PropTypes } from '@/components/kui'
import { Nav, baseNav } from "./menu";
import { Row, Col, Menu, Badge, Select, Icon, Layout } from '@/components'
import DocHeader from './components/header'
// import vueIcon from './assets/vue.svg'
export default class DocLayout extends Kui {

  constructor(props) {
    super(props)
    this.state = {
      activeName: '',
      components: []// code.components
    }
  }

  // componentWillMount() {
  //   this.setState({ activeName: this.context.router.route.location.pathname })
  // }

  routerChange(path) {
    if (path.indexOf('http') >= 0) {
      window.open(path)
    } else {
      setTimeout(() => this.setState({ key: '' }), 500)
      if (path != window.location.pathname) {
        document.scrollTop = document.documentElement.scrollTop = 0
      }
      this.context.router.history.push(path)

    }
    this.setState({ activeName: path })
  }
  render() {
    let renderItem = (data) => {
      return data.map((child, y) => {
        return (<Menu.Item icon={child.icon} name={child.link || child.weblink} key={y}>
          {child.link === '/log' && <Badge dot>{child.title}</Badge>}
          {child.link !== '/log' && child.title}
          {child.sub && <span className="sub">{child.sub}</span>}
        </Menu.Item>)
      })
    }
    let renderGroup = (child, x) => {
      return <Menu.Group title={child.title} name={child.title} key={x}>{renderItem(child.child)}</Menu.Group>
    }

    let renderLeftMenu = () => {
      return Nav.map((child, x) => renderGroup(child, x))
    }
    let getSearchCom = () => {
      return this.state.components.map((com, index) => {
        return <Select.Option key={index} value={com.name}>{com.name} {com.title}</Select.Option>
      })
    }
    return (
      <Layout>
        <DocHeader />
        <Layout className="main">
          <Layout.Sider className="docs-k-layout-sider">

            <Menu onSelect={this.routerChange.bind(this)} activeName={this.state.activeName} width="auto" className="left-menu">
              {
                baseNav.map(m => {
                  return <Menu.Item key={m.title}>{m.title}</Menu.Item>
                })
              }
              {renderLeftMenu()}
            </Menu>
          </Layout.Sider>
          <Layout.Content>
            {this.props.children}
            <Layout.Footer>
              KUI ©2018 Created by chuchur |
          <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备19016072号-2</a>
            </Layout.Footer>
          </Layout.Content>
        </Layout >
      </Layout >
    )
  }
}
DocLayout.contextTypes = {
  router: PropTypes.object.isRequired
}