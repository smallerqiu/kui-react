import React from 'react'
// import PropTypes from 'prop-types'
import { getPosition } from '../_tool/utils'
// import Transition from '../transition'
import Transfer from '../transfer'
import { Kui, PropTypes } from '../kui'
import { CSSTransition } from 'react-transition-group'

export default class BaseDrop extends Kui {

  state = {
    left: 0,
    top: 0,
    mousedownIn: false,
    transformOrigin: '',
    placement: this.props.placement,
  }
  elRef = React.createRef()

  componentDidMount() {
    // this.$nextTick(e => this.setPosition())
    this.setPosition()
    document.addEventListener('mousedown', this.onMouseDown.bind(this))
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown.bind(this))
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.show != prevProps.show) {
      setTimeout(() => {
        this.setPosition()
      }, 0);
    }
  }
  onExited(el) {
    if (el) {
      el.className += ' k-menu-hidden'
    }
  }
  onEnter(el) {
    if (el) {
      el.className = el.className.replace('k-menu-hidden', '')
    }
  }
 
  render() {
    let { className, show, width, transfer, children, onMouseEnter, unmountOnExit, showInit,
      onMouseLeave, transitionName } = this.props
    let { left, top, transformOrigin, placement } = this.state
    const props = {
      ref: this.elRef,
      className: className,
      style: {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        transformOrigin
      },
      'k-placement': placement,
      onMouseEnter, onMouseLeave
    }
    return showInit ?
      <Transfer transfer={transfer} show={show} docOnClick={this.hide.bind(this)} onResize={this.resize.bind(this)}>
        <CSSTransition classNames={transitionName}
          in={show} timeout={300}
          onEnter={this.onEnter.bind(this)}
          onExited={this.onExited.bind(this)}>
          <div {...props}>
            {children}
          </div>
        </CSSTransition>
      </Transfer>
      : null
  }

  baseContextmenu(e) {
    let pickerHeight = this.$el.offsetHeight
    let pickerWidth = this.$el.offsetWidth
    let clientHeight = document.documentElement.clientHeight
    let clientWidth = document.documentElement.clientWidth

    let offsetTop = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
    let offsetLeft = document.body.scrollLeft || document.documentElement.scrollLeft || window.scrollX;
    let left = e.clientX + offsetLeft;
    let top = e.clientY + offsetTop;
    let showInRight = clientWidth - e.clientX > pickerWidth
    let showInBottom = clientHeight - e.clientY > pickerHeight
    let transformOrigin = 'top center';

    if (!showInRight) {
      left -= pickerWidth
    }
    if (!showInBottom) {
      top -= pickerHeight
      transformOrigin = 'bottom center'
    }
    if (this.show) {
      this.$el.style.left = left + 'px'
      this.$el.style.top = top + 'px'
    }
    this.left = left
    this.top = top
    this.transformOrigin = transformOrigin
  }

  onMouseDown({ target }) {
    let mousedownIn = this.props.show && this.elRef && this.elRef.current.contains(target)
    this.setState({ mousedownIn })
  }

  setPosition(e) {
    let { trigger, transfer, placement, selectionRef } = this.props
    if (trigger == 'contextmenu') {
      return;
    }
    getPosition(selectionRef.current, this.elRef.current, transfer, placement, (top, left, transformOrigin, placement) => {
      this.setState({ top, left, transformOrigin, placement })
    })
  }

  hide(e) {
    let { target } = e
    e.stopPropagation()
    let { show, onHide, selectionRef } = this.props
    let { mousedownIn } = this.state
    if (show &&
      !selectionRef.current.contains(target) &&
      !this.elRef.current.contains(target) &&
      !mousedownIn
    ) {
      onHide && onHide()
    }
  }

  resize() {
    let { show, onResize } = this.props
    if (show) {
      onResize && onResize()
      this.setPosition()
    }
  }
}
BaseDrop.defaultProps = {
  trigger: 'click',
  transitionName: 'dropdown'
}

BaseDrop.propTypes = {
  selectionRef: PropTypes.any,
  transfer: PropTypes.bool,
  show: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  width: PropTypes.number,
  placement: PropTypes.string,
  trigger: PropTypes.oneOf(['click', 'hover', 'contextmenu']),
  transitionName: PropTypes.string,
  unmountOnExit: PropTypes.bool,
  showInit: PropTypes.bool,
}