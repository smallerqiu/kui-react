import React from 'react'
import { Kui, PropTypes } from '../kui'
import { Button, Transition, Icon } from '../index'

export default class Modal extends Kui {
  static defaultProps = {
    type: 'modal',
    icon: 'success',
    title: '我是一个标题',
    width: 520,
    okText: '确定',
    cancelText: '取消',
  }
  static propTypes = {
    footer: PropTypes.node,
    onOk: PropTypes.func,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    type: PropTypes.oneOf(['modal', 'toast']),
    color: PropTypes.string,
    icon: PropTypes.string,
    visible: PropTypes.bool,
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    isMove: PropTypes.bool,
  }
  state = {
    visible: props.visible,
    left: 0,
    top: 100,
    isMouseDown: false,
    startPos: { x: 0, y: 0 }
  }
  onKeyUp = this.onKeyUp.bind(this)
  modalRef = React.createRef()
  onStop(e) {
    e.cancelBubble = true
  }
  getColor() {
    return this.props.color ? { color: this.props.color } : {};
  }
  getIcon() {
    let { icon } = this.props
    let icons = {
      info: "ios-information-circle",
      error: "ios-close-circle",
      success: "ios-checkmark-circle",
      warning: "ios-alert"
    };
    return this.className([
      "k-toast-icon",
      {
        [`k-ion-${icons[icon]}`]: icons[icon],
        [`k-ion-${icon}`]: !icons[icon]
      }
    ])
  }
  onMouseDown(e) {
    if (e.button == 0) {
      this.setState({
        isMouseDown: true,
        // x: this.refs.Modal.offsetLeft,
        // y: this.refs.Modal.offsetTop,
        startPos: { x: e.clientX, y: e.clientY }
      })
    }
  }
  onMouseMove(e) {
    if (this.state.isMouseDown && this.props.isMove) {
      let { startPos, left, top } = this.state
      let movex = e.clientX - startPos.x
      let movey = e.clientY - startPos.y
      this.setState({
        left: left + movex,
        top: top + movey,
        startPos: { x: e.clientX, y: e.clientY },
      })
    }
  }
  onMouseUp() {
    this.setState({
      isMouseDown: false,
    })
  }
  onOk() {
    this.props.onOk && this.props.onOk()
    this.onClose();
  }
  onCancel() {
    this.props.onCancel && this.props.onCancel()
    this.onClose();
  }
  onClose() {
    this.props.onClose && this.props.onClose()
    this.setState({
      visible: false
    })
    // setTimeout(() => { this.left = 0; this.top = 100; }, 500);
  }
  classes() {
    return this.className([
      "k-modal",
      {
        ["k-toast"]: this.props.type == "toast"
      }
    ])
  }
  headerStyle() {
    return this.props.isMove ? { cursor: 'move' } : {};
  }
  modalStyles() {
    let style = {};
    let { width } = this.props
    let { top, left } = this.state
    style.width = `${width}px`;
    style.left = `${left}px`;
    style.top = `${top}px`;
    return style;
  }
  /*   componentWillReceiveProps(props) {
      if (this.state.visible !== props.visible) {
        this.setState({
          visible: props.visible
        })
      }
    } */
  onKeyUp(e) {
    if (this.state.visible && e.keyCode == 27) {
      this.setState({ visible: false })
      this.props.onClose && this.props.onClose();
    }
  }
  clickMaskToClose(e) {
    if (!this.modalRef.current.contains(e.target) && !this.props.isMove) {
      this.setState({ visible: false })
      this.props.onClose && this.props.onClose();
    }
  }
  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp);
  }
  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp);
  }
  renderWrap() {
    let { type, children, footer, cancelText, okText, title } = this.props
    let renderBody = () => {
      if (type == 'modal')
        return children || '我是内容';
      else if (type == 'toast') {
        return <div className="k-pull-center">
          <span className={this.getIcon()} style={this.styles(this.getColor())}></span>
          <div className="k-toast-content">
            {children || '我是内容'}
          </div>
        </div>
      }
    }
    let renderFooter = () => {
      if (footer != undefined) {
        return <div className="k-modal-footer"> {footer} </div>
      }
      else return <div className="k-modal-footer">
        {type == 'modal' && <div className="k-pull-right">
          <Button onClick={this.onCancel.bind(this)}>{cancelText}</Button>
          <Button type="primary" onClick={this.onOk.bind(this)}>{okText}</Button>
        </div>
        }
        {type == 'toast' && <div className="k-pull-center">
          <Button type="gray" hollow onClick={this.onOk.bind(this)}>{okText}</Button>
        </div>
        }
      </div>
    }
    return <div className="k-modal-wrap" onClick={this.clickMaskToClose.bind(this)} style={this.styles()}>
      <div className="modal" ref={this.modalRef} style={this.styles(this.modalStyles())}>
        <div className="k-modal-content">
          <a className="k-modal-close" onClick={this.onClose.bind(this)}><Icon type="md-close" /></a>
          {this.props.type == 'modal' && <div className="k-modal-header" style={this.styles(this.headerStyle())}
            onMouseDown={this.onMouseDown.bind(this)}>
            <div className="k-modal-header-inner">{title}</div>
          </div>}
          <div className="k-modal-body">
            {renderBody()}
          </div>
          {renderFooter()}
        </div>
      </div>
    </div>
  }
  render() {

    return <div className={this.classes()} onMouseMove={this.onMouseMove.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
      <Transition name="fade" show={this.state.visible} key="fsdafa">
        <div className="k-modal-mask" ></div>
      </Transition>
      <Transition name="fadeease" show={this.state.visible} key="fff">
        {this.renderWrap()}
      </Transition>
    </div>
  }
}
