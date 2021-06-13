import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Badge extends Kui {


  static propTypes = {
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dot: PropTypes.bool,
    color: PropTypes.string,
    status: PropTypes.string,
    text: PropTypes.string,
    maxCount: PropTypes.number
  }

  static defaultProps = {
    maxCount: 99
  }

  render() {
    const { children, maxCount, count, dot, color, status, text } = this.props

    let innerText = null, statusNode = [];

    if (typeof count === 'number' && count !== 0) {
      innerText = count > maxCount ? maxCount + '+' : count
    } else if (typeof count === 'string') {
      innerText = count
    } else if ((status || color) && (!dot && !children)) {
      const props = {
        className: this.className(['k-badge-status-dot', {
          [`k-badge-status-${status}`]: status,
          [`k-badge-status-${color}`]: color && !/^#/.test(color)
        }]),
        style: {
          backgroundColor: /^#/.test(color) ? color : null
        }
      }
      statusNode.push(<span key="dot" {...props}></span>)
      if (text)
        statusNode.push(<span key="text" className="k-badge-status-text">{text}</span >)
    }

    const props = {
      className: this.className({
        'k-badge-count': count !== undefined,
        'k-badge-dot': dot,
        [`k-badge-${status}`]: status,
      }),
      style: { backgroundColor: color }
    }
    const supNode = (innerText !== null || dot) ? <sup {...props}>{innerText}</sup> : null
    return (
      <div className={this.className(["k-badge"])} style={this.styles()}>
        {children}
        {supNode}
        {statusNode}
      </div >
    )
  }
};
