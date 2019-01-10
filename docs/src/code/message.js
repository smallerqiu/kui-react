let code = {}

code.base = `import { Message } from 'react-kui';
ReactDOM.render() {
  return (
    <Button onClick={()=>Message.info("普通提示")} type="primary">普通提示 </Button>
  )
}`

code.type = `import { Message } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Button onClick={()=>Message.warning("警告提示")} type="warning">警告提示 </Button>
      <Button onClick={()=>Message.success("成功提示")} type="success">成功提示 </Button>
      <Button onClick={()=>Message.error("错误提示")} type="danger">错误提示 </Button>  
    </div>
  )
}`

code.time = `import { Message } from 'react-kui';
config() {
  Message.config({
    type: "info",
    duration: 0,
    closable: true,
    content: "手动关闭",
    onClose: () => { alert('callback') }
  });
}
ReactDOM.render() {
  return (
    <div>
      <Button onClick={()=>Message.success("10秒后关闭的", 10)} type="success">10秒后关闭</Button>
      <Button onClick={()=>Message.error("5秒后关闭的", 5)} type="primary">5秒后关闭</Button>
      <Button onClick={this.config} type="primary">手动关闭</Button>     
    </div>
  )
}`
code.static = `Message.info(content, [duration], onClose)
Message.success(content, [duration], onClose)
Message.warning(content, [duration], onClose)
Message.error(content, [duration], onClose)`

code.destory = `Message.config(options)
Message.destroy()`

export default code