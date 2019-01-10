import React from 'react'
import code from '../code/steps'
import Demo from '../components/demo'
import { Steps, Button } from '@/index'
const Step = Steps.Step
export default class steps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: code,
      current: 0
    }
  }
  setStep(t) {
    let { current } = this.state
    current = t == 'next' ? (current >= 3 ? 3 : current + 1) : (current <= 0 ? 0 : current - 1)
    this.setState({ current })
  }
  render() {
    return (<div>
      <h2>Steps 步骤条</h2>
      <p>拆分某项流程的步骤，引导用户按流程完成任务。</p>
      <h3>代码示例</h3>
      <Demo title="基本" layout="vertical">
        <div>
          <Steps current="1">
            <Step title="已完成" description="这里是步骤的描述信息" />
            <Step title="进行中" description="这里是步骤的描述信息" />
            <Step title="待进行" description="这里是步骤的描述信息" />
          </Steps>
        </div>
        <div>简单的步骤条。</div>
        <div>{code.base}</div>
      </Demo>
      <Demo title="迷你版" layout="vertical">
        <div>
          <Steps current="1" mini>
            <Step title="已完成" />
            <Step title="进行中" />
            <Step title="待进行" />
          </Steps>
        </div>
        <div>迷你版的步骤条，通过设置
          <code>mini</code> 启用.</div>
        <div>{code.mini}</div>
      </Demo>
      <Demo title="自定义图标" layout="vertical">
        <div>
          <Steps current="1">
            <Step title="登陆" icon="ios-lock" />
            <Step title="绑定手机" icon="md-phone-portrait" />
            <Step title="绑定邮箱" icon="md-mail" />
          </Steps>
        </div>
        <div>可以启用自定义图标。自定义
          <code>icon</code>
        </div>
        <div>{code.icon}</div>
      </Demo>
      <Demo title="步骤切换" layout="vertical">
        <div>
          <Steps current={this.state.current}>
            <Step title="步骤1" />
            <Step title="步骤2" />
            <Step title="步骤3" />
            <Step title="步骤4" />
          </Steps>
          <br />
          <Button onClick={this.setStep.bind(this, 'next')}>下一步</Button>
          <Button onClick={this.setStep.bind(this, 'prev')}>上一步</Button>
        </div>
        <div>通常配合内容及按钮使用，表示一个流程的处理进度。</div>
        <div>{code.test}</div>
      </Demo>
      <Demo title="步骤运行错误" layout="vertical">
        <div>
          <Steps current="1" status="error">
            <Step title="步骤1" description="这里是步骤的描述信息" />
            <Step title="步骤2" description="这里是步骤的描述信息" />
            <Step title="步骤3" description="这里是步骤的描述信息" />
            <Step title="步骤4" description="这里是步骤的描述信息" />
          </Steps>
        </div>
        <div>使用
          <code>Steps</code> 的
          <code>status</code> 属性来指定当前步骤的状态。</div>
        <div>{code.status}</div>
      </Demo>
      <Demo title="垂直方向" layout="vertical">
        <div>
          <Steps current="1" vertical>
            <Step title="步骤1" description="这里是步骤的描述信息" />
            <Step title="步骤2" description="这里是步骤的描述信息" />
            <Step title="步骤3" description="这里是步骤的描述信息" />
            <Step title="步骤4" description="这里是步骤的描述信息" />
          </Steps>
        </div>
        <div>简单的竖直方向的小型步骤条。</div>
        <div>{code.vertical}</div>
      </Demo>
      <h3>Steps API</h3>
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
              <td>指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 status 属性覆盖状态</td>
              <td>String,Number</td>
              <td>0</td>
            </tr>
            <tr>
              <td>vertical</td>
              <td>是否垂直显示，默认水平显示 </td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>mini</td>
              <td>是否显示迷你模式 </td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>status</td>
              <td>指定当前步骤的状态，可选 wait process finish error</td>
              <td>String </td>
              <td>process</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Step API</h3>
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
              <td>title</td>
              <td>步骤标题</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>description</td>
              <td>步骤的详情描述，可选 </td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>icon</td>
              <td>步骤图标的类型，可选 </td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>status</td>
              <td>指定当前步骤的状态，可选 wait process finish error</td>
              <td>String </td>
              <td>wait</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
}
