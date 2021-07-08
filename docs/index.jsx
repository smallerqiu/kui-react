import React, { Component } from 'react'
import { Button, Layout } from 'react-kui'
import Header from './components/header'
import './assets/home.less'
export default class Index extends Component {
  start() {
    this.props.history.push('/docs/start')
  }
  gitee() {
    window.open("//gitee.com/chuchur/kui-vue");
  }
  render() {
    return (<Layout className="index">
      <Header history={this.props.history} />
      <section className="index-content">
        <div className="logo">K UI</div>
        <h1>轻量级桌面UI组件库 for React</h1>
        <div className="btn-content">
          <Button className="start" onClick={this.start.bind(this)} size="large">开始使用</Button>
          <Button icon="logo-github" size="large" onClick={this.gitee.bind(this)}>Gitee</Button>
        </div>
      </section>
      <footer className="index-footer">
        <p>Copyright ©2009-2018
          <a href="http://www.chuchur.com">禅境花园</a> by chuchur <a href="https://beian.miit.gov.cn" target="_blank">粤ICP备17111365号-2</a> </p>
      </footer>
    </Layout>)
  }
}