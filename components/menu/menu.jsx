import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class Menu extends Kui {
  state = {
    selectedKeys: this.props.selectedKeys || [],
    defaultOpenKeys: this.props.openKeys || [],
    currentMode: this.props.mode,
    originOpenKeys: [],
    originMode: null,
  }
  getChildContext() {
    return {
      Menu: this.context.Menu || this,
    };
  }
  openChange(openKeys) {
    this.setState({ defaultOpenKeys: openKeys })
    let { onClick } = this.props
    onClick && onClick(openKeys)
  }
  handleClick(options) {
    let { SubMenu, Menu, Dropdown } = this.context
    let parent = SubMenu || Menu || Dropdown
    if (parent) {
      parent.handleClick(options)
    } else {
      let selectedKeys = options.keyPath
      let { onClick } = this.props
      onClick && onClick(options)
      this.setState({ selectedKeys })
    }
  }
  render() {
    console.log(this.context)
    const { theme, inlineCollapsed } = this.props
    const { currentMode } = this.state
    const preCls = this.context.Dropdown ? 'dropdown-menu' : 'menu';
    const cls = [`k-${preCls} k-${preCls}-${theme} k-${preCls}-${currentMode}`, {
      [`k-${preCls}-inline-collapased`]: inlineCollapsed
    }];
    let index = -1;
    return (<ul className={this.className(cls)}>
      {
        React.Children.map(this.props.children, child => {
          return React.cloneElement(child, { eventKey: child.key || `${preCls}item_${index++}` })
        })
      }
    </ul>)
  }
}
Menu.defaultProps = {
  theme: 'light',
  mode: 'vertical',
}

Menu.propTypes = {
  theme: PropTypes.string,
  mode: PropTypes.string,
  selectedKeys: PropTypes.array,
  openKeys: PropTypes.array,
  accordion: PropTypes.bool,
  verticalAffixed: PropTypes.bool,
  inlineCollapsed: PropTypes.bool,
  onClick: PropTypes.func
}

Menu.childContextTypes = {
  Menu: PropTypes.any,
  SubMenu: PropTypes.any,
  Dropdown: PropTypes.any
};

Menu.contextTypes = {
  SubMenu: PropTypes.any,
  Menu: PropTypes.any
};