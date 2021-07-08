
import React from 'react'
import { Kui, PropTypes } from '../kui'
import { Row, Col } from '../grid'
import { CSSTransition } from 'react-transition-group'
import { isNotEmpty } from '../_tool/utils'

export default class FormItem extends Kui {
  static contextTypes = {
    Form: PropTypes.any
  };
  static defaultProps = {
    width: 0
  }
  static propTypes = {
    label: PropTypes.string,
    prop: PropTypes.string,
    labelCol: PropTypes.object,
    wrapperCol: PropTypes.object,
    rules: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  }
  state = {
    valid: true,
    itemValue: null,
    message: ''
  }

  testValue = () => {
    // 正在清理中，这时不进行验证
    let { rules, prop } = this.props
    if (prop) {
      let rule = rules || (this.context.Form.props.rules || {})[prop]
      rule && this.validate(rule)
    }
  }

  test = (rule, valid = true) => {
    let { prop } = this.props
    const itemValue = this.context.Form.testProp(prop)
    let message = rule.message
    // todo：
    // if (trigger == 'blur' && rule.trigger !== trigger) {
    //   return;
    // }
    if (rule.required) {
      valid = Array.isArray(itemValue) ? itemValue.length > 0 : (isNotEmpty(itemValue) && itemValue !== false)
      message = message || 'This field is required'
      // console.log(valid, message)
    } else {
      //valid custom pattern
      if (rule.pattern) {
        valid = rule.pattern.test(itemValue)
      }
      //valid type
      else if (rule.type) {
        switch (rule.type) {
          case 'mail':
            valid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(itemValue)
            message = message || 'Incorrect email format'
            break;
          case 'mobile':
            valid = /^[1][3-9][0-9]{9}$/.test(itemValue)
            message = message || 'Incorrect mobile phone number format'
            break;
          case 'number':
            // valid = typeof itemValue === 'number' && !isNaN(itemValue)
            valid = /^(-?\d+)(\.\d+)?$/.test(itemValue)
            message = message || 'Incorrect number format'
            // let { min, max } = rule
            // if (min !== undefined && min !== null && min !== '') {
            //   valid = itemValue <= min
            // }
            break;
          default:
            break;

        }
        // console.log(valid, prop, message)

      }
      //valid custom validator
      else if (typeof rule.validator === 'function') {
        rule.validator(rule, itemValue, error => {
          valid = error === undefined
          if (error) {
            message = error.message
          }
        })
      }
      //valid length (min or max)
      else if (rule.min !== undefined || rule.max !== undefined) {
        const _type = typeof itemValue
        //min
        if (rule.min !== undefined) {
          if (Array.isArray(itemValue)) {
            valid = itemValue.length >= rule.min
          } else if (_type === 'string') {
            valid = itemValue.replace(/[\u0391-\uFFE5]/g, "aa").length >= rule.min
          } else if (_type === 'number') {
            valid = itemValue >= rule.min
          }
        }

        //max
        if (rule.max !== undefined && valid) {
          if (Array.isArray(itemValue)) {
            valid = itemValue.length <= rule.max
          } else if (_type === 'string') {
            valid = itemValue.replace(/[\u0391-\uFFE5]/g, "aa").length <= rule.max
          } else if (_type === 'number') {
            valid = itemValue <= rule.max
          }
        }
        message = message || 'Incorrect length'
      }
    }
    this.setState({ message, valid })
    return valid
  }

  validate = (rules) => {
    if (rules.constructor === Object) return this.test(rules)
    // 有 required 排前面
    rules = rules.sort((a, b) => a.required ? -1 : 0)
    let valid = true
    for (let i = 0; i < rules.length; i++) {
      valid = this.test(rules[i], valid)
      if (!valid) {
        // 有一条规则不通过就跳出
        break;
      }
    }
    return valid
  }
  componentDidMount() {
    this.props.onCollect && this.props.onCollect(this, true)
  }
  componentWillUnmount() {
    this.props.onCollect && this.props.onCollect(this, false)
  }
  render() {
    let { label, prop, wrapperCol = {}, labelCol = {}, rules, children } = this.props
    let { message, valid, } = this.state
    const { Form } = this.context
    rules = rules || (Form.props.rules || {})[prop] || []
    const required = rules.constructor === Object ? rules.required : rules.filter(r => r.required).length > 0

    const classes = [
      "k-form-item",
      {
        "k-form-item-required": required,
        "k-form-item-error": !valid
      }
    ]

    if (Form.props.layout == 'vertical') {
      delete wrapperCol.offset
    }
    if (Form.props.layout == 'inline') {
      labelCol = {}
      wrapperCol = {}
    }

    let id = null
    if (Form.props.name && prop) {
      id = `${Form.props.name}_${prop}`
    }
    return (
      <Row className={classes} type="flex">
        {
          label ? <Col className="k-form-item-label"  {...labelCol}>
            <label htmlFor={id}>{label}</label>
          </Col>
            : null
        }
        <Col {...wrapperCol}>
          <div className="k-form-item-content">
            {
              React.Children.map(children, child => {
                if (child && React.isValidElement(child)) {
                  const tag = child.type.name
                  const value = prop ? Form.testProp(prop) : ''
                  const size =  Form.props.size
                  const props = {
                    id,
                    size
                  }
                  if (prop) {
                    if (['Radio', 'Checkbox', 'Switch'].indexOf(tag) > -1) {
                      props.checked = value || false
                    } else {
                      props.value = value
                    }
                    props.onChange = (value) => {
                      if (tag) {
                        if (['Radio', 'Checkbox'].indexOf(tag) > -1) {
                          value = value.target.checked
                        }
                        if (['Input', 'TextArea'].indexOf(tag) > -1) {
                          value = value.target.value
                        }
                        Form.setValue(prop, value)
                        this.testValue()
                      }
                    }
                    if (['Input', 'TextArea'].indexOf(tag) > -1) {
                      props.onBlur = (value) => {
                        value = value.target.value
                        this.testValue()
                      }
                    }
                  }
                  if (tag == 'FormItem') {
                    props.onCollect = (context, push) => {
                      this.props.onCollect && this.props.onCollect(context, push)
                    }
                  }
                  return React.cloneElement(child, props)
                } else {
                  return child
                }
              })
            }
            <CSSTransition classNames="k-form-item-fade" in={!valid} timeout={300} unmountOnExit>
              <div className="k-form-item-error-tip">{message}</div>
            </CSSTransition>
          </div>
        </Col>
      </Row>
    )
  }
}

