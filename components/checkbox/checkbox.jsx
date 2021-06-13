import Icon from '../icon'
import React from 'react'
import { Kui, PropTypes } from '../kui'


export default class Checkbox extends Kui {

  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    indeterminate: PropTypes.bool,
    checked: PropTypes.bool
  }

  static contextTypes = {
    Group: PropTypes.any,
  }

  state = {
    isChecked: false
  }

  componentDidMount() {
    const { checked, indeterminaten } = this.props
    this.setState({
      isChecked: checked !== undefined ? checked : checked == true && !indeterminaten
    })
  }

  componentDidUpdate(props, state) {

  }
  change = (e) => {
    let { disabled, children, label, onChange, value } = this.props
    if (disabled) {
      return false;
    }
    let group = this.context.Group

    const checked = e.target.checked;
    this.setState({ isChecked: checked })
    if (group) {
      label = label || children.text
      group.change({ label, value })
    } else {
      onChange && onChange(e)
    }
  }
  render() {
    let { disabled, label, value, checked, children, indeterminate } = this.props
    let { isChecked } = this.state
    let group = this.context.Group

    if (group) {
      checked = group.props.value.indexOf(value) !== -1
      disabled = disabled || group.props.disabled
      // console.log(indeterminate)
    } else {
      if (checked === undefined) {
        checked = isChecked
      }
    }
    const wpclasses = ["k-checkbox-wrapper", { ["k-checkbox-disabled"]: disabled }];

    const classes = [
      "k-checkbox",
      {
        ["k-checkbox-checked"]: checked && !indeterminate,
        ["k-checkbox-indeterminate"]: indeterminate
      }
    ];
    let inner = checked ? <Icon type="checkmark" /> : null
    const labelNode = label || children
    const props = {
      type: "checkbox",
      className: "k-checkbox-input",
      checked,
      disabled,
      onChange: this.change
    }
    return (
      <label className={this.className(wpclasses)}>
        <span className={this.className(classes)}>
          <input {...props} />
          <span className="k-checkbox-inner">{inner}</span>
        </span>
        {labelNode ? <span className="k-checkbox-label">{labelNode}</span> : null}
      </label>
    )
  }
}
