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
    // console.log(prevProps, prevState)
    if (this.state.show !== this.props.show) {
      this.setState({ show: this.props.show })
    }
  }
  // componentWillReceiveProps(props) {
  //   if (this.state.show != props.show) {
  //     this.setState({ show: props.show })
  //   }
  // }
  onExit(el) {
    this.props.onExit && this.props.onExit(el)
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = 1
  }
  onExiting(el) {
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
    this.props.onEnter && this.props.onEnter(el)
    if (el) {
      el.style.overflow = 'hidden';
      el.style.height = 0
      el.style.opacity = 0.1
    }
  }
  onEntering(el) {
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
    this.props.onEntered && this.props.onEntered(el)
    el.style.height = ''
    el.style.overflow = ''
    el.style.opacity = ''
  }
  render() {
    const { timeout, name, children } = this.props
    return (<CSSTransition in={this.state.show} timeout={timeout}
      onExited={(e) => this.onExited(e)}
      onExiting={(e) => this.onExiting(e)}
      onExit={(e) => this.onExit(e)}
      onEnter={(e) => this.onEnter(e)}
      onEntering={(e) => this.onEntering(e)}
      onEntered={(e) => this.onEntered(e)}
      unmountOnExit classNames={name}>
      {children}</CSSTransition>)
  }
}
Transition.defaultProps = {
  name: 'fade',
  timeout: 300
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
}