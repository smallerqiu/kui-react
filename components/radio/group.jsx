import Radio from './radio';
import Button from './button';
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
    value: PropTypes.any,
    optionType: PropTypes.oneOf(['button', 'default']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    hollow: PropTypes.bool,
    circle: PropTypes.bool
  }
  static defaultProps = {
    options: [],
    optionType: 'default',
    value: '',
  }

  state = {
    defaultValue: this.props.value || ''
  }

  change = ({ value }) => {
    const { onChange } = this.props
    this.setState({ defaultValue: value })
    onChange && onChange(value)
    let FormItem = this.context.FormItem
    FormItem && FormItem.testValue(value)

  }
  getChildContext() {
    return {
      Group: this
    };
  }
  componentDidUpdate(prevProps, prevState, snap) {
    let { value } = this.props
    if (value != prevProps.value) {
      this.setState({ defaultValue: value })
    }
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