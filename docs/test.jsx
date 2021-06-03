import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { DatePicker } from 'react-kui';

class Demo extends React.Component {

  state = {
    v1: false,
    v2: false
  }

  setVisible = (key, visible) => {
    let obj = {}
    obj[key] = visible
    this.setState(obj)
  }

  render() {
    let { v1, v2 } = this.state
    return (
      <div style={{padding:200}}>
      {/* <DatePicker /> */}
      <br/>
      <br/>
      {/* <DatePicker mode="month" placeholder="请选择月份"/> */}
      <br/>
      <br/>
      <DatePicker mode="range" />
    </div>
    )
  }
}
ReactDOM.render(<Demo />, document.getElementById('app'))
