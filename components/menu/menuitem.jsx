import React from 'react'
import Icon from '../icon'
import { isReactNode } from '../_tool/utils'
import { Kui, PropTypes } from '../kui'
// import Tooltip from '../tooltip'

export default class MenuItem extends Kui {
  static propTypes = {
    icon: PropTypes.string,
    disabled: PropTypes.bool,
    affixed: PropTypes.bool,
    eventKey: PropTypes.any,
  }

  static contextTypes = {
    Menu: PropTypes.any,
    SubMenu: PropTypes.any,
    Dropdown: PropTypes.any,
  }
  state = {
    active: false,
    currentAffixed: this.props.affixed,
  }
  starClick(e) {
    if (!this.props.disabled) {
      e.stopPropagation();
      let { currentAffixed } = this.state
      let item = this
      this.setState({ currentAffixed: !currentAffixed }, () => this.context.SubMenu.affixed(item, e))

    }
  }
  componentDidMount() {
    let { SubMenu, Menu } = this.context
    if (Menu && SubMenu) {
      let { selectedKeys } = Menu.state
      let selected = selectedKeys.indexOf(this.props.eventKey) >= 0
      if (selected && selectedKeys.indexOf(SubMenu.props.eventKey) < 0) {
        selectedKeys.push(SubMenu.props.eventKey)
        Menu.setState({ selectedKeys })
      }
    }
  }
  render() {
    let { icon, disabled, children, eventKey } = this.props
    let { currentAffixed, active } = this.state
    let { Menu, SubMenu, Dropdown } = this.context
    let { selectedKeys, currentMode } = Menu.state
    let { verticalAffixed } = Menu.props
    let selected = selectedKeys.indexOf(eventKey) >= 0

    const item = this
    const preCls = Dropdown ? 'dropdown-menu' : 'menu';
    const props = {
      className: this.className([`k-${preCls}-item`, {
        [`k-${preCls}-item-active`]: active,
        [`k-${preCls}-item-selected`]: selected && !Dropdown,
        [`k-${preCls}-item-disabled`]: disabled
      }]),

      onMouseEnter: () => {
        if (disabled) return;
        this.setState({ active: true })
      },
      onMouseLeave: () => {
        this.setState({ active: false })
      },
      onClick: (e) => {
        if (!disabled) {
          let key = eventKey
          let options = {
            key,
            keyPath: [key],
            item,
            event: e
          }
          let parent = SubMenu || Menu
          if (parent) {
            parent.handleClick(options)
          }
        }
      },
    }

    const showTooltip = !SubMenu && Menu.props.inlineCollapsed
    let titleNode = children.length > 1 ? <span>{children}</span> : (isReactNode(children) ? children : <span>{children}</span>)
    return (
      // {/* <Tooltip placement="right"> */}
      <li {...props}>
        {icon ? <Icon type={icon} className={`k-${preCls}-item-icon`} /> : null}
        {titleNode}
        {currentMode == 'vertical' && verticalAffixed && SubMenu ?
          <Icon onClick={this.starClick.bind(this)} className="k-menu-item-icon-affix" type={currentAffixed ? "star" : "star-outline"} /> : null}
      </li>
      // {/* {showTooltip ? <template slot="title">{children}</template> : null} */}
      // {/* </Tooltip> */}
    )
  }
}