import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class Input extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      currentValue: props.value || '',
      clearableShow: false,
      isFocus: false,
      isMove: false
    }

    this.inputRef = React.createRef()
    this.textareaRef = React.createRef()

    // this.handleMove = this.handleMove.bind(this)
    // this.handleOut = this.handleOut.bind(this)
    // this.handleFocus = this.handleFocus.bind(this)
    // this.handleBlur = this.handleBlur.bind(this)
    // this.handleInput = this.handleInput.bind(this)
    // this.setCurrentValue = this.setCurrentValue.bind(this)

  }
  //compted
  iconClasses() {
    return this.className([`k-ion-${this.props.icon}`])
  }
  classes() {
    return this.className([
      "k-input-wp",
      {
        ["k-input-mini"]: this.props.mini,
        ["k-input-icon-left"]: this.props.icon && this.props.iconAlign == 'left'
      }
    ])
  }
  inputStyles() {
    return this.styles(this.props.width && this.props.width > 0 ? { width: `${this.props.width}px` } : {})
  }
  inputClasses() {
    return this.className([
      "k-input",
      {
        ["k-input-mini"]: !!this.props.mini,
        ["k-input-disabled"]: this.props.disabled
      }
    ])
  }
  textareaClasses() {
    return this.className([
      "k-input",
      {
        ["k-input-mini"]: !!this.props.mini,
        ["k-input-disabled"]: this.props.disabled,
        ["k-textarea"]: this.props.type == "textarea"
      }
    ])
  }
  // methods
  clear() {
    this.setCurrentValue("");
    this.setState({
      clearableShow: false
    })
  }
  handleMove(e) {
    const { currentValue } = this.state
    this.setState({
      clearableShow: currentValue && currentValue.length > 0,
      isMove: true
    })
  }
  handleOut() {
    this.setState({ isMove: false })
    if (!this.state.isFocus) {
      this.setState({
        clearableShow: false
      })
    }
  }
  iconClick(e) {
    !this.props.disabled && this.props.onIconClick && this.props.onIconClick(e)
  }
  handleEnter(e) {
    e.keyCode == 13 && this.props.onEnter && this.props.onEnter(e)
  }
  handleKeydown(e) {
    this.props.onKeyDown && this.props.onKeyDown(e)
  }
  handleKeypress(e) {
    this.props.onKeyPress && this.props.onKeyPress(e)
  }
  handleKeyup(e) {
    this.props.onKeyUp && this.props.onKeyUp(e)
    this.handleEnter(e)
  }
  handleFocus(e) {
    let { currentValue } = this.state
    this.setState({
      clearableShow: currentValue && currentValue.length > 0,
      isFocus: true
    })
    this.props.onFocus && this.props.onFocus(e)
  }
  handleBlur(e) {
    if (!this.state.isMove) {
      this.setState({
        clearableShow: false
      })
    }
    this.setState({
      isFocus: false
    })
    this.props.onBlur && this.props.onBlur(e)
    this.props.onFormItemBlur && this.props.onFormItemBlur(e.target.value)
  }
  handleInput(e) {
    let value = e.target.value;
    this.setState({
      clearableShow: value && value.length > 0
    })
    if (this.props.number)
      value = Number.isNaN(Number(value)) ? value : Number(value);
    this.props.onInput && this.props.onInput(value)
    this.setCurrentValue(value);
  }
  handleChange(e) {
    this.props.onChange && this.props.onChange(e)
    this.props.onFormItemChange && this.props.onFormItemChange(e.target.value)
  }
  setCurrentValue(value) {
    if (value === this.state.currentValue) return;
    this.setState({
      currentValue: value
    })
  }
  focus() {
    if (this.props.type === "textarea") {
      this.textareaRef.current.focus();
    } else {
      this.inputRef.current.focus();
    }
    this.setState({
      isFocus: true
    })
  }
  blur() {
    if (this.props.type === "textarea") {
      this.textareaRef.current.blur();
    } else {
      this.inputRef.current.blur();
    }
    this.setState({
      isFocus: false
    })
  }

  componentDidMount() {
    // this.setState({
    //   currentValue: this.props.value || ''
    // })
  }
  componentWillReceiveProps(props) {
    if (props.value != this.state.currentValue) {
      this.setCurrentValue(props.value)
    }
  }
  render() {
    let { type, icon, disabled, maxLength, name, clearable, autoFocus, number, placeholder, readOnly, rows, elementId, autoComplete, spellCheck } = this.props
    let { currentValue, clearableShow } = this.state
    return <div style={this.inputStyles()} className={this.classes()}
      onMouseMove={e => this.handleMove(e)} onMouseOut={e => this.handleOut(e)}
    >
      {
        type !== 'textarea' ?
          <div>
            {icon && type !== 'textarea' && <i className={this.iconClasses()} onClick={(e) => this.iconClick(e)}></i>}
            <input
              id={elementId} autoComplete={autoComplete} spellCheck={spellCheck} ref={this.inputRef} type={type}
              className={this.inputClasses()} placeholder={placeholder} disabled={disabled}
              maxLength={maxLength}
              value={currentValue || ''}
              readOnly={readOnly} name={name} number={number} autoFocus={autoFocus}
              onKeyUp={e => this.handleKeyup(e)}
              onKeyPress={e => this.handleKeypress(e)}
              onKeyDown={e => this.handleKeydown(e)}
              onFocus={e => this.handleFocus(e)}
              onBlur={e => this.handleBlur(e)}
              onInput={e => this.handleInput(e)}
              onChange={e => this.handleChange(e)}
            />
            {type != 'textarea' && clearable && clearableShow && <span className='k-input-clearable' onClick={this.clear.bind(this)} ></span >}
          </div >
          :
          <textarea id={elementId} autoComplete={autoComplete} spellCheck={spellCheck} ref={this.textareaRef}
            className={this.textareaClasses()} placeholder={placeholder} disabled={disabled} rows={rows}
            maxLength={maxLength} readOnly={readOnly}
            name={name}
            value={currentValue || ''}
            autoFocus={autoFocus}
            onChange={e => this.handleChange(e)}
            onKeyUp={e => this.handleKeyup(e)}
            onKeyPress={e => this.handleKeypress(e)}
            onKeyDown={e => this.handleKeydown(e)}
            onFocus={e => this.handleFocus(e)}
            onBlur={e => this.handleBlur(e)}
            onInput={e => this.handleInput(e)}
          >
          </textarea >
      }
    </div>
  }
}
Input.defaultProps = {
  iconAlign: 'right'
}
Input.propTypes = {
  onKeyUp: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onInput: PropTypes.func,
  onIconClick: PropTypes.func,
  onFormItemChange: PropTypes.func,

  iconAlign: PropTypes.oneOf(["left", 'right']),
  autoFocus: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  spellCheck: PropTypes.bool,
  elementId: PropTypes.string,
  clearable: PropTypes.bool,
  mini: PropTypes.bool,
  type: PropTypes.oneOf(["text", "textarea", "password", "url", "email", "date"]),
  icon: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  disabled: PropTypes.bool,
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  readOnly: PropTypes.bool,
  name: PropTypes.string,
  number: PropTypes.bool,
  autoComplete: PropTypes.oneOf(['on', 'off']),
  Id: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}