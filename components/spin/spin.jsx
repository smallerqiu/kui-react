import React from 'react';
import { Kui, PropTypes } from '../kui'

export default class Spin extends Kui {
  static defaultProps = {
    mode: 'zoom',
    visible: true,
  }

  static propTypes = {
    visible: PropTypes.bool,
    mode: PropTypes.oneOf(["bounce", "flip", "rotate", "zoom"])
  }
  render() {
    let { mode, visible, children } = this.props
    const classes = [{
      [`k-spin-loading`]: visible,
      [`k-spin-${mode}`]: mode && visible,
    }]

    const spin = <div className={this.className(classes)} />
    return (
      <div className="k-spin" style={this.styles()}>{spin}{children}</div>
    )
  }
}