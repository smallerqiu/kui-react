import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Radio extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      checked: props.checked,
      value: props.value
    }
  }
  onChange(e) {
    const checked = e.target.checked;
    if (checked) {
      if (this.props.onChange) {
        this.props.onChange(checked);
        this.props.onFormItemChange && this.props.onFormItemChange(checked)
      }
    }

    this.setState({ checked: checked });
  }
  wpclasses() {
    return this.className([
      "k-radio-wp",
      {
        ["k-radio-disabled"]: this.props.disabled
      }
    ])
  }
  classes() {
    return this.className([
      "k-radio",
      {
        ["k-radio-checked"]: this.state.checked
      }
    ])
  }
  componentWillReceiveProps(props) {
    this.setState({ checked: props.checked })
  }
  render() {
    return <label className={this.wpclasses()} style={this.styles()}>
      <span className={this.classes()}>
        <span className="k-radio-inner"></span>
        <input type="radio" className="k-radio-input" name={this.props.name} disabled={this.props.disabled} checked={this.state.checked} onChange={this.onChange.bind(this)} />
      </span>
      {this.props.label || this.props.children}
    </label>
  }
}

Radio.propTypes = {
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func
} 