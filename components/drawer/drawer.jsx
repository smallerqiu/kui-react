import Button from "../button";
import Icon from "../icon";
import Transfer from "../base/transfer";
import { measureScrollBar } from '../_tool/utils'
import { Kui, PropTypes } from '../kui'
import React from 'react'
import { CSSTransition } from 'react-transition-group'

let cacheBodyOverflow = {};

export default class Drawer extends Kui {

  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    placement: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
    closable: PropTypes.bool,
    footer: PropTypes.any,
    maskClosable: PropTypes.bool,
  }

  static defaultProps = {
    title: 'Title',
    width: 520,
    height: 256,
    okText: '确定',
    cancelText: '取消',
    placement: 'right',
    closable: true,
    maskClosable: true,
  }

  state = {
    show: this.props.visible,
    rendered: this.props.visible
  }
  componentDidUpdate(prevProps, prevState, snap) {
    let { visible, placement } = this.props
    if (visible != prevProps.visible) {
      this.setState({ rendered: true }, () => {
        this.setState({ show: visible }, () => {
          this.resetBodyStyle(visible)
        })
      })
    }
    if (placement != prevProps.placement && this.state.rendered) {
      this.contentRef.current.className = `k-drawer-box k-drawer-${placement}-exit-done`
    }
  }
  componentWillUnmount() {
    this.resetBodyStyle(false)
  }
  ok = () => {
    this.props.onOk && this.props.onOk()
  }
  onKeyUp = (e) => {
    if (this.state.show) {
      if (e.keyCode == 27) this.close();
    }
  }
  cancel = () => {
    this.props.onCancel && this.props.onCancel()
    this.close();
  }
  close = () => {
    // this.setState({ show: false })
    this.props.onCancel && this.props.onCancel()
    this.props.onClose && this.props.onClose()
  }
  maskToClose = () => {
    if (this.props.maskClosable) {
      this.close()
    }
  }
  resetBodyStyle(opened) {
    if (!this.state.show && !cacheBodyOverflow.hasOwnProperty('overflow')) {
      cacheBodyOverflow = {
        width: document.body.width,
        overflow: document.body.overflow,
        overflowX: document.body.overflowX,
        overflowY: document.body.overflowY,
      }
    }
    if (opened) {
      let barWidth = measureScrollBar(true)
      if (barWidth) {
        document.body.style.width = `calc(100% - ${barWidth}px)`
        document.body.style.overflow = `hidden`
      }
    } else {
      setTimeout(() => {
        Object.keys(cacheBodyOverflow).forEach(key => {
          document.body.style[key] = cacheBodyOverflow[key] || ''
          delete cacheBodyOverflow[key]
        })
      }, 300)
    }
  }
  elRef = React.createRef()
  contentRef = React.createRef()
  render() {
    const { title, cancelText, okText, placement, closable, footer, width, height, children } = this.props
    const { rendered, show } = this.state
    const canelBtn = <Button onClick={this.cancel} key="cancelBtn">{cancelText}</Button>
    const okBtn = <Button type="primary" onClick={this.ok} key="okBtn">{okText}</Button>
    const footNode = (
      footer !== null ? <div className="k-drawer-footer">
        {footer}
        {!footer && [canelBtn, okBtn]}
      </div> : null
    )
    const closeNode = closable
      ? <span className="k-drawer-close" onClick={this.close}><Icon type="close" /></span>
      : null
    const transitionName = `k-drawer-${placement}`

    const classes = ['k-drawer', `k-drawer-${placement}`,
      { 'k-drawer-open': show },
      { 'k-drawer-has-footer': footer !== null },
    ]
    let styles = {}
    if (placement == 'left' || placement == 'right') styles.width = width + 'px'
    if (placement == 'top' || placement == 'bottom') styles.height = height + 'px'
    // const wrapCls =
    return (
      <Transfer Transfer transfer={true} show={rendered} dropRef={this.elRef} parentSelector={() => document.body}>
        <div className={this.className(classes)} ref={this.elRef}>
          <CSSTransition classNames="k-drawer-fade" timeout={300} in={show}>
            <div className="k-drawer-mask" onClick={this.maskToClose}></div>
          </CSSTransition>
          <CSSTransition classNames={transitionName} timeout={200} in={show}>
            <div className="k-drawer-box" ref="drawer" style={styles} ref={this.contentRef}>
              <div className="k-drawer-content">
                {closeNode}
                <div className="k-drawer-header"><div className="k-drawer-header-inner">{title}</div></div>
                <div className="k-drawer-body">
                  {children}
                </div>
                {footNode}
              </div>
            </div>
          </CSSTransition>
        </div></Transfer>
    )
  }
};
