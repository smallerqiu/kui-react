import React, { Component } from 'react'
import { Layout, Select, Menu, SubMenu } from '@/components/index'
import logo from '../assets/favicon.png'
import { Nav } from "../menu";

export default class DocHeader extends Component {
  state = {
    activeName: '',
    components: []//code.components
  }

  go({ key, keyPath, item }) {
    if (key == "home") {
      this.topMenu = ['home']
      this.$router.push("/");
    } else if (key == '/components/all') {
      this.$router.push("/components/all");
    } else {
      open(key);
    }
  }
  change({ value }) {
    this.$router.push(`/components/${value}`);
    setTimeout(() => (this.key = ""), 500);
  }
  changeV({ value }) {
    if (value == "2") {
      open("https://v2.k-ui.cn");
    }
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
        <Select placeholder="搜索组件..." filterable value={this.state.key} onChange={(path) => this.change(path)}>
          {getSearchCom()}
        </Select>
      </div >
      {/* <Menu mode="horizontal" onClick={this.go} className="top-menu">
        <Menu.Item key="home" name="home">首页</Menu.Item>
        <MenuItem key="/components/all">组件</MenuItem>
        <SubMenu key="shengtai" name="shengtai">
          <template slot="title">生态相关</template>
          <Menu.Item key="https://v2.k-ui.cn">KUI v2.x</Menu.Item>
          <Menu.Item key="https://gitee.com/chuchur/kui-vue">Gitee</Menu.Item>
          <Menu.Item key="https://react.k-ui.cn">KUI for React</Menu.Item>
          <Menu.Item key="https://www.chuchur.com">Blog</Menu.Item>
        </SubMenu>
        <Select size="small" width={100} style="margin-left:10px" v-model="version" transfer={false} >
          <Option value="3">3.x</Option>
          <Option value="2">2.x</Option>
        </Select >
      </Menu > */}
    </Layout.Header >)
  }
}