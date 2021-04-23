import React from 'react'
import Icon from '../icon'
import { Kui, PropTypes } from '../kui'
// import Tooltip from '../tooltip'

export default class MenuItem extends Kui {

  state = {
    active: false,
    currentAffixed: this.props.affixed,
  }
  starClick(e) {
    if (!this.disabled) {
      e.stopPropagation();
      this.currentAffixed = !this.currentAffixed
      this.collectAffixItem(this, this.currentAffixed)
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
    let { selectedKeys, verticalAffixed, mode } = Menu.state
    let selected = selectedKeys.indexOf(eventKey) >= 0

    // console.log(selected,selectedKeys,eventKey)

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
            console.log(parent)
            parent.handleClick(options)
          }
        }
      },
    }

    // const showTooltip = this.$parent == Menu && Menu.inlineCollapsed
    // let child = this.$slots.default
    // let titleNode = child.length == 1 ? isVnode(child[0]) ? child : <span>{child}</span> : child

    return (
      // {/* <Tooltip placement="right"> */}
      <li {...props}>
        {icon ? <Icon type={icon} className={`k-${preCls}-item-icon`} /> : null}
        {children}
        {mode == 'vertical' && verticalAffixed && SubMenu ? <Icon onClick={this.starClick} className="k-menu-item-icon-affix" type={currentAffixed ? "star" : "star-outline"} /> : null}
      </li>
      // {/* {showTooltip ? <template slot="title">{children}</template> : null} */}
      // {/* </Tooltip> */}
    )
  }
}

MenuItem.propTypes = {
  eventKey: PropTypes.any,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  affixed: PropTypes.bool,
}

MenuItem.contextTypes = {
  Menu: PropTypes.any,
  SubMenu: PropTypes.any,
  Dropdown: PropTypes.any,
  collectAffixItem: PropTypes.func,
};