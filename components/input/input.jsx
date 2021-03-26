import React from 'react'
import { Kui, PropTypes } from '../kui'
import BaseInput from '../base/input'

export default class Input extends Kui {

  getChildContext() {
    return {
      Input: this
    };
  }
  render() {
    const props = {
      ...this.props,
      inputType: 'input',
      style: this.styles(this.props.style)
    }

    return <BaseInput {...props} />
  }
}
// Input.defaultProps = {
//   iconAlign: 'right'
// }
Input.childContextTypes = {
  Input: PropTypes.any
}
// Input.propTypes = {
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