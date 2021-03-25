import Radio from './radio';
import Button from './button';
import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class CheckboxGroup extends Kui {

  change = (data) => {
    const { onChange } = this.props

    onChange && onChange(data.value)
    let FormItem = this.context.FormItem
    FormItem && FormItem.testValue(data.value)

  }
  getChildContext() {
    return {
      Group: this
    };
  }
  render() {
    const { options, children, optionType, circle } = this.props
    let childs = children
    if (options && options.length) {
      childs = options.map(option => {
        return optionType == 'default' ? <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          disabled={option.disabled}
        /> : <Button
          key={option.value}
          icon={option.icon}
          value={option.value}
          label={option.label}
          disabled={option.disabled}
        />
      })
    }
    return (<div className={this.className(['k-radio-group', { 'k-radio-cirle': circle }])}>{childs}</div>)
  }
}

CheckboxGroup.childContextTypes = {
  Group: PropTypes.any
};

CheckboxGroup.contextTypes = {
  FormItem: PropTypes.any
};

CheckboxGroup.propTypes = {
  disabled: PropTypes.bool,
  options: PropTypes.array,
  value: PropTypes.any,
  optionType: PropTypes.oneOf(['button', 'default']),
  size: PropTypes.oneOf(['small', 'large']),
  hollow: PropTypes.bool,
  circle: PropTypes.bool
}
CheckboxGroup.defaultProps = {
  options: [],
  optionType: 'default',
  value: []
}
