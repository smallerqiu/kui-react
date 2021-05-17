import Icon from "../icon";
import Transition from '../base/transition'

import { Kui, PropTypes } from '../kui'
import React from 'react'

export default class Panel extends Kui {
  static propTypes = {
    title: PropTypes.string,
    eventKey: PropTypes.any,
    actived: PropTypes.bool,
    extra: PropTypes.any
  }

  static contextTypes = {
    Collapse: PropTypes.any
  }

  state = {
    visible: this.props.actived,
    rendered: this.props.actived == true
  }

  handelClick = () => {
    let { Collapse } = this.context
    if (Collapse) {
      Collapse.change(this.props.eventKey)
    }
  }
  componentDidUpdate(prevProps, prevState, snap) {
    if (prevProps.actived !== this.props.actived) {
      this.setState({ rendered: true }, this.setState({ visible: this.props.actived }))
    }
  }
  render() {
    let { children, title, extra, actived } = this.props
    let { rendered } = this.state

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
        <Transition show={actived} unmountOnExit={!rendered} timeout={300} name="k-collapse">
          <div className="k-collapse-content">
            <div className="k-collapse-content-box">
              {children}
            </div>
          </div>
        </Transition>
      </div>
    )
  }
}