import React from 'react'
import { Kui, PropTypes } from '../kui'
import BasePop from '../base/pop'

export default class Tooltip extends Kui {
  static defaultProps = {
    transfer: true,
    trigger: 'hover',
    placement: 'top'
  }

  static propTypes = {
    dark: PropTypes.bool,
    transfer: PropTypes.bool,
    title: PropTypes.any,
    color: PropTypes.string,
    trigger: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.any,
    placement: PropTypes.oneOf(["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "left-bottom", "left-top", "right", "right-top", "right-bottom"]),
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
    let { children, dark, placement, width, transfer, color, title, trigger, content, onVisibleChange } = this.props
    let { visible } = this.state
    let props = {
      show: visible, trigger,color,
      dark, placement, width, transfer, title, content,
      preCls: 'tooltip',
      onVisibleChange: (visible) => {
        this.setState({ visible })
        onVisibleChange && onVisibleChange(visible)
      }
    }
    return (title ? <BasePop {...props}>{children}</BasePop> : children)
  }
}