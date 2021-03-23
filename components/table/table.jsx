import React from 'react'
import { Kui, PropTypes } from '../kui'
import Checkbox from '../checkbox'
export default class Table extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      selectRow: [] //所有选择的数据
    }
  }
  classes() {
    return this.className([
      "k-table",
      {
        ["k-table-border"]: this.props.bordered,
        ["k-table-mini"]: this.props.mini
      }
    ])
  }
  styles() {
    return this.props.data.length == 0 ? { overflow: "hidden" } : {};
  }
  tdStyle(align) {
    let obj = {};
    if (align) obj["textAlign"] = "right";
    return obj;
  }
  onCheck(checked, item, index) {
    // let checked = item._checked;
    let { data, onSelection } = this.props

    data[index]._checked = checked;
    let row = data.filter(item => item._checked == true);
    this.setState({ data: data, selectRow: row, checked: row.length == data.length })
    onSelection && onSelection(row, item)
  }
  onCheckAll(checked) {
    let { data, onSelection } = this.props

    data.forEach(item => (item._checked = checked));
    let row = checked ? JSON.parse(JSON.stringify(data)) : [];
    this.setState({ data: data, selectRow: row, checked: checked })
    onSelection && onSelection(row)
  }
  render() {
    let { columns, data, noDataText } = this.props
    let renderCol = () => {
      return columns.map((item, i) => {
        return (<th key={i}>
          {
            item.type == 'selection' ? <label htmlFor="k-checkbox-all">
              <Checkbox onChange={(e) => this.onCheckAll(e)} checked={this.state.checked}>全选</Checkbox>
            </label> :
              item.title
          }
        </th>)
      })
    }
    let renderTdContent = (item, col, m) => {
      if (col.type == 'selection') return <Checkbox checked={item._checked || false} onChange={(e) => this.onCheck(e, item, m)}></Checkbox>

      if (col.type == 'html') return <div>{item[col.key]}</div>

      if (col.render) return col.render(item,m)

      let wStyle = col.width > 0 ? { width: `${col.width}px;` } : {}
      return <div style={wStyle}>{item[col.key]}</div>
    }
    let renderTd = (item, m) => {

      return columns.map((col, i) => {
        return (<td key={i} style={this.tdStyle(col.textAlign)}>
          {renderTdContent(item, col, m)}
        </td>)
      })
    }

    let renderData = () => {
      return data.map((item, i) => {
        return (<tr key={i}>
          {renderTd(item, i)}
        </tr>)
      })
    }

    return (<div className={this.classes()} style={this.styles(this.styles())} ref="table">
      <table>
        <thead>
          <tr>
            {renderCol()}
          </tr>
        </thead>
        <tbody>
          {renderData()}
        </tbody>
      </table>
      {!data || data.length == 0 && <div className="no-data">{noDataText}</div>}
    </div>)
  }
}

Table.defaultProps = {
  noDataText: '暂无数据...',
  data: [],
  columns: []
}

Table.propTypes = {
  bordered: PropTypes.bool,
  mini: PropTypes.bool,
  noDataText: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array, // 表格类目
  // onselect: { type: Function, default:function(){} }, //单个选中触发
  // onselectAll: { type: Function, default:function(){} }, //所有选中触发
  onSelection: PropTypes.func  //选中的时候触发,
}