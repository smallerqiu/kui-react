import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
import Transition from '../transition'

export default class BackTop extends Kui {

  state = {
    visible: false
  }

  scroll = () => {
    let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
    this.visible = top >= this.height;
    this.setState({ visible: top >= this.props.height })
  }

  timer = null

  componentDidMount() {
    window.addEventListener('scroll', this.scroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll)
  }

  handle = (e) => {
    this.props.onClick && this.props.onClick();
    if (this.timer) {
      clearInterval(this.timer);
    }
    let height = 80;
    this.timer = setInterval(() => {
      var oTop = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
      if (oTop > 0) {
        document.body.scrollTop = document.documentElement.scrollTop = oTop - height;
        // window.setWindowScroll(-height)
        this.scroll()
      } else {
        clearInterval(this.timer);
      }
      if (height <= 15) {
        height = 15;
      } else {
        height -= 1;
      }
    }, 10);
  }

  render() {
    let { bottom, right, children } = this.props
    let { visible } = this.state
    let styles = { bottom, right }
    console.log(children)
    if (!children) {
      children = <div className="k-backtop-content"><Icon type="arrow-up" /></div>
    }

    return <Transition show={visible} >
      <div className="k-backtop" onClick={this.handle} style={this.styles(styles)} >
        {children}
      </div>
    </Transition>
  }
}

BackTop.propsType = {
  onClick: PropTypes.fun,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

BackTop.defaultProps = {
  height: 100
}