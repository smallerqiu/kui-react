let code = {}

code.base = `
import { Steps } from 'react-kui';
const Step = Steps.Step
ReactDOM.render() {
  return (<Steps current="1">
  <Step title="已完成" description="这里是步骤的描述信息" />
  <Step title="进行中" description="这里是步骤的描述信息" />
  <Step title="待进行" description="这里是步骤的描述信息" />
</Steps>)
}`

code.mini = `import { Steps } from 'react-kui';
const Step = Steps.Step
ReactDOM.render() {
  return (<Steps current="1" mini>
  <Step title="已完成" />
  <Step title="进行中" />
  <Step title="待进行" />
</Steps>) 
}`

code.icon = `import { Steps } from 'react-kui';
const Step = Steps.Step
ReactDOM.render() {
  return (<Steps current="1">
    <Step title="登陆" icon="ios-lock" />
    <Step title="绑定手机" icon="md-phone-portrait" />
    <Step title="绑定邮箱" icon="md-mail" />
</Steps>)
}`

code.test = `import { Steps } from 'react-kui';
const Step = Steps.Step
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
ReactDOM.render() {
  return (<Steps current={this.state.current}>
    <Step title="步骤1" />
    <Step title="步骤2" />
    <Step title="步骤3" />
    <Step title="步骤4" />
  </Steps>
  <br />
  <Button onClick={this.setStep.bind(this, 'next')}>下一步</Button>
  <Button onClick={this.setStep.bind(this, 'prev')}>上一步</Button>) 
}`

code.status = `import { Steps } from 'react-kui';
const Step = Steps.Step
ReactDOM.render() {
  return (<Steps current="1" status="error">
    <Step title="步骤1" description="这里是步骤的描述信息" />
    <Step title="步骤2" description="这里是步骤的描述信息" />
    <Step title="步骤3" description="这里是步骤的描述信息" />
    <Step title="步骤4" description="这里是步骤的描述信息" />
</Steps>) 
}`

code.vertical = `import { Steps } from 'react-kui';
const Step = Steps.Step
ReactDOM.render() {
  return (<Steps current="1"  vertical>
    <Step title="步骤1" description="这里是步骤的描述信息" />
    <Step title="步骤2" description="这里是步骤的描述信息" />
    <Step title="步骤3" description="这里是步骤的描述信息" />
    <Step title="步骤4" description="这里是步骤的描述信息" />
</Steps>) 
}`

export default code