import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { Button, Drawer, Radio } from 'react-kui';

const Demo = () => {

  const [show, toggle] = React.useState(false)
  const [placement, setPlacement] = React.useState('left')

  return (
    <div>
      <Radio.Group value={placement} onChange={setPlacement}>
        <Radio label="left" value="left" />
        <Radio label="top" value="top" />
        <Radio label="right" value="right" />
        <Radio label="bottom" value="bottom" />
      </Radio.Group>
      <Button onClick={() => toggle(true)} >Open</Button>
      <Drawer visible={show}
        width="300"
        onCancel={() => { toggle(false) }}
        placement={placement}
        title="What's your name? "
        cancelText="cancel"
        okText="Ok">My name is chuchur.</Drawer>
    </div>
  )
}
ReactDOM.render(<Demo />, document.getElementById('app'))
