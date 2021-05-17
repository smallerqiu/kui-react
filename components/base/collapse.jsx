//利用react-transition-group@2.x 的状态管理 结合  transition 和 css3 的 transition 实现 Jqeury toggle
//给需要的 元素加上 css  transition: height .2s ease-in-out;
//by chuchur
import React from 'react'
import { Kui, PropTypes } from '../kui'
import { Transition } from 'react-transition-group';

export default class Collapse extends Kui {
  static propTypes = {
    unmountOnExit: PropTypes.bool,
    show: PropTypes.bool,
    name: PropTypes.string
  }
  static defaultTypes = {
    unmountOnExit: false,
  }
  onEnter(el) {
    el.style.overflow = 'hidden';
    el.style.height = 0
    el.style.opacity = 0.1
  }
  onEntering(el) {
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px'
      el.style.opacity = 1
    } else {
      el.style.height = ''
      el.style.opacity = ''
    }
  }
  onEntered(el) {
    el.style.overflow = ''
    el.style.height = ''
    el.style.opacity = ''
  }

  onExit(el) {
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = 1
  }
  onExiting(el) {
    if (el.scrollHeight !== 0) {
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
      el.style.marginTop = 0;
      el.style.marginBottom = 0;
      el.style.opacity = 0
      el.style.overflow = 'hidden';
    }
  }
  onExited(el) {
    el.style.height = '';
    el.style.paddingTop = '';
    el.style.paddingBottom = '';
    el.style.marginTop = '';
    el.style.marginBottom = '';
    el.style.opacity = ''
    el.style.overflow = ''
  }
  render() {
    let { children, unmountOnExit } = this.props
    const props = {
      onEnter: this.onEnter,
      onEntering: this.onEntering,
      onEntered: this.onEntered,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited,
      timeout: 300,
      unmountOnExit: unmountOnExit,
      in: this.props.show,
    }
    let clsName = children.props.className || null
    return <Transition {...props}>
      {
        state => React.cloneElement(children, { className: this.className(`${clsName} ${this.props.name} ${this.props.name}-${state}`) })
      }
    </Transition>
  }
}