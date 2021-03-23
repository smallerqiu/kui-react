import React from 'react'
import Icon from '../icon'
import { Kui, PropTypes } from '../kui'
export default class MenuItem extends Kui {
  constructor(props) {
    super(props)
  }
  classes() {
    return this.className([
      "k-menu-item",
      {
        ["k-menu-item-active"]: this.props.actived
      }
    ])
  }
  onClick() {
    this.props.onClick && this.props.onClick()
  }
  render() {
    return (<li className={this.classes()} onClick={this.onClick.bind(this)}>
      {this.props.icon && <Icon type={this.props.icon}></Icon>}
      {this.props.children}
    </li>)
  }
}

MenuItem.propTypes = {
  onClick: PropTypes.any,
  actived: PropTypes.bool,
  icon: PropTypes.string,
  name: PropTypes.string.isRequired
}
