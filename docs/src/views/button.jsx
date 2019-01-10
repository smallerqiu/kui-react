import React, { Component } from 'react'
import {  Button, ButtonGroup } from '@/'

import Demo from '../components/demo'

import code from '../code/button'
export default class button extends Component {
  render() {
    return <div className="demo-button">
      <h2>Button 按钮</h2>
      <Demo title="基础">
        <div>
          <Button>Default</Button>
          <Button type="primary">Primary</Button>
          <Button type="primary" hollow>hollow</Button>
          <Button type="primary" circle>circle</Button> 
          <Button type="link" circle>link</Button>
        </div>
        <div>使用
        <code>type</code>属性来定义
        <code>Button</code> 的主题。提供7种主题，默认Default，<code>hollow</code>，<code>circle</code>呈现镂空和圆角</div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="禁用">
        <div>
          <Button type="primary">Primary</Button>
          <Button disabled type="primary">disabled</Button>
        </div>
        <div>通过添加
        <code>disabled</code>属性可将按钮设置为不可用状态。</div>
        <div>{code.disabled}</div>
      </Demo>
      <Demo title="带图标">
        <div>
          <Button type="primary" icon="ios-search">搜索</Button>
          <Button type="success" icon="ios-cloud-upload">上传</Button>
          <Button type="danger" icon="ios-cloud-download">下载</Button>
          <Button type="primary" icon="ios-play"/>
          <Button type="primary" icon="ios-pause"></Button>
          <Button type="primary" icon="ios-square"></Button>
        </div>
        <div>
          通过添加
        <code>icon</code>属性 设置按钮按钮图标。
        </div>
        <div>{code.withIcon}</div>
      </Demo>
      <Demo title="尺寸">
        <div>
          <Button type="primary">Primary</Button>
          <Button type="primary" mini>mini</Button>
        </div>
        <div>通过添加
        <code>mini</code>属性 设置按钮尺寸大小。</div>
        <div>{code.size}</div>
      </Demo>
      <Demo title="按钮组合">
        <div>
          <Button.Group>
            <Button>待发货</Button>
            <Button>已发货</Button>
            <Button>已签收</Button>
          </Button.Group>
          <Button.Group circle>
            <Button>待发货</Button>
            <Button>已发货</Button>
            <Button>已签收</Button>
          </Button.Group>
          <Button.Group mini>
            <Button>待发货</Button>
            <Button>已发货</Button>
            <Button>已签收</Button>
          </Button.Group>
        </div>
        <div>将多个
        <code>Button</code>放入
        <code>ButtonGroup</code>内，可实现按钮组合的效果。</div>
        <div>{code.group}</div>
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
              <td>按钮类型，可选值为primary、ghost、link、success、warning、danger或者不设置</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>mini</td>
              <td>按钮尺寸大小</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>circle</td>
              <td>按钮是否圆角</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>hollow</td>
              <td>按钮是否颜色镂空</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>icon</td>
              <td>按钮的图标</td>
              <td>String </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  }
}