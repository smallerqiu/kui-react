import React from 'react'
import { Kui, PropTypes } from '../kui'
import MenuItem from './menuitem'
import MenuGroup from './menugroup'
import SubMenu from './submenu'
export default class Menu extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: props.activeName,
      subName:'',
      openName: Array.isArray(props.openName) ? props.openName : [].concat(props.openName),
    }
  }
  classes() {
    return this.className([
      "k-menu",
      {
        [`k-menu-${this.props.theme}`]: this.props.theme,
        [`k-menu-${this.props.mode}`]: this.props.mode
      }
    ])
  }
  menuStyles() {
    return this.props.mode == "vertical" ? { width: this.props.width > 0 ? `${this.props.width}px` : this.props.width } : {};
  }

  itemClick(name, subName) {
    this.setState({ activeIndex: name, subName: subName })
    this.props.onSelect && this.props.onSelect(name)
  }
  subClick(name, visible) {
    let openName = null
    if (this.props.accordion) {
      openName = visible ? '' : name
    } else {
      openName = this.state.openName;
      (openName.indexOf(name) >= 0 ? openName.splice(openName.indexOf(name), 1) : openName.push(name))
    }
    this.setState({ openName: openName })
  }
  componentWillReceiveProps(props) {
    if (this.state.activeIndex != props.activeName) {
      this.setState({ activeIndex: props.activeName })
    }
    if (this.state.openName != props.openName) {
      this.setState({ openName: Array.isArray(props.openName) ? props.openName : [].concat(props.openName) })
    }
  }
  render() {
    let renderItem = (child, subName) => {
      return React.cloneElement(child, Object.assign({}, child.props, {
        actived: this.state.activeIndex == child.props.name,
        onClick: this.itemClick.bind(this, child.props.name, subName)
      }))
    }

    let renderSubmenu = (child) => {
      let children = React.Children.map(child.props.children, item => {
        if (item.type == MenuItem) { return renderItem(item, child.props.name) }
        if (item.type == MenuGroup) return renderGroup(item, child.props.name)
      });
      let name = this.state.openName;
      let state = Array.isArray(name) ? name.indexOf(child.props.name) >= 0 : name === child.props.name;
      let isOpen = state && this.props.mode == 'vertical';

      return React.cloneElement(child, Object.assign({}, child.props, {
        actived: this.state.subName == child.props.name,
        mode: this.props.mode, children: children, visible: isOpen,
        onClick: this.subClick.bind(this, child.props.name, isOpen)
      }));
    };

    let renderGroup = (child, subName) => {
      let children = React.Children.map(child.props.children, item => renderItem(item, subName));
      return React.cloneElement(child, Object.assign({}, child.props, { children: children }))
    };

    let renderChild = () => {
      return React.Children.map(this.props.children, child => {
        let type = child.type
        if (type == MenuItem)
          return renderItem(child)
        if (type == MenuGroup)
          return renderGroup(child)
        if (type == SubMenu)
          return renderSubmenu(child)
      })
    }

    return (<ul className={this.classes()} style={this.styles(this.menuStyles())}>
      {renderChild()}
    </ul>)
  }
}
Menu.defaultProps = {
  theme: 'light',
  mode: 'vertical',
  width: 240,
}
Menu.propTypes = {
  onSelect: PropTypes.func,
  theme: PropTypes.string,
  mode: PropTypes.string,
  activeName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  openName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  accordion: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
