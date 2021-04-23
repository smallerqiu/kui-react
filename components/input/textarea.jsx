import React from 'react'
import { Kui, PropTypes } from '../kui'
import BaseInput from '../base/input'

export default class TextArea extends Kui {
  // static defaultProps = {
  //   iconAlign: 'right'
  // }
  static childContextTypes = {
    TextArea: PropTypes.any
  }
  // static propTypes = {
  //   onKeyUp: PropTypes.func,
  //   onKeyPress: PropTypes.func,
  //   onKeyDown: PropTypes.func,
  //   onFocus: PropTypes.func,
  //   onBlur: PropTypes.func,
  //   onChange: PropTypes.func,
  //   onEnter: PropTypes.func,
  //   onIconClick: PropTypes.func,

  //   iconAlign: PropTypes.oneOf(["left", 'right']),
  //   clearable: PropTypes.bool,
  //   type: PropTypes.oneOf(["text", "password", "url", "email", "date"]),
  //   icon: PropTypes.string,
  //   value: PropTypes.any,
  // }
  getChildContext() {
    return {
      TextArea: this
    };
  }
  render() {
    const props = {
      ...this.props,
      inputType: 'textarea'
    }
    return <BaseInput {...props} />
  }
}
