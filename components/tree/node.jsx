import React from 'react'
import { Kui, PropTypes } from '../kui'
import Checkbox from '../checkbox'
import Node from './node.jsx'
import Icon from '../icon'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Transition from '../base/transition'
import { isEqual } from 'lodash'
import on from './ani'
export default class TreeNode extends Kui {
  static defaultProps = {
    data: {}
  }

  static contextTypes = {
    Tree: PropTypes.any,
    VNode: PropTypes.any
  }

  static childContextTypes = {
    VNode: PropTypes.any
  }

  static propTypes = {
    data: PropTypes.object,
    isLeaf: PropTypes.object,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    title: PropTypes.string,
    eventKey: PropTypes.string,
  }

  state = {
    data: this.props.data || {},
    loading: false,
    draged: false,
    droped: false,
    reload: true
  }

  getChildContext() {
    return {
      VNode: this
    };
  }

  componentDidUpdate(prevProps, prevState, snap) {
    if (!isEqual(prevProps.data, this.props.data)) {
      this.setState({ data: this.props.data })
    }
  }

  componentDidMount() {
    let { Tree, VNode } = this.context
    let { checkedKeys } = Tree.state
    let checked = checkedKeys.indexOf(this.state.data.key) > -1
    if (checked) {
      this.updateChildCheck(this.state.data, checked)
      // if (VNode)
      //   this.updateParentCheck(VNode)
    }
  }

  updateChildCheck = ({ children = [], disabled }, checked) => {
    !disabled && children.forEach(item => {
      if (!item.disabled) {
        let { Tree } = this.context
        let { checkedKeys } = Tree.state
        const key = item.key
        let index = checkedKeys.indexOf(key)
        // console.log(key, checked)
        checked ? index < 0 && checkedKeys.push(key) : index > -1 && checkedKeys.splice(index, 1)
        Tree.setState({ checkedKeys }, () => {
          this.updateChildCheck(item, checked)
        })
      }
    })
  }

  updateParentCheck = (vnode) => {
    if (!vnode) return
    let { data } = vnode.props
    if (!data || data.disabled) return;
    let { VNode } = vnode.context
    // let { defaultData, VNode, disabled } = parent
    let { children = [], key } = data
    let { Tree } = this.context
    let { checkedKeys, halfCheckedKeys } = Tree.state
    const normal = children.filter(({ disabled }) => !disabled)
    let checkedLength = normal.filter(({ key }) => checkedKeys.indexOf(key) > -1).length
    let halfcheckedLength = normal.filter(({ key }) => halfCheckedKeys.indexOf(key) > -1).length
    // let key = defaultData.key,
    let isCheckAll = checkedLength == normal.length;

    let halfIndex = halfCheckedKeys.indexOf(key)
    let checkIndex = checkedKeys.indexOf(key)

    isCheckAll ? checkedKeys.push(key) : (checkIndex > -1 && checkedKeys.splice(checkIndex, 1))
    if ((halfcheckedLength > 0 || checkedLength > 0) && !isCheckAll) {
      // console.log(halfCheckedKeys, key,'a')
      halfIndex < 0 && halfCheckedKeys.push(key)
      // console.log(halfCheckedKeys, key,'b')
    } else {
      halfIndex > -1 && halfCheckedKeys.splice(halfIndex, 1);
    }
    Tree.setState({ checkedKeys, halfCheckedKeys }, () => {
      VNode && this.updateParentCheck(VNode)
    })
  }

  handleCheck = (e) => {
    let { data } = this.state
    if (!data.disabled) {
      const checked = e.target.checked
      let { Tree, VNode } = this.context
      let { eventKey } = this.props

      let { checkedKeys, halfCheckedKeys } = Tree.state
      let index = checkedKeys.indexOf(eventKey)
      checked && index < 0 ? checkedKeys.push(eventKey) : checkedKeys.splice(index, 1)

      let halfIndex = halfCheckedKeys.indexOf(eventKey)

      if (checked && halfIndex > -1) {
        halfCheckedKeys.splice(halfIndex, 1)
      }

      Tree.setState({ checkedKeys, halfCheckedKeys }, () => {
        this.updateChildCheck(data, checked)
        this.updateParentCheck(VNode)
        Tree.onCheck(checked, eventKey, data)
      })
    }
  }
  handleSelect = (e) => {
    let { disabled, key } = this.state.data
    if (!disabled) {
      let { Tree } = this.context
      if (Tree.props.directory) {
        this.handleExpand(e)
      }
      if (Tree.state.selectedKeys.indexOf(key) < 0) {
        Tree.onSelect(key, this.state.data)
      }
    }
  }
  handleExpand = (e) => {
    e.stopPropagation()
    let { Tree, VNode } = this.context
    if (this.props.children) {
      Tree.onExpand(this.props.eventKey, this.props, this)
    } else {
      Tree.onExpand(this.state.data.key, this.state.data, this)
    }
  }
  onDragStart = (e) => {
    this.setState({ draged: true })
    this.context.Tree.onDragStart(e, { data: this.state.data, VNode: this.context.VNode })
  }
  onDragEnd = (e) => {
    this.setState({ draged: false })
    this.context.Tree.onDragEnd(e, { node: this.state.data })
    this.forceUpdate()
  }
  onDragEnter = (e) => {
    this.setState({ droped: true })
    this.context.Tree.onDragEnter(e, { node: this.state.data })
  }
  onDragLeave = (e) => {
    this.setState({ droped: false })
    this.context.Tree.onDragLeave(e, { node: this.state.data })
  }
  onDrop = (e) => {
    this.setState({ droped: false })
    if (!this.state.data.disabled) {
      this.context.Tree.onDrop(e, { node: this.state.data })
    }
  }
  onDragOver = (e) => {
    e.preventDefault()
  }

  getParent = () => {
    let { VNode, Tree } = this.context
    return VNode ? VNode.state.data : { children: Tree.state.data }
  }
  render() {
    let { data, loading, reload, draged, droped } = this.state
    data = Object.assign({ ...this.props }, data)
    // delete data.data
    // console.log(data,this.props)

    let { isLeaf, disabled, icon, title, children = [], key, eventKey } = data
    key = key || eventKey || this.props.eventKey
    // console.log(key)
    let itemNode = [], { Tree } = this.context
    let { selectedKeys = [], expandedKeys = [], checkedKeys = [], halfCheckedKeys = [],
    } = Tree.state
    let { checkable, showLine, directory, draggable, showIcon, showExtra, onLoadData, extra } = Tree.props

    const expand = expandedKeys.indexOf(key) > - 1,
      selected = selectedKeys.indexOf(key) > - 1,
      checked = checkedKeys.indexOf(key) > - 1,
      indeterminate = halfCheckedKeys.indexOf(key) > - 1;

    let hasChilds = this.props.children || children.length > 0
    if ((hasChilds || onLoadData) && isLeaf !== true) {
      let arrowCls = ['k-tree-arrow', { 'k-tree-arrow-open': expand }]
      let arrowNode = <span className={this.className(arrowCls)} onClick={this.handleExpand} key="arrow">
        <Icon type={loading ? 'sync' : (showLine ? (expand ? 'remove-circle-outline' : 'add-circle-outline') : 'chevron-forward')} spin={loading} />
      </span>
      itemNode.push(arrowNode)
    } else {
      itemNode.push(<span className="k-tree-commes" key="commes"></span>)
    }
    if (checkable) {
      let props = {
        key: 'checkbox',
        checked, disabled, indeterminate,
        onChange: this.handleCheck,/*  input: e => { this.$set(this.data, 'checked', e) }  }*/
      }
      itemNode.push(<Checkbox {...props} />)
    }
    let iconNode = null
    if (icon && showIcon) {
      iconNode = <Icon type={icon} key="icon" className="k-tree-icon" />;
    }

    let titleCls = ['k-tree-title', { 'k-tree-title-selected': selected }]

    if (Tree.props.title && typeof Tree.props.title == 'function') {
      title = Tree.props.title({ node: data, parent: this.getParent() })
    }
    let innerNode = [iconNode, title]

    const titleProps = {
      key: "title",
      className: this.className(titleCls),
      tabIndex: "-1",
      draggable: draggable && !disabled
    }
    if (!directory) {
      titleProps.onClick = this.handleSelect;
    }
    if (draggable) {
      titleProps.onDragStart = this.onDragStart
      titleProps.onDragEnd = this.onDragEnd
      titleProps.onDrop = this.onDrop
      titleProps.onDragEnter = this.onDragEnter
      titleProps.onDragLeave = this.onDragLeave
      titleProps.onDragOver = this.onDragOver
    }
    itemNode.push(<span {...titleProps}>{innerNode}</span>)

    let childs = null
    if (hasChilds && reload && expand) {
      if (this.props.children) {
        childs = React.Children.map(this.props.children, (child, i) => {
          let props = Object.assign({}, child.props)
          let k = child.key || props.eventKey || `${key}_${i}`
          delete props.key
          delete props.data
          return <CSSTransition
            unmountOnExit
            key={k}
            in={expand}
            {...on}
            timeout={300}
            classNames={`k-tree-slide`}><Node {...props} key={k} eventKey={k} /></CSSTransition>
        })
      } else {
        childs = children.map((item, i) => {
          const k = item.key || `${key}_${i}`
          item.key = k
          return <CSSTransition
            unmountOnExit
            key={k}
            in={expand}
            {...on}
            timeout={300}
            classNames={`k-tree-slide`}><Node data={item} eventKey={k} /></CSSTransition>
        })
      }
    }
    const itemProps = {
      className: this.className(['k-tree-item', {
        'k-tree-item-disabled': disabled,
        'k-tree-item-drag': draged,
        'k-tree-item-drop': droped && !disabled,
        'k-tree-item-extra-hidden': !showExtra,
        'k-tree-item-selected': directory && selected
      }]),
    }
    if (directory) {
      itemProps.onClick = this.handleSelect
    }

    let extraNode;
    if (extra && typeof extra == 'function') {
      let extraEl = extra({ node: this.state.data, parent: this.getParent() })
      extraNode = <span className='k-tree-item-extra' key="extra">{extraEl}</span>
    }

    return (
      <div className="k-tree-children">
        <div {...itemProps}>{itemNode}{extraNode}</div>
        <TransitionGroup className="k-tree-item-children">
          {childs}
        </TransitionGroup>
      </div>)
  }
}