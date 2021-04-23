import { Kui, PropTypes } from '../kui'
import React from 'react'
import Panel from './panel'

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
    const { currentValue } = this.state
    const classes = ['k-collapse', {
      ['k-collaplse-sample']: sample
    }]
    return (<div className={this.className(classes)}>{
      React.Children.map(children, (child, index) => {
        let { children, title, extra } = child.props
        let key = child.key || String(index)
        return <Panel
          title={title}
          key={key}
          eventKey={key}
          extra={extra}
        >{children}</Panel>
      })
    }</div>)
  }
}