import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class MenuDivider extends Kui {
  static contextTypes = {
    Dropdown: PropTypes.any
  }
  render() {
    const preCls = this.context.Dropdown ? 'dropdown-menu' : 'menu';
    return <li className={`k-${preCls}-item-divider`} />
  }
}