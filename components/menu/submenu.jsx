import React from 'react'
import { Kui, PropTypes } from '../kui'
import Collapse from '../collapse/collapse'
import CMenu from './menu.jsx'
import Icon from '../icon'
import BasePop from '../base/pop'

const animateNames = {
  horizontal: 'dropdown',
  inline: 'k-collaplse-slide',
  vertical: 'k-menu-submenu-fade'
}
export default class SubMenu extends Kui {
  state = {
    active: false,
    opened: false,
    left: null,
    minWidth: null,
    currentMode: null,
  }

  titleRef = React.createRef()

  getChildContext() {
    return {
      SubMenu: this
    };
  }
  componentDidMount() {
    let { SubMenu, Menu } = this.context
    if (Menu && SubMenu) {
      let { selectedKeys } = Menu.state
      let selected = selectedKeys.indexOf(this.props.eventKey) >= 0
      if (selected && selectedKeys.indexOf(SubMenu.props.eventKey) < 0) {
        Menu.selectedKeys.push(SubMenu.props.eventKey)
      }
    }
  }

  render() {
    let { disabled, eventKey, title, children, icon } = this.props
    let { opened, minWidth, active } = this.state
    let { Dropdown, Menu, SubMenu } = this.context

    const { currentMode, theme, selectedKeys, defaultOpenKeys,
      mode, verticalAffixed } = Menu.state

    let selected = selectedKeys.indexOf(eventKey) >= 0

    if (currentMode == 'inline') {
      opened = defaultOpenKeys.indexOf(eventKey) >= 0
    }
    // opened = true
    let types = currentMode == 'horizontal' ? 'vertical' : currentMode

    const preCls = Dropdown ? 'dropdown-menu-submenu' : 'menu-submenu';

    let aniName = currentMode == 'horizontal' && !SubMenu ? 'dropdown' : animateNames[types];

    let titleProps = {
      ref: this.titleRef,
      key: 'title',
      className: `k-${preCls}-title`,
      onClick: () => this.openChange()
    }
    if (SubMenu || Menu || Dropdown) {
      titleProps.onMouseEnter = e => this.showPopupMenu()
      titleProps.onMouseLeave = e => this.hidePopupMenu()
    }
    const titleNode = <div {...titleProps}>
      <span className={`k-${preCls}-inner`}>
        {icon ? <Icon type={icon} /> : null}
        {React.isValidElement(title) ? title : <span>{title}</span>}
      </span>
      <Icon type={currentMode == 'inline' || (currentMode == 'horizontal' && SubMenu == null) ? "chevron-down" : 'chevron-forward'} className={`k-${preCls}-arrow`} />
    </div>
    const popupProps = {
      key: 'content',
      className: `k-${preCls}-popup`,
      style: {
        'minWidth': `${minWidth}px`,
        'marginLeft': theme == 'dark' && /* this.$parent == root && */ mode == "horizontal" ? '-16px' : null
      },
      onMouseEnter: () => {
        clearTimeout(this.timer);
        this.setState({
          opened: true,
          active: true
        })
      },
      onMouseLeave: () => {
        this.hidePopupMenu(currentMode)
      }
    }

    const childNode = <div {...popupProps}>
      <CMenu mode={types} theme={theme}>{children}</CMenu>
    </div>
    // let wocao = <CMenu mode={types} theme={theme}>{children}</CMenu>
    //  console.log(wocao)
    // let childNode = React.cloneElement(<div />, popupProps, wocao)
    let haspop = currentMode != 'inline' && SubMenu == null && !Dropdown,
      popProps = {};
    if (haspop) {
      popProps = {
        content: childNode,
        showPlacementArrow: false,
        preCls: preCls + '-popup',
        transfer: true,
        placement: currentMode == 'horizontal' ? 'bottom-left' : 'right-top',
        show: opened,
        onOpen: () => {
          let state = { opened: true }
          if (currentMode == 'horizontal') {
            state.minWidth = this.titleRef.current.offsetWidth
          }
          this.setState(state)
        }
        // on: {
        //   input: e => {
        //     if (currentMode == 'horizontal')
        //       this.minWidth = this.$el.offsetWidth
        //   }
        // }
      }
    }

    const classes = [
      `k-${preCls}`,
      {
        [`k-${preCls}-active`]: active,
        [`k-${preCls}-selected`]: selected && !Dropdown,
        [`k-${preCls}-opened`]: opened,
        [`k-${preCls}-disabled`]: disabled
      }
    ]
    // const hasRenderAffix = this.$parent == root && mode == 'vertical' && verticalAffixed

    // const affixNode = hasRenderAffix ? this.renderAffix(root) : null
    return (
      <li className={this.className(classes)}>
        {haspop ? <BasePop {...popProps}>{titleNode}</BasePop> :
          [titleNode, <Collapse show={opened} name={aniName} key="collapse">{childNode}</Collapse>]}
        {/* {affixNode} */}
      </li>
    )
  }
  hidePopupMenu() {
    if (this.props.disabled) return;
    this.setState({ active: false })
    if (this.context.Menu && this.context.Menu.state.currentMode != 'inline') return;
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setState({ opened: false })
    }, 300);
  }
  showPopupMenu() {
    if (this.props.disabled) return;
    clearTimeout(this.timer)
    this.setState({ active: true })

    let { SubMenu, Dropdown, Menu } = this.context
    if (Menu && Menu.state.currentMode != 'inline') {
      if (SubMenu || Dropdown) {
        this.setState({ opened: true })
      }
    }
  }

  renderAffix(root) {
    const childs = getChild(this.$slots.default)
    const itemClick = (item, e) => {
      let disabled = item.componentOptions.propsData.disabled
      if (disabled == undefined) {
        // this.selected = true
        let key = item.data.key

        let options = {
          key,
          keyPath: [key],
          item,
          event: e
        }
        let parent = this.SubMenu || this.Menu
        if (parent) {
          parent.handleClick(options)
        }
      }
    }
    const child = childs.map(item => {
      let affixed = item.componentOptions.propsData.affixed
      let vnode = item.componentOptions.children
      let key = item.data.key
      if (affixed !== undefined && affixed !== false) {
        return <li className={["k-menu-submenu-affix-item", { 'k-menu-submenu-affix-item-active': root.selectedKeys.indexOf(key) >= 0 }]} key={key}>
          <span className="k-menu-submenu-affix-item-text" onClick={e => itemClick(item, e)}>{vnode}</span>
        </li>
      }
    })
    return <div className="k-menu-submenu-affix">{child}</div>
  }
  openChange() {
    let { Menu, SubMenu } = this.context
    if (Menu) {
      let { currentMode, defaultOpenKeys } = Menu.state
      let { accordion } = Menu.props
      if (currentMode != 'inline') return;
      let openKeys = defaultOpenKeys
      let key = this.props.eventKey
      let index = openKeys.indexOf(key)

      if (accordion && !SubMenu) {
        openKeys = index >= 0 ? [] : [key]
        console.log(openKeys)
      } else {
        if (index >= 0) {
          openKeys.splice(index, 1)
        } else {
          openKeys.push(key)
        }
      }
      Menu.openChange(openKeys)
    }
  }
  closeSub() {
    this.setState({ opened: false })
    let SubMenu = this.context.SubMenu
    if (SubMenu) SubMenu.closeSub()
  }
  handleClick(options) { //item click event
    console.log('sss')
    options.keyPath.unshift(this.props.eventKey)
    let root = this.context.Menu
    let parent = this.context.SubMenu || root
    if (parent) {
      parent.handleClick(options)
    }
    let { currentMode } = root.state
    console.log(currentMode)
    if (currentMode == 'horizontal' || currentMode == 'vertical') {
      this.closeSub()
    }
  }
}

SubMenu.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.any,
  icon: PropTypes.string,
  eventKey: PropTypes.any,
}

SubMenu.childContextTypes = {
  SubMenu: PropTypes.any,
};

SubMenu.contextTypes = {
  Menu: PropTypes.any,
  SubMenu: PropTypes.any,
  Dropdown: PropTypes.any
};