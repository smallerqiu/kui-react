import code from '../code/poptip'
import Demo from '../components/demo'
import React from 'react'
import { Row, Col, Button, Poptip, Message } from '@/index'
export default class poptip extends React.Component {
  ok() {
    Message.success('你点了确定')
  }
  cancel() {
    Message.info('你点了取消')
  }
  render() {
    let content = (
      <div slot="content" className="k-table k-table-border">
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>电话</th>
              <th>住址</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>张山</td>
              <td>13256652545</td>
              <td>广东省深圳市宝安区软件产业基地三诺大厦19楼</td>
            </tr>
            <tr>
              <td>王二</td>
              <td>36254525658</td>
              <td>浙江省杭州市阿里西溪园区3A18楼</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
    return (<div>
      <h2>Poptip 气泡提示</h2>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12">
          <Demo title="基本">
            <div>
              <Poptip trigger="hover" title="标题" content="内容">
                <Button>hover激活</Button>
              </Poptip>
              <Poptip trigger="click" title="标题" content="内容">
                <Button>click激活</Button>
              </Poptip>
            </div>
            <div>可以分别使用
            <code>click</code>和
            <code>hover</code>来触发展示</div>
            <div>{code.base}</div>
          </Demo>
          <Demo title="位置">
            <div slot="content" style={{ overflow: 'hidden' }}>
              <div style={{ marginLeft: '80px', whiteSpace: 'nowrap' }}>
                <Poptip title="标题" content="内容" placement="top-left">
                  <Button>上左</Button>
                </Poptip>
                <Poptip title="标题" content="内容" placement="top">
                  <Button>上边</Button>
                </Poptip>
                <Poptip title="标题" content="内容" placement="top-right">
                  <Button>上右</Button>
                </Poptip>
              </div>
              <div style={{ float: 'left', height: '150px', width: '80px' }}>
                <Poptip title="标题" content="内容" placement="left-top">
                  <Button>左上</Button>
                </Poptip>
                <Poptip title="标题" content="内容" placement="left">
                  <Button>左边</Button>
                </Poptip>
                <Poptip title="标题" content="内容" placement="left-bottom">
                  <Button>左下</Button>
                </Poptip>
              </div>
              <div style={{ marginLeft: '300px', height: '150px', width: '80px' }}>
                <Poptip title="标题" content="内容" placement="right-top">
                  <Button>右上</Button>
                </Poptip>
                <Poptip title="标题" content="内容" placement="right">
                  <Button>右边</Button>
                </Poptip>
                <Poptip title="标题" content="内容" placement="right-bottom">
                  <Button>右下</Button>
                </Poptip>
              </div>
              <div style={{ marginLeft: '80px', whiteSpace: 'nowrap' }}>
                <Poptip title="标题" content="内容" placement="bottom-left">
                  <Button>下左</Button>
                </Poptip>
                <Poptip title="标题" content="内容" placement="bottom">
                  <Button>下边</Button>
                </Poptip>
                <Poptip title="标题" content="内容" placement="bottom-right">
                  <Button>下右</Button>
                </Poptip>
              </div>
            </div>
            <div>
              <code>Poptip</code>的位置一共有12种，通过
            <code>placement</code>控制</div>
            <div>{code.position}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo title="嵌套">
            <div>
              <Poptip trigger="click" content={content} placement="right-top">
                <Button>Click me</Button>
              </Poptip>
            </div>
            <div>通过
            <code>content</code>来自定义展示内容</div>
            <div>{code.slot}</div>
          </Demo>
          <Demo title="确认框">
            <div>
              <Poptip confirm title="您确认删除这条内容吗？" onOk={this.ok} onCancel={this.cancel}>
                <Button type="danger">删除</Button>
              </Poptip>
              <Poptip confirm title="Are you OK?" onOk={this.ok} onCancel={this.cancel} okText="yes" cancelText="no">
                <Button>config</Button>
              </Poptip>
            </div>
            <div>启用
            <code>confirm</code>来自定义一个确认框模式</div>
            <div>{code.confirm}</div>
          </Demo>
        </Col>
      </Row >

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
              <td>trigger</td>
              <td>触发方式，可选值为hover（悬停）click（点击）,在 confirm 模式下，只有 click 有效</td>
              <td>String</td>
              <td>click</td>
            </tr>
            <tr>
              <td>title</td>
              <td>显示的标题</td>
              <td>String </td>
              <td>-</td>
            </tr>
            <tr>
              <td>content</td>
              <td>显示的正文内容，只在非 confirm 模式下有效</td>
              <td>String </td>
              <td>-</td>
            </tr>
            <tr>
              <td>placement</td>
              <td>提示框出现的位置，可选值为top，top-left，top-right，bottom，bottom-left，bottom-right，left，left-top，left-bottom，right，right-top，right-bottom</td>
              <td>String </td>
              <td>top</td>
            </tr>
            <tr>
              <td>width</td>
              <td>宽度，最小宽度为 150px，在 confirm 模式下，默认最大宽度为 300px</td>
              <td>String </td>
              <td>-</td>
            </tr>
            <tr>
              <td>confirm</td>
              <td>是否开启对话框模式</td>
              <td>Boolean </td>
              <td>false</td>
            </tr>
            <tr>
              <td>transfer</td>
              <td>是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>okText</td>
              <td>确定按钮的文字，只在 confirm 模式下有效</td>
              <td>String </td>
              <td>确定</td>
            </tr>
            <tr>
              <td>cancelText</td>
              <td>取消按钮的文字，只在 confirm 模式下有效</td>
              <td>String </td>
              <td>取消</td>
            </tr>
            <tr>
              <td>onCancel</td>
              <td>点击取消的回调，只在 confirm 模式下有效</td>
              <td>Function </td>
              <td>-</td>
            </tr>
            <tr>
              <td>onOk</td>
              <td>点击确定的回调，只在 confirm 模式下有效</td>
              <td>Function </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div >)
  }
}

