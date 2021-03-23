import React from 'react'
import { Kui, PropTypes } from '@/components/kui'
import { Input, Button, Select, Icon } from '../index'
export default class Page extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      elevator: 0,
      pageCount: 0,
      page: 0,
      current: 1,
      total: props.total,
      showPrevMore: false,
      showNextMore: false,
      pageSize: props.pageSize,
      pagers: []
    }
  }
  setPagers() {
    const pagerCount = 7;
    const page = Number(this.state.page);
    const pageCount = Number(this.state.pageCount);
    let showPrevMore = false;
    let showNextMore = false;
    if (pageCount > pagerCount) {
      if (page > pagerCount - 3) {
        showPrevMore = true;
      }
      if (page < pageCount - 3) {
        showNextMore = true;
      }
    }
    const pagers = [];
    if (showPrevMore && !showNextMore) {
      const startPage = pageCount - (pagerCount - 2);
      for (let i = startPage; i < pageCount; i++) {
        pagers.push(i);
      }
    } else if (!showPrevMore && showNextMore) {
      for (let i = 2; i < pagerCount; i++) {
        pagers.push(i);
      }
    } else if (showPrevMore && showNextMore) {
      const offset = Math.floor(pagerCount / 2) - 1;
      for (let i = page - offset; i <= page + offset; i++) {
        pagers.push(i);
      }
    } else {
      for (let i = 2; i < pageCount; i++) {
        pagers.push(i);
      }
    }
    this.setState({ showPrevMore, showNextMore, pagers })
    // return array;
  }
  classes() {
    return this.className(["k-page", { ["k-page-mini"]: this.props.mini }])
  }
  changeSize(value) {
    let { page, pageSize, pageCount, total } = this.state
    this.setState({
      pageSize: value,
      pageCount: Math.ceil(total / value) || 1,
      page: page > pageCount ? pageCount : page
    }, () => this.setPagers())
    this.props.onPageSizeChange && this.props.onPageSizeChange(value)
  }
  goPage() {
    let { page, elevator, pageCount } = this.state

    if (elevator >= 1 && elevator < pageCount) {
      if (!elevator || page < 0) return;
      this.setState({ page: elevator }, () => this.setPagers())
    }
  }
  toPage(page) {
    if (page != this.state.page) {
      this.setState({ page }, () => this.setPagers())
      this.props.onChange && this.props.onChange(page)
    }
  }
  prePage() {
    let { page } = this.state
    page = parseInt(page)
    if (page > 1) {
      this.setState({ page: page - 1, elevator: page - 1 }, () => this.setPagers());
      this.props.onChange && this.props.onChange(page - 1)
    }
  }
  nextPage() {
    let { page, pageCount } = this.state;
    page = parseInt(page)
    if (page < pageCount) {
      this.setState({ page: page + 1, elevator: page + 1 }, () => this.setPagers())
      this.props.onChange && this.props.onChange(page + 1)
    }
  }

  // componentWillMount() {
  //   this.initPage()
  // }
  initPage() {
    let { total, current, pageSize } = this.state;
    let pageCount = Math.ceil(total / pageSize) || 1;
    this.setState({
      pageCount: pageCount,
      elevator: current,
      page: current,
      groupCount: Math.ceil(pageCount / 5),
    }, () => this.setPagers())
  }
  // componentWillMount = () => {

  // }
  componentWillReceiveProps(props) {
    if (props.pageSize != this.state.pageSize) {
      this.setState({ pageSize: props.pageSize })
    }
    if (props.total != this.props.total || this.props.current != props.current) {
      this.setState({
        total: props.total,
        current: props.current,
      }, () => this.initPage())
    }
  }
  render() {
    let { mini, showSizer, sizeData, showTotal, showElevator } = this.props;
    let { elevator, pageSize, pageCount, showNextMore, showPrevMore, pagers, page } = this.state;
    let renderPager = () => {
      let pages = []
      for (let pager of pagers) {
        pages.push(<li key={pager} className={this.className(['k-pager-item', { ['active']: page == pager }])} onClick={this.toPage.bind(this, pager)}><span >{pager}</span></li>)
      }
      return pages
    }
    return (<div className={this.className()} style={this.styles()}>
      <div className={this.classes()}>
        <ul className="k-pager">
          <li className="k-pager-item" onClick={this.prePage.bind(this)}><span><Icon type="ios-arrow-back" /></span></li>
          {pageCount > 0 && <li className={this.className(['k-pager-item', { ['active']: page == 1 }])} onClick={this.toPage.bind(this, 1)}><span >1</span></li>}
          {showPrevMore && <li className="k-pager-item k-pager-more"><span ><Icon type="ios-more" /></span></li>}
          {renderPager()}
          {showNextMore && <li className="k-pager-item k-pager-more"><span ><Icon type="ios-more" /></span></li>}
          {pageCount > 1 && <li className={this.className(['k-pager-item', { ['active']: page == pageCount }])} onClick={this.toPage.bind(this, pageCount)}><span >{pageCount}</span></li>}
          <li className="k-pager-item" onClick={this.nextPage.bind(this)}><span><Icon type="ios-arrow-forward" /></span></li>
        </ul >
        {
          showSizer && <div className="k-page-sizer" >
            <Select mini={mini} value={pageSize} onChange={this.changeSize.bind(this)}>
              {
                sizeData.map((p) => {
                  return <Select.Option key={p} value={p}>{p}条/页</Select.Option>
                })
              }
            </Select>
          </div>
        }
        {showTotal && <div className="k-page-number" >
          <span>共{pageCount}页</span>
        </div >}
        {showElevator && <div className="k-page-options">
          <span>跳至</span>
          <Input value={elevator} mini={mini} className="k-page-options-elevator" onChange={(e) => this.setState({ elevator: parseInt(e.target.value) })} />
          <span>页</span>
          <Button mini={mini} className="k-page-options-action" onClick={this.goPage.bind(this)}>确定</Button>
        </div>}
      </div >
    </div >)
  }
}
Page.defaultProps = {
  sizeData: [10, 15, 20, 30, 40],
  total: 0,
  pageSize: 30,
  current: 1
}
Page.propTypes = {
  onPageSizeChange: PropTypes.func,
  showSizer: PropTypes.bool,
  showTotal: PropTypes.bool,
  showElevator: PropTypes.bool,
  sizeData: PropTypes.array,
  mini: PropTypes.bool,
  total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  current: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}