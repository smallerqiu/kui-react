import Icon from "../icon";
import CollapseEl from '../base/collapse'

import { Kui, PropTypes } from '../kui'
import React from 'react'

export default class Panel extends Kui {
  static propTypes = {
    title: PropTypes.string,
    eventKey: PropTypes.any,
    extra: PropTypes.any
  }

  static contextTypes = {
    Collapse: PropTypes.any
  }

  handelClick = () => {
    let { Collapse } = this.context
    if (Collapse) {
      Collapse.change(this.props.eventKey)
    }
  }
  render() {
    let actived = false
    let { children, title, extra, eventKey } = this.props
    let { Collapse } = this.context

    // let key = 'a'
    if (Collapse) {
      actived = Collapse.state.currentValue.indexOf(eventKey) >= 0
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
        <CollapseEl show={actived}>
          <div className="k-collapse-content">
            <div className="k-collapse-content-box">
              {children}
            </div>
          </div>
        </CollapseEl>
      </div>
    )
  }
}