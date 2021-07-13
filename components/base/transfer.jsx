import React from 'react'
import ReactDOM from 'react-dom'
import { Kui, PropTypes } from '../kui'

function getParentElement(parentSelector) {
  return parentSelector();
}
const isReact16 = ReactDOM.createPortal !== undefined;

const getCreatePortal = () =>
  isReact16
    ? ReactDOM.createPortal
    : ReactDOM.unstable_renderSubtreeIntoContainer;

export default class Transfer extends Kui {
  static defaultProps = {
    transfer: true,
    parentSelector: () => document.body,
  }
  static propTypes = {
    docOnClick: PropTypes.func,
    onResize: PropTypes.func,
    onScroll: PropTypes.func,
    transfer: PropTypes.bool,
    show: PropTypes.bool,
    dropRef: PropTypes.any,
    parentSelector: PropTypes.func
  }

  getSnapshotBeforeUpdate(prevProps) {
    const prevParent = getParentElement(prevProps.parentSelector);
    const nextParent = getParentElement(this.props.parentSelector);
    return { prevParent, nextParent };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { prevParent, nextParent } = snapshot;
    if (nextParent !== prevParent) {
      prevParent.removeChild(this.popup);
      nextParent.appendChild(this.popup);
    }
    let { show, parentSelector } = this.props
    if (!show) return;

    if (show && (prevProps.show != show)) {
      const parent = getParentElement(parentSelector);
      !parent.contains(this.popup) && parent.appendChild(this.popup);
    }

    !isReact16 && this.rerender()
  }
  createPopup() {
    let popup = document.createElement('div')
    popup.style.top = 0
    popup.style.left = 0
    popup.style.width = '100%'
    popup.style.position = 'absolute'
    this.popup = popup
  }
  componentDidMount() {
    let { transfer, onScroll, onResize, docOnClick, show, parentSelector } = this.props
    if (transfer) {
      if (!isReact16) {
        this.createPopup()
      }
      // document
      onScroll && window.addEventListener('scroll', onScroll)
      // window.addEventListener('mousewheel', this.props.onScroll)
      onResize && window.addEventListener('resize', onResize)
      docOnClick && document.addEventListener('click', docOnClick)

      if (show) {
        const parent = getParentElement(parentSelector);
        !parent.contains(this.popup) && parent.appendChild(this.popup);
      }
    }
  }

  componentWillUnmount() {
    let { transfer, onScroll, onResize, docOnClick, parentSelector } = this.props
    if (transfer) {
      onScroll && window.removeEventListener('scroll', onScroll)
      onResize && window.removeEventListener('resize', onResize)
      docOnClick && document.removeEventListener('click', docOnClick)
      // const popup = ReactDOM.findDOMNode(this.popup)
      // console.log(popup)
      !isReact16 && ReactDOM.unmountComponentAtNode(this.popup)
      const parent = getParentElement(parentSelector);
      if (parent && parent.contains(this.popup)) {
        parent.removeChild(this.popup);
      } else {
        // console.warn(
        //   'React-Modal: "parentSelector" prop did not returned any DOM ' +
        //   "element. Make sure that the parent element is unmounted to " +
        //   "avoid any memory leaks."
        // );
      }
      // if (unmountResult) {
      //   popup.parentNode.removeChild(document.getElementById('test'))
      // }
      // // if (document.body.contains(this.popup)) {
      // document.body.removeChild(popup);
      // }
    }
  }
  portalRef = ref => this.portal = ref

  rerender() {
    const createPortal = getCreatePortal();
    const portal = createPortal(
      this,
      <>{this.props.children}</>,
      this.popup
    );
    this.portalRef(portal);
  }
  render() {
    if (!isReact16) {
      return null;
    }

    if (!this.popup && isReact16) {
      this.createPopup()
    }
    const createPortal = getCreatePortal();

    return createPortal(<>{this.props.children}</>, this.popup)
  }
}