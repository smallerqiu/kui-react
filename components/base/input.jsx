import Icon from '../icon'
import { isNotEmpty } from '../_tool/utils'
import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class BaseInput extends Kui {

  static propTypes = {
    clearable: PropTypes.bool,
    size: PropTypes.oneOf(["small", "large", "default"]),
    inputType: PropTypes.string,
    value: PropTypes.any,
    type: PropTypes.oneOf(["text", "textarea", "password", "url", "email", "date", "search"]),
    icon: PropTypes.string,
    // iconAlign: PropTypes.string,
    suffix: PropTypes.any
  }
  static defaultProps = {
    size: 'default',
    type: 'text',
    inputType: 'input'
  }

  static contextTypes = {
    FormItem: PropTypes.any,
    Input: PropTypes.any,
    TextArea: PropTypes.any,
  }

  state = {
    currentValue: this.props.value || '',
    isFocus: false,
    isEnter: false,
    isPassword: true,
  }
  inputRef = React.createRef()

  componentDidMount() {
    let textInput = (this.context.Input || this.context.TextArea) || {}
    textInput.focus = () => {
      this.inputRef.current.focus()
    }
    textInput.blur = () => {
      this.inputRef.current.blur()
    }
  }
  componentDidUpdate(prevProps, prevState, snap) {
    let { value } = this.props
    if (value != prevProps.value) {
      this.setState({ currentValue: value })
    }
  }
  clear = () => {
    this.setState({ currentValue: '' }, () => {
      this.props.onChange && this.props.onChange({ target: { value: '' } })
      this.inputRef.current.focus()
    })
  }
  iconClick = () => {
    let { disabled, onIconClick } = this.props
    if (!disabled && onIconClick) {
      onIconClick()
    }
  }
  onFocus = (e) => {
    let { isFocus } = this.state
    let { onFocus } = this.props
    onFocus && onFocus(e)
    this.setState({ isFocus: !isFocus })
  }
  onBlur = (e) => {
    this.isFocus = false
    let { onBlur } = this.props
    onBlur && onBlur(e)
    this.FormItem && this.FormItem.testValue(this.state.currentValue, 'blur')
  }

  showPassword = () => {
    let { isPassword } = this.state
    let type = isPassword ? 'text' : 'password'
    this.setState({ isPassword: !isPassword })
    this.inputRef.current.type = type
  }
  onChange = (e) => {
    let onChange = this.props.onChange
    onChange && onChange(e)
    this.setState({ currentValue: e.target.value })
  }
  onSearch = () => {
    let { onSearch } = this.props
    onSearch && onSearch(this.state.currentValue)
  }
  getSuffix = () => {
    let { type, suffix } = this.props
    let { isPassword } = this.state
    const Search = this.props.onSearch ? <Icon type='search' onClick={this.onSearch} /> : null
    const Password = (type == 'password') ? <Icon type={!isPassword ? 'eye-outline' : 'eye-off-outline'} onClick={this.showPassword} /> : null

    return Password || Search || suffix
  }
  getTextInput = () => {
    const { disabled, size, type, inputType } = this.props
    let { currentValue } = this.state

    let isTextArea = inputType == 'textarea'
    // console.log(this.props)

    const options = { ...this.props }
    delete options.inputType
    delete options.onSearch
    delete options.clearable
    delete options.onIconClick

    const props = Object.assign(options, {
      style: this.styles(),
      value: currentValue,
      className: this.className([
        `k-${inputType}`,
        {
          [`k-${inputType}-disabled`]: disabled,
          ["k-input-sm"]: size == 'small' && !isTextArea,
          ["k-input-lg"]: size == 'large' && !isTextArea
        }
      ]),
      ref: this.inputRef,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
    })

    if (!isTextArea) {
      props.type = type
      delete props.rows
    }
    return isTextArea ? <textarea {...props} /> : <input {...props} />
  }

  render() {
    const { inputType, icon, suffix, size, type, onSearch, clearable } = this.props

    let isTextArea = inputType == 'textarea'
    let hasChild = icon || onSearch || suffix || type == 'password' || clearable

    let textInput = this.getTextInput()

    if (isTextArea || !hasChild) {
      return textInput
    } else {
      let { isFocus, isEnter, currentValue } = this.state
      const clearableShow = clearable && (isFocus || isEnter) && isNotEmpty(currentValue)
      let hasSuffix = onSearch || suffix || type == 'password'
      const props = {
        className: this.className([
          'k-input-wrapper',
          {
            ["k-input-has-suffix"]: hasSuffix,
            ["k-input-sm"]: size == 'small',
            ["k-input-lg"]: size == 'large',
            ["k-input-has-clear"]: clearable,
          }
        ]),
        onMouseEnter: () => this.setState({ isEnter: true }),
        onMouseLeave: () => this.setState({ isEnter: false })
      }
      const suffixNode = this.getSuffix()
      return <div {...props}>
        {icon ? <Icon type={icon} className="k-input-icon" onClick={this.iconClick.bind(this)} /> : null}
        {textInput}
        {suffixNode ? <div className="k-input-suffix">{suffixNode}</div> : null}
        {clearableShow ? <Icon type="close-circle" className="k-input-clearable" onClick={this.clear} /> : null}
      </div>
    }
  }
};