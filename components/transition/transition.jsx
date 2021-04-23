import React, { Component } from 'react'
import { PropTypes } from '../kui'
import { CSSTransition } from 'react-transition-group'


export default class Transition extends Component {
  state = {
    show: this.props.show
  }
  componentDidMount() {
    if (this.state.show === undefined) {
      this.setState({ show: true })
    }
  }
  componentWillUnmount() {
    this.setState({ show: false })
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.show !== this.props.show) {
      this.setState({ show: this.props.show })
    }
  }
  onExit(el) {
    if (!el) return
    this.props.onExit && this.props.onExit(el)
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = 1
  }
  onExiting(el) {
    if (!el) return
    this.props.onExiting && this.props.onExiting(el)
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
    if (!el) return
    this.props.onExited && this.props.onExited(el)
    el.style.height = '';
    el.style.paddingTop = '';
    el.style.paddingBottom = '';
    el.style.marginTop = '';
    el.style.marginBottom = '';
    el.style.opacity = ''
    el.style.overflow = ''
  }
  onEnter(el) {
    if (!el) return
    this.props.onEnter && this.props.onEnter(el)
    if (el) {
      el.style.overflow = 'hidden';
      el.style.height = 0
      el.style.opacity = 0.1
    }
  }
  onEntering(el) {
    if (!el) return
    this.props.onEntering && this.props.onEntering(el)
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px'
      el.style.opacity = 1
    } else {
      el.style.height = ''
      el.style.opacity = ''
    }
  }
  onEntered(el) {
    if (!el) return
    this.props.onEntered && this.props.onEntered(el)
    el.style.height = ''
    el.style.overflow = ''
    el.style.opacity = ''
  }
  render() {
    const { timeout, name, children, unmountOnExit } = this.props
    const { show } = this.state
    return (<CSSTransition in={show} timeout={timeout}
      onExited={(e) => this.onExited(e)}
      onExiting={(e) => this.onExiting(e)}
      onExit={(e) => this.onExit(e)}
      onEnter={(e) => this.onEnter(e)}
      onEntering={(e) => this.onEntering(e)}
      onEntered={(e) => this.onEntered(e)}
      unmountOnExit={unmountOnExit} classNames={name}>
      {children}</CSSTransition>)
  }
}
Transition.defaultProps = {
  name: 'fade',
  timeout: 300,
  unmountOnExit: true
}
Transition.propTypes = {
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,
  name: PropTypes.string,
  show: PropTypes.bool,
  timeout: PropTypes.number,
  unmountOnExit: PropTypes.bool,
}