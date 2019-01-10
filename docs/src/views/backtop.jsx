import React from 'react';
import Demo from '../components/demo'
import code from '../code/backtop'
import { Row, Col, BackTop } from '@/index'
export default class backtop extends React.Component {

  render() {
    const style = {
      background: '#2d94ff',
      height: '40px',
      lineHeight: '40px',
      textAlign: 'center',
      color: '#fff'
    }
    return (<div className="backtop">
      <h2>BackTop</h2>
      <p>当页面内容冗长，需要快捷返回顶部时使用，一般放置在页面右下角位置。</p>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12">
          <Demo title="基础用法" layout="vertical">
            <div>
              向下滚动页面，灰色的按钮为默认效果。
                        <BackTop></BackTop>
            </div>
            <div>
              默认位置距离页面右部和底部 50px，滚动至距顶端 400px 时显示。
                    </div>
            <div>{code.base}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo title="基础用法" layout="vertical">
            <div>
              自定义按钮为蓝色的按钮
              <BackTop bottom="90" right="100">
                <div style={style}>UP</div>
              </BackTop>
            </div>
            <div>
              可以自定义回到顶部按钮的样式
                        <code>bottom</code>为90px，
                        <code>right</code>为100px
                    </div>
            <div>{code.custom}</div>
          </Demo>
        </Col>
      </Row>
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
              <td>height</td>
              <td>页面滚动高度达到该值时才显示
                            <code>BackTop</code>组件 </td>
              <td>String,Number</td>
              <td>400</td>
            </tr>
            <tr>
              <td>bottom</td>
              <td>组件距离底部的距离 </td>
              <td>String,Number </td>
              <td>40</td>
            </tr>
            <tr>
              <td>right</td>
              <td>组件距离右部的距离 </td>
              <td>String,Number </td>
              <td>40</td>
            </tr>
            <tr>
              <td>onClick</td>
              <td>点击按钮时触发 </td>
              <td>Function </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
}