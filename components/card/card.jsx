import Icon from "../icon";
import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Card extends Kui {

  static propTypes = {
    bordered: PropTypes.bool,
    title: PropTypes.string,
    icon: PropTypes.string,
    extra: PropTypes.any,
  }

  static defaultProps = {
    bordered: true
  }
  render() {
    const { title, icon, children, bordered, extra } = this.props
    const cls = ['k-card', {
      ['k-card-bordered']: bordered
    }]
    const extraNode = extra ? <div className="k-card-extra">{extra}</div> : null
    const iconNode = icon ? <Icon type={icon} /> : null
    const titleNode = title ? <span className="k-card-title">{title}</span> : null
    return (
      <div className={this.className(cls)}>
        <div className="k-card-head">{iconNode}{titleNode}{extraNode}</div>
        {children ? <div className="k-card-body">{children}</div> : null}
      </div>
    )
  }
}
