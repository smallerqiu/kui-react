import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
import Button from '../button'
import Transfer from '../base/transfer'
import { CSSTransition } from 'react-transition-group'
import { measureScrollBar, getOffset } from '../_tool/utils'

let cacheBodyOverflow = {};

export default class Modal extends Kui {
  static defaultProps = {
    okText: '确定',
    cancelText: '取消',
    mask: true,
    maskClosable: true,
    transfer: true,
    showPoint: { x: 0, y: 0 }
  }
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    top: PropTypes.number,
    width: PropTypes.number,
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    maximized: PropTypes.bool,
    centered: PropTypes.bool,
    draggable: PropTypes.bool,
    loading: PropTypes.bool,
    footer: PropTypes.any,
    onOk: PropTypes.func,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    transfer: PropTypes.bool,
    showPoint: PropTypes.object
    // type: PropTypes.oneOf(['modal', 'toast']),
    // color: PropTypes.string,
    // icon: PropTypes.string,
  }
  state = {
    rendered: false,
    show: this.props.visible,
    showInner: this.props.visible,
    left: '',
    currentTop: this.props.top,
    isMouseDown: false,
    mousedownIn: false,
    startPos: { x: 0, y: 0 },
    showPoint: this.props.showPoint
  }

  modalRef = React.createRef()
  headerRef = React.createRef()
  elRef = React.createRef()

  componentDidUpdate(prevProps, prevState, snap) {
    let { visible } = this.props
    if (visible != prevProps.visible) {
      this.updateProp(visible)
    }
    if (visible) {
      this.setPos()
    }
  }

  componentDidMount() {
    this.mousedown = this.mousedown.bind(this)
    this.mousemove = this.mousemove.bind(this)
    this.mouseup = this.mouseup.bind(this)
    document.addEventListener('mousedown', this.mousedown)

    if (this.props.draggable) {
      let left = (document.body.offsetWidth - (this.props.width || 520)) / 2
      this.setState({ left })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.mousedown)
    this.resetBodyStyle(false)
  }

  updateProp(visible) {
    if (visible) {
      this.setState({ rendered: true }, () => {
        this.setState({ show: visible, showInner: visible })
      })
    } else {
      this.setState({ show: false }, () => {
        setTimeout(() => {
          this.setState({ showInner: false })
        }, 230);
      })
    }
    this.resetBodyStyle(visible)
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
  setPos() {
    let { showPoint: { x, y }, show } = this.state

    if (show) {
      let { left, top } = getOffset(this.modalRef.current)
      this.modalRef.current.style['transform-origin'] = `${x - left}px ${y - top}px`
    }
  }
  ok() {
    this.props.onOk && this.props.onOk()
  }
  cancel() {
    this.close()
    this.props.onCancel && this.props.onCancel()
  }
  close() {
    this.props.onCancel && this.props.onCancel()
    this.props.onClose && this.props.onClose()
  }
  clickMaskToClose(e) {
    let { loading, maskClosable } = this.props
    let { mousedownIn } = this.state
    if (!loading && maskClosable && !this.modalRef.current.contains(e.target) && !mousedownIn) {
      this.close()
    }
  }
  mousemove(e) {
    let { draggable } = this.props
    let { isMouseDown, startPos, currentTop, left } = this.state
    if (isMouseDown && draggable) {
      let { x, y } = startPos
      left += e.clientX - x
      currentTop = currentTop || 100
      currentTop += e.clientY - y
      startPos = { x: e.clientX, y: e.clientY }
      this.setState({ startPos, currentTop, left }, () => {
        this.setPos()
      })
      e.preventDefault()
    }
  }
  mouseup(e) {
    this.setState({ isMouseDown: false })
    document.removeEventListener('mousemove', this.mousemove)
    document.removeEventListener('mouseup', this.mouseup)
  }
  mousedown(e) {
    let { show, startPos } = this.state
    let { draggable } = this.props
    let { current } = this.headerRef
    if (!show) {
      let showPoint = { x: e.clientX, y: e.clientY }
      this.setState({ showPoint })
    }
    if (e.button == 0 && draggable === true && current && current.contains(e.target)) {
      startPos = { x: e.clientX, y: e.clientY }
      this.setState({ startPos, isMouseDown: true }, () => {
        this.mousemove(e)
        document.addEventListener('mousemove', this.mousemove)
        document.addEventListener('mouseup', this.mouseup)
      })

    }

    let mousedownIn = show && this.modalRef.current && this.modalRef.current.contains(e.target)
    this.setState({ mousedownIn })
  }
  render() {
    let { content, mask, title, children,
      cancelText, loading, okText, width,
      maximized, centered, footer, transfer,
      draggable } = this.props
    let { left, currentTop, showInner, show, rendered } = this.state

    //mask
    let maskNode = null
    if (mask) {
      maskNode = <CSSTransition
        timeout={300}
        classNames="k-modal-fade"
        in={show}>
        <div className="k-modal-mask" />
      </CSSTransition>
    }

    //content
    if (!content) {
      const contents = []
      contents.push(<span key="btnClose" className="k-modal-close" onClick={this.close.bind(this)}><Icon type="close" /></span>)
      contents.push(<div key="header" className="k-modal-header" ref={this.headerRef}><div className="k-modal-header-inner">{title}</div></div>)
      contents.push(<div key="body" className="k-modal-body">{children}</div>)

      //footer
      if (footer !== null) {
        // let footer = $slots.footer
        if (!footer) {
          footer = [<Button key="btnOk" onClick={this.cancel.bind(this)}>{cancelText}</Button>,
          <Button key="btnCancel" onClick={this.ok.bind(this)} type="primary" loading={loading}>{okText}</Button>]
        }
        const footerNode = footer ? <div className="k-modal-footer" key="footer">{footer}</div> : null;

        contents.push(footerNode)
      }
      content = <div className="k-modal-content" key="content">{contents}</div>
    }

    if (draggable) {
      left = left || (document.body.offsetWidth - (width || 520)) / 2
    }
    const style = {
      width: `${width}px`,
      top: `${currentTop}px`,
      left: `${left}px`,
    }
    const classes = [
      'k-modal', {
        'k-modal-draggable': draggable,
        'k-modal-maximized': maximized,
        'k-modal-centered': centered,
        'k-modal-has-footer': footer !== null,
      }
    ]
    return rendered ? <Transfer
      dropRef={this.elRef}
      show={rendered}
      transfer={transfer}>
      <div className={this.className(classes)} ref={this.elRef}>
        {maskNode}
        <div className="k-modal-wrap"
          onClick={this.clickMaskToClose.bind(this)}
          style={{ display: showInner ? '' : 'none' }}>
          <CSSTransition timeout={300} classNames="k-modal-zoom" in={show}>
            <div className="k-modal-inner" ref={this.modalRef} style={style}>
              {content}
            </div>
          </CSSTransition>
        </div>
      </div>
    </Transfer> : null
  }
}
