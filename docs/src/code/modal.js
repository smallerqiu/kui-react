let code = {}

code.base = `import { Modal } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    visible:false
  }
} 
ReactDOM.render() {
  return (
    <div>
      <Button onClick={()=>this.setState({visible:true})}>普通对话框</Button>
      <Modal visible={visible} onClose={()=>this.setState({visible:false})}></Modal>
    </div>
  )
}`
code.custom = `import { Modal } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    v2: false,
    v3: false,
    v4: false,
  }
}
onOpen(key) {
  let obj = {}
  obj[key] = true
  this.setState(obj)
}
onClose(key) {
  let obj = {}
  obj[key] = false
  this.setState(obj)
}
ReactDOM.render() {
  return (
    <div>
      <Button onClick={this.onOpen.bind(this,'v2')}>自定义宽度</Button>
      <Button onClick={this.onOpen.bind(this,'v3')}>内容和页脚</Button>
      <Button onClick={this.onOpen.bind(this,'v4')}>按钮文字</Button>
      <Modal visible={v2} width="300" onClose={this.onClose.bind(this,'v2')}></Modal>
      <Modal visible={v3}
        title="我是自定义标题"
        footer={[<Button type="danger" key="1">自定义1</Button>, <Button type="success" key="2">自定义2</Button>]}
        onClose={this.onClose.bind(this,'v3')}>
        <p>我是自定义内容</p>
      </Modal>
      <Modal visible={v4} width="300" cancelText="不要取消" okText="别点我" onClose={this.onClose.bind(this,'v4')}></Modal> 
    </div>
  )
}`
code.canMove = `import { Modal } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    visible:false
  }
} 
ReactDOM.render() {
  return (
    <div>
      <Button onClick={()=>this.setState({visible:true})}>普通对话框</Button>
      <Modal visible={visible} isMove onClose={()=>this.setState({visible:false})}>我可以拖动的</Modal>
    </div>
  )
}`
code.mode = `import { Modal } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    color: "",
    icon: "success",
    visible:false
  }
}
onShow(type) {
  this.setState({
    icon: type,
    visible: true,
    color: type == "happy" ? "orange" : ""
  })
}
ReactDOM.render() {
  return (
    <div>
      <Button onClick={this.onShow.bind(this,'success')}>Success</Button>
      <Button onClick={this.onShow.bind(this,'error')}>Error</Button>
      <Button onClick={this.onShow.bind(this,'warning')}>Warning</Button>
      <Button onClick={this.onShow.bind(this,'info')}>Info</Button>
      <Button onClick={this.onShow.bind(this,'ios-happy')}>happy</Button>
      <Modal visible={visible} isMove type="toast" icon={icon} color={color} onClose={()=>this.setState({visible:false})}>恭喜你中了5000万...</Modal>  
    </div>
  )
}`

export default code