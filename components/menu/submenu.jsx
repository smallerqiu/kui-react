import React from 'react'
import { Kui, PropTypes } from '../kui'
import CMenu from './menu.jsx'
import Icon from '../icon'
import BasePop from '../base/pop'
import Transition from '../base/transition'

export default class SubMenu extends Kui {
  static propTypes = {
    disabled: PropTypes.bool,
    title: PropTypes.any,
    icon: PropTypes.string,
    eventKey: PropTypes.any,
  }

  static childContextTypes = {
    SubMenu: PropTypes.any,
  }

  static contextTypes = {
    Menu: PropTypes.any,
    SubMenu: PropTypes.any,
    openChange: PropTypes.func,
    Dropdown: PropTypes.any
  }
  state = {
    active: false,
    opened: false,
    left: null,
    minWidth: null,
    currentMode: null,
    rendered: false,
    affixedKeys: []
  }

  titleRef = React.createRef()

  getChildContext() {
    return {
      SubMenu: this
    };
  }
  componentDidMount() {
    let { SubMenu, Menu } = this.context
    if (Menu != null) {
      let { selectedKeys, inlineCollapsed, defaultOpenKeys, currentMode } = Menu.state
      let { eventKey, children } = this.props

      const opened = defaultOpenKeys.indexOf(eventKey) >= 0

      if (opened) {
        this.setState({ rendered: true })
      }

      if (SubMenu != null) {
        let selected = selectedKeys.indexOf(eventKey) >= 0
        if (selected && selectedKeys.indexOf(SubMenu.props.eventKey) < 0) {
          selectedKeys.push(SubMenu.props.eventKey)
          Menu.setState({ selectedKeys })
        }
      }

      if (!inlineCollapsed) {
        this.setState({ opened })
      }

      if (currentMode == 'inline') {
        this.setState({ opened, rendered: opened })
      }

      const affixedKeys = children.filter(({ props }) => props.affixed).map(i => i.key)
      this.setState({ affixedKeys })
    }
  }

  componentDidUpdate(prevProps, prevState, snap) {
    // let { opened } = this.state
    // if (opened != prevState.opened && opened) {
    //   this.setState({ rendered: true })
    // }
    // const { defaultOpenKeys,inlineCollapsed } = this.context.Menu.state
    // const { inlineCollapsed } = this.context.Menu.props

    // console.log(inlineCollapsed)

  }


  render() {
    let { disabled, eventKey, title, children, icon } = this.props
    let { opened, minWidth, active, rendered } = this.state
    let { Dropdown, Menu, SubMenu } = this.context

    const { currentMode, selectedKeys, defaultOpenKeys, inlineCollapsed } = Menu.state
    const { theme, verticalAffixed } = Menu.props

    let selected = selectedKeys.indexOf(eventKey) >= 0
    const showInline = currentMode == 'inline'
    //when accordion
    if (showInline) {
      opened = defaultOpenKeys.indexOf(eventKey) >= 0
      if (opened) rendered = true
    }

    // opened = true
    let types = currentMode == 'horizontal' || inlineCollapsed ? 'vertical' : currentMode

    const preCls = Dropdown ? 'dropdown-menu-submenu' : 'menu-submenu';

    let titleProps = {
      ref: this.titleRef,
      key: 'title',
      className: `k-${preCls}-title`,
      onClick: () => this.openChange(),
      onMouseEnter: () => this.showPopupMenu(),
      onMouseLeave: () => this.hidePopupMenu()
    }
    const titleNode = <div {...titleProps}>
      <span className={`k-${preCls}-inner`}>
        {icon ? <Icon type={icon} /> : null}
        {React.isValidElement(title) ? title : <span>{title}</span>}
      </span>
      <Icon type={(showInline && !inlineCollapsed) || (currentMode == 'horizontal' && SubMenu == null) ?
        "chevron-down" : 'chevron-forward'} className={`k-${preCls}-arrow`} />
    </div>

    const hasRenderAffix = SubMenu == null && currentMode == 'vertical' && verticalAffixed

    const popupProps = {
      key: 'content',
      className: this.className([`k-${preCls}-popup`, { [`k-${preCls}-affix-popup`]: hasRenderAffix }]),
      style: {
        'minWidth': `${minWidth}px`,
        'marginLeft': theme == 'dark' && SubMenu == null && currentMode == "horizontal" ? '-16px' : null
      },
      onMouseEnter: () => {
        clearTimeout(this.timer);
        this.setState({
          active: true
        })
        if (!showInline) {
          this.setState({
            opened: true,
          })
        }
      },
      onMouseLeave: () => {
        this.hidePopupMenu()
      }
    }

    const childNode = <div {...popupProps}>
      {/* {React.createElement(CMenu, { mode: types, theme }, children)} */}
      <CMenu mode={types} theme={theme}>{children}</CMenu>
    </div>
    let popMenuNode = null
    // console.log(inlineCollapsed, showInline, inlineCollapsed)
    if ((!showInline || inlineCollapsed) && SubMenu == null && Dropdown == null) {

      const popProps = {
        content: childNode,
        showPlacementArrow: false,
        preCls: preCls + '-popup',
        transfer: SubMenu == null,
        placement: currentMode == 'horizontal' ? 'bottom-left' : 'right-top',
        show: opened,
        onUnmount: this.onUnmount.bind(this),
        onVisibleChange: (opened, { current }) => {
          let state = { opened }
          if (currentMode == 'horizontal' && SubMenu == null && Menu != null) {
            state.minWidth = current.offsetWidth
          }
          this.setState(state)
        }
      }
      popMenuNode = <BasePop {...popProps}>{titleNode}</BasePop>
    } else {
      // console.log(opened, rendered, !rendered, !rendered && !opened)
      popMenuNode = [titleNode, <Transition
        show={opened}
        name={'k-' + preCls + (showInline && !inlineCollapsed && !Dropdown ? '-slide' : '-fade')}
        collapse={showInline}
        unmountOnExit={!rendered}
        onUnmount={this.onUnmount.bind(this)}
        key="collapse">{childNode}</Transition>]
    }

    const classes = [`k-${preCls}`, {
      [`k-${preCls}-active`]: active,
      [`k-${preCls}-selected`]: selected && !Dropdown,
      [`k-${preCls}-opened`]: opened,
      [`k-${preCls}-disabled`]: disabled
    }]

    const affixNode = hasRenderAffix ? this.renderAffix() : null

    return (<li className={this.className(classes)}>{popMenuNode}{affixNode}</li>)
  }
  onUnmount() {
    // mode 切换的时候，原来显示的子集，给他销毁掉，再次展开要重新 render
    this.setState({ rendered: false })
  }
  hidePopupMenu() {
    let { currentMode, defaultOpenKeys } = this.context.Menu.state
    if (this.props.disabled) return;
    let { inlineCollapsed } = this.context.Menu.props

    this.setState({ active: false })

    if (currentMode != 'inline' || inlineCollapsed) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setState({ opened: false }, () => {
          let openKeys = [].concat(defaultOpenKeys)
          let key = this.props.eventKey,
            index = openKeys.indexOf(key)
          index > -1 && openKeys.splice(index, 1)
          this.context.Menu.openChange(openKeys)
        })

      }, 300);
    }
  }
  showPopupMenu() {
    if (this.props.disabled) return;
    clearTimeout(this.timer)
    this.setState({ active: true })
    let { currentMode, defaultOpenKeys } = this.context.Menu.state
    let { inlineCollapsed } = this.context.Menu.props
    if (currentMode != 'inline' || inlineCollapsed) {
      this.setState({ rendered: true }, () => {
        this.setState({ opened: true })
        let openKeys = [].concat(defaultOpenKeys)
        let key = this.props.eventKey,
          index = openKeys.indexOf(key)
        index < 0 && openKeys.push(key)
        this.context.Menu.openChange(openKeys)
      })
    }
  }
  affixed(item, e) {
    let parent = this.context.Menu
    let key = item.props.eventKey
    if (parent) {
      let options = {
        key,
        keyPath: [key],
        item,
        event: e
      }
      parent.props.onAffixed && parent.props.onAffixed(options)
      let { affixedKeys } = this.state
      if (item.state.currentAffixed) {
        affixedKeys.push(key)
      } else {
        let index = affixedKeys.indexOf(key)
        affixedKeys.splice(index, 1)
      }
      this.setState({ affixedKeys })
    }
  }
  affixItemClick(item, e) {
    let disabled = item.props.disabled
    if (!disabled) {
      let parent = this.context.SubMenu || this.context.Menu
      if (parent != null) {
        let key = item.key
        let options = {
          key,
          keyPath: [key],
          item,
          event: e
        }
        parent.handleClick(options)
      }
    }
  }
  renderAffix() {
    let { affixedKeys } = this.state
    let { selectedKeys } = this.context.Menu.state
    const childs = this.props.children.filter((child) => affixedKeys.indexOf(child.key) > -1)
    const childNode = childs.map(item => {
      return (<li className={this.className(["k-menu-submenu-affix-item", { 'k-menu-submenu-affix-item-active': selectedKeys.indexOf(item.key) >= 0 }])} key={item.key}>
        <span className="k-menu-submenu-affix-item-text" onClick={e => this.affixItemClick(item, e)}>{item.props.children}</span>
      </li>)
    })
    return <ul className="k-menu-submenu-affix">{childNode}</ul>
  }
  openChange() {
    let { Menu, SubMenu } = this.context
    if (Menu != null) {
      let { currentMode, defaultOpenKeys } = Menu.state
      let { accordion, inlineCollapsed } = Menu.props
      if (currentMode != 'inline' || inlineCollapsed) return;
      let openKeys = [].concat(defaultOpenKeys)
      let key = this.props.eventKey
      let index = openKeys.indexOf(key)

      if (accordion && SubMenu == null) {
        openKeys = index >= 0 ? [] : [key]
      } else {
        if (index >= 0) {
          openKeys.splice(index, 1)
        } else {
          openKeys.push(key)
        }
      }

      const opened = openKeys.indexOf(key) > -1
      if (!this.state.rendered) {
        this.setState({ rendered: true }, () => {
          this.setState({ opened }, () => Menu.openChange(openKeys))
        })
      } else {
        this.setState({ opened }, () => Menu.openChange(openKeys))
      }
    }
  }

  handleClick(options) { //item click event
    options.keyPath.unshift(this.props.eventKey)
    let { Menu, SubMenu } = this.context
    let parent = SubMenu || Menu
    if (parent != null) {
      parent.handleClick(options)
    }
    let { currentMode } = Menu.state
    let { inlineCollapsed } = Menu.props
    if (currentMode != 'inline' || inlineCollapsed) {
      Menu.openChange([])
      this.setState({ opened: false }, () => { })
    }
  }
}

