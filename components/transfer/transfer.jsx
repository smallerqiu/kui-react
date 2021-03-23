import Render from 'react-dom'
import { Kui, PropTypes } from '../kui'
export default class Transfer extends Kui {
  componentDidUpdate(a, b) {
    this._render()
  }
  componentDidMount(a, b) {
    if (this.props.transfer) {
      this.popup = document.createElement('span')
      document.body.appendChild(this.popup)
      this._render()
      // document
      if (this.props.onScroll) {
        window.addEventListener('scroll', this.props.onScroll)
        // window.addEventListener('mousewheel', this.props.onScroll)
      }

      if (this.props.onResize) {
        window.addEventListener('resize', this.props.onResize)
      }
      if (this.props.docOnClick) {
        document.addEventListener('click', this.props.docOnClick)
      }
    }
  }

  componentWillUnmount() {
    if (this.props.transfer) {
       Render.unmountComponentAtNode(this.popup)
       document.body.removeChild(this.popup);
      if (this.props.onScroll) {
        window.removeEventListener('scroll', this.props.onScroll)
        // window.removeEventListener('mousewheel', this.props.onScroll)
      }
      if (this.props.onResize) {
        window.removeEventListener('resize', this.props.onResize)
      }
      if (this.props.docOnClick) {
        document.removeEventListener('click', this.props.docOnClick)
      }
    }
  }
  _render() {
    this.props.transfer && Render.render(this.props.children, this.popup)
  }
  render() {
    return !this.props.transfer ? this.props.children : null
  }
}
Transfer.defaultProps = {
  transfer: true
}
Transfer.propTypes = {
  docOnClick: PropTypes.func,
  onResize: PropTypes.func,
  onScroll: PropTypes.func,
  transfer: PropTypes.bool,
  in: PropTypes.bool
}