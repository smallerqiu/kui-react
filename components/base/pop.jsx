import React from 'react'
import Button from "../button";
import Icon from "../icon";
import Drop from './drop'
import { Kui, PropTypes } from '../kui'
// import Render from 'react-dom'
export default class BasePop extends Kui {

  static childContextTypes = {
    BasePop: PropTypes.any
  }

  getChildContext() {
    return {
      BasePop: this
    };
  }

  static defaultProps = {
    trigger: 'hover',
    showPlacementArrow: true,
    placement: 'top',
    okText: '确定',
    cancelText: '取消',
  }

  static propTypes = {
    preCls: PropTypes.string,
    trigger: PropTypes.string,
    confirm: PropTypes.bool,
    dark: PropTypes.bool,
    color: PropTypes.string,
    transfer: PropTypes.bool,
    show: PropTypes.bool,
    title: PropTypes.any,
    content: PropTypes.any,
    showPlacementArrow: PropTypes.bool,
    width: PropTypes.number,
    placement: PropTypes.oneOf(["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "left-bottom", "left-top", "right", "right-top", "right-bottom"]),
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    onVisibleChange: PropTypes.func
  }

  timer = null

  state = {
    opened: this.props.show || false,
  }

  selectionRef = React.createRef()
  dropRef = null

  componentDidUpdate(prevProps, prevState, snap) {
    let { show } = this.props
    if (show != prevProps.show) {
      this.setState({ opened: show })
    }
  }
  toggle(opened, callback) {
    this.setState({ opened }, () => callback && callback())
    this.props.onVisibleChange && this.props.onVisibleChange(opened, this.selectionRef)
  }
  ok() {
    this.toggle(false)
    this.props.onOk && this.props.onOk()
  }
  cancel() {
    this.toggle(false)
    this.props.onCancel && this.props.onCancel()
  }
  mouseEnter(e) {
    clearTimeout(this.timer)
    let { trigger, confirm } = this.props
    let { opened } = this.state
    if (trigger == "hover" && !confirm && !opened) {
      this.toggle(true)
    }
  }
  mouseLeave(e) {
    let { trigger, confirm } = this.props
    let { opened } = this.state
    if (trigger == 'hover' &&
      !confirm &&
      opened
    ) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.toggle(false)
      }, 200);
    }
  }

  contextMenu(e) {
    let { trigger, confirm, show } = this.props
    if (trigger == 'contextmenu') {
      e.persist()
      this.dropRef.points = e
      this.toggle(true)
      if (show) {
        this.dropRef.showContextmenu()
      }
      e.preventDefault();
      return false;
    }
  }

  onClick(e) {
    let { trigger, confirm } = this.props
    let { opened } = this.state
    if (trigger == 'contextmenu' && opened && !this.dropRef.elRef.current.contains(e.target)) {
      this.toggle(false)
    }
    if (trigger == "click" || confirm) {
      if (!opened) {
        this.toggle(true)
      }
    }
  }

  renderPopup() {
    let { placement, title, preCls, content, confirm, transfer, color,
      width, trigger,
      showPlacementArrow, cancelText, okText } = this.props, childNode;
    if (showPlacementArrow) {
      let titleNode, contentNode, footerNode;
      if (confirm) {
        contentNode = [<Icon type="help-circle" key="icon" />, <div key="title" className={`k-${preCls}-title`}>{title}</div>]

        footerNode = <div key="footer" className={`k-${preCls}-footer`}>
          <Button size="small" onClick={this.cancel.bind(this)}>{cancelText}</Button>
          <Button type="primary" size="small" onClick={this.ok.bind(this)}>{okText}</Button>
        </div>
      } else {
        titleNode = title ? <div key="title" className={`k-${preCls}-title`}>{title}</div> : ''
        contentNode = content
      }
      contentNode = contentNode ? <div key="content" className={`k-${preCls}-inner-content`}>{contentNode}</div> : null;

      childNode = [<div className={`k-${preCls}-arrow`} key="arrow"><div className={`k-${preCls}-arrow-content`} style={{ backgroundColor: /^#/.test(color) ? color : null }}></div></div>,
      <div className={`k-${preCls}-inner`} key="inner" style={{ backgroundColor: /^#/.test(color) ? color : null }}>{[titleNode, contentNode, footerNode]}</div>]

    } else {
      childNode = content
    }

    // childNode = React.cloneElement(childNode, { ref: this.overlayRef }) 
    let { opened } = this.state

    const props = {
      key: 'drop',
      selectionRef: this.selectionRef,
      transfer,
      show: opened,
      className: this.className([`k-${preCls}-content`, { [`k-${preCls}-${color}`]: color && !/^#/.test(color) }]),
      width,
      preCls,
      placement,
      color,
      trigger,
      transitionName: `k-${preCls}`,
      onMouseEnter: e => {
        if (this.dropRef.elRef.current.contains(e.target)) {
          clearTimeout(this.timer)
        }
      },
      onMouseLeave: () => {
        if (trigger == 'hover') {
          this.toggle(false)
        }
      },
      onClose: () => {
        this.toggle(false)
      }
    }
    return <Drop {...props}>{childNode}</Drop>
  }
  componentWillUnmount() {
    this.props.onUnmount && this.props.onUnmount()
  }
  render() {
    let { children } = this.props
    let { onMouseEnter, onClick, onMouseLeave, onContextMenu } = children.props
    let popup = this.renderPopup()
    const props = {
      ref: this.selectionRef,
      onContextMenu: e => {
        onContextMenu && onContextMenu(e)
        this.contextMenu(e)
      },
      onMouseEnter: e => {
        onMouseEnter && onMouseEnter(e)
        this.mouseEnter(e)
      },
      onMouseLeave: e => {
        onMouseLeave && onMouseLeave(e)
        this.mouseLeave(e)
      },
      onClick: e => { 
        onClick && onClick(e)
        this.onClick(e)
      }
    }
    let childs = [].concat(children.props.children, popup)
    return React.cloneElement(children, props, childs)
  }
}
