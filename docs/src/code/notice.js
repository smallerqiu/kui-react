let code = {}

code.base = `import { Notice } from 'react-kui';
info() {
  Notice.open({
    title: "通知的标题",
    content: "通知的描述",
    duration: 5
  });
}
ReactDOM.render() {
  return (
    <div>
     <Button onClick={this.info} type="primary">普通提示 </Button> 
    </div>
  )
}`

code.withIcon = `import { Notice } from 'react-kui';
notices(type) {
  Notice[type]({
    title: "通知的标题",
    content: "通知的描述",
    duration: 5
  });
}
ReactDOM.render() {
  return (
    <div>
      <Button onClick={()=>this.notices('info')} type="primary">消息提示 </Button>
      <Button onClick={()=>this.notices('warning')} type="warning">警告提示 </Button>
      <Button onClick={()=>this.notices('success')} type="success">成功提示 </Button>
      <Button onClick={()=>this.notices('error')} type="danger">错误提示 </Button>  
    </div>
  )
}`

code.static = `Notice.info(options)
Notice.success(options)
Notice.warning(options)
Notice.error(options)`

code.destory = `Notice.open(options)
Notice.destroy()`

export default code