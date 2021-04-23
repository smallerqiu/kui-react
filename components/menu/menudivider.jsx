import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class MenuDivider extends Kui {
  render() {
    const preCls = this.context.Dropdown ? 'dropdown-menu' : 'menu';
    return <li class={`k-${preCls}-item-divider`} />
  }
}


MenuDivider.contextTypes = {
  Dropdown: PropTypes.any
};