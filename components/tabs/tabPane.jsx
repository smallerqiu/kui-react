import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class TabPane extends Kui {
  static contextTypes = {
    Tabs: PropTypes.any,
  };
  static propTypes = {
    title: PropTypes.string,
    disabled: PropTypes.bool,
    closable: PropTypes.bool,
    eventKey: PropTypes.string
  }

  render() {
    const classes = [
      'k-tabs-tabpane',
      {
        'k-tabs-tabpane-active': this.context.Tabs.state.activeKey == this.props.eventKey
      }
    ]
    return <div className={this.className(classes)}
      style={this.styles()}>
      {this.props.children}
    </div>
  }
}