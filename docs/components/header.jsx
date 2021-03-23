import React, { Component } from 'react'
import { Layout, Select, Menu } from '@/components/index'
import logo from '../assets/favicon.png'

export default class DocHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeName: '',
      components: []//code.components
    }
  }
  start() {
    this.props.history.push('/start')
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
    let getSearchCom = () => {
      return this.state.components.map((com, index) => {
        return <Select.Option key={index} value={com.name}>{com.name} {com.title}</Select.Option>
      })
    }
    return (<Layout.Header className="header">
      <div className="logo">
        <a href="/">
          <img src={logo} />K UIKIT
      </a>
      </div>
      <div className="search-component">
        <Select placeholder="搜索组件..." filterable value={this.state.key} onChange={(path) => this.routerChange(path)}>
          {getSearchCom()}
        </Select>
      </div >
      <Menu mode="horizontal" onClick={this.go} className="top-menu">
        <Menu.Item key="home" name="home">首页</Menu.Item>
        <Menu.Item key="start" name="start">组件</Menu.Item>
        <Menu.SubMenu key="shengtai" name="shengtai">
          <template slot="title">生态相关</template>
          <Menu.Item key="https://v2.k-ui.cn">KUI v2.x</Menu.Item>
          <Menu.Item key="https://gitee.com/chuchur/kui-vue">Gitee</Menu.Item>
          <Menu.Item key="https://react.k-ui.cn">KUI for React</Menu.Item>
          <Menu.Item key="https://www.chuchur.com">Blog</Menu.Item>
        </Menu.SubMenu>
        <Select size="small" width={100} style="margin-left:10px" v-model="version" transfer={false} >
          <Option value="3">3.x</Option>
          <Option value="2">2.x</Option>
        </Select >
      </Menu >
    </Layout.Header >)
  }
}