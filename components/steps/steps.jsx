

import React from 'react'
import { Kui, PropTypes } from '../kui'
import Step from './step'
export default class Steps extends Kui {
  classes() {
    let { vertical, mini } = this.props
    return this.className(['k-steps', {
      ['k-steps-vertical']: vertical,
      ['k-steps-mini']: mini,
    }])
  }
  render() {
    let { current, status, vertical, children } = this.props
    let renderStep = () => {
      let width = React.Children.count(children)
      return React.Children.map(children, (child, index) => {
        if (child.type != Step) return null
        let props = {}
        props.step = index + 1
        props.width = !vertical ? 100 / width : 0;
        if (index == current) {
          props.status = status == 'error' ? 'error' : 'process'
        } else if (index > current) {
          props.status = 'wait'
        } else if (index < current) {
          props.status = 'finish'
        }
        return React.cloneElement(child, Object.assign({}, child.props, props))
      })
    }
    return (<div className={this.classes()} style={this.styles()}>{renderStep()}</div>)
  }
}
Steps.defaultProps = {
  status: 'process',
  current: 0
}
Steps.propTypes = {
  current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vertical: PropTypes.bool,
  mini: PropTypes.bool,
  status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
}
