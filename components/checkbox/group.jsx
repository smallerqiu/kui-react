import Checkbox from './checkbox';
import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class CheckboxGroup extends Kui {

  change = (data) => {
    const { value, onChange } = this.props
    let index = value.indexOf(data.value)
    if (index < 0) {
      value.push(data.value);
    } else {
      value.splice(index, 1);
    }
    onChange && onChange(value)
    let FormItem = this.context.FormItem
    FormItem && FormItem.testValue(checked)

  }
  getChildContext() {
    return {
      Group: this
    };
  }
  render() {
    const { options, children } = this.props
    let childs = children
    if (options && options.length) {
      childs = options.map(option => {
        return <Checkbox
          key={option.value}
          value={option.value}
          label={option.label}
          disabled={option.disabled}
        />
      })
    }
    return (<div className={this.className(['k-checkbox-group'])}>{childs}</div>)
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
  value: PropTypes.array,
}
CheckboxGroup.defaultProps = {
  options: [],
  value: []
}
