
import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
export default class Step extends Kui {
  stepStyles() {
    let { width } = this.props
    return width ? { width: `${width}%` } : {}
  }
  classes() {
    let { status } = this.props
    return this.className(['k-step-item', {
      [`k-steps-${status}`]: status
    }])
  }

  render() {
    let { icon, title, description, step, status } = this.props
    return (<div className={this.classes()} style={this.styles(this.stepStyles())}>
      <div className="k-step-tail">
        <i></i>
      </div>
      <div className="k-step-icon">
        {icon && <Icon type={icon}></Icon>}
        {!icon && <div className="k-step-icon-inner">
          {status != 'finish' && !icon && status != 'error' && <span>{step}</span>}
          {!icon && status == 'finish' && <Icon type="md-checkmark" />}
          {!icon && status == 'error' && <Icon type="md-close" />}
        </div>}
      </div>
      <div className="k-step-main">
        <div className="k-step-title">{title}</div>
        <div className="k-step-description">{description}</div>
      </div>
    </div>)
  }
}
Step.defaultProps = {
  status: 'wait'
}
Step.propTypes = {
  step: PropTypes.number,
  width: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
  icon: PropTypes.string
}
