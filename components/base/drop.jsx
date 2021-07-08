import React from 'react'
import { getPosition, isReactNode } from '../_tool/utils'
// import Transition from '../transition'
import Transfer from './transfer'
import { Kui, PropTypes } from '../kui'
import { CSSTransition } from 'react-transition-group'
import Render from 'react-dom'

export default class BaseDrop extends Kui {

  static contextTypes = {
    BasePop: PropTypes.any
  }

  static defaultProps = {
    trigger: 'click',
    transitionName: 'dropdown'
  }

  static propTypes = {
    transfer: PropTypes.bool,
    show: PropTypes.bool,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    width: PropTypes.number,
    placement: PropTypes.string,
    trigger: PropTypes.oneOf(['click', 'hover', 'contextmenu']),
    transitionName: PropTypes.string,
    selectionRef: PropTypes.any,
    updateKey: PropTypes.any,
  }
  state = {
    left: 0,
    top: 0,
    minWidth: 0,
    mousedownIn: false,
    transformOrigin: '',
    placement: this.props.placement,
    rendered: this.props.show === true,
    visible: this.props.show
  }
  points = null
  elRef = React.createRef()

  componentDidMount() {

    this.onMouseDown = this.onMouseDown.bind(this)

    document.addEventListener('mousedown', this.onMouseDown)

    let parent = this.context.BasePop

    if (parent) {
      parent.dropRef = this
    }

    setTimeout(() => {
      // this.setPosition()
    }, 0);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown)
    let parent = this.context.BasePop
    if (parent) {
      parent.dropRef = null
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    let { show, placement, trigger, updateKey } = this.props
    if (show != prevProps.show) {
      this.setState({ rendered: true, visible: show }, () => {
        trigger == 'contextmenu' ? this.showContextmenu() : this.setPosition()
      })
    }

    if (placement != prevProps.placement) {
      this.setState({ placement })
    }
    if (this.state.rendered != prevState.rendered) {
      this.props.onRender && this.props.onRender()
    }

    if (updateKey != prevProps.updateKey) {
      this.setPosition()
    }
  }

  render() {
    let { className, width, transfer, children, onMouseEnter, minWidth,
      onMouseLeave, transitionName } = this.props
    let { left, top, transformOrigin, placement, rendered, visible } = this.state
    const props = {
      ref: this.elRef,
      className: className,
      style: {
        left: `${left}px`,
        top: `${top}px`,
        minWidth: `${minWidth}px`,
        width: `${width}px`,
        transformOrigin
      },
      'k-placement': placement,
      onMouseEnter, onMouseLeave
    }
    return (
      <Transfer
        transfer={transfer}
        dropRef={this.elRef}
        show={rendered}
        onTransfer={this.setPosition.bind(this)}
        docOnClick={this.hide.bind(this)}
        onResize={this.resize.bind(this)}>
        <CSSTransition classNames={transitionName}
          in={visible} timeout={300}
          unmountOnExit={!rendered}>
          <div {...props}>
            {children}
          </div>
        </CSSTransition>
      </Transfer>
    )
  }

  showContextmenu() {
    let e = this.points
    let { current } = this.elRef
    let pickerHeight = current.offsetHeight
    let pickerWidth = current.offsetWidth
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
    this.setState({ left, top, transformOrigin })
  }

  onMouseDown({ target }) {
    let mousedownIn = this.props.visible && this.elRef && this.elRef.current.contains(target)
    this.setState({ mousedownIn })
  }
  getSelection() {
    let { current } = this.props.selectionRef
    return isReactNode(current) ? Render.findDOMNode(current) : current
  }
  setPosition(e) {
    let { trigger, transfer, placement, show } = this.props
    if (trigger == 'contextmenu' || !this.state.rendered || !show) {
      return;
    }
    let selection = this.getSelection()
    getPosition(selection, this.elRef.current, transfer, placement, (top, left, transformOrigin, placement) => {
      this.setState({ top, left, transformOrigin, placement })
    })
  }

  hide(e) {
    let { target } = e
    // e.stopPropagation()
    let { onClose } = this.props
    let { mousedownIn, visible } = this.state

    let selection = this.getSelection()
    if (visible &&
      selection &&
      target.parentNode != null && target.parentNode.parentNode != null &&
      !selection.contains(target) &&
      this.elRef.current != null && !this.elRef.current.contains(target) &&
      !mousedownIn
    ) {
      onClose && onClose()
    }

  }

  resize() {
    let { onResize } = this.props
    let { visible } = this.state
    if (visible) {
      onResize && onResize()
      this.setPosition()
    }
  }
}
