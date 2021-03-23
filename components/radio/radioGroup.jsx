import React from 'react'
import { Kui, PropTypes } from '../kui'
import Radio from './radio'
import RadioButton from './radioButton'
export default class RadioGroup extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || ''
    }
  }
  getChildContext() {
    return {
      RadioGroup: this
    }
  }
  onChange(value) {
    this.setState({ data: value })
    if (this.props.onChange) this.props.onChange(value)
    this.props.onFormItemChange && this.props.onFormItemChange(value)
  }
  componentWillReceiveProps(props) {
    if (props.value != this.props.value) {
      this.setState({
        value: props.value
      })
    }
  }
  render() {
    return <div className={this.className('k-radio-group')} style={this.styles()}>
      {
        React.Children.map(this.props.children, (child, index) => {
          if (child && child.type == Radio) {
            let value = child.props.value
            let checked = this.state.value == value && value !== undefined && value !== null && value !== ''
            return React.cloneElement(child, Object.assign({}, child.props, {
              checked: checked,
              disabled: child.props.disabled || this.props.disabled,
              onChange: this.onChange.bind(this, value)
            }))
          } else if (child && child.type == RadioButton) {
            let value = child.props.value
            let checked = this.state.value == value && value !== undefined && value !== null && value !== ''
            return React.cloneElement(child, Object.assign({}, child.props, {
              actived: checked,
              mini: this.props.mini,
              disabled: child.props.disabled || this.props.disabled,
              onChange: this.onChange.bind(this, value)
            }))
          } else {
            return child
          }
        })
      }
    </div>
  }
}
RadioGroup.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  mini: PropTypes.bool,
  disabled: PropTypes.bool,
}


RadioGroup.childContextTypes = {
  RadioGroup: PropTypes.any
}