import React from 'react'
import { Kui, PropTypes } from '@/components/kui' 
import code from './code/menuData'
import { Row, Col, Menu, Badge, Select, Icon } from '@/index'
import logo from './assets/favicon.png'
import vueIcon from './assets/vue.svg'
export default class Layout extends Kui {

  constructor(props) {
    super(props)
    this.state = {
      activeName: '',
      components: code.components
    }
  }

  componentWillMount() {
    this.setState({ activeName: this.context.router.route.location.pathname })
  }

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
      return code.nav.map((child, x) => renderGroup(child, x))
    }
    let getSearchCom = () => {
      return this.state.components.map((com, index) => {
        return <Select.Option key={index} value={com.name}>{com.name} {com.title}</Select.Option>
      })
    }
    return (
      <section className="body">
        <header>
          <div className="logo"><a href="/"><img src={logo} />K UIKIT</a></div>
          <div className="search-component">
            <Select placeholder="搜索组件..." filterable value={this.state.key} onChange={(path) => this.routerChange(path)}>
              {getSearchCom()}
            </Select>
          </div>
          <Menu style={{ float: 'right' }} mode="horizontal" activeName="/install" onSelect={(path) => this.routerChange(path)}>
            <Menu.Item name="/" icon="ios-home">首页</Menu.Item>
            <Menu.Item name="#/start" icon="ios-options">组件</Menu.Item>
            <Menu.Item name="https://vue.k-ui.cn"><img src={vueIcon} style={{ height: 15, margin: 0 }} />KUI VUE</Menu.Item>
            <Menu.Item name="https://gitee.com/chuchur/kui-react" icon="logo-github">GITEE</Menu.Item>
            <Menu.Item name="https://www.chuchur.com" icon="ios-leaf">Blog</Menu.Item>
          </Menu>
        </header>
        <section className="main">
          <Row>
            <Col span="4" className="colNav">
              {/* <Scroll> */}
              <nav className="nav">
                <Menu onSelect={this.routerChange.bind(this)} activeName={this.state.activeName} width="auto">
                  {renderLeftMenu()}
                </Menu>
              </nav>
              {/* </Scroll> */}
            </Col>
            <Col span="20" className="colMain">
              {/* <Scroll target="window"> */}
              <div className="content">
                {this.props.children}
              </div>
              {/* </Scroll> */}
            </Col>
          </Row>
        </section>
        <footer>
          <div className="ft-left">
            <ul>
              <li>链接</li>
              <li><a href="https://gitee.com/chuchur/kui-react" target="_blank">仓库代码</a></li>
              <li><a href="https://vue.k-ui.cn" target="_blank">KUI VUE</a></li>
              <li><a href="#/sponsor">支持作者</a></li>
              <li><a href="https://gitee.com/chuchur/kui-react" target="_blank">码云</a></li>
              <li><a href="#/about">关于</a></li>
            </ul>
            <p>© 2015-2019 Created by chuchur.com</p>
          </div>
          <div className="ft-right">
            <ul>
              <li>
                <a href="https://chuchur.com" target="_blank"><img src="//chuchur.com/favicon.png" />
                  <span>chuchur</span>
                </a>
              </li>
              <li>
                <a href="https://gitee.com/chuchur/kui-react" target="_blank">
                  <Icon type="ios-cloud" />
                  <span>gitee</span>
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </section >
    )
  }
}
Layout.contextTypes = {
  router: PropTypes.object.isRequired
}