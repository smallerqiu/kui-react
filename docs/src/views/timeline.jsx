import React from 'react'
import code from '../code/timeline'
import Demo from '../components/demo'
import TimeLine from '@/components/timeline'
export default class timeline extends React.Component {
  render() {
    return (<div>
      <h2>TimeLine 时间轴</h2>
      <h3>代码示例</h3>
      <Demo title="基础">
        <div>
          <TimeLine>
            <TimeLine.Item>发布1.0版本</TimeLine.Item>
            <TimeLine.Item>发布1.0版本</TimeLine.Item>
            <TimeLine.Item>发布1.0版本</TimeLine.Item>
          </TimeLine>
        </div>
        <div>
          <code>TimeLine</code>内部必须包含
        <code>TimeLine.Item</code>
        </div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="图标">
        <div>
          <TimeLine>
            <TimeLine.Item icon="ios-ribbon">发布2.0版本</TimeLine.Item>
            <TimeLine.Item icon="ios-bug">修复bug</TimeLine.Item>
            <TimeLine.Item>发布1.0版本</TimeLine.Item>
          </TimeLine>
        </div>
        <div>给
        <code>TimeLine.Item</code>设置
        <code>icon</code>可以改变图标展示</div>
        <div>{code.withIcon}</div>
      </Demo>
      <Demo title="颜色">
        <div>
          <TimeLine>
            <TimeLine.Item icon="ios-ribbon" color="#cba302">发布2.0版本</TimeLine.Item>
            <TimeLine.Item icon="ios-bug" color="red">修复bug</TimeLine.Item>
            <TimeLine.Item>发布1.0版本</TimeLine.Item>
          </TimeLine>
        </div>
        <div>
          <code>color</code>可以改变图标的颜色</div>
        <div>{code.color}</div>
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
              <td>icon</td>
              <td>时间轴item 图标</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>color</td>
              <td>时间轴item 颜色</td>
              <td>String</td>
              <td>String</td>
            </tr>
            <tr>
              <td>dot</td>
              <td>自定义时间轴点</td>
              <td>ReactNode</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
} 