
import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class FormItem extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      width: props.width || props.labelWidth,
      valid: true,
      errorTip: '',
      rules: props.rules,
      fieldValue: props.value || ''
    }
  }
  classes() {
    let { required } = this.props
    return this.className([
      "k-form-item",
      {
        "k-form-item-required": required,
        "k-form-item-error": !this.state.valid
      }
    ])
  }
  labelStyles() {
    let width = this.state.width
    return { width: `${width}px` }
  }
  contentStyles() {
    let width = this.state.width
    return this.props.labelAlign != 'top' ? { marginLeft: `${width}px` } : {}
  }
  reset() {
    if (this.props.prop) {
      let { valid, fieldValue } = this.state
      valid = true
      fieldValue = Array.isArray(fieldValue) ? [] : ''
      console.log(fieldValue)
      this.setState({ valid, fieldValue }, () => {
        this.context.Form.resetField(this.props.prop)
      })
    }
  }
  test(rule) {
    let valid = true
    let value = this.state.fieldValue
    let message = rule.message || 'This field must required'
    let type = Object.prototype.toString.call(value)
    if (value === '' && type == '[object String]' && rule.required) {
      valid = false
    } else if (value.length == 0 && type == '[object Array]' && rule.required) {
      valid = false
    } else if (rule.min && value.length < rule.min) {
      valid = false
      message = rule.message || (type == '[object Array]' ? `Choose at least ${rule.min} item` : `Introduce no less than ${rule.min} words`)
    } else if (rule.max && value.length > rule.max) {
      valid = false
      message = rule.message || (type == '[object Array]' ? `Choose ${rule.max} items at best` : `Introduce no more than ${rule.max} words`)
    } else if (rule.pattner) {
      valid = rule.pattner.test(value)
      message = rule.message || 'Incorrect email format'
    } else if (rule.type == 'mail') {
      valid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)
      message = rule.message || 'Incorrect email format'
    } else if (rule.type == 'mobile') {
      valid = /^[1][3,4,5,7,8][0-9]{9}$/.test(value)
      message = rule.message || 'Incorrect mobile format'
    } else if (rule.type == 'number') {
      valid = typeof value === 'number' && isNaN(value);
      message = rule.message || 'Incorrect number format'
    } else if (rule.validator && typeof rule.validator == 'function') {
      rule.validator(this.rule, value, error => {
        if (error) {
          valid = false
          message = error.message
        }
      })
    }
    this.setState({ valid, errorTip: message })
    return valid
  }
  validates(trigger, callback = () => { }) {
    let { prop, rules } = this.props
    rules = rules || (prop && this.context.Form.getProp(prop).value)
    if (prop) {
      if (rules && rules.length) {
        let valid = true
        rules.forEach(rule => {
          trigger = !trigger ? rule.trigger || 'blur' : trigger
          if (rule.trigger == trigger) {
            if (!valid) {
              callback(valid)
              return false;
            }
            valid = this.test(rule)
            callback(valid)
          }
        })
      }
    }
  }
  onFormItemBlur(value) {
    this.setState({ fieldValue: value }, () => {
      this.validates('blur')
    })
  }
  onFormItemChange(value) {
    if (value != this.state.fieldValue) {
      this.setState({ fieldValue: value }, () => {
        this.validates('change')
      })
      this.context.Form.onFormItemChange(this.props.prop, value)
    }
  }
  componentWillUnmount() {
    this.props.prop && this.context.Form.addField(this)
  }
  componentDidMount() {
    this.props.prop && this.context.Form.addField(this)
  }
  render() {
    let { label, children } = this.props
    let { valid, errorTip } = this.state
    let renderItem = () => {
      return React.Children.map(children, child => {
        return React.cloneElement(child, Object.assign({}, child.props, {
          onFormItemChange: this.onFormItemChange.bind(this),
          onFormItemBlur: this.onFormItemBlur.bind(this)
        }))
      })
    }
    return (<div className={this.classes()} style={this.styles()}>
      {label && <label style={this.styles(this.labelStyles())} className="k-form-item-label">{label}</label>}
      <div className="k-form-item-content" style={this.styles(this.contentStyles())}>
        {renderItem()}
        {!valid && <div className="k-form-item-error-tip">{errorTip}</div>}
      </div>
    </div>)
  }
}
FormItem.contextTypes = {
  Form: PropTypes.any
};
FormItem.defaultProps = {
  width: 0
}
FormItem.propTypes = {
  onFormItemChange: PropTypes.func,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  errorTip: PropTypes.string,
  rules: PropTypes.array,
  prop: PropTypes.string,
  labelAlign: PropTypes.string,
  labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
