import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
export default class TabPane extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      activeName: props.name,
      width: props.width || 0 //ie9
    }
  }
  paneStyle() {
    let { width } = this.props
    return width ? { width: `${width}px` } : {};
  }
  componentDidMount() {
    this.context.Tabs.addItem(this)
  }
  componentWillUnmount() {
    this.context.Tabs.removeItem(this)
  }
  render() {
    return <div className={this.className('k-tabs-tabpane')} style={this.styles(this.paneStyle())}>
      {this.props.children}
    </div>
  }
}
TabPane.contextTypes = {
  Tabs: PropTypes.any
};
TabPane.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  closable: PropTypes.bool,
  visible: PropTypes.bool,
}

TabPane.defaultProps = {
  closable: true
}
