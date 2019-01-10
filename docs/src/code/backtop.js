let code = {}
code.base = `import { Input } from 'react-kui';
ReactDOM.render() {
  return (<BackTop></BackTop>)
}`

code.custom = `import { Input } from 'react-kui';
const style = {
  background: '#2d94ff',
  height: '40px',
  lineHeight: '40px',
  textAlign: 'center',
  color: '#fff'
}
ReactDOM.render() {
  return (
    <div>
      <BackTop bottom="90" right="100">
        <div style={style}>UP</div>
      </BackTop>
    </div>
  )
}
`
export default code