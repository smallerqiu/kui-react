import React from 'react'
import { Kui, PropTypes } from '../kui'
import TreeNode from './node'
export default class Tree extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data || []
    }
  }
  onExpand(data) {
    this.props.onExpand && this.props.onExpand(data)
  }
  onChecked(obj) {
    let data = this.state.data

    //
    let checkAll = true //子集是否全选
    let checkOne = false //子集是否有一个被选中
    let getChildChecked = (parent) => {
      if (parent.children && parent.children.length) {
        parent.children.forEach(child => {
          child.checked ? checkOne = true : checkAll = false
          getChildChecked(child)
        })
      }
    }
    // 递归父级，判断子集选中状态，
    let checkParent = (parent, child) => {
      parent.forEach(p => {
        if (child._pid == p._uid) {
          getChildChecked(p)
          p.indeterminate = checkAll || !checkOne ? false : true
          p.checked = checkAll ? true : false
          checkParent(data, p)
        }
        if (p.children && p.children.length) {
          checkParent(p.children, child)
        }
      })
    }
    checkParent(data, obj)
    //获取选中的item
    this.setState({ data });

    let checkedData = this.getChecked(data);
    this.props.onChecked && this.props.onChecked(checkedData);
  }
  getChecked(data) {
    let checked = []
    let check = (data) => {
      data.forEach(child => {
        child.checked && checked.push(child)
        if (child.children && child.children.length) {
          check(child.children)
        }
      })
    }
    check(data)
    return checked;
  }
  onSelect(obj) {
    let select = (data) => {
      return data.forEach(item => {
        item.selected = obj === item ? !item.selected : false
        if (item.children && item.children.length) {
          select(item.children)
        }
      });
    }
    let data = select(this.state.data)
    this.setState({ data })
    this.props.onSelect && this.props.onSelect(obj)
  }
  componentWillReceiveProps(props) {
    if (props.data != this.state.data) {
      this.setState({ data: props.data })
    }
  }
  render() {
    let data = this.state.data || []
    let { checkbox } = this.props
    return (<div className={this.className("k-tree")} style={this.styles()}>
      {
        data.map((item, index) => {
          item._pid = index;
          item._uid = '0-' + index;
          return React.createElement(TreeNode, {
            data: item,
            checkbox: checkbox,
            onSelect: this.onSelect.bind(this),
            onChecked: this.onChecked.bind(this),
            onExpand: this.onExpand.bind(this),
            onLoadData: this.props.onLoadData,
            key: index,
          })
        })
      }
      {(!data || !data.length) && <span className="tree-nodata">暂无数据...</span>}
    </div>)
  }
}
Tree.defaultProps = {
  data: []
}
Tree.propTypes = {
  data: PropTypes.array,
  checkbox: PropTypes.bool,
  onLoadData: PropTypes.func,
  onSelect: PropTypes.func,
  onExpand: PropTypes.func,
  onLoadData: PropTypes.func,
}
