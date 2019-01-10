let code = {}

code.base = `
import { Page } from 'react-kui';
ReactDOM.render() {
  return <Page total="100" curent="1" pageSize="10"/>
}
`
code.size = `import { Page } from 'react-kui';
ReactDOM.render() {
  return <Page total="60" curent="1" pageSize="10" mini onChange={(page)=>{console.log(page)}} />
}`
code.sizer = `import { Page } from 'react-kui';
ReactDOM.render() {
  return <Page total="60" current="1" showSizer showElevator showTotal pageSize="15" mini onChange={this.onChange.bind(this)}></Page>
}`
export default code