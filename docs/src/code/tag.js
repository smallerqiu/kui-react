let code = {}

code.base = `import { Tag } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Tag>标签1</Tag>
      <Tag>标签2</Tag>
      <Tag>标签3</Tag>
      <Tag closeable>标签4</Tag>
    </div>
  )
}`

code.color = `import { Tag } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Tag color="blue">标签1</Tag>
      <Tag color="gray">标签2</Tag>
      <Tag color="green">标签3</Tag>
      <Tag color="red">标签4</Tag>
      <Tag color="orange">标签5</Tag>
      <Tag color="#2db7f5" closeable>自定义</Tag> 
    </div>
  )
}`


code.custom=`import { Tag } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
      count: 3
  }
}
ReactDOM.render() {
  return (
    <div>
    { this.rendetTag() }
    <Tag onClick={() => this.setState({ count: this.state.count + 1 })}>增加</Tag>  
    </div>
  )
}
`
export default code