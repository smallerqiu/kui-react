import React, { Component } from 'react' 
import { Button } from '@/index'
import logo from '../assets/favicon.png'
export default class Index extends Component {
  start() {
    this.props.history.push('/start')
  } 
  render() {
    return (<section className="index">
      <header className="header">
        <div className="nav">
          <div className="nav-left">
            <div className="logo">
              <a href="/">
                <img src={logo} alt="K UIKIT" />
                <span>K UIKIT</span>
              </a>
            </div>
          </div>
          <div className="nav-right">
            <ul>
              <li><a href="/">首页</a> </li>
              <li><a href="#/start">组件</a> </li>
              <li><a href="//chuchur.github.io/kui-vue/" target="_blank">KUI VUE</a></li>
              <li><a href="//github.com/chuchur/kui-react">GITHUB</a></li>
              <li><a href="//chuchur.com">BLOG</a></li>
            </ul>
          </div>
        </div>
      </header>
      <section className="index-content">
        <div className="logo">K UI</div>
        <h1>一枚高质量前端UI组件库</h1>
        <div className="btn-content">
          <Button className="start" onClick={this.start.bind(this)}>开始使用</Button>
          <Button icon="logo-github" className="github"><a href="//github.com/chuchur/kui-react" target="_blank">Github</a></Button>
        </div>
      </section>
    </section>)
  }
}