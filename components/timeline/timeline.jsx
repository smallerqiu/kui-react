import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class TimeLine extends Kui {
  static propTypes = {
    mode: PropTypes.string
  }
  render() {
    return (<ul className={this.className(['k-timeline', `k-timeline-${this.props.mode}`])} style={this.styles()}>
      {this.props.children}
    </ul>)
  }
}

