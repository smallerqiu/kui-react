import React from 'react'
import RenderDOM from 'react-dom'
import { Kui, PropTypes } from '../kui'
import Transition from '../transition'
export default class Notice extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
    this.domRef = React.createRef()
  }
  getIcon() {
    let icons = {
      info: "ios-information-circle",
      error: "ios-close-circle",
      success: "ios-checkmark-circle",
      warning: "ios-alert"
    };
    return `k-ion-${icons[this.props.type]}`;
  }
  classes() {
    let { noticeType, type } = this.props
    return this.className([
      `k-${noticeType}-notice`,
      {
        [`k-${noticeType}-${type}`]: type
      }
    ])
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  componentDidMount() {
    this.forceUpdate();
    this.startTimer()
    this.setState({ show: true })
  }
  onClose() {
    let dom = this.domRef.current
    if (dom) {
      dom = RenderDOM.findDOMNode(dom)
      dom.style.height = 0;
      dom.style.paddingTop = 0;
      dom.style.paddingBottom = 0;
    }
    this.setState({ show: false })
    this.props.onClose && this.props.onClose()
  }
  startTimer() {
    if (this.props.closable) return;
    this.timer = setTimeout(() => {
      this.onClose()
    }, this.props.duration * 1000)
  }
  onEnter(e) {
    e.style.height = e.scrollHeight - 15 + "px";
  }
  onExited(e) {
    this.props.onExited && this.props.onExited(e)
  }
  render() {
    let { transitionName, noticeType, content, closable, title } = this.props
    return (<Transition name={transitionName} show={this.state.show} ref={this.domRef} onExited={(e) => this.onExited(e)} onEnter={(e) => this.onEnter(e)}>
      {
        noticeType == 'message' ? <div className={this.classes()} >
          <div className="k-message-notice-content">
            <i className={this.getIcon()}></i>
            <span >{content}</span>
            {closable && <a className="k-message-close" onClick={this.onClose.bind(this)}></a>}
          </div>
        </div>
          :
          <div className={this.classes()}>
            <div className="k-notice-notice-content">
              <div className="k-notice-title">{title}</div>
              <div className="k-notoce-desc">{content}</div>
              <a className="k-notice-close" onClick={this.onClose.bind(this)}></a>
            </div>
          </div>
      }
    </Transition>)
  }
}
Notice.defaultProps = {
  type: 'info',
  transitionName: 'fadedown',
  noticeType: 'message',
  duration: 3
}
Notice.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  name: PropTypes.string,
  closable: PropTypes.bool,
  transitionName: PropTypes.string,
  noticeType: PropTypes.string,
  onClose: PropTypes.func,
  duration: PropTypes.number
}

