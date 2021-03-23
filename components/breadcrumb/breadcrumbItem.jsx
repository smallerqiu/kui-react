import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'


export default class BreadcrumbItem extends Kui {

  toPath() {
    let { to, replace } = this.props
    let router = this.context.router.history
    to && replace ? router.replace(replace) : router.push(to)
  }
  render() {
    const { children, toPath, icon, separator } = this.props
    return (
      <span className={this.className(['k-breadcrumb-item'])} style={this.styles()}>
        {icon ? <Icon type={icon} /> : null}
        <span className="k-breadcrumb-link" onClick={() => toPath}>
          {children}
        </span>
        <span className="k-breadcrumb-separator">{separator}</span>
      </span>
    )
  }
}

BreadcrumbItem.contextTypes = {
  // router: PropTypes.object.isRequired
}

BreadcrumbItem.propTypes = {
  separator: PropTypes.string,
  to: PropTypes.string,
  replace: PropTypes.bool,
  icon: PropTypes.string
}

BreadcrumbItem.defaultProps = {
  separator: '/'
}