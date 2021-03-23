import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class TimeLineItem extends Kui {
  colorStyles() {
    let color = this.props.color;
    return color ? { color: color } : {};
  }
  classes() {
    let icon = this.props.icon;
    return icon ? [`k-ion-${icon}`] : ["k-ion-ios-radio-button-off"];
  }
  render() {
    return (<li className={this.className('k-time-line-item')} style={this.styles()}>
      <div className="k-time-line-dot" style={this.styles(this.colorStyles())}>
        {this.props.dot || <i className={this.className(this.classes())}></i>}
      </div>
      <div className="k-time-line-item-content">
        {this.props.children}
      </div>
    </li>)
  }
}
TimeLineItem.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  dot: PropTypes.node,
} 