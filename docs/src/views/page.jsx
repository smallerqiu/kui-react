import React from 'react'
import Demo from '../components/demo'
import { Page, Button } from '@/index'
import code from '../code/page'
export default class page extends React.Component {
  constructor(props) {
    super(props)
  }
  onChange(page) {
    console.log(page)
  }

  render() {
    return (<div>
      <h2>Page 分页</h2>
      <h3>代码示例</h3>
      <Demo title="基础" layout="vertical">
        <div>
          <Page total="100" current="1" pageSize="10"></Page>
        </div>
        <div>基本分页，
          <code>total</code>为总页数，
          <code>current</code>为当前页码，
          <code>pagesize</code>为页码分组</div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="尺寸" layout="vertical">
        <div>
          <Page total="60" current="1" pageSize="10" mini onChange={this.onChange.bind(this)}></Page>
        </div>
        <div>设置
          <code>mini</code>可设置组件小尺寸展示，
          <code>change</code>为页码改变触发事件</div>
        <div>{code.size}</div>
      </Demo>
      <Demo title="显示辅助分页" layout="vertical">
        <div>
          <Page total="60" current="1" showSizer showElevator showTotal pageSize="15" mini onChange={this.onChange.bind(this)}></Page>
        </div>
        <div>可以切换每页显示的数量。</div>
        <div>{code.sizer}</div>
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
              <td>current</td>
              <td>当前页码</td>
              <td>Number,String</td>
              <td>1</td>
            </tr>
            <tr>
              <td>total</td>
              <td>数据总数</td>
              <td>Number,String</td>
              <td>0</td>
            </tr>
            <tr>
              <td>pageSize</td>
              <td>每页条数</td>
              <td>Number,String </td>
              <td>10</td>
            </tr>
            <tr>
              <td>showSizer</td>
              <td>是否显示页码组</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>showTotal</td>
              <td>是否显示总数</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>showElevator</td>
              <td>是否显示跳转</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>sizeData</td>
              <td>自定义页码组数据</td>
              <td>Array </td>
              <td>[10,15,20,30,40]</td>
            </tr>
            <tr>
              <td>mini</td>
              <td>是否为迷你风格</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>页码改变的回调，返回改变后的页码</td>
              <td>Function</td>
              <td>-</td>
            </tr>
            <tr>
              <td>onPageSizeChange</td>
              <td>切换页码组改变的回调，返回改变后的page-size</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
}