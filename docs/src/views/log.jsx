import React from 'react'
import TimeLine from '@/components/timeline'
export default class log extends React.Component {
  render() {
    return (<div className="demo-logs">
      <h2>更新日志</h2>
      <TimeLine>
        <TimeLine.Item>
          <h3>1.0.8
          <span>2018-8-8</span>
          </h3>
          <p>重新设计了logo，干掉了文档的左右分裂阅读模式。</p>
          <p>图标库升级到4.3.0，使用更加规范，有效区分了ios和安卓粗细线条</p>
          <p>修复Message，Notice组件关闭时卡顿的问题</p>
          <p>修复Row，Col组件gutter的bug</p>
          <p>完善部分组件的动画切换，更加流畅</p>
          <p>Input 组件新增iconAlign属性，可以控制图标显示位置</p>
          <p>修复TimeLine组件图标不显示问题</p>
          <p>修复Poptip组件位置显示问题</p>
          <p>修复Tooltip组件位置显示问题</p>
          <p>修复Tabs组件滚动问题</p>
          <p><code>Tabs</code>新增animated属性控制切换动画</p>
          <p>去调了一部分组件多余的事件绑定</p>
          <p>文档可以搜索组件</p>
        </TimeLine.Item>
        <TimeLine.Item>
          <h3>1.0.7
          <span>2018-7-15</span>
          </h3>
          <p>完善所有组件自定义style和className的问题</p>
          <p>优化Row 和 Col 子组件</p>
        </TimeLine.Item>
        <TimeLine.Item>
          <h3>1.0.6
          <span>2018-7-14</span>
          </h3>
          <p>修复组件引用的问题</p>
        </TimeLine.Item>
        <TimeLine.Item>
          <h3>1.0.5
          <span>2018-7-13</span>
          </h3>
          <p>修复编译问题</p>
        </TimeLine.Item>
        <TimeLine.Item>
          <h3>1.0.4
          <span>2018-7-12</span>
          </h3>
          <p>Menu组件细节优化和一些调整</p>
        </TimeLine.Item>
        <TimeLine.Item>
          <h3>1.0.3
          <span>2018-7-11</span>
          </h3>
          <p>编译优化</p>
        </TimeLine.Item>
        <TimeLine.Item>
          <h3>1.0.2
          <span>2018-7-11</span>
          </h3>
          <p>修复<code>Breadcrumb</code>组件自定义style的问题</p>
          <p>新增<code>Layout</code>一系列布局组件</p>
        </TimeLine.Item>
        <TimeLine.Item>
          <h3>1.0.1
          <span>2018-7-10</span>
          </h3>
          <p>修复React 16.x 版本下部分组件ref传递错误的问题</p>
          <p>修复<code>DatePicker</code>特定情况下换行的bug</p>
        </TimeLine.Item>
        <TimeLine.Item>
          <h3>1.0.0
          <span>2018-7-1</span>
          </h3>
          <p>1.0发布，转入公测</p>
        </TimeLine.Item>
        <TimeLine.Item icon="ios-flask">
          <h3> 0.0.1
          <span>2018-5-27</span>
          </h3>
          <p>着手开发</p>
        </TimeLine.Item>
      </TimeLine>
    </div>)
  }
}