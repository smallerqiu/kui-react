import React, { Component } from 'react'
import { Layout, Select, Menu, Dropdown, Icon, Button, Message } from '../../components/index'
import logo from '../assets/favicon.png'
import { Nav } from "../menu";
import { version } from '../../package.json'
const { Option } = Select
const components = Nav.reduce((a, b) => a.concat(b.child), [])
// import PropTypes from 'prop-types'

// import { createBrowserHistory  } from 'history'
// const history = createBrowserHistory();

export default class DocHeader extends Component {

  state = {
    activeName: '',
    components: components,
    v: "2",
    key: "",
    topMenu: [],
  }
  menuClick = ({ key, keyPath, item }) => {
    let { history } = this.props
    if (key == "home") {
      this.setState({ topMenu: ['home'] })
      history.push('/')
    } else if (key == '/components/all') {
      history.push(key)
    } else {
      open(path);
    }
  }
  toComponents = (key) => {
    this.props.history.push(`/components/${key}`)
    this.setState({ key })
    setTimeout(() => this.setState({ key: '' }), 500);
  }
  openOutLink = ({ key }) => {
    open(key);
  }
  changeVersion = (v) => {
    this.setState({ v })
    if (v == "1") {
      Message.info('建议使用2.x版本')
    }
  }
  componentDidMount() {
    let topMenu = this.props.history.location.pathname == '/' ? ['home'] : ['/components/all']
    this.setState({ topMenu })
  }
  render() {
    const menu = <Menu>
      <Menu.Item key="https://k-ui.cn">KUI for Vue</Menu.Item>
      <Menu.Item key="https://gitee.com/chuchur/kui-react">源码</Menu.Item>
      <Menu.Item key="https://gitee.com/chuchur/kui-react/issues">提交Bug</Menu.Item>
      <Menu.Item key="https://chuchur.com">Blog</Menu.Item>
    </Menu>
    const { v, key, topMenu } = this.state
    return (<Layout.Header className="header">
      <div className="logo">
        <a href="/">
          <img src={logo} />K UIKIT
          <sub>v {version}</sub>
        </a>
      </div>
      <div className="search-component">
        <Select
          placeholder="🔍 搜索组件..."
          filterable
          value={key}
          bordered={false}
          showArrow={false}
          onChange={this.toComponents}>
          {
            components.map((com, i) => {
              return (
                <Option key={i} value={com.name}>{com.title} {com.sub}</Option>
              )
            })
          }
        </Select>
      </div >
      <Menu mode="horizontal" onClick={this.menuClick} className="top-menu" selectedKeys={topMenu}>
        <Menu.Item key="home">首页</Menu.Item>
        <Menu.Item key="/components/all">组件</Menu.Item>
      </Menu>
      <Select size="small" width={100} style={{ margin: '0 10px' }} value={v} onChange={this.changeVersion}>
        <Option value="2">2.0</Option>
        <Option value="1">1.x</Option>
      </Select>
      <Dropdown trigger="click"
        placement="bottom-right"
        content={menu}
        onClick={this.openOutLink}>
        <Button size="small">更多
          <Icon type="chevron-down-outline" />
        </Button>
      </Dropdown>
      <img src="https://img.shields.io/npm/v/react-kui.svg?style=flat-square" style={{ height: 24, marginLeft: 10 }} />
    </Layout.Header >)
  }
}