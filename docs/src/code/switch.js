let code = {}

code.base = `import { Switch } from 'react-kui';
ReactDOM.render() {
  return (<Switch />)
}`

code.theme = `import { Switch } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
        <Switch value={true}/>
        <Switch value={true} type="success"/>
        <Switch value={true} type="danger"/>
        <Switch value={true} type="warning"/>
    </div>
  )
}`

code.text = `import { Switch } from 'react-kui';
ReactDOM.render() {
  return (<Switch value={false} trueText="是" falseText="否"/>)
}`

code.disabled = `import { Switch } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
        <Switch value={false} disabled />
        <Switch value={true} disabled />
        <Switch value={true} disabled trueText="是" falseText="否" />
    </div>
  )
}`

export default code