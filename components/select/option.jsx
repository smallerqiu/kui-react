import React from 'react'
import { Kui, PropTypes } from '../kui';
export default class Option extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      // selected: false,
      // index: 0,
      // visible: true
    }
  }
  itemClasses() {
    return this.className([
      "k-select-item",
      {
        ["k-select-item-selected"]: this.props.selected,
        ["k-select-item-disabled"]: this.props.disabled
      }
    ])
  }
  onSelect(e) {
    if(this.props.disabled) return
    this.props.onClick && this.props.onClick(e)
  }
  query(query) {
    // query 转义查询里面的正则
    let parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, "\\$1");
    this.visible = new RegExp(parsedQuery, "i").test(this.label);
  }
  render() {
    return (<li className={this.itemClasses()} onClick={this.onSelect.bind(this)}>
      {this.props.children || this.props.label}
    </li >)
  }
}

Option.defaultProps = {
  onClick: function () { }
}

Option.propTypes = {
  onClick: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  selected: PropTypes.bool
}

