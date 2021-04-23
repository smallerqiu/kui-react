import Icon from '../icon'
import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Notice extends Kui {
  static defaultProps = {
    type: "info",
    noticeType: "message",
    onClose: () => { }
  }
  static propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    content: PropTypes.string,
    closable: PropTypes.bool,
    noticeType: PropTypes.string,
    onClose: PropTypes.func
  }
  render() {
    let { noticeType, type, content, title, onClose, closable } = this.props
    const classes = [`k-${noticeType}-box`, `k-${noticeType}-${type}`, {
      'k-notice-has-icon': noticeType == 'notice' && type != 'default'
    }];
    let childNode;
    let icons = {
      info: "information-circle",
      error: "close-circle",
      success: "checkmark-circle",
      warning: "alert-circle"
    };
    let iconNode = type != 'default' ? <Icon type={icons[type]} className={`k-${noticeType}-icon`} /> : null
    if (noticeType == 'message') {

      childNode = (
        <div className="k-message-content">
          {iconNode}
          <span>{content}</span>
          {closable ? <Icon className="k-message-close" type="close" onClick={onClose} /> : null}
        </div>
      )
    } else {
      childNode = (
        <div className="k-notice-content">
          {iconNode}
          <div className="k-notice-title">{title}</div>
          <div className="k-notoce-desc">{content}</div>
          <Icon className="k-notice-close" type="close" onClick={onClose} />
        </div>
      )
    }
    return (
      <div className={this.className(classes)}>
        {childNode}
      </div>
    )
  }
}

