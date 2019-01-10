import React from 'react'
import { Icon, Input, Radio, Message } from '@/'

import Demo from '../components/demo'

import code from '../code/icon'

import { Kui, PropTypes } from '@/components/kui'
export default class icon extends Kui {

  constructor(props) {
    super(props)
    this.state = {
      key: '',
      all: [],
      applist: [],
      searchList: [],
      copyhtml: '',
      iconType: 'ios'
    }
    this.onChange = this.onChange.bind(this)
  }
  switchIcon(name) {
    let icons = [...name == 'ios' ? code.icons.ios : code.icons.md]
    this.setState({ iconType: name, applist: icons })
  }
  componentWillMount() {
    let { all, applist } = this.state
    all = [...code.icons.ios, ...code.icons.md, ...code.icons.logo]
    applist = code.icons.ios
    this.setState({ all, applist })
  }
  copy(x) {
    // this.setState({copyhtml : })
    this.refs.copyDom.value = `<Icon type="${x}" />`
    setTimeout(() => {
      this.refs.copyDom.select()
      document.execCommand("copy");
      Message.success('复制成功！')
    })
  }
  onChange(e) {
    let value = e.target.value;
    let list = value ? this.state.all.filter(x => x.indexOf(e.target.value) >= 0) : []
    this.setState({ searchList: list, key: e.target.value })
  }
  getIcons(data) {
    return data.map(icon => {
      return (<span onClick={this.copy.bind(this, icon)} key={icon}>
        <Icon type={icon} />
      </span>)
    })
  }
  render() {
    let { applist, searchList, iconType } = this.state

    return <div>
      <h2>Icon 图标</h2>
      <p>kui 的图标使用开源项目
      <a href="http://ionicons.com/" target="_blank">ionicons</a>，当前版本4.3.0
    </p>
      <h3>使用</h3>
      <Demo title="基础">
        <div>
          <Icon type="ios-home" />
          <Icon type="ios-home" size="25" />
          <Icon type="ios-home" size="25" color="red" />
        </div>
        <div>
          可以通过
        <code>type</code>,
        <code>size</code>
          <code>color</code>属性分别设置图标的类型、大小、颜色
        </div>
        <div>{code.base}</div>
      </Demo>
      <h3>API</h3>
      <div className="table-border">
        <table>
          <tbody>
            <tr>
              <th>属性</th>
              <th>说明</th>
              <th>类型</th>
              <th>默认值</th>
            </tr>
            <tr>
              <td>type</td>
              <td>图标的名称</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>size</td>
              <td>图标的大小，单位是 px</td>
              <td>String,Number </td>
              <td>-</td>
            </tr>
            <tr>
              <td>color</td>
              <td>图标的颜色</td>
              <td>String </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>图标列表</h3>
      <Input placeholder="搜索图标，点击图标即可复制" className="icon-search-box" value={this.state.key} onChange={this.onChange.bind(this)} />
      <br />
      <br />
      {searchList.length ? <div className="search-icons">
        <h3>Search icons </h3>
        <div className="icon-item">
          {this.getIcons(searchList)}
        </div>
      </div> :
        <div className="show-icons" v-if="!searchList.length">
          <div className="icon-head">
            <h3>App icons </h3>
            <div className="icon-title">
              <Radio.Group value={iconType} onChange={(v) => this.switchIcon(v)}>
                <Radio.Button value="ios" label="IOS"></Radio.Button>
                <Radio.Button value="Material" label="Material"></Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <br/>
          <br/>
          <div className="icon-item">
            {this.getIcons(applist)}
          </div>
          <h3>Logos</h3>
          <div className="icon-item">
            {this.getIcons(code.icons.logo)}
          </div>
        </div>}

      <input type="text" ref="copyDom" style={{ position: 'absolute', left: -9999 }} />
    </div>
  }
} 