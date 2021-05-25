import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button } from 'react-kui';

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
      <div>
        <Button onClick={() => this.setVisible('v1', true)} type="primary">Open Modal</Button>
        <Modal title="Title"
          visible={v1}
          draggable 
          onCancel={() => this.setVisible('v1', false)}
          onOk={() => this.setVisible('v1', false)}
        >Content</Modal>
      
      </div>
    )
  }
}
ReactDOM.render(<Demo />, document.getElementById('app'))
