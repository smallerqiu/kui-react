import React from 'react'
import { Kui, PropTypes } from '@/components/kui'
import { Transition, Transfer } from '../index'
import Option from './option'
export default class Select extends Kui {
  static defaultProps = {
    placeholder: '请选择',
    transfer: true,
    width: 0,
    value: '',
  }
  static propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    mini: PropTypes.bool,
    filterable: PropTypes.bool,
    transfer: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    clearable: PropTypes.bool,
    disabled: PropTypes.bool
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      dropdownWith: 0,
      left: 0,
      fadeInBottom: false,
      top: 0,
      label: "",
      selectLabel: '',
      value: props.value === undefined ? '' : props.value,
      queryKey: ''
    }
    this.domRef = React.createRef();
    this.relRef = React.createRef()
  }
  isClearable() {
    return this.props.clearable && !this.props.disabled && this.state.label;
  }
  classes() {
    return this.className([
      "k-select",
      {
        ["k-select-disabled"]: this.props.disabled,
        ["k-select-open"]: this.state.visible,
        ["k-select-mini"]: this.props.mini
      }
    ])
  }
  selectClass() {
    return this.className([
      "k-select-selection",
      {
        ["k-select-isclearable"]: this.props.clearable && this.state.label
      }
    ])
  }
  selectStyles() {
    return this.props.width > 0 ? { width: `${this.props.width}px` } : {};
  }
  dropdownStyles() {
    let style = {};
    style.width = `${this.state.dropdownWith}px`;
    style.left = `${this.state.left}px`;
    style.top = `${this.state.top}px`;
    if (this.state.fadeInBottom) {
      style["transformOrigin"] = "center bottom 0px";
    }
    return style;
  }
  onClear(e) {
    this.setState({
      selectLabel: '',
      label: ''
    })
    this.props.onChange && this.props.onChange('')
    this.props.onFormItemChange && this.props.onFormItemChange('')
    e.stopPropagation()
  }
  toggleDrop() {
    if (!this.props.disabled) {
      this.setState({
        dropdownWith: this.relRef.current.offsetWidth,
        visible: !this.state.visible
      })
    }
  }
  handleScroll() {
    setTimeout(() => {
      this.setPosition()
    });
  }
  setPosition() {
    if (!this.state.visible) return;
    let m = 3;
    let rel = this.relRef.current;
    let dom = this.domRef.current;
    let relPos = rel.getBoundingClientRect()


    let clientH = window.innerHeight;
    let clientW = window.innerWidth;
    // console.log(relPos)
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

    let domH = dom.offsetHeight;
    let relH = rel.offsetHeight;

    //set
    let left = 0
    let top = 0
    let fadeInBottom = false

    if (this.props.transfer) left = relPos.left + 1 + scrollLeft;
    //new
    if (clientH - relPos.top - relH - m < domH) {
      //空出来的高度不足以放下dom
      fadeInBottom = true;
      top = this.props.transfer ? relPos.top - m - domH + scrollTop : -(domH + m);
    } else {
      fadeInBottom = false;
      top = this.props.transfer ? relPos.top + relH + m + scrollTop : relH + m;
    }
    let dropdownWith = rel.offsetWidth;
    this.setState({
      left, top, dropdownWith, fadeInBottom
    })
  }
  onChange(item) {
    this.props.onChange && this.props.onChange(item.value);
    this.props.onFormItemChange && this.props.onFormItemChange(item.value)
    this.setState({
      label: item.label,
      selectLabel: item.label,
      visible: false,
      value: item.value,
      queryKey: ''
    })
  }
  setLabel() {
    React.Children.map(this.props.children, child => {
      if (this.state.value == child.props.value) {
        let label = child.props.label === undefined ? child.props.children : child.props.label
        this.setState({ label, selectLabel: label, })
      }
    })
  }
  hidePopup(e) {
    if (!this.state.visible) return
    if (!this.relRef.current.contains(e.target) && !this.domRef.current.contains(e.target)) {
      this.setState({ visible: false, queryKey: '', label: this.state.selectLabel })
    }
  }
  componentDidMount() {
    this.setLabel()
  }

  /*   componentWillReceiveProps(props) {
      let { value } = props
      if (props.value !== this.state.value) {
        this.setState({ value: value }, () => {
          if (value === '' || value === undefined || value === null)
            this.setState({ label: '', selectLabel: '' })
          else
            this.setLabel()
        })
      }
    } */
  labelChange(e) {
    this.setState({ label: e.target.value, queryKey: e.target.value })
  }
  render() {
    let { value, label, visible, queryKey } = this.state
    let { placeholder, disabled, filterable, transfer } = this.props
    let renderOption = (
      React.Children.map(this.props.children, child => {
        let _label = child.props.label === undefined ? child.props.children : child.props.label
        let show = true
        if (filterable) {
          let parsedQuery = String(queryKey).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, "\\$1");
          show = new RegExp(parsedQuery, "i").test(_label);
        }
        if (child.type !== Option || !show) return null
        return React.cloneElement(child, Object.assign({}, child.props, {
          selected: (value !== '' && value !== undefined && value !== null) && value == child.props.value,
          onClick: this.onChange.bind(this, { value: child.props.value, label: _label })
        }))
      })
    )
    return (<div className={this.classes()} style={this.styles(this.selectStyles())}  >
      <div className={this.selectClass()} onClick={this.toggleDrop.bind(this)} ref={this.relRef}>
        <input type="text" className="k-select-label" placeholder={placeholder} value={label}
          readOnly={!filterable || disabled}
          disabled={disabled} onChange={(e) => this.labelChange(e)} />
        <span className="k-select-arrow"></span>
        {this.isClearable && <span className="k-select-clearable" onClick={(e) => this.onClear(e)}></span>}
      </div >
      <Transfer transfer={transfer}
        onScroll={this.setPosition.bind(this)}
        onResize={this.setPosition.bind(this)}
        docOnClick={(e) => this.hidePopup(e)}>
        <Transition name="dropdown" show={visible} onEnter={() => this.setPosition()}>
          {
            <div className="k-select-dropdown" ref={this.domRef} style={this.styles(this.dropdownStyles())}>
              <ul>
                {renderOption}
                {renderOption && renderOption.length == 0 && <li className="k-select-item">暂无数据...</li>}
              </ul>
            </div>
          }
        </Transition>
      </Transfer>
    </div>)
  }
}