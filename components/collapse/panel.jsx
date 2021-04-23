import Icon from "../icon";
import Collapse from './collapse.js'

import { Kui, PropTypes } from '../kui'
import React from 'react'

export default class Panel extends Kui {

  handelClick = (e) => {
    let CP = this.context.Collapse
    if (CP) {
      CP.change(this.props.eventKey)
    }
  }
  render() {
    let actived = false
    let { children, title, extra, eventKey } = this.props
    let CP = this.context.Collapse

    // let key = 'a'
    if (CP) {
      actived = CP.state.currentValue.indexOf(eventKey) >= 0
    }
    const classes = ['k-collapse-item', {
      ['k-collapse-item-active']: actived
    }]
    return (
      <div className={this.className(classes)}>
        <div className="k-collapse-header" onClick={this.handelClick}>
          <Icon type="chevron-forward" className="k-collapse-arrow" />
          <span className="k-collapse-title">{title}</span>
          {extra ? <span className="k-collapse-extra">{extra}</span> : null}
        </div>
        <Collapse show={actived}>
          <div className="k-collapse-content">
            <div className="k-collapse-content-box">
              {children}
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}


Panel.propTypes = {
  title: PropTypes.string,
  eventKey: PropTypes.any,
  extra: PropTypes.any
}

Panel.contextTypes = {
  Collapse: PropTypes.any
};