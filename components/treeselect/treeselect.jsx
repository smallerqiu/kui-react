import React from 'react'
import { Kui, PropTypes } from '@/components/kui'
import { Tree } from '../index'
export default class TreeSelect extends Kui {
  static defaultProps = {
    placeholder: '请选择',
    queryPlaceholder: '请输入关键字查询',
    transfer: true,
    width: 0,
    value: '',
    data: [],
    label: ''
  }
  static propTypes = {
    onChange: PropTypes.func,
    queryPlaceholder: PropTypes.string,
    placeholder: PropTypes.string,
    mini: PropTypes.bool,
    data: PropTypes.array,
    queryable: PropTypes.bool,
    transfer: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    clearable: PropTypes.bool,
    disabled: PropTypes.bool
  }
  state = {
    visible: false,
    dropdownWith: 0,
    left: 0,
    fadeInBottom: false,
    top: 0,
    showLabel: props.label || '',
    value: props.value,
    queryKey: ''
  }
  domRef = React.createRef();
  relRef = React.createRef()
  isClearable() {
    return this.props.clearable && !this.props.disabled && this.state.showLabel;
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
        ["k-select-isclearable"]: this.props.clearable && this.state.showLabel
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
  onQueryChange() {
    this.props.onQueryChange && this.props.onQueryChange(this.state.queryKey)
  }
  treeSelect(item) {
    let { onChange } = this.props
    let { visible, showLabel } = this.state
    if (onChange) {
      onChange(item, value => {
        visible = value
        if (!value) {
          showLabel = item.title
          this.setState({ showLabel, visible, value: item.value || '' })
        }
      })
      return;
    }
    this.setState({
      showLabel: item.title,
      value: item.value || '',
      visible: false
    })
  }
  onClear(e) {
    this.setState({
      selectLabel: '',
      showLabel: ''
    })
    this.props.onChange && this.props.onChange('')
    e.stopPropagation()
  }
  toggleDrop() {
    if (this.props.disabled) {
      return false;
    }
    this.setState({
      dropdownWith: this.relRef.current.offsetWidth,
      visible: !this.state.visible
    })

    this.handleScroll();

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
    this.setState({
      label: item.label,
      selectLabel: item.label,
      visible: false,
      value: item.value,
      queryKey: ''
    })
  }
  hidePopup(e) {
    if (!this.state.visible) return
    if (!this.relRef.current.contains(e.target) && !this.domRef.current.contains(e.target)) {
      this.setState({ visible: false, queryKey: '', label: this.state.selectLabel })
    }
  }
  onExpand() {
    this.handleScroll()
  }

  /*   componentWillReceiveProps(props) {
      if (props.label !== this.state.showLabel) {
        this.setState({ showLabel: props.label })
      }
      if (props.value !== this.state.value) {
        this.setState({ value: props.value })
      }
    } */
  labelChange(e) {
    this.setState({ showLabel: e.target.value, queryKey: e.target.value })
  }
  render() {
    let { value, showLabel, visible, queryKey } = this.state
    let { placeholder, disabled, queryPlaceholder, transfer, data, onLoadData, queryable } = this.props

    return (<div className={this.classes()} style={this.styles(this.selectStyles())}  >
      <div className={this.selectClass()} onClick={this.toggleDrop.bind(this)} ref={this.relRef}>
        <input type="text" className="k-select-label" placeholder={placeholder} value={showLabel}
          readOnly="readonly"
          disabled={disabled} onChange={(e) => this.labelChange(e)} />
        <span className="k-select-arrow"></span>
        {this.isClearable && <span className="k-select-clearable" onClick={(e) => this.onClear(e)}></span>}
      </div >
      <Transfer transfer={transfer}
        onScroll={this.setPosition.bind(this)}
        onResize={this.setPosition.bind(this)}
        docOnClick={(e) => this.hidePopup(e)}>
        <Transition name="dropdown" show={visible}>
          {
            <div className="k-select-dropdown" ref={this.domRef} style={this.styles(this.dropdownStyles())}>
              {queryable && <div className="k-treeselect-search">
                <input className="k-treeselect-input" placeholder={queryPlaceholder} value={queryKey} onChange={(e) => this.setState({ queryKey: e.target.value })} />
                <input type="button" value="搜索" className="k-treeselect-btn" onClick={this.onQueryChange.bind(this)} />
              </div>}
              <Tree data={data} onLoadData={onLoadData} onSelect={this.treeSelect.bind(this)} onExpand={this.onExpand.bind(this)}></Tree>
            </div>
          }
        </Transition>
      </Transfer>
    </div>)
  }
}