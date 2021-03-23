import React from 'react';
import { Kui, PropTypes } from '../kui'
import Transition from '../transition'
export default class Loading extends Kui {
  constructor(props) {
    super(props)
    let { percent, height, color, type, error } = props
    this.state = {
      visible: true,
      timer: null,
      percent: percent,
      height: height,
      color: color,
      type: type,
      error: error
    }
  }
  barStyles() {
    let style = {};
    let { type, percent, color } = this.state
    if (type == "line") {
      style.width = `${percent}%`
      style.backgroundColor = color
    }
    return style;
  }
  warpStyles() {
    return this.state.type == "line" ? { height: `${this.state.height}px` } : {};
  }
  barClasses() {
    return this.className([
      "k-loading-line",
      {
        ["k-loading-line-error"]: this.state.error
      }
    ])
  }
  animateClasses() {
    return this.className([
      "k-loading-animate",
      {
        [`k-loading-animate-${this.state.type}`]: this.state.type
      }
    ])
  }
  update(obj){
    this.setState(obj)
  }
  // percent()=>this.state.percent
  render() {
    let { loadingText } = this.props
    let { visible, type } = this.state
    return (
      <Transition show={visible}>
        <div className="k-loading-warp" style={this.styles(this.warpStyles())} >
          {type == 'line' ?
            <div className={this.barClasses()} style={this.styles(this.barStyles())}></div>
            :
            <div className="k-loading-inner">
              <div className={this.animateClasses()}></div>
              {loadingText && <div className="k-loading-text">{loadingText}</div>}
            </div>}
        </div>
      </Transition>
    );
  }
}
Loading.defaultProps = {
  type: 'line',
  height: 2,
  percent: 0,
}
Loading.propTypes = {
  error: PropTypes.bool,
  percent: PropTypes.number,
  type: PropTypes.oneOf(['line', 'zoom', 'flip', 'rotate', 'bounce']),
  loadingText: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
}
