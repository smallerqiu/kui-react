import React from 'react'
import { Kui, PropTypes } from '../kui'
import Collapse from '../collapse/collapse'
export default class SubMenu extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      actived: props.actived,
      height: 0,
      hideTime: null,
    }
  }
  onClick() {
    if (this.props.mode != "vertical") return;
    this.props.onClick()
  }
  openMenu() {
    if (this.props.mode == "vertical") return;
    this.setState({ visible: true })
  }
  closeMenu() {
    if (this.props.mode == "vertical") return;
    this.setState({ visible: false })
  }
  classes() {
    return this.className([
      "k-menu-submenu",
      {
        ["k-menu-item-active"]: this.state.actived,
        ["k-menu-item-opened"]: this.state.visible
      }
    ])
  }
  componentWillReceiveProps(props) {
    let _props = {}
    if (this.state.visible != props.visible) {
      _props.visible = props.visible
    }
    if (this.state.actived != props.actived) {
      _props.actived = props.actived
    }
    this.setState(_props)
  }
  render() {
    return (<li className={this.classes()} onMouseOver={this.openMenu.bind(this)} onMouseOut={this.closeMenu.bind(this)}>
      <div className="k-menu-title" onClick={this.onClick.bind(this)} >
        {this.props.title}
        <i className="k-ion-ios-arrow-down k-menu-arrow"></i>
      </div>
      <Collapse show={this.state.visible}>
        <ul className="k-menu-dropdown" >
          {this.props.children}
        </ul>
      </Collapse>
    </li>)
  }
}
SubMenu.defaultProps = {
  mode: 'vertical'
}
SubMenu.propTypes = {
  title: PropTypes.node,
  name: PropTypes.string.isRequired,
  mode: PropTypes.string,
  visible: PropTypes.bool,
  actived: PropTypes.bool,
  onClick: PropTypes.func
} 