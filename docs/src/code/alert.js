let code = {}

code.base = `import { Alert } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Alert type="success">Success Text</Alert>
      <Alert type="info">Info Text</Alert>
      <Alert type="warning">Warning Text</Alert>
      <Alert type="error">Error Text</Alert>       
    </div>
  )
}`


code.icon = `import { Alert } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Alert type="success" showIcon>Success Text</Alert>
      <Alert type="info" showIcon>Info Text</Alert>
      <Alert type="warning" showIcon>Warning Text</Alert>
      <Alert type="error" showIcon>Error Text</Alert>  
    </div>
  )
}`

code.close = `import { Alert } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Alert type="success" showIcon closable>Success Text</Alert>
      <Alert type="info" showIcon closable>Info Text</Alert>
      <Alert type="warning" showIcon closable>Warning Text</Alert>
      <Alert type="error" showIcon closable>Error Text</Alert>  
    </div>
  )
}`

export default code;