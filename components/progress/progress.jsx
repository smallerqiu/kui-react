import React from 'react';
import Icon from '../icon'
import { Kui, PropTypes } from '../kui'

export default class Progress extends Kui {
  static defaultProps = {
    percent: 0,
    status: 'normal',
    showInfo: true,
    type: 'line',
    size: 'default',
  }
  static propTypes = {
    percent: PropTypes.number,
    color: PropTypes.string,
    format: PropTypes.func,
    width: PropTypes.number,
    size: PropTypes.oneOf(['small', 'default']),
    status: PropTypes.oneOf(['active', 'exception', 'success', 'normal']),
    type: PropTypes.oneOf(['line', 'circle', 'dashboard']),
    showInfo: PropTypes.bool
  }
  componentDidUpdate(prevProps, prevState, snap) {
    let { percent } = this.props
    if (percent != prevProps.percent) {
      console.log(percent)
      this.setState({ percent })
    }
  }

  state = {
    percent: this.props.percent
  }

  renderTip() {
    let { status, type, format, showInfo } = this.props
    let { percent } = this.state;

    if (!showInfo) return null;

    let text = `${percent}%`;
    if (typeof format == 'function') {
      text = format(percent)
    } else {
      if (type == 'line') {
        if (percent == 100) {
          text = <Icon type="checkmark-circle" />
        }
        if (status == 'exception')
          text = <Icon type="close-circle" />
      }
      if (type == 'circle') {
        if (percent == 100) {
          text = <Icon type="checkmark" />
        }
        if (status == 'exception')
          text = <Icon type="close" />
      }
    }
    return <span className="k-progress-text" key="text">{text}</span>

  }
  renderCircle(radius, percent, strokeWidth, strokeColor, gap = 0, dashboard) {
    let offsetRadius = radius - strokeWidth / 2,
      benginX = 0,
      benginY = - offsetRadius,
      endX = 0,
      endY = -2 * offsetRadius;

    let d = `M ${radius},${radius} 
               m ${benginX}, ${(dashboard ? -1 : 1) * benginY} 
               a ${offsetRadius},${offsetRadius} 0 1 1 ${endX}, ${(dashboard ? 1 : -1) * endY} 
               a ${offsetRadius},${offsetRadius} 0 1 1 ${(dashboard ? 1 : -1) * endX},${(dashboard ? -1 : 1) * endY}`,
      len = Math.PI * 2 * radius,
      len2 = Math.PI * (dashboard ? 1.5 : 2) * radius,
      style = {
        strokeDasharray: `${(percent / 100) * (len2 - gap)}px ${len}px`, //长度,间距
        transition: `stroke-dasharray .3s ease 0s,stroke-width 0.06s ease 0.3s`,
        strokeDashoffset: dashboard ? -30 : 0,
        stroke: strokeColor
      };
    let ds = null
    if (dashboard) {
      ds = {
        strokeDasharray: `${(75 / 100) * (len)}px ${len}px`, //长度,间距
        strokeDashoffset: -30,
      }
    }

    return (<svg viewBox={`0 0 ${radius * 2} ${radius * 2}`} key="gress">
      <path d={d} fill="none" strokeWidth={strokeWidth} className="k-progress-inner" style={ds} />
      <path d={d} fill="none" strokeWidth={percent == 0 ? 0 : strokeWidth} strokeLinecap="round" style={style} className="k-progress-bg" />
    </svg>)
  }
  renderGress() {
    let { type, color } = this.props
    let { percent } = this.state
    if (type == 'line') {
      return <div className="k-progress-inner" key="gress">
        <div className="k-progress-bg" style={{ width: `${percent}%`, backgroundColor: `${color}` }}></div>
      </div>
    } else if (type == 'circle') {
      return this.renderCircle(50, percent, 6, color, 17)
    } else if (type == 'dashboard') {
      return this.renderCircle(50, percent, 6, color, 0, true)
    }
  }
  render() {
    let { type, status, showInfo, width, size } = this.props
    let { percent } = this.state
    if (percent == 100) {
      status = 'success'
    }
    let classes = [
      'k-progress', `k-progress-${type}`,
      `k-progress-${status}`,
      { 'k-progress-hide-info': !showInfo },
      { 'k-progress-sm': type == 'line' && size == 'small' },
      { 'k-progress-hide-info': !showInfo }
    ]
    let tipNode = this.renderTip()
    let gress = this.renderGress(), style;
    if (type != 'line' && width > 10) {
      style = { width, height: width }
    }
    return (
      <div className={this.className(classes)} style={this.styles(style)}>
        {[gress, tipNode]}
      </div>
    )
  }
}