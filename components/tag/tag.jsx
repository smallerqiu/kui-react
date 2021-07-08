import React from 'react'
import { Kui, PropTypes } from '../kui'
import Transition from '../base/transition'
import Icon from '../icon'
export default class Tag extends Kui {
  static propTypes = {
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    color: PropTypes.string
  }
  state = {
    visible: true,
    isDefaultColor: ['blue', 'red', 'orange', 'gray', 'green'].indexOf(this.props.color) >= 0
  }

  tagStyles() {
    return this.state.isDefaultColor ? {} : { backgroundColor: this.props.color }
  }
  handle = (e) => {
    this.props.onClick && this.props.onClick(e)
  }
  onClose = (e) => {
    this.props.onClose && this.props.onClose(e)
    this.setState({ visible: false })
    e.preventDefault()
  }
  render() {
    let { children, closeable, color, onMouseEnter, onMouseLeave } = this.props
    let { visible } = this.state
    const props = {
      className: this.className(['k-tag', {
        [`k-tag-${color}`]: color && !/^#/.test(color),
        ['k-tag-has-color']: /^#/.test(color)
      }]),
      style: this.styles({ backgroundColor: /^#/.test(color) ? color : null }),
      onClick: this.handle,
      onMouseEnter: () => {
        onMouseEnter && onMouseEnter()
      },
      onMouseLeave: () => {
        onMouseLeave && onMouseLeave()
      },
    }
    return (<Transition name="k-tag" show={visible}>
      <div {...props}>
        <span className="k-tag-text">
          {children}
        </span>
        {closeable ? <Icon type="close" className="k-tag-close" onClick={this.onClose} /> : null}
      </div>
    </Transition>)
  }
}