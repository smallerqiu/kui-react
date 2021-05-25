import React from 'react'
import Modal from './modal'
import Button from '../button'
import Icon from '../icon'
import { Kui, PropTypes } from '../kui'

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

let showPoint = {}
let mousedown = e => {
  showPoint = { x: e.clientX, y: e.clientY }
}
if (typeof window !== undefined) {
  document.addEventListener('mousedown', mousedown)
}

export default class toast extends Kui {
  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.any,
    color: PropTypes.string,
    cancelText: PropTypes.string,
    okText: PropTypes.string,
  }
  state = {
    loading: false, visible: false
  }
  render() {
    //icons
    let { icon, title, content, color, cancelText, okText, type } = this.props
    let { loading, visible } = this.state
    let icons = {
      info: "information-circle",
      error: "close-circle",
      success: "checkmark-circle",
      warning: "alert-circle",
      confirm: 'help-circle'
    }
    let iconType = icons[type] || icon
    //header 
    let header = <div className="k-toast-header" key="header">
      {(iconType) ? <Icon className="k-toast-icon" type={iconType} color={color} /> : null}
      <div className="k-toast-title">{title}</div>
    </div>

    //body
    let body = <div className="k-toast-content" key="body">{content}</div>
    //footer
    let footerNode = [<Button type="primary"
      loading={loading}
      key="btnOk"
      onClick={this.ok.bind(this)}>{okText || '确定'}</Button>]

    if (type == 'confirm') {
      footerNode.unshift(<Button key="btnCancel" onClick={this.cancel.bind(this)}>{cancelText || '取消'}</Button>)
    }
    let footer = <div className='k-toast-footer' key="footer">{footerNode}</div>

    let classes = 'k-modal k-toast ' + (icons[type] ? 'k-toast-' + type : '')
    let props = {
      className: this.className(classes),
      content: [header, body, footer],
      visible,
      transfer: false,
      maskClosable: false,
      showPoint
    }
    return <Modal {...props} />;
  }
  show() {
    this.setState({ visible: true })
  }
  ok() {
    let { onOk } = this.props;
    let fun = onOk ? onOk() : {}
    if (isPromise(fun)) {
      this.setState({ loading: true })
      fun.then(e => { this.destroy() }).catch(e => { })
    } else {
      this.destroy()
    }
  }
  cancel() {
    let { onCancel } = this.props;
    onCancel && onCancel()
    this.destroy()
  }
  destroy() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        this.props.onDestroy && this.props.onDestroy()
      }, 300);
    })
  }
}