import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class ButtonGroup extends Kui {

  static propTypes = {
    size: PropTypes.oneOf(['small', 'large']),
    circle: PropTypes.bool
  }


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

