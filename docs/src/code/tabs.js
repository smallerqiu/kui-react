let code = {}

code.base = `import { Tabs } from 'react-kui';
ReactDOM.render() {
  return (
    <Tabs value="3">
      <Tabs.Pane label="Tab1" name="1">我是内容1....</Tabs.Pane>
      <Tabs.Pane label="Tab2" name="2">我是内容2....</Tabs.Pane>
      <Tabs.Pane label="Tab3" name="3">我是内容3....</Tabs.Pane>
    </Tabs>
  )
}`

code.disabled = `import { Tabs } from 'react-kui';
ReactDOM.render() {
  return (
    <Tabs>
      <Tabs.Pane label="Tab1">我是内容1....</Tabs.Pane>
      <Tabs.Pane label="Tab2" disabled>我是内容2....</Tabs.Pane>
      <Tabs.Pane label="Tab3">我是内容3....</Tabs.Pane>
    </Tabs>
  )
}`

code.icon = `import { Tabs } from 'react-kui';
ReactDOM.render() {
  return (
    <Tabs>
      <Tabs.Pane label="Tab1" icon="social-windows">我是内容1....</Tabs.Pane>
      <Tabs.Pane label="Tab2" icon="social-apple">我是内容2....</Tabs.Pane>
      <Tabs.Pane label="Tab3" icon="social-android">我是内容3....</Tabs.Pane>
    </Tabs>
  )
}`
code.card = `import { Tabs } from 'react-kui';
ReactDOM.render() {
  return (
    <Tabs card extra={<Button mini>Action</Button>}>
      <Tabs.Pane label="Tab1" icon="social-windows">我是内容1....</Tabs.Pane>
      <Tabs.Pane label="Tab2" icon="social-apple">我是内容2....</Tabs.Pane>
      <Tabs.Pane label="Tab3" icon="social-android">我是内容3....</Tabs.Pane>
    </Tabs>
  )
}`

code.closable =`import { Tabs } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    count: 5
  }
}
onClick() {
  this.setState({
    count: this.state.count + 1
  })
}
onClose() {
  this.setState({
    count: this.state.count - 1
  })
}
ReactDOM.render() {
  return (
    <Tabs card closable extra={<Button slot="extra" mini onClick={this.onClick.bind(this)}>+</Button>} onClose={this.onClose.bind(this)}>
      {
        (() => {
          let tabs = [], count = this.state.count;
          for (let n = 1; n < count; n++) {
            tabs.push(<Tabs.Pane label={'Tab ' + n} closable={n != 1} key={n}>我是内容{n}....</Tabs.Pane>)
          }
          return tabs
        })()
      }
    </Tabs>
  )
}`

code.sample = `import { Tabs } from 'react-kui';
ReactDOM.render() {
  return (
    <Tabs value="1" sample>
      <Tabs.Pane label="TabTitle 1" name="1">
        <p>我是内容1....</p>
        <p>我是内容1....</p>
        <p>我是内容1....</p>
      </Tabs.Pane>
      <Tabs.Pane label="TabTitle 2" name="2">
        <p>我是内容2....</p>
        <p>我是内容2....</p>
        <p>我是内容2....</p>
      </Tabs.Pane>
      <Tabs.Pane label="TabTitle 3" name="3">
        <p>我是内容2....</p>
        <p>我是内容2....</p>
        <p>我是内容2....</p>
      </Tabs.Pane>
    </Tabs>
  )
}`

export default code