import React from 'react'
import { Kui, PropTypes } from '../kui'
import Transition from '../transition'
import Transfer from '../transfer'
export default class Tooltip extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      left: 0,
      top: 0
    }
    this.domRef = React.createRef()
    this.relRef = React.createRef()
  }
  domStyles() {
    let style = {};
    this.props.width && (style.width = `${this.props.width}px`);
    style.top = `${this.state.top}px`;
    style.left = `${this.state.left}px`;
    return style;
  }

  setPosition() {
    let pos = { left: 0, top: 0 };
    let rel = this.relRef.current.children[0] || this.relRef.current
    if (!rel) return;
    if (this.props.transfer) {
      pos = rel.getBoundingClientRect()
    }
    setTimeout(() => {
      let x = this.props.placement;
      let dom = this.domRef.current;
      let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
      if (!dom) return;
      let l = pos.left + scrollLeft
      let t = pos.top + scrollTop

      let top = 0, left = 0;
      switch (x) {
        case "top":
          top = t - dom.offsetHeight - 10;
          left = l - (dom.offsetWidth - rel.offsetWidth) / 2;
          break;
        case "top-left":
          top = t - dom.offsetHeight - 10;
          left = pos.left;
          break;
        case "top-right":
          top = t - dom.offsetHeight - 10;
          left = l - (dom.offsetWidth - rel.offsetWidth);
          break;
        case "bottom":
          top = t + rel.offsetHeight + 10;
          left = l - (dom.offsetWidth - rel.offsetWidth) / 2;
          break;
        case "bottom-right":
          top = t + rel.offsetHeight + 10;
          left = l - (dom.offsetWidth - rel.offsetWidth);
          break;
        case "bottom-left":
          top = t + rel.offsetHeight + 10;
          left = pos.left;
          break;
        case "left":
          left = l - dom.offsetWidth - 10;
          top = t - (dom.offsetHeight - rel.offsetHeight) / 2;
          break;
        case "left-top":
          left = l - dom.offsetWidth - 10;
          top = t;
          break;
        case "left-bottom":
          left = l - dom.offsetWidth - 10;
          top = t - (dom.offsetHeight - rel.offsetHeight);
          break;
        case "right":
          left = l + rel.offsetWidth + 10;
          top = t - (dom.offsetHeight - rel.offsetHeight) / 2;
          break;
        case "right-top":
          left = l + rel.offsetWidth + 10;
          top = t;
          break;
        case "right-bottom":
          left = l + rel.offsetWidth + 10;
          top = t - (dom.offsetHeight - rel.offsetHeight);
          break;
      }
      this.setState({ left, top })
    });
  }
  mouseHandle() {
    if (this.props.trigger == "hover") {
      this.setState({ visible: !this.state.visible })
      this.setPosition()
    }
  }
  relClick() {
    if (this.props.trigger == "click") {
      this.setState({ visible: !this.state.visible })
      this.setPosition()
    }
  }
  render() {
    let { children, transfer, placement, content } = this.props
    return (<div className={this.className('k-tooltip')} style={this.styles()} onMouseEnter={this.mouseHandle.bind(this)}
      onMouseLeave={this.mouseHandle.bind(this)}  >
      <div className="k-tooltip-rel" ref={this.relRef} onClick={this.relClick.bind(this)}>
        {children}
      </div>
      <Transfer transfer={transfer}>
        <Transition name="fade" show={this.state.visible} >
          <div className="k-tooltip-dom" style={this.domStyles()} ref={this.domRef} k-placement={placement}>
            <div className="k-poptip-arrow"></div>
            <div>
              {content}
            </div>
          </div>
        </Transition>
      </Transfer>
    </div>)
  }
}

Tooltip.defaultProps = {
  transfer: true,
  trigger: 'hover',
  width: 0,
  placement: 'top'
}


Tooltip.propTypes = {
  transfer: PropTypes.bool,
  trigger: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  content: PropTypes.any,
  placement: PropTypes.oneOf(["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "left-bottom", "left-top", "right", "right-top", "right-bottom"]),
}