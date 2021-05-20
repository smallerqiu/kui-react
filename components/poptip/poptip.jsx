import React from 'react';
import { Kui, PropTypes } from '../kui'
import BasePop from '../base/pop'

export default class Poptip extends Kui {
  static defaultProps = {
    placement: 'top',
    trigger: 'hover',
    transfer: true
  }
  static propTypes = {
    dark: PropTypes.bool,
    trigger: PropTypes.string,
    transfer: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.any,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
    let { children, dark, placement, width, transfer, title, trigger, content, onVisibleChange } = this.props
    let { visible } = this.state
    let props = {
      show: visible, trigger,
      dark, placement, width, transfer, title, content,
      preCls: 'poptip',
      onVisibleChange: (visible) => {
        this.setState({ visible })
        onVisibleChange && onVisibleChange(visible)
      }
    }
    return (<BasePop {...props}>{children}</BasePop>
    )
  }
}
