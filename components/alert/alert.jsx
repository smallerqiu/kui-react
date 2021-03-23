import React from 'react'
import Icon from '../icon'
import { Kui, PropTypes } from '../kui'
import Transition from '../transition'

export default class Alert extends Kui {

  state = {
    closed: false
  }

  close = () => {
    this.setState({ closed: true })
    let { onClose } = this.props
    onClose && onClose()
  }

  render() {

    let { showIcon, closable, type, description, message, children } = this.props
    let { closed } = this.state

    const classes = [
      "k-alert", {
        [`k-alert-${type}`]: type,
        'k-alert-has-icon': showIcon,
        'k-alert-has-close': closable,
        'k-alert-has-description': description,
      }
    ];
    let icons = {
      info: "information-circle",
      error: "close-circle",
      success: "checkmark-circle",
      warning: "alert-circle"
    };
    const iconNode = showIcon ? <Icon type={icons[type]} className="k-alert-icon" /> : null
    const closeIcon = closable ? <Icon className="k-alert-close" type="close" onClick={this.close} /> : null
    description = <div className="k-alert-description">{description}</div>
    const msg = <div className="k-alert-message">{(message || children)}</div>
    return (
      <Transition name='k-alert-slide' show={!closed}>
        <div className={this.className(classes)} >
          {iconNode}
          {msg}
          {description}
          {closeIcon}
        </div >
      </Transition >
    )
  }
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'error', 'success', 'warning']),
  closable: PropTypes.bool,
  showIcon: PropTypes.bool,
  message: PropTypes.string,
  description: PropTypes.string
}

Alert.defaultProps = {
  type: 'warning'
}