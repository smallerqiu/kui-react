
import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Form extends Kui {
  static childContextTypes = {
    Form: PropTypes.any
  }
  static defaultProps = {
    labelAlign: 'right',
    size: 'default'
  }
  static propTypes = {
    labelAlign: PropTypes.oneOf(['left', 'top', 'right']),
    model: PropTypes.object,
    labelCol: PropTypes.object,
    wrapperCol: PropTypes.object,
    rules: PropTypes.object,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    onSubmit: PropTypes.func,
    onReset: PropTypes.func
  }
  state = {
    FormItems: [],
    defaultModel: this.props.model || {}
  }

  getChildContext() {
    return {
      Form: this
    }
  }

  componentDidUpdate(prevProps, prevState, snap) {
    let { model } = this.props
    console.log(model)
    if (model != prevProps.model) {
      this.setState({ defaultModel: model }, () => {
        this.validate()
      })
    }
  }

  setValue(prop, value = '') {
    let keys = prop.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.')
    let { defaultModel } = this.state
    let model = defaultModel
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      if (key in model) {
        if (i == keys.length - 1 || keys.length == 1) {
          let val = model[key]
          if (typeof val === 'boolean') {
            model[key] = value || false
          } else if (Array.isArray(val)) {
            model[key] = value || []
          } else {
            model[key] = value
          }
        }
        model = model[key]
      }
    }
    this.setState({ defaultModel })
  }

  test(key) {
    //提供外部单独验证
    let item = this.state.FormItems.filter(item => item.props.prop == key)[0]
    if (item) {
      let rule = item.props.rules || (this.props.rules || {})[item.props.prop]
      if (rule) {
        return item.validate(rule)
      }
    }
  }

  testProp(path) {
    let keys = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.')
    let model = this.state.defaultModel
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      if (key in model) {
        model = JSON.parse(JSON.stringify(model[key]))
      } else {
        throw new Error('请传入正确的prop值:' + path)
      }
    }
    return model;
  }

  validate(callback) {
    var result = true

    this.state.FormItems.forEach((item) => {
      let rules = item.props.rules || (this.props.rules || {})[item.props.prop]
      if (rules) {
        let valid = item.validate(rules)
        if (!valid) result = false
      }
    })

    if (typeof callback == 'function') {
      callback(result)
    }
  }
  onCollect = (context, push) => {
    const { FormItems } = this.state
    !push ? FormItems.splice(FormItems.indexOf(context), 1) : FormItems.push(context)
    if (push && context.props.prop && this.props.model) {
      this.testProp(context.props.prop)
    }
  }
  reset = () => {
    this.state.FormItems.forEach(item => {
      let { prop } = item.props
      if (prop) {
        this.setValue(prop)
      }
      item.setState({ valid: true })
    })
  }
  submit = (e) => {
    e.preventDefault()
    this.validate((result) => {
      this.props.onSubmit && this.props.onSubmit(e, result, this.state.defaultModel)
    })
  }
  render() {
    let { labelAlign, size, labelCol = {}, wrapperCol = {}, children } = this.props
    const classes = ["k-form",
      {
        [`k-form-label-${labelAlign}`]: labelAlign,
        'k-form-lg': size == 'large',
        'k-form-sm': size == 'small',
      }
    ];
    return (
      <form
        autoComplete="off"
        className={this.className(classes)}
        onSubmit={this.submit}
        onReset={this.reset}
      >
        {
          React.Children.map(children, child => {
            labelCol = child.props.labelCol || labelCol
            wrapperCol = child.props.wrapperCol || wrapperCol
            return React.cloneElement(child, { labelCol, wrapperCol, onCollect: this.onCollect })
          })
        }
      </form>
    )
  }
}

