import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button } from 'react-kui';

class Demo extends React.Component {

  state = {
    visible: false
  }

  setVisible = (visible) => {
    this.setState({ visible })
    console.log('eee')
  }

  render() {
    let { visible } = this.state
    return (
      <div>
        <Button onClick={() => this.setVisible(true)} type="primary">Open Modal</Button>
        <Modal title="Title"
          visible={visible}
          onCancel={() => this.setVisible(false)}
          onOk={() => this.setVisible(false)}
        >Content</Modal>
      </div>
    )
  }
}
ReactDOM.render(<Demo />, document.getElementById('app'))
