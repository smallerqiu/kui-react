let code = {}

code.base = `import { Badge } from 'react-kui';
ReactDOM.render() {
  return (
    <Badge count="3">
      <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
    </Badge>
  )
}`

code.dot = `import { Badge } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
     <Badge dot>
        <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
      </Badge>
      <Badge dot style={{ marginLeft: 20 }}>
        <Icon type="ios-calendar-outline" size="50" color="orange"></Icon>
      </Badge>
      <Badge dot style={{ marginLeft: 20 }}>
        <a href="#">我是一个连接</a>
      </Badge>   
    </div>
  )
}`

code.maxCount = `import { Badge } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Badge count="100" maxCount="99">
        <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
      </Badge>
      <Badge count="10055" maxCount="999" style={{ marginLeft: 60 }}>
        <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
      </Badge>     
    </div>
  )
}`

code.color = `import { Badge } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Badge count="100" maxCount="99" color="orange">
        <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
      </Badge>
      <Badge dot color="green" style={{ marginLeft: 60 }}>
        <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }}></div>
      </Badge>    
    </div>
  )
}`

code.badge = `import { Badge } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Badge count="10" style={{ marginLeft: 20 }}></Badge>
      <Badge count="20" color="blue" style={{ marginLeft: 40 }}></Badge>   
    </div>
  )
}`

code.other = `import { Badge } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    count: 4
  }
  this.getChildren.bind(this)
}
onAdd() {
  this.setState({ count: this.state.count + 1 })
}
onDel() {
  if(this.state.count==1) return;
  this.setState({ count: this.state.count - 1 })
}
getChildren() {
  let childs = []
  for (let i = 0; i < this.state.count; i++) {
    childs.push(<div key={i} style={{marginBottom:5}}><Badge count="+" onClick={this.onAdd.bind(this)}>
      <Button>增加</Button>
    </Badge>
      <Badge count="-" onClick={this.onDel.bind(this)} style={{ marginLeft: 20 }}>
        <Input width="200"></Input>
      </Badge></div>)
  }
  return childs
}
ReactDOM.render() {
  return (
    <div>
     {this.getChildren()} 
    </div>
  )
}`

export default code
