import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class MenuGroup extends Kui {
  static propTypes = {
    title: PropTypes.any.isRequired
  }
  render() {
    let index = -1;
    return (<li className="k-menu-item-group">
      <div className="k-menu-item-group-title">{this.props.title}</div>
      <ul className="k-menu-item-group-list">
        {
          React.Children.map(this.props.children, child => {
            return React.cloneElement(child, { eventKey: child.key || `menu_item_${index++}` })
          })
        }
      </ul>
    </li>)
  }
}