import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'

export default class Button extends Kui {

  static propTypes = {
    buttonType: PropTypes.string,
    icon: PropTypes.string,
    block: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    loading: PropTypes.bool,
    circle: PropTypes.bool,
    type: PropTypes.oneOf(["danger", "primary", "link", "default", "dashed"]),
    hollow: PropTypes.bool,
  }

  static defaultProps = {
    type: 'default',
    size: 'default',
  }

  render() {
    const { type, loading, circle, hollow,
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
    const options = { ...this.props };
    ['hollow', 'circle', 'loading', 'block'].map(a=>delete options[a])
    const props = Object.assign(options, {
      type: buttonType,
      style: this.styles(),
      className: cls,
    })
    const kid = React.Children.map(children, child => {
      return <span>{child}</span>
    })

    return <button {...props}>
      {iconNode}
      {kid}
    </button>
  }
}
