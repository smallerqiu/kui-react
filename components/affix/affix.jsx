import React from 'react'
import { Kui, PropTypes } from '../kui'

function getOffset(element, target) {
  element = element !== window ? element.current : element
  target = target !== window ? target.current : target

  let { top, height, width } = element.getBoundingClientRect()
  if (target === document) target = target.documentElement
  let targetRect = (target !== window) ? target.getBoundingClientRect() : { top: 0, let: 0, bottom: 0 }

  let scrollTop = (target !== window) ? target.scrollTop : target.pageYOffset
  if (target !== window) {
    top = element.offsetTop - element.parentElement.offsetTop
  }
  return {
    top, height, width, scrollTop,
    targetTop: targetRect.top,
    targetHeight: targetRect.height,
    targetInnerHeight: target.innerHeight || target.clientHeight
  }
}

export default class Affix extends Kui {

  static propTypes = {
    offsetTop: PropTypes.number,
    offsetBottom: PropTypes.number,
    target: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
    offsetTop: 0,
    target: () => window
  }

  blobRef = React.createRef()
  state = {
    fixed: false,
    width: 0,
    height: 0,
    offsetModeOfTop: false,
    offsetModeOfBottom: false,
    offsetTopValue: this.props.offsetTop,
    offsetBottomValue: this.props.offsetBottom,
  }

  updatePosition = (e) => {
    let { offsetBottom, offsetTop, onChange } = this.props

    let { fixed, } = this.state
    let blobRef = this.blobRef;

    if (!blobRef) return;

    let target = this.props.target()

    let { top, height, width, targetInnerHeight, scrollTop, targetTop } = getOffset(blobRef, target)
    // console.log(top, height, width, targetInnerHeight, scrollTop, targetTop)
    offsetTop = target === window ? offsetTop : scrollTop

    if (fixed) {

      if (typeof offsetBottom != undefined && offsetBottom >= 0) {
        if (0 >= top + height + offsetBottom - targetInnerHeight) {
          this.setState({ offsetModeOfBottom: false, fixed: false })
          fixed = false
        }
      } else if (top >= offsetTop) { // unfixedTop
        this.setState({ offsetModeOfTop: false, fixed: false })
        fixed = false
      }
      if (target !== window && top !== targetTop) {
        this.setState({ offsetTopValue: targetTop })
      }
      if (!fixed) {
        this.setState({ fixed: false })
        onChange && onChange(false)
      }
    } else {
      if (typeof offsetBottom != undefined && offsetBottom >= 0) {
        if (0 <= top + height + offsetBottom - targetInnerHeight) {
          this.setState({ offsetModeOfBottom: true, fixed: true })
          fixed = true
        }
      } else {
        if (top <= offsetTop) { //fixedTop
          this.setState({ offsetModeOfTop: true, fixed: true })
          fixed = true
          if (target !== window) {
            this.setState({ offsetTopValue: targetTop })
          }
        }
      }
      if (fixed) {
        onChange && onChange(true)
        this.setState({ width, height })
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updatePosition)

    let target = this.props.target()

    if (target) {
      if (target.current !== undefined) {
        setTimeout(() => {
          target.current.addEventListener('scroll', this.updatePosition)
        }, 0);
        return;
      }
      target.addEventListener('scroll', this.updatePosition)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePosition)
    let target = this.props.target()

    if (target) {
      if (target.current !== undefined) {
        target.current.removeEventListener('scroll', this.updatePosition)
        return;
      }
      target.removeEventListener('scroll', this.updatePosition)
    }
  }

  render() {
    let blobStyle = null, fixedStyle = null, classes = null;
    let { fixed, width, height, offsetModeOfBottom,
      offsetModeOfTop, offsetTopValue } = this.state
    let { offsetBottom, children } = this.props

    if (fixed) {
      blobStyle = { width, height }
      fixedStyle = { width, height }

      if (offsetModeOfBottom) {
        fixedStyle.bottom = offsetBottom
      }
      if (offsetModeOfTop) {
        fixedStyle.top = offsetTopValue
      }
      classes = { ['k-affix']: fixed }
    }

    return (
      <div style={this.styles(blobStyle)} ref={this.blobRef}>
        <div style={fixedStyle} className={this.className(classes)}>
          {children}
        </div>
      </div>
    )
  }
}
