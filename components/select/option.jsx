import React from 'react'
import Icon from '../icon'
import { Kui, PropTypes } from '../kui';
import { isNotEmpty } from "../_tool/utils";

export default class Option extends Kui {

  static contextTypes = {
    Select: PropTypes.any,
  }

  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
  }

  onSelect(e) {
    let { value, label, disabled, children, eventKey } = this.props
    if (disabled) return;
    value = !isNotEmpty(value) ? eventKey : value
    if (this.context.Select) {
      label = label || children
      this.context.Select.change({ label, value })
    }
  }

  render() {
    let { disabled, value, label, children, eventKey } = this.props
    value = !isNotEmpty(value) ? eventKey : value
    let selected = false;
    label = label || children
    let iconNode = null
    let { Select } = this.context
    if (Select) {
      /*  let _value = Select.currentValue
       if (!hasProp(Select, 'value')) {
         _value = Select.currentValue
       }
       if (Select.multiple) {
         selected = _value.indexOf(value) !== -1
 
         iconNode = <Icon type="checkmark" />
       } else {
         selected = _value === value
       } */
      let { multiple } = Select.props
      let { currentValue } = Select.state
      if (multiple) {
        selected = currentValue.indexOf(value) >= 0
        iconNode = <Icon type="checkmark" />
      } else {
        selected = currentValue === value
      }
    }
    const classes = [
      "k-select-item",
      {
        ["k-select-item-selected"]: selected,
        ["k-select-item-disabled"]: disabled
      }
    ];
    const childs = <span>{label}{iconNode}</span>

    return (
      <li className={this.className(classes)} onClick={this.onSelect.bind(this)}>{childs}</li>
    )
  }
}