import React from 'react'
// import Render from 'react-dom'
import { Kui, PropTypes } from '../kui'

export default class Transfer extends Kui {
  static defaultProps = {
    transfer: true
  }
  static propTypes = {
    docOnClick: PropTypes.func,
    onResize: PropTypes.func,
    onScroll: PropTypes.func,
    transfer: PropTypes.bool,
    show: PropTypes.bool,
    dropRef: PropTypes.any,
  }
  state = {
    popup: null,
    parentNode: null,
  }
  elRef = React.createRef()
  rendered = false

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.transfer && this.props.show && !this.rendered) {
      this.rerender()
    }
  }
  
  componentDidMount() {
    let { transfer, onScroll, onResize, docOnClick } = this.props
    let { popup } = this.state
    if (transfer) {
      if (!popup) {
        popup = document.createElement('div')
        popup.style.top = 0
        popup.style.left = 0
        popup.style.width = '100%'
        popup.style.position = 'absolute'
        this.setState({ popup })
        // document.body.appendChild(this.popup)
      }
      // document
      onScroll && window.addEventListener('scroll', onScroll)
      // window.addEventListener('mousewheel', this.props.onScroll)
      onResize && window.addEventListener('resize', onResize)
      docOnClick && document.addEventListener('click', docOnClick)
    }
  }

  componentWillUnmount() {
    let { transfer, onScroll, onResize, docOnClick, dropRef } = this.props
    let { popup, parentNode } = this.state
    if (transfer && parentNode) {
      // Render.unmountComponentAtNode(popup)
      parentNode.appendChild(dropRef.current)
      document.body.removeChild(popup)
      onScroll && window.removeEventListener('scroll', onScroll)
      onResize && window.removeEventListener('resize', onResize)
      docOnClick && document.removeEventListener('click', docOnClick)
    }
  }
  rerender() {
    let { show, transfer, dropRef, onTransfer } = this.props
    let { popup, parentNode } = this.state
    if (!document.body.contains(popup) && show) {
      document.body.appendChild(popup)
    }
    if (!parentNode) {
      this.setState({ parentNode: dropRef.current.parentNode })
    }
    if (transfer && dropRef) {
      this.rendered = true
      popup.appendChild(dropRef.current)
      onTransfer && onTransfer()
    }
    // // transfer && Render.render(this.elRef.current, popup)
  }
  render() {
    return this.props.children
  }
}