import Button from '../button';
import { Kui, PropTypes } from '../kui'
import React from 'react'

export default class RadioButton extends Kui {
  state = {
    isChecked: false
  }

  componentDidMount() {
    const { checked } = this.props
    this.setState({
      isChecked: checked !== undefined ? checked : checked == true
    })
  }

  change = () => {
    let { value, label, onChange, children } = this.props

    let group = this.context.Group

    if (group) {
      label = label || children.text
      group.change({ label, value })
    } else {
      onChange && onChange(e)
      FormItem && FormItem.testValue(checked)
    }
  }

  render() {
    let { disabled, label, value, checked, children, hollow, size, icon } = this.props
    let { isChecked } = this.state
    let group = this.context.Group

    if (group) {
      checked = group.props.value == value
      disabled = disabled || group.props.disabled


      hollow = hollow || group.props.hollow
      size = size || group.props.size
    } else {
      if (checked === undefined) {
        checked = isChecked
      }
    }

    const props = {
      type: checked ? 'primary' : 'default',
      onClick: this.change,
      disabled, hollow, size, icon
    }
    return (
      <Button {...props}>{label || children}</Button>
    )
  }
};



RadioButton.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
  hollow: PropTypes.bool
}

RadioButton.contextTypes = {
  Group: PropTypes.any,
  FormItem: PropTypes.any
};