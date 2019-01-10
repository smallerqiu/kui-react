let code = {}

code.base=`import { Button } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Button>Default</Button>
      <Button type="primary">Primary</Button>
      <Button type="link">link</Button>
    </div>
  )
}`

code.disabled= `import { Button } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Button type="primary">Primary</Button>
      <Button disabled type="primary">disabled</Button>
    </div>
  )
}`

code.withIcon =`import { Button } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Button type="primary" icon="ios-search">搜索</Button>
      <Button type="success" icon="ios-cloud-upload">上传</Button>
      <Button type="danger" icon="ios-cloud-download">下载</Button>
      <Button type="primary" icon="ios-play"></Button>
      <Button type="primary" icon="ios-pause"></Button>
      <Button type="primary" icon="ios-square"></Button>
    </div>
  )
}`

code.size =`import { Button } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Button type="primary">Primary</Button>
      <Button type="primary" mini>mini</Button>
    </div>
  )
}`

code.group=`import { Button } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <ButtonGroup>
        <Button>待发货</Button>
        <Button>已发货</Button>
        <Button>已签收</Button>
      </ButtonGroup>
      <ButtonGroup circle>
        <Button>待发货</Button>
        <Button>已发货</Button>
        <Button>已签收</Button>
        </ButtonGroup>
        <ButtonGroup mini>
        <Button>待发货</Button>
        <Button>已发货</Button>
        <Button>已签收</Button>
      </ButtonGroup>
    </div>
  )
}`
export default code