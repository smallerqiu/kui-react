import Checkbox from './checkbox';
import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class CheckboxGroup extends Kui {

  static childContextTypes = {
    Group: PropTypes.any
  };

  static contextTypes = {
    FormItem: PropTypes.any
  };

  static propTypes = {
    disabled: PropTypes.bool,
    options: PropTypes.array,
    value: PropTypes.array,
  }
  static defaultProps = {
    options: [],
    value: []
  }
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
    FormItem && FormItem.testValue(value)

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

