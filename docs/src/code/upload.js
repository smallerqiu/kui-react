let code = {}

code.base = `import { Upload ，Button } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Upload action="/rest/uploadFile">
        <Button>上传文件</Button>
      </Upload>
    </div>
  )
}`

code.disabled = `import { Upload ，Button } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Upload action="/rest/uploadFile" disabled>
        <Button>上传文件</Button>
      </Upload>
    </div>
  )
}`
code.withData = `import { Upload ，Button } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    data: { a: 1, b: 2, c: 3 },
  }
}
ReactDOM.render() {
  return (
    <div>
      <Upload action="/rest/uploadFile" data={data}>
        <Button>上传文件</Button>
      </Upload>
    </div>
  )
}`

code.mode = `import { Upload ，Button ，Message } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    data: { a: 1, b: 2, c: 3 },
  }
}
change(file) {
  Message.info('选择了文件：' + file);
}
upload() {
  this.refs.upload.submit();
}
complite(res) {
  console.log(res);
}
ReactDOM.render() {
  return (
    <div>
      <Upload action="/rest/uploadFile" onChange={this.change.bind(this)} onComplite={this.complite.bind(this)} ref="upload" data={data} type="wait">
        <Button>上传文件</Button>
      </Upload>
      <Button onClick={this.upload.bind(this)}>点我开始上传</Button>
    </div>
  )
}`


export default code