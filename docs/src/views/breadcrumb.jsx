import React from 'react'
import Demo from '../components/demo'
import code from '../code/breadcrumb'
import Breadcrumb from '@/components/breadcrumb'
const Item = Breadcrumb.Item
export default class breadcrumb extends React.Component {
  render() {
    return (
      <div>
        <h2>Breadcrumb 面包屑</h2>
        <p>显示当前页面在系统层级结构中的位置，并能向上返回。</p>
        <h3>代码示例</h3>
        <Demo title="基础用法">
          <div>
            <Breadcrumb>
              <Item to="/">Home</Item>
              <Item to="/breadcrumb">breadcrumb</Item>
              <Item>other</Item>
            </Breadcrumb>
          </div>
          <div>
            通过
                <code>to</code>添加跳转链接
            </div>
          <div>{code.base}</div>
        </Demo>
        <Demo title="设置图标">
          <div>
            <Breadcrumb>
              <Item to="/" icon="ios-home">Home</Item>
              <Item to="/breadcrumb" icon="logo-buffer">breadcrumb</Item>
              <Item icon="ios-heart">other</Item>
            </Breadcrumb>
          </div>
          <div>
            通过
                <code>icon</code>设置图标
            </div>
          <div>{code.icon}</div>
        </Demo>
        <Demo title="分隔符">
          <div>
            <Breadcrumb>
              <Item to="/" icon="ios-home" separator="~">Home</Item>
              <Item to="/breadcrumb" icon="logo-buffer" separator="~">breadcrumb</Item>
              <Item icon="ios-heart" separator="~">other</Item>
            </Breadcrumb>
          </div>
          <div>
            通过
                <code>separator</code>设置分隔符
            </div>
          <div>{code.separator}</div>
        </Demo>
        <h3>Item API</h3>
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
                <td>separator</td>
                <td>自定义分隔符</td>
                <td>String</td>
                <td>/</td>
              </tr>
              <tr>
                <td>to</td>
                <td>自定义链接函数,和 <code>react-router-dom</code>配合使用 </td>
                <td>String </td>
                <td>-</td>
              </tr>
              <tr>
                <td>replace</td>
                <td>路由跳转时，开启 replace 将不会向 history 添加新记录</td>
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
    );
  }
}
