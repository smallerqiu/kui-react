import React from 'react'
import PopBase from '../base/pop'
import { Kui, PropTypes } from '../kui'

export default class Dropdown extends Kui {

  static defaultProps = {
    trigger: 'hover',
    transfer: true,
    placement: 'bottom-left',
    showPlacementArrow: false
  }
  static propTypes = {
    dark: PropTypes.bool,
    trigger: PropTypes.string,
    transfer: PropTypes.bool,
    showPlacementArrow: PropTypes.bool,
    visible: PropTypes.bool,
    placement: PropTypes.oneOf(["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right"]),
    content: PropTypes.any
  }

  static childContextTypes = {
    Dropdown: PropTypes.any
  }

  getChildContext() {
    return {
      Dropdown: this
    }
  }

  state = {
    show: this.props.visible || false
  }

  componentDidUpdate(prevProps, prevState, snap) {
    let { visible } = this.props
    if (visible != prevProps.visible) {
      this.setState({ show: visible })
    }
  }
  render() {
    let { show } = this.state
    let { dark, trigger, transfer, showPlacementArrow, placement, content, children } = this.props
    if (trigger == 'contextmenu') {
      showPlacementArrow = false
    }
    let props = {
      preCls: 'dropdown',
      dark, trigger, transfer, showPlacementArrow,
      placement, content,
      show,
      onVisibleChange: (show) => {
        this.setState({ show })
      }
    }
    return (
      <PopBase {...props} >{children}</PopBase>
    )
  }
  handleClick(options) {
    this.setState({ show: false })
    let { onClick, onChange } = this.props
    onClick && onClick(options)
    onChange && onChange(false)
  }
}