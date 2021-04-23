import Notice from "./inner";
import React from 'react'
import { Kui, PropTypes } from '../kui'
import { CSSTransition, TransitionGroup } from 'react-transition-group'


let count = 0
const timestamp = Date.now()

function getUuid() {
  return `k-message_${timestamp}_${count++}`
}

export default class Group extends Kui {
  static propTypes = {
    type: PropTypes.string,
  }
  state = {
    group: []
  }
  destroy() {

  }
  show(options) {
    let { duration, close, closable, noticeType } = options
    let { group } = this.state
    let key = getUuid()
    options.name = key
    options.duration = isNaN(Number(duration)) ? 3.5 : duration;
    let timer;
    let callback = () => {
      (typeof close) === 'function' && close()
      let { group } = this.state
      group = group.filter(item => item.name !== key)
      this.setState({ group })
      clearTimeout(timer);
      timer = null;
    };
    options.duration > 0 && (timer = setTimeout(callback, options.duration * 1000));
    if ((closable === true && noticeType == "message") || noticeType == "notice") {
      options.onClose = callback
    }
    group.push(options)
    this.setState({
      group
    })
  }
  render() {
    let { group } = this.state
    const { type, on = {} } = this.props

    return (
      <TransitionGroup className={`k-${type}`}>
        {
          group.map((item, i) => (
            <CSSTransition
              key={item.name}
              timeout={300}
              classNames={`k-${type}-slide`}
              {...on}
            >
              <Notice {...item} />
            </CSSTransition>
          ))
        }
      </TransitionGroup>
    )
  }
}


