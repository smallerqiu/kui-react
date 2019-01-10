import React from 'react';
import Demo from '../components/demo'
import Code from '../components/code'
import code from '../code/message'
import { Button, Alert, Message } from '@/index'
export default class message extends React.Component {
  config() {
    Message.config({
      type: "info",
      duration: 0,
      closable: true,
      content: "手动关闭",
      onClose: () => { alert('callback') }
    });
  }
  render() {
    return (<div>
      <h2>Message 全局提示</h2>
      <h3>代码示例</h3>
      <Demo title="基础用法">
        <div>
          <Button onClick={()=>Message.info("普通提示")} type="primary">普通提示 </Button>
        </div>
        <div>
          <code>Message</code>的基本用法</div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="提示类型">
        <div>
          <Button onClick={()=>Message.warning("警告提示")} type="warning">警告提示 </Button>
          <Button onClick={()=>Message.success("成功提示")} type="success">成功提示 </Button>
          <Button onClick={()=>Message.error("错误提示")} type="danger">错误提示 </Button>
        </div>
        <div>通过
          <code>type</code>来设置提示类型</div>
        <div>{code.type}</div>
      </Demo>
      <Demo title="自定义时长">
        <div>
          <Button onClick={()=>Message.success("10秒后关闭的", 10)} type="success">10秒后关闭</Button>
          <Button onClick={()=>Message.error("5秒后关闭的", 5)} type="primary">5秒后关闭</Button>
          <Button onClick={this.config} type="primary">手动关闭</Button>
        </div>
        <div>可以自定义配置，其中
          <code>duration</code>来控制自动关闭时长</div>
        <div>{code.time}</div>
      </Demo>
      <h3>API</h3>
      <Alert>组件提供了一些静态方法，使用方式如下</Alert>
      <Code lang="js">{code.static}</Code>
      <Alert>另外提供了全局配置和全局销毁的方法：</Alert>
      <Code lang="js">{code.destory}</Code>
      <p>参数 options 为对象，具体说明如下：</p>
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
              <td>提示类型，提供 info、success、error、warning四种可选类型</td>
              <td>String</td>
              <td>info</td>
            </tr>
            <tr>
              <td>content</td>
              <td>提示内容</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>duration</td>
              <td>自动关闭的延时，单位秒,0为 不自动关闭</td>
              <td>Number</td>
              <td>3</td>
            </tr>
            <tr>
              <td>closable</td>
              <td>是否可手动关闭</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>onClose</td>
              <td>关闭时的回调</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
} 
