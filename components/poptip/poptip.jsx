import React from 'react';
import { Kui, PropTypes } from '../kui'
import Button from "../button";
import Transition from '../transition'
import Transfer from '../transfer'
export default class Poptip extends Kui {
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
  classes() {
    return this.className([
      "k-poptip-dom",
      {
        ["k-poptip-confirm"]: this.props.confirm
      }
    ])
  }
  popStyles() {
    let style = {};
    this.props.width && (style.width = `${this.props.width}px`);
    style.top = `${this.state.top}px`;
    style.left = `${this.state.left}px`;
    return style;
  }
  onHide(e) {
    if (this.props.transfer && this.domRef.current && this.relRef.current) {
      if (!this.domRef.current.contains(e.target) && !this.relRef.current.contains(e.target)) {
        this.setState({ visible: false })
      }
    }
  }
  ok() {
    this.setState({ visible: false })
    this.props.onOk && this.props.onOk()
  }
  cancel() {
    this.setState({ visible: false })
    this.props.onCancel && this.props.onCancel()
  }
  mouseHandle() {
    if (this.props.trigger == "hover") {
      this.setState({ visible: !this.state.visible }, () => this.setPosition())
    }
  }
  relClick(e) {
    // e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
    if (this.props.trigger == "click") {
      this.setState({ visible: !this.state.visible }, () => this.setPosition())
    }
  }
  setPosition() {
    let pos = { left: 0, top: 0 }, rel = this.relRef.current;

    if (!rel) return;
    rel = rel.children[0] || rel
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
  render() {
    let { children, placement, transfer, title, confirm, content, cancelText, okText } = this.props
    return (<div className={this.className('k-poptip')} style={this.styles()} onMouseEnter={this.mouseHandle.bind(this)} onMouseLeave={this.mouseHandle.bind(this)} >
      <div className="k-poptip-rel" ref={this.relRef} onClick={this.relClick.bind(this)}>
        {children}
      </div>
      <Transfer transfer={transfer} onResize={this.setPosition.bind(this)} docOnClick={(e) => this.onHide(e)}>
        <Transition name="fade" show={this.state.visible}>
          <div className={this.classes()} style={this.styles(this.popStyles())} ref={this.domRef} k-placement={placement} >
            <div className="k-poptip-arrow"></div>
            {title && <div className="k-poptip-title">
              {confirm && <i className="k-ion-ios-help-circle" ></i>}
              <span>{title}</span>
            </div>}
            <div className="k-poptip-content">
              {content}
            </div>
            {confirm && <div className="k-poptip-footer">
              <Button type="link" mini onClick={this.cancel.bind(this)}>{cancelText}</Button>
              <Button type="primary" mini onClick={this.ok.bind(this)}>{okText}</Button>
            </div>}
          </div>
        </Transition>
      </Transfer>
    </div>)
  }
}
Poptip.defaultProps = {
  okText: '确定',
  cancelText: '取消',
  placement: 'top',
  trigger: 'click',
  width: 0,
  transfer: true
}
Poptip.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  trigger: PropTypes.string,
  confirm: PropTypes.bool,
  transfer: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placement: PropTypes.oneOf(["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "left-bottom", "left-top", "right", "right-top", "right-bottom"]),
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  disabled: PropTypes.bool
}