import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class Switch extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      checked: props.value
    }
  }
  classes() {
    return this.className([
      "k-switch",
      {
        ["k-switch-checked"]: this.state.checked,
        ["k-switch-disabled"]: this.props.disabled,
        [`k-switch-${this.props.type}`]: !!this.props.type
      }
    ])
  }
  componentWillReceiveProps(props) {
    if (props.value !== this.props.value)
      this.setState({
        checked: props.value
      })
  }

  onChange() {
    if (this.props.disabled) {
      return false;
    }
    const checked = !this.state.checked
    this.setState({
      checked: checked
    })
    this.props.onChange && this.props.onChange(checked)
    this.props.onFormItemChange && this.props.onFormItemChange(checked)
  }
  render() {
    return <span className={this.classes()} onClick={this.onChange.bind(this)} style={this.styles()}>
      <span className="k-switch-inner">
        <span>
          {this.state.checked ? this.props.trueText : this.props.falseText}
        </span>
      </span>
      <span className="k-switch-button"></span>
    </span>
  }
}

Switch.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.bool,
  type: PropTypes.oneOf(['success', 'warning', 'danger', 'primary']),
  disabled: PropTypes.bool,
  trueText: PropTypes.string,
  falseText: PropTypes.string
}

