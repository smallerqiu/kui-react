import Render from 'react-dom'
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
    show: PropTypes.bool
  }
  state = {
    popup: null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.transfer) {
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
    let { transfer, onScroll, onResize, docOnClick, show } = this.props
    let { popup } = this.state
    if (transfer && show) {
      Render.unmountComponentAtNode(popup)
      document.body.removeChild(popup);

      onScroll && window.removeEventListener('scroll', onScroll)
      // window.removeEventListener('mousewheel', this.props.onScroll)
      onResize && window.removeEventListener('resize', onResize)
      docOnClick && document.removeEventListener('click', docOnClick)
    }
    console.log('owww')
  }
  rerender() {
    let { show, children, transfer } = this.props
    let { popup } = this.state
    if (!document.body.contains(popup) && show) {
      document.body.appendChild(popup)
    }
    transfer && Render.render(children, popup)
  }
  render() {
    return !this.props.transfer ? this.props.children : null
  }
}