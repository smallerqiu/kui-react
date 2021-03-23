import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class ButtonGroup extends Kui {
  
  render() {
    const { size, circle, children } = this.props
    const props = {
      className: this.className([
        "k-btn-group",
        {
          ["k-btn-group-sm"]: size == 'small',
          ["k-btn-group-lg"]: size == 'large',
          ["k-btn-group-circle"]: circle
        }
      ])
    }
    return <div {...props} style={this.styles()}>{children}</div>
  }
}

ButtonGroup.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  circle: PropTypes.bool
}


