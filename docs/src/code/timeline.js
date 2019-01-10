let code = {}

code.base = `import { TimeLine } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <TimeLine>
        <TimeLine.Item>发布1.0版本</TimeLine.Item>
        <TimeLine.Item>发布1.0版本</TimeLine.Item>
        <TimeLine.Item>发布1.0版本</TimeLine.Item>
      </TimeLine> 
    </div>
  )
}`
code.withIcon = `import { TimeLine } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
    <TimeLine>
      <TimeLine.Item icon="ios-ribbon">发布2.0版本</TimeLine.Item>
      <TimeLine.Item icon="ios-bug">修复bug</TimeLine.Item>
      <TimeLine.Item>发布1.0版本</TimeLine.Item>
    </TimeLine> 
    </div>
  )
}`
code.color = `import { TimeLine } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <TimeLine>
        <TimeLine.Item icon="ios-ribbon" color="#cba302">发布2.0版本</TimeLine.Item>
        <TimeLine.Item icon="ios-bug" color="red">修复bug</TimeLine.Item>
        <TimeLine.Item>发布1.0版本</TimeLine.Item>
      </TimeLine> 
    </div>
  )
}`

export default code