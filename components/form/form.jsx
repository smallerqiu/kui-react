
import React from 'react'
import { Kui, PropTypes } from '../kui'
import FormItem from './formitem'
export default class Form extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      model: props.model
    }
  }
  classes() {
    let { labelAlign } = this.props
    return this.className([
      "k-form",
      {
        [`k-form-${labelAlign}`]: labelAlign
      }
    ])
  }
  resetField(key) {
    let { model } = this.props
    if (model && model[key]) {
      let type = Object.prototype.toString.call(model[key])
      if (type === '[object Object]') model[key] = {}
      else if (type === '[object Array]') model[key] = []
      else model[key] = ''
      this.props.onChange && this.props.onChange(model)
    }
  }
  getChildContext() {
    return {
      Form: this
    }
  }
  resetFields() {
    this.state.items.forEach(item => item.reset())
  }
  removeField(field) {
    let { items } = this.state
    items.splice(items.indexOf(field), 1);
    this.setState({ items })
  }
  addField(field) {
    let { items } = this.state
    items.push(field)
    this.setState({ items })
  }
  getProp(prop) {
    prop = prop.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    let keys = prop.split('.')
    let newModel = this.props.rules
    let len = keys.length - 1
    for (let i = 0; i < len; i++) {
      let key = keys[i]
      if (key in newModel) {
        newModel = newModel[key]
      } else {
        throw new Error('请传入正确的prop值')
      }
    }
    return {
      model: newModel,
      key: keys[len],
      value: newModel[keys[len]]
    };
  }
  validate(callback) {
    var isValid = true
    this.state.items.forEach(item => {
      item.validates(null, valid => {
        if (!valid) isValid = valid
      })
    })
    if (typeof callback === 'function') {
      callback(isValid)
    }
  }
  validateField(key) {
    let field = this.fields.filter(x => x.prop == key)[0]
    if (field) {
      field.validates()
    }
  }
  onFormItemChange(prop, value) {
    let { model } = this.state
    if (model) {
      model[prop] = value
      this.props.onChange && this.props.onChange(model)
    }
  }
  // componentWillReceiveProps(props)
  render() {
    let { labelWidth, labelAlign, children } = this.props
    let renderItem = () => {
      return React.Children.map(children, child => {
        let { props, type } = child
        if (type == FormItem) {
          let itemRules = props.rules || (props.prop && this.getProp(props.prop).value)
          let required = props.required || itemRules && itemRules.filter(rule => rule.required).length > 0
          return React.cloneElement(child, Object.assign({}, child.props, {
            labelWidth, labelAlign, required,
            resetField: this.resetField.bind(this),
          }))
        } else {
          return child
        }
      })
    }
    return (<div>
      <form autoComplete="off" className={this.classes()} style={this.styles()}>
        {renderItem()}
      </form>
    </div>)
  }
}
Form.childContextTypes = {
  Form: PropTypes.any
}
Form.defaultProps = {
  labelAlign: 'right',
  labelWidth: 80
}
Form.propTypes = {
  labelAlign: PropTypes.oneOf(['left', 'top', 'right']),
  model: PropTypes.object,
  rules: PropTypes.object,
  labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
