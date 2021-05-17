import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class Menu extends Kui {
  static contextTypes = {
    Menu: PropTypes.any,
    SubMenu: PropTypes.any,
    Dropdown: PropTypes.any
  }

  static childContextTypes = {
    Menu: PropTypes.any,
  }

  static defaultProps = {
    theme: 'light',
    mode: 'vertical',
    inlineCollapsed: false
  }

  static propTypes = {
    theme: PropTypes.string,
    mode: PropTypes.string,
    selectedKeys: PropTypes.array,
    accordion: PropTypes.bool,
    inlineCollapsed: PropTypes.bool,
    verticalAffixed: PropTypes.bool,
    openKeys: PropTypes.array,
  }

  state = {
    selectedKeys: this.props.selectedKeys || [],
    defaultOpenKeys: this.props.inlineCollapsed ? [] : this.props.openKeys || [],
    currentMode: this.props.mode,
    originOpenKeys: this.props.openKeys || [],
    originMode: this.props.mode,
    inlineCollapsed: this.props.inlineCollapsed
  }
  componentDidUpdate(prevProps, prevState, snap) {
    let { mode, selectedKeys, inlineCollapsed } = this.props
    let { originOpenKeys } = this.state

    if (prevProps.mode != mode) {
      this.setState({ currentMode: mode })
    }

    if (prevProps.selectedKeys !== selectedKeys) {
      this.setState({ selectedKeys })
    }

    if (prevProps.inlineCollapsed != inlineCollapsed) {
      this.setState({ defaultOpenKeys: inlineCollapsed ? [] : originOpenKeys }, () => {
        this.setState({ inlineCollapsed })
      })
    }
  }
  getChildContext() {
    return {
      Menu: this.context.Menu || this,
    };
  }
  openChange(openKeys) {
    this.setState({ defaultOpenKeys: openKeys })
    if (!this.props.inlineCollapsed) {
      this.setState({ originOpenKeys: openKeys })
    }
    this.props.onOpenChange && this.props.onOpenChange(openKeys)
  }
  handleClick(options) {
    let { SubMenu, Menu, Dropdown } = this.context
    let parent = SubMenu || Menu || Dropdown
    if (parent) {
      parent.handleClick(options)
    } else {
      let selectedKeys = options.keyPath
      let { onClick, onChange } = this.props
      onClick && onClick(options)
      this.setState({ selectedKeys })
      onChange && onChange(selectedKeys)
    }
  }
  render() {
    const { theme, inlineCollapsed, children } = this.props
    const { currentMode } = this.state
    const preCls = this.context.Dropdown ? 'dropdown-menu' : 'menu';
    const cls = [`k-${preCls} k-${preCls}-${theme} k-${preCls}-${currentMode}`, {
      [`k-${preCls}-inline-collapased`]: inlineCollapsed
    }];
    let index = -1;
    return (<ul className={this.className(cls)} style={this.styles()}>
      {
        React.Children.map(children, child => {
          return React.cloneElement(child, { eventKey: child.key || `${preCls}item_${index++}` })
        })
      }
    </ul>)
  }
}
