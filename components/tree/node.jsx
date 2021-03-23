import React from 'react'
import { Kui, PropTypes } from '../kui'
import Collapse from '../collapse/collapse.js'
import Checkbox from '../checkbox'
import Icon from '../icon'
export default class TreeNode extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data || {}
    }
  }
  arrowClass() {
    return this.className(['k-tree-arrow', { ['k-tree-arrow-open']: this.state.data.expand, }
    ])
  }
  titleClass() {
    return this.className([
      'k-tree-title', {
        ['k-tree-title-selected']: this.state.data.selected
      }
    ])
  }
  handelCheck(checked) {
    let { data } = this.state
    if (!data.disabled) {
      data.checked = checked
      // 递归子集，同步选中选中状态
      let checkChild = (data) => {
        data.indeterminate = false
        if (data.children && data.children.length) {
          data.children.forEach(child => {
            child.checked = data.checked
            child.indeterminate = false
            checkChild(child)
          })
        }
      }
      checkChild(data)
      this.setState({ data })
      this.props.onChecked && this.props.onChecked(data)
    }
  }
  handelSelect() {
    if (!this.state.data.disabled) {
      let { data } = this.state
      // data.selected = !data.selected
      // this.setState({ data })
      this.props.onSelect && this.props.onSelect(data)
    }
  }
  handelExpand() {
    let data = this.state.data
    if (!data.disabled) {
      if (data.loading !== undefined && (!data.children || !data.children.length)) {
        data.loading = true
        this.setState({ data })
        this.props.onLoadData && this.props.onLoadData(data, children => {
          data.loading = false
          if (children && children.length) {
            data.children = children
            data.expand = !data.expand
            this.setState({ data })
          }
        })
      } else if (data.children && data.children.length) {
        data.expand = !data.expand
        this.setState({ data })
      }
      this.props.onExpand && this.props.onExpand(data)
    }
  }
  componentWillReceiveProps(props) {
    if (props.data != this.state.data) {
      this.setState({ data: props.data })
    }
  }
  render() {
    let { data } = this.state
    let { checkbox, onSelect, onChecked, onExpand, onLoadData } = this.props
    let renderNode = () => {
      if (data.children && data.children.length) {
        return data.children.map((item, index) => {
          item._pid = data._uid;
          item._uid = data._uid + '-' + index;
          return (<Collapse show={data.expand} key={index}>
            <TreeNode data={item}
              onSelect={onSelect}
              onChecked={onChecked}
              onExpand={onExpand}
              onLoadData={onLoadData}
              checkbox={checkbox} />
          </Collapse>)
        })
      }
    }
    return (
      <ul className={this.className("k-tree-children")} style={this.styles()}>
        <li>
          <span className={this.arrowClass()} onClick={this.handelExpand.bind(this)}>
            <i className={!data.loading ? 'k-ion-ios-arrow-forward' : 'k-ion-ios-sync k-load-loop'}></i>
          </span>
          {checkbox && <Checkbox disabled={data.disabled} checked={data.checked} onChange={this.handelCheck.bind(this)} indeterminate={data.indeterminate} />}
          {data.icon && <span><Icon type={data.icon} /></span>}
          <span className={this.titleClass()} onClick={this.handelSelect.bind(this)}>{data.title}</span>
          {renderNode()}
        </li>
      </ul>
    )
  }
}
TreeNode.defaultProps = {
  data: {}
}
TreeNode.propTypes = {
  data: PropTypes.object,
  checkbox: PropTypes.bool,
  // onSelect: PropTypes.fuc,
  // onChecked: PropTypes.fuc,
  // onExpand: PropTypes.fuc,
  // onLoadData: PropTypes.fuc,
}


