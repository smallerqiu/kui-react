import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Checkbox extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }
  wpclasses() {
    return this.className([
      "k-checkbox-wp",
      {
        ["k-checkbox-disabled"]: this.props.disabled
      }
    ])
  }
  classes() {
    return this.className([
      "k-checkbox",
      {
        ["k-checkbox-checked"]: this.state.checked && !this.props.indeterminate,
        ["k-checkbox-indeterminate"]: this.props.indeterminate
      }
    ])
  }
  change(e) {
    if (this.props.disabled) {
      return false;
    }

    const checked = e.target.checked;
    const group = this.context.CheckboxGroup

    this.setState({
      checked: checked
    })

   
    // if (!group) {
    this.props.onChange && this.props.onChange(checked)
    this.props.onFormItemChange && this.props.onFormItemChange(checked)
    // }
  }
  componentWillReceiveProps(props) {
    if (props.checked != this.state.checked)
      this.setState({
        checked: props.checked, label: props.label
      })
  }
  componentDidMount() {
    // if (this.parent) this.group = true;
    // if (!this.group) {
    //   this.props.checked = this.props.value;
    // } else {
    //   this.parent.update();
    // }
  }

  render() {
    return <label className={this.wpclasses()} style={this.styles()}>
      <span className={this.classes()}>
        <span className="k-checkbox-inner"></span>
        <input type="checkbox" className="k-checkbox-input" name={this.props.name} disabled={this.props.disabled} checked={this.props.checked} onChange={this.change.bind(this)} />
      </span>
      {this.props.children || this.props.label}
      {/* <slot>{ label }</slot> */}
    </label>
  }
}

Checkbox.contextTypes = {
  CheckboxGroup: PropTypes.any
};

Checkbox.propTypes = {
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool
}

Checkbox.defaultProps = {
  checked:false
}


