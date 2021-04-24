import { Kui, PropTypes } from '../kui'
import React from 'react'

export default class Collapse extends Kui {

  static propTypes = {
    activeKey: PropTypes.array,
    accrodion: PropTypes.bool,
    sample: PropTypes.bool,
    onChange: PropTypes.func
  }

  static childContextTypes = {
    Collapse: PropTypes.any
  }

  static contextTypes = {
    Collapse: PropTypes.any
  }

  getChildContext() {
    return {
      Collapse: this
    };
  }
  state = {
    currentValue: this.props.activeKey || []
  }
  change = (key) => {
    if (!key) return;

    let { onChange, accrodion, } = this.props
    let { currentValue } = this.state
    let index = currentValue.indexOf(key)

    if (index >= 0) {
      accrodion ? currentValue = [] : currentValue.splice(index, 1)
    } else {
      accrodion ? currentValue = [key] : currentValue.push(key)
    }
    this.setState({ currentValue })
    onChange && onChange(key)
  }
  render() {
    const { children, sample } = this.props
    // const { currentValue } = this.state
    const classes = ['k-collapse', {
      ['k-collaplse-sample']: sample
    }]
    return (<div className={this.className(classes)}>{
      React.Children.map(children, (child, index) => {
        let eventKey = child.key || String(index)
        return React.cloneElement(child, { eventKey })
      })
    }</div >)
  }
}