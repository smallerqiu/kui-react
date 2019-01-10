let code = {}

code.base = `import { Affix } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Affix>
        <Button>Affix top</Button>
      </Affix>
      <Affix offsetBottom="0">
        <Button>Affix Bottom</Button>
      </Affix> 
    </div>
  )
}`

code.offset = `import { Affix } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
       <Affix offsetTop="200">
           <Button>200px to Affix top</Button>
       </Affix>
       <Affix offsetBottom="100">
           <Button>100px to Affix bottom</Button>
       </Affix>  
    </div>
  )
}`

code.callback = `import { Affix ,Message} from 'react-kui';
onChange(v) {
  if (v) {
      Message.success('当前状态：' + v)
  } else {
      Message.error('当前状态：' + v)
  }
}
ReactDOM.render() {
  return (
    <div>
      <Affix offsetTop="150" onChange={()=>this.onChange}>
          <Button>150px to Affix top</Button>
      </Affix>
      <Affix offsetBottom="100" onChange={()=>this.onChange}>
          <Button>100px to Affix bottom</Button>
      </Affix>  
    </div>
  )
}
`

export default code