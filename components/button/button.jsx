import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'

export default class Button extends Kui {
  constructor() {
    super()
    this.onClick.bind(this)
  }
  onClick(e) {
    this.props.onClick && this.props.onClick(e)
  }
  render() {
    const { type, loading, circle, hollow, onClick, disabled,
      buttonType, icon, children, size, block } = this.props
    const onlyIcon = !(children && children.length)
    const cls = this.className([
      "k-btn",
      {
        [`k-btn-${type}`]: !!type,
        ["k-btn-sm"]: size == 'small',
        ["k-btn-block"]: !!block,
        ["k-btn-loading"]: loading,
        ["k-btn-icon-only"]: onlyIcon,
        ["k-btn-lg"]: size == 'large',
        ["k-btn-circle"]: !!circle,
        ["k-btn-hollow"]: !!hollow
      }
    ])
    const iconType = loading ? 'sync' : icon;

    const iconNode = iconType ? <Icon type={iconType} spin={loading} /> : null

    const props = {
      type: buttonType,
      disabled,
      style: this.styles(),
      className: cls,
      onClick: onClick
    }
    const kid = React.Children.map(children, child => {
      return <span>{child}</span>
    })

    return <button {...props}>
      {iconNode}
      {kid}
    </button>
  }
}

Button.propTypes = {
  buttonType: PropTypes.string,
  icon: PropTypes.string,
  block: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
  loading: PropTypes.bool,
  circle: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["danger", "primary", "link", "default", "dashed"]),
  hollow: PropTypes.bool,
  disabled: PropTypes.bool,
}

Button.defaultProps = {
  type: 'default',
}
