import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
export default class TabPane extends Kui {
  static contextTypes = {
    Tabs: PropTypes.any,
    collectTabPanes: PropTypes.func
  };
  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    disabled: PropTypes.bool,
    closable: PropTypes.bool,
    eventKey: PropTypes.string
  }

  componentDidMount() {
    this.context.collectTabPanes(this, 'add')
  }
  componentWillUnmount() {
    this.context.collectTabPanes(this, 'delete')
  }
  render() {
    const classes = [
      'k-tabs-tabpane',
      {
        'k-tabs-tabpane-active': this.context.Tabs.props.activeKey == this.props.eventKey
      }
    ]
    return <div className={this.className(classes)}
      style={this.styles()}>
      {this.props.children}
    </div>
  }
}