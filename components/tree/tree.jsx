import React from 'react'
import { Kui, PropTypes } from '../kui'
import TreeNode from './node'
import { isEqual } from 'lodash'

export default class Tree extends Kui {
  static childContextTypes = {
    Tree: PropTypes.any
  }
  static defaultProps = {
    data: [],
    showIcon: true,
    showExtra: true,
  }
  static propTypes = {
    data: PropTypes.array,
    selectedKeys: PropTypes.array,
    expandedKeys: PropTypes.array,
    checkedKeys: PropTypes.array,
    checkable: PropTypes.bool,
    draggable: PropTypes.bool,
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    showExtra: PropTypes.bool,
    directory: PropTypes.bool,
    extra: PropTypes.any
  }
  state = {
    data: this.props.data || [],
    selectedKeys: this.props.selectedKeys || [],
    expandedKeys: this.props.expandedKeys || [],
    checkedKeys: this.props.checkedKeys || [],
    ctrlKeyEntered: false,
    halfCheckedKeys: [],
    dragNode: null,
    dragParentNode: null,
  }
  componentDidUpdate(prevProps, prevState, snap) {
    let { data, selectedKeys, expandedKeys, checkedKeys } = this.props
    if (!isEqual(data, prevProps.data)) {
      this.setState({ data })
    }
    if (!isEqual(selectedKeys, prevProps.selectedKeys)) {
      this.setState({ selectedKeys })
    }
    if (!isEqual(expandedKeys, prevProps.expandedKeys)) {
      this.setState({ expandedKeys })
    }
    if (!isEqual(checkedKeys, prevProps.checkedKeys)) {
      this.setState({ checkedKeys })
    }
  }

  componentDidMount() {
    //Init key
    // (this.state.data || []).forEach(item => {
    //   this.setKeys(item);
    // });
    //Init half check
    this.setCheckHalf()
  }

  getChildContext() {
    return {
      Tree: this
    }
  }
  setCheckHalf() {
    this.props.checkable && (this.state.checkedKeys || []).forEach(key => {
      this.setParentHalf(this.state.data, key)
    })
  }
  // setKeys({ children = [] }, key = 'n') {
  //   let index = 0
  //   for (let i = 0; i < children.length; i++) {
  //     let item = children[i]
  //     item.key = item.key || `${key}_${index}`
  //     index++
  //     this.setKeys(item, item.key)
  //   }
  // }
  setParentHalf(data = [], key) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      let { children = [], disabled } = item
      let keys = children.filter(child => !child.disabled).map(child => child.key)

      if (keys.indexOf(key) >= 0 && this.state.checkedKeys.indexOf(item.key) < 0) { //符合要求
        let { halfCheckedKeys } = this.state
        halfCheckedKeys.push(item.key)
        this.setState({ halfCheckedKeys })
        this.setParentHalf(this.state.data, item.key)
        break;
      } else {
        this.setParentHalf(children, key)
      }
    }
  }
  onCheck(checked, key, node) {
    let { onCheck } = this.props
    onCheck && onCheck({
      checkedKeys: this.state.checkedKeys,
      checked,
      node,
    })
  }
  onSelect(key, node) {
    let { onCheck } = this.props
    let { selectedKeys, ctrlKeyEntered } = this.state
    let index = selectedKeys.indexOf(key)
    if (ctrlKeyEntered) {
      index > -1 ? selectedKeys.splice(index, 1) : selectedKeys.push(key)
    } else {
      selectedKeys = index > -1 ? [] : [key]
    }
    this.setState({ selectedKeys })
    onCheck && onCheck({
      selectedKeys,
      selected: index < 0,
      node
    })
  }
  onExpand(key, node, vnode) {
    let { onExpand, onLoadData } = this.props
    let { expandedKeys } = this.state
    let { loading } = vnode.state
    // console.log(key, node, vnode)
    if (node.children) {
      let index = expandedKeys.indexOf(key)
      index > -1 ? expandedKeys.splice(index, 1) : expandedKeys.push(key)
      this.setState({ expandedKeys })
      onExpand && onExpand({
        expandedKeys,
        expanded: index < 0,
        node
      })
    } else if (this.props.onLoadData && !node.isLeaf && !loading) {

      vnode.setState({ loading: true })
      onLoadData && onLoadData(node, child => {
        vnode.setState({ loading: false })
        node.children = child
        expandedKeys.push(vnode.props.eventKey)
        this.setState({ expandedKeys })
        onExpand && onExpand({
          expandedKeys,
          expanded: true,
          node
        })
      })
    }
    // }
  }
  // onDragStart(e, { node, parent }) {
  onDragStart(event, { data, VNode }) {
    let { expandedKeys } = this.state
    this.dragNode = data
    this.dragParentNode = VNode
    let index = expandedKeys.indexOf(data.key)
    if (index > -1) {
      expandedKeys.splice(index, 1)
    }
    this.setState({ expandedKeys })
    let { onDragStart } = this.props
    onDragStart && onDragStart({ event, node: data })
  }
  onDragEnd(event, { node, parent }) {
    let { onDragEnd } = this.props
    onDragEnd && onDragEnd({ event, node })
  }
  onDragEnter(event, { node, parent }) {
    let { onDragEnter } = this.props
    onDragEnter && onDragEnter({ event, node, expandedKeys: this.state.expandedKeys })
  }
  onDragLeave(event, { node, parent }) {
    let { onDragLeave } = this.props
    onDragLeave && onDragLeave({ event, node })
  }

  onDrop(event, { node }) {
    let dragParentNode = this.dragParentNode.state.data
    let { dragNode } = this

    if (dragNode && node.key != dragNode.key && node.key != dragParentNode.key) {
      let { expandedKeys } = this.state
      //remove self

      let index = dragParentNode.children.indexOf(dragNode)
      dragParentNode.children.splice(index, 1)

      // this.dragParentNode.reload = false
      // if not children ,remove expand key
      if (!dragParentNode.children.length) {
        let index = expandedKeys.indexOf(dragParentNode.key)
        index > -1 && expandedKeys.splice(index, 1)
      }

      // this.dragParentNode.reload = true


      // append self
      if (!node.children || !node.children.length) {
        node.children = [];
        expandedKeys.indexOf(node.key) < 0 && expandedKeys.push(node.key)
      }
      let keys = node.children.map(i => i.key)
      if (keys.indexOf(node.key) < 0) {
        node.children.push(dragNode)
      }
      this.setState({ expandedKeys })
    }
    let { onDrop } = this.props
    onDrop && onDrop({ event, node, dragNode })

    this.dragNode = null
    this.dragParentNode = null

  }
  renderChild() {
    let { data } = this.state
    let { children } = this.props
    if (children) {
      return React.Children.map(children, (child, i) => {
        let props = Object.assign({}, { ...child.props })
        let key = child.key || props.eventKey || `n_${i}`
        return <TreeNode {...props} key={key} eventKey={key} />
      })
    }
    return data.map((item, i) => {
      const key = item.key || `n_${i}`
      item.key = key
      return <TreeNode data={item} key={key} eventKey={key} />
    })
  }
  render() {
    let { showLine, directory } = this.props
    return (<div
      style={this.styles()}
      className={this.className(["k-tree", {
        'k-tree-show-line': showLine,
        'k-tree-directory': directory
      }])}>
      {this.renderChild()}
    </div>)
  }
}