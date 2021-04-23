import Icon from '../icon'
import React from 'react'
import { Kui, PropTypes } from '../kui'


export default class Radio extends Kui {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    checked: PropTypes.bool
  }

  static contextTypes = {
    Group: PropTypes.any,
    FormItem: PropTypes.any
  };
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
    let FormItem = this.context.FormItem

    const checked = e.target.checked;
    this.setState({ isChecked: checked })
    if (group) {
      label = label || children.text
      group.change({ label, value })
    } else {
      onChange && onChange(e)
      FormItem && FormItem.testValue(checked)
    }
  }
  render() {
    let { disabled, label, value, checked, children } = this.props
    let { isChecked } = this.state
    let group = this.context.Group

    if (group) {
      checked = group.props.value == value
      disabled = disabled || group.props.disabled
    } else {
      if (checked === undefined) {
        checked = isChecked
      }
    }
    const wpclasses = ["k-radio-wrapper", { ["k-radio-disabled"]: disabled }];

    const classes = [
      "k-radio",
      {
        ["k-radio-checked"]: checked,
      }
    ];
    let inner = checked ? <Icon type="checkmark" /> : null
    const labelNode = label || children
    const props = {
      type: "radio",
      className: "k-radio-input",
      checked,
      disabled,
      onChange: this.change
    }
    return (
      <label className={this.className(wpclasses)}>
        <span className={this.className(classes)}>
          <input {...props} />
          <span className="k-radio-inner">{inner}</span>
        </span>
        {labelNode ? <span className="k-radio-label">{labelNode}</span> : null}
      </label>
    )
  }
}