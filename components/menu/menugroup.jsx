import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class MenuGroup extends Kui {
  render() {
    return (<li className="k-menu-item-group">
      <div className="k-menu-item-group-title">{this.props.title}</div>
      <ul>
        {this.props.children}
      </ul>
    </li>)
  }
}
MenuGroup.propTypes = {
  title: PropTypes.string.isRequired
}

