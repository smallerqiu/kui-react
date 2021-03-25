import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
export default class Switch extends Kui {

  state = {
    isChecked: this.props.checked || false
  }


  change = (e) => {
    let { disabled, onChange, checked } = this.props
    let { isChecked } = this.state
    if (disabled) {
      return false;
    }
    const check = checked === undefined ? isChecked : checked
    this.setState({ isChecked: !check })
    onChange && onChange(!check)
  }
  render() {
    let { disabled, size, falseText, trueText, checked, loading,
      checkedChildren, uncheckedChildren } = this.props
    let { isChecked } = this.state
    if (checked === undefined) {
      checked = isChecked
    }
    const classes = [
      "k-switch",
      {
        ["k-switch-checked"]: checked,
        ["k-switch-loading"]: loading,
        ["k-switch-disabled"]: disabled||loading,
        ["k-switch-sm"]: size == 'small',
      }
    ];
    const children = checkedChildren || trueText || uncheckedChildren || falseText
    const textNode = (
      (size != 'small' && children) ? <span className="k-switch-inner">{checked ? checkedChildren || trueText : uncheckedChildren || falseText}</span> : null
    )
    const loadNode = loading ? <Icon spin type="sync" className="k-switch-loading" /> : null
    const props = {
      className: this.className(classes),
      onClick: this.change,
      type: "button",
      disabled: disabled || loading,
      style: this.styles()
    }

    return (
      <button {...props}>{textNode}{loadNode}</ button>
    )
  }
};

Switch.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  checkedChildren: PropTypes.any,
  uncheckedChildren: PropTypes.any,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  trueText: PropTypes.string,
  falseText: PropTypes.string,
  size: PropTypes.oneOf(['default', 'small'])
}

Switch.contextTypes = {
  FormItem: PropTypes.any,
};