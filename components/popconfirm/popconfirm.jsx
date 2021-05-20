import React from 'react';
import { Kui, PropTypes } from '../kui'
import BasePop from '../base/pop'

export default class Poptip extends Kui {
  static defaultProps = {
    placement: 'top',
    trigger: 'click',
    transfer: true,
    okText: '确定',
    cancelText: '取消'
  }
  static propTypes = {
    dark: PropTypes.bool,
    trigger: PropTypes.string,
    transfer: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.any,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    placement: PropTypes.oneOf(["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "left-bottom", "left-top", "right", "right-top", "right-bottom"]),
    visible: PropTypes.bool,
  }

  state = {
    visible: this.props.visible
  }

  componentDidUpdate(prevProps, prevState, snap) {
    let { visible } = this.props
    if (visible != prevProps.visible) {
      this.setState({ visible })
    }
  }

  render() {
    let { children, dark, placement, width, transfer, title, trigger,
      onOk, onCancel, onVisibleChange } = this.props

    let { visible } = this.state
    let props = {
      show: visible, trigger,
      dark, placement, width, transfer, title,
      preCls: 'popconfirm',
      confirm: true,
      onVisibleChange: (visible) => {
        this.setState({ visible })
        onVisibleChange && onVisibleChange(visible)
      },
      onOk: () => {
        onOk && onOk()
      },
      onCancel: () => {
        onCancel && onCancel()
      }
    }
    return (<BasePop {...props}>{children}</BasePop>
    )
  }
}
