let code = {}

code.base = `import { Input } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
       <Input placeholder="请输入内容..."></Input>
       <Input width="200" placeholder="disabled..." disabled />
    </div>
  )
}`

code.clearable = `import { Input } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Input placeholder="请输入内容..." clearable/>
    </div>
  )
}`

code.withIcon = `import { Input } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Input placeholder="请输入内容..." icon="ios-person" />
      <Input placeholder="请输入内容..." icon="ios-search" />
    </div>
  )
}`

code.size = `import { Input } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Input placeholder="请输入内容..."/>
      <Input mini placeholder="请输入内容..." icon="ios-person"/>
    </div>
  )
}`


code.textArea = `import { Input } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Input type="textarea" rows="4" placeholder="请输入内容..." /> <br />
      <Input type="textarea" rows="1" placeholder="请输入内容..." />
    </div>
  )
}
`


export default code