import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'

export default class BreadcrumbItem extends Kui {

  static propTypes = {
    separator: PropTypes.string,
    icon: PropTypes.string,
    href: PropTypes.string
  }

  static defaultProps = {
    separator: '/'
  }

  render() {
    const { children, icon, separator, href } = this.props
    return (
      <span className={this.className(['k-breadcrumb-item'])} style={this.styles()}>
        {icon ? <Icon type={icon} /> : null}
        <span className="k-breadcrumb-link">
          {
            href ? <a href={href}>{children}</a> : children
          }
        </span>
        <span className="k-breadcrumb-separator">{separator}</span>
      </span>
    )
  }
}