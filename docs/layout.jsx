import React from 'react'
import { Kui, PropTypes } from '@/components/kui'
import { Nav, baseNav } from "./menu";
import { Row, Col, Menu, SubMenu, Badge, Icon, Layout } from '@/components'
import Header from './components/header'
import './assets/index.less'

export default class DocLayout extends Kui {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  state = {
    prev: {}, next: {},
    typo: false,
    activeName: [],
    pathname: this.context.router.history.location
  }

  componentDidMount() {
    let { pathname } = this.context.router.history.location
    this.setActiveKey({ path: pathname })
  }
  componentDidUpdate(prevProps, prevState, snap) {
    let { pathname } = this.state
    let newPathname = this.context.router.history.location.pathname
    if (pathname != newPathname) {
      this.setState({ pathname: newPathname })
      this.setActiveKey({ path: newPathname })
    }
  }

  go({ key, keyPath, item }) {
    if (!key) return;
    let { current } = this.getPath(key), path;
    if (!current) {
      path = key
    } else {
      let { title, sub, name } = current
      document.title = `${title} ${sub || ""} - KUI`;
      path = (sub ? "/components/" : "/docs/") + key;
      this.setState({ typo: !sub })
    }
    this.context.router.history.push(path);

    // setTimeout(() => {
    window.scrollTo(0, 0)
    // }, 1000);
  }
  getPath(name) {
    const data = Nav.concat([
      {
        title: "m",
        child: baseNav,
      },
    ]);
    let routes = data.reduce((x, y) => x.concat(y.child), [])
    let index = routes.findIndex(x => x.name == name)
    return { current: routes[index], prev: routes[index - 1], next: routes[index + 1] }
  }

  setActiveKey({ path }) {
    let key = path.replace(/\/docs\/|\/components\//, "").toLowerCase();
    let { current, prev = {}, next = {} } = this.getPath(key);
    let { typo, activeName } = this.state
    if (path == '/components/all') {
      prev = baseNav[5]
      next = Nav[0].child[0]
      document.title = `组件总览 - KUI`;
      activeName = [path];
    } else if (current) {
      let { title, sub, name } = current;
      document.title = `${title} ${sub || ""} - KUI`;
      typo = !sub
      activeName = [name]
    }
    this.setState({
      prev, next, typo, activeName
    })
  }
  render() {
    let { activeName, typo, prev, next } = this.state
    return (
      <Layout>
        <Header />
        <Layout className="main">
          <Layout.Sider className="docs-k-layout-sider">
            <Menu selectedKeys={activeName} className="left-menu" onClick={this.go.bind(this)} mode="inline" openKeys={['components']}>
              {
                baseNav.map(m => {
                  return <Menu.Item key={m.name}>
                    {m.badeg ?
                      <Badge dot >{m.title}</Badge> :
                      m.title}
                  </Menu.Item>
                })
              }
              <SubMenu key="components" title="Components(65)">
                <Menu.Item key="/components/all">组件总览</Menu.Item>
                {
                  Nav.map(({ child, title }, x) => {
                    return (<Menu.Group title={title} name={title} key={'sub' + x}>
                      {
                        child.map(({ icon, name, sub, title }) => {
                          return (<Menu.Item icon={icon} key={name}>
                            <span>{sub}</span>
                            <span className="sub">{title}</span>
                          </Menu.Item>)
                        })
                      }
                    </Menu.Group>)
                  })
                }
              </SubMenu>
            </Menu>
          </Layout.Sider>
          <Layout.Content className={this.className({ 'typo': typo })}>
            {this.props.children}
            <Row className="foot-nav">
              <Col span={12}>
                <a onClick={() => this.go({ key: prev.name })}>
                  <Icon type="chevron-back-outline" />{prev.name}
                </a>
              </Col>
              <Col span={12}>
                <a onClick={() => this.go({ key: next.name })}>{next.name}
                  <Icon type="chevron-forward-outline" />
                </a>
              </Col>
            </Row>
            <Layout.Footer className="docs-k-footer">
              KUI ©2018 Created by chuchur |
              <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备19016072号-2</a>
            </Layout.Footer>
          </Layout.Content>
        </Layout >
      </Layout >
    )
  }
}