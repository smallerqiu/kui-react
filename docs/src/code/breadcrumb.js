let code = {}

code.base = `import { Breadcrumb } from 'react-kui';
const Item = Breadcrumb.Item
ReactDOM.render() {
  return (
    <div>
     <Breadcrumb>
         <Item to="/">Home</Item>
         <Item to="/breadcrumb">breadcrumb</Item>
         <Item>other</Item>
     </Breadcrumb>   
    </div>
  )
}`

code.icon = `import { Breadcrumb } from 'react-kui';
const Item = Breadcrumb.Item
ReactDOM.render() {
  return (
    <div>
      <Breadcrumb>
          <Item to="/" icon="ios-home">Home</Item>
          <Item to="/breadcrumb" icon="logo-buffer">breadcrumb</Item>
          <Item icon="ios-heart">other</Item>
      </Breadcrumb>  
    </div>
  )
}`

code.separator = `import { Breadcrumb } from 'react-kui';
const Item = Breadcrumb.Item
ReactDOM.render() {
  return (
    <div>
      <Breadcrumb>
          <Item to="/" icon="ios-home" separator="~">Home</Item>
          <Item to="/breadcrumb" icon="logo-buffer" separator="~">breadcrumb</Item>
          <Item icon="ios-heart" separator="~">other</Item>
      </Breadcrumb>  
    </div>
  )
}`

export default code