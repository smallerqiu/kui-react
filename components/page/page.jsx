import React from 'react'
import { Kui, PropTypes } from '@/components/kui'
import { Input } from '../input'
import Icon from '../icon'
import Select from '../select'

export default class Page extends Kui {
  static defaultProps = {
    sizeData: [10, 15, 20, 30, 40],
    total: 0,
    pageSize: 10,
    size: 'default',
    current: 1
  }
  static propTypes = {
    onPageSizeChange: PropTypes.func,
    onChange: PropTypes.func,
    showSizer: PropTypes.bool,
    showTotal: PropTypes.bool,
    showElevator: PropTypes.bool,
    sizeData: PropTypes.array,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    total: PropTypes.number,
    pageSize: PropTypes.number,
    current: PropTypes.number,
  }

  state = {
    pageCount: 0,
    page: this.props.current,
    defaultPageSize: this.props.pageSize
  }

  componentDidMount() {
    this.setState({
      pageCount: Math.ceil(this.props.total / this.state.defaultPageSize) || 1
    })
  }

  renderPage() {
    const groupCount = 7,
      page = Number(this.state.page),
      pageCount = Number(this.state.pageCount);
    let showPrevMore = false;
    let showNextMore = false;
    if (pageCount > groupCount) {
      if (page > groupCount - 3) { showPrevMore = true; }
      if (page < pageCount - 3) { showNextMore = true; }
    }
    const array = [];
    if (showPrevMore && !showNextMore) {
      const startPage = pageCount - (groupCount - 2);
      for (let i = startPage; i < pageCount; i++) {
        array.push(i);
      }
    } else if (!showPrevMore && showNextMore) {
      for (let i = 2; i < groupCount; i++) {
        array.push(i);
      }
    } else if (showPrevMore && showNextMore) {
      const offset = Math.floor(groupCount / 2) - 1;
      for (let i = page - offset; i <= page + offset; i++) {
        array.push(i);
      }
    } else {
      for (let i = 2; i < pageCount; i++) {
        array.push(i);
      }
    }
    let child = array.map((p, i) => {
      let prop = {
        className: this.className(['k-pager-item', { active: page == p }]),
        key: i,
        onClick: () => this.toPage(p)
      }
      return <li {...prop} key={i}><span>{p}</span></li>
    })
    const moreNode = (key) => <li key={key} className="k-pager-item k-pager-more"><Icon type="ellipsis-horizontal" /></li>;

    if (showPrevMore) {
      child.unshift(moreNode('fmore'))
    }
    if (showNextMore) {
      child.push(moreNode('lmore'))
    }
    return child
  }
  prePage() {
    let { page } = this.state
    if (page > 1) {
      page--
      this.setState({ page })
      this.props.onChange && this.props.onChange(page)
    }
  }
  nextPage() {
    let { pageCount, page } = this.state;
    if (page < pageCount) {
      page++;
      this.setState({ page })
      this.props.onChange && this.props.onChange(page)
    }
  }
  toPage(page) {
    this.setState({ page })
    this.props.onChange && this.props.onChange(page)
  }
  changeSize({ value }) {
    // console.log(value)
    let { total, onPageSizeChange } = this.props
    let defaultPageSize = value,
      pageCount = Math.ceil(total / this.state.defaultPageSize) || 1;
    this.setState({ defaultPageSize, pageCount })
    onPageSizeChange && onPageSizeChange(value)
  }
  renderFirst() {
    let { pageCount, page } = this.state
    if (pageCount > 0) {
      return <li key="first" className={this.className(["k-pager-item", { 'active': page == 1 }])} onClick={() => this.toPage(1)} >
        <span>1</span>
      </li>
    }
    return null
  }
  renderLast() {
    let { pageCount, page } = this.state
    if (pageCount > 1) {
      return <li key="last" className={this.className(['k-pager-item', { 'active': page == pageCount }])} onClick={() => this.toPage(pageCount)} >
        <span>{pageCount}</span>
      </li>
    }
    return null
  }
  renderSize() {
    let { defaultPageSize, page } = this.state
    let { size, sizeData, showSizer } = this.prop
    let prop = {
      value: defaultPageSize,
      size,
      options: sizeData.map(s => {
        return { value: s, label: `${s}条/页` }
      }),
      on: {
        input: e => defaultPageSize = e,
        change: this.changeSize
      }
    }
    return (showSizer ? <div className="k-page-sizer"><Select {...prop} /></div > : null)
  }
  renderElvator() {
    let { size, onChange, showElevator } = this.props
    let { page } = this.state
    let prop = {
      className: 'k-page-options-elevator',
      size, value: page,
      onBlur: e => {
        let page = e.target.value;
        let { pageCount } = this.state
        if (page > pageCount) page = pageCount
        if (page < 1) page = 1

        if ((page >= 1 || page <= pageCount) && this.props.page != page) {
          this.setState({ page })
          onChange && onChange(page)
        }
        // change: e => this.page = e
      }
    }
    return (
      showElevator ?
        <div className="k-page-options" key="elevator">
          <span>跳至</span><Input {...prop} /><span>页</span>
        </div> : null
    )
  }

  render() {
    let { size, total, showTotal } = this.props
    let { page, pageCount } = this.state
    const classes = ["k-page", { ["k-page-sm"]: size == 'small' }],
      preNode = <li key="prev" className={this.className(['k-pager-item', { 'k-pager-item-disabled': page == 1 }])} onClick={() => this.prePage()}><Icon type="chevron-back" /></li>,
      nextNode = <li key="next" className={this.className(['k-pager-item', { 'k-pager-item-disabled': page == pageCount }])} onClick={() => this.nextPage()}><Icon type="chevron-forward" /></li>,
      totalNode = (showTotal ? <div key="total" className="k-page-number"><span>共{total}条</span></div> : null),
      pagerNode = this.renderPage(),
      sizeNode = [],// this.renderSize(),
      elvatorNode = this.renderElvator(),
      firstNode = this.renderFirst(),
      lastNode = this.renderLast()
    return (
      <div className={this.className(classes)}>
        <ul className="k-pager">
          {[preNode, firstNode, pagerNode, lastNode, nextNode, sizeNode, totalNode, elvatorNode]}
        </ul>
      </div>
    )
  }
}
