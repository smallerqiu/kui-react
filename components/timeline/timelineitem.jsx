import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
export default class TimeLineItem extends Kui {
  static propTypes = {
    color: PropTypes.string,
    icon: PropTypes.string,
    dot: PropTypes.any,
  }

  render() {
    let { icon, color, children, dot } = this.props
    const styles = { color }
    const type = icon ? icon : "radio-button-off";
    const iconNode = dot || <Icon type={type} />
    const iconCls = ['k-time-line-dot', { 'k-time-line-icon-default': !icon }]

    return (
      <li className="k-time-line-item">
        <div className={this.className(iconCls)} style={styles}>
          {iconNode}
        </div>
        <div className="k-time-line-item-content">
          {children}
        </div>
      </li>
    )
  }
}