import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { Tabs, Button } from 'react-kui';

const data = [
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2', closable: true },
  { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: true },
];
class Demo extends React.Component {
  state = {
    panes: data,
    activeKey: data[0].key,
  }

  newTabIndex = 0
  onChange(activeKey) {
    this.setState({ activeKey })
  }
  onClose(key) {
    let { panes, activeKey } = this.state

    const index = panes.map(p => p.key).indexOf(key)
    if (activeKey == key) {
      if (index == panes.length - 1) {
        activeKey = panes[index - 1].key
      } else {
        activeKey = panes[index + 1].key
      }
    }
    panes.splice(index, 1)
    this.setState({ panes, activeKey })
  }
  add() {
    let { panes } = this.state
    const activeKey = 'pane_' + this.newTabIndex++;
    panes.push({
      title: 'New Tab' + this.newTabIndex,
      content: 'Content of new Tab ' + this.newTabIndex,
      key: activeKey,
      closable: true
    });
    this.setState({ panes, activeKey })
  }
  render() {

    return (
      <div className="t1">
        <div className="t2"></div>
        <div className="t3">
          <div className="t4">
            <div className="t5">
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
              <div className="t6"></div>
            </div>
          </div>
        </div>
        <div className="t2"></div>
      </div>
    )
  }
}
ReactDOM.render(<Demo />, document.getElementById('app'))
