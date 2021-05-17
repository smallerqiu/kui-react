
import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
import TabPane from './tabPane'
export default class Tabs extends Kui {
  static childContextTypes = {
    Tabs: PropTypes.any,
    collectTabPanes: PropTypes.func
  }
  static defaultProps = {
    animated: true
  }
  static propTypes = {
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    card: PropTypes.bool,
    closable: PropTypes.bool,
    sample: PropTypes.bool,
    animated: PropTypes.bool,
    extra: PropTypes.any,
    onClose: PropTypes.func,
  }
  state = {
    tabPanes: [],
    activeKey: this.props.activeKey,
    currentIndex: -1,
    scrollable: false,
    navOffsetLeft: 0,
    prevBtnDisabed: false,
    nextBtnDisabed: false,
  }

  navscrollRef = React.createRef()
  extraRef = React.createRef()
  navboxRef = React.createRef()
  navRef = React.createRef()
  inkbarRef = React.createRef()

  componentDidUpdate(prevProps, prevStat, snap) {
    let { activeKey } = this.props
    if (prevProps.activeKey != activeKey) {
      this.setState({ activeKey })
      this.updateIndex()
    }
  }

  getChildContext() {
    return {
      Tabs: this,
      collectTabPanes: (context, type) => {
        let { tabPanes } = this.state
        type === 'delete' ? tabPanes.splice(tabPanes.indexOf(context), 1) : tabPanes.push(context)
        this.setState({ tabPanes }, () => {
          this.resetNavPosition()
          this.updateNav()
        })
      }
    }
  }

  componentDidMount() {
    this.resetNavPosition = this.resetNavPosition.bind(this)
    window.addEventListener('resize', this.resetNavPosition)
    this.updateIndex()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resetNavPosition)
  }

  closeTab(key, e) {
    this.props.onTabClose && this.props.onTabClose(key)
    e.stopPropagation()
    // e.preventDefault();
  }

  resetActivePostion() {
    const target = this.navRef.current.children[this.currentIndex]
    if (!target) return;
    // show active tab in client
    const pane = this.navscrollRef.current
    // let totalWidth = pane.offsetWidth
    let clientWidth = this.navboxRef.current.clientWidth
    let { navOffsetLeft } = this
    let { offsetLeft, offsetWidth } = target



    // min left 
    if (navOffsetLeft + offsetLeft < 0) {
      navOffsetLeft = -offsetLeft
    }
    //max right
    else if (clientWidth - navOffsetLeft < offsetLeft + offsetWidth) { //outside 

      // let marginRight = window.getComputedStyle(target).marginRight
      // marginRight = parseFloat(marginRight)

      navOffsetLeft -= offsetLeft + offsetWidth + navOffsetLeft - clientWidth + 2 //marginRight
    }
    this.navOffsetLeft = navOffsetLeft
    pane.style.transform = `translate3d(${navOffsetLeft}px,0,0)`
  }

  resetNavPosition() {
    // when one tab removed or append
    // this.$nextTick(e => {
    const pane = this.navscrollRef.current
    if (!pane) return;
    let totalWidth = pane.offsetWidth
    let clientWidth = this.navboxRef.current.clientWidth
    let { navOffsetLeft } = this
    if (clientWidth + navOffsetLeft < clientWidth) {
      navOffsetLeft = clientWidth - totalWidth
    }
    if (navOffsetLeft > 0) navOffsetLeft = 0
    this.navOffsetLeft = navOffsetLeft


    this.nextBtnDisabed = navOffsetLeft == clientWidth - totalWidth
    this.prevBtnDisabed = navOffsetLeft == 0

    pane.style.transform = `translate3d(${navOffsetLeft}px,0,0)`


    this.resetActivePostion()

    this.updateNav()
    // })

  }

  scroll(direction) {
    //control left or right

    const pane = this.navscrollRef.current
    let totalWidth = pane.offsetWidth
    let clientWidth = this.navboxRef.current.clientWidth
    let { navOffsetLeft } = this
    // console.log(totalWidth, clientWidth)
    if (direction == 'right') {
      const endWidth = totalWidth - clientWidth + navOffsetLeft
      if (endWidth > clientWidth) {
        navOffsetLeft -= clientWidth
      } else if (endWidth > 0) {
        navOffsetLeft -= endWidth
      }
    } else {
      if (navOffsetLeft < -clientWidth) {
        navOffsetLeft += clientWidth
      } else if (navOffsetLeft < 0) {
        navOffsetLeft = 0
      }
    }
    this.nextBtnDisabed = navOffsetLeft == clientWidth - totalWidth
    this.prevBtnDisabed = navOffsetLeft == 0

    this.navOffsetLeft = navOffsetLeft
    pane.style.transform = `translate3d(${navOffsetLeft}px,0,0)`
  }

  tabClick(pane, index) {
    if (!pane.disabled) {
      let key = pane.key
      let { onChange, onTabClick } = this.props

      this.$emit('input', key)
      this.$emit('change', key)
      this.$emit('tab-click', key)
      this.activeKey = key
      this.currentIndex = index
    }
  }

  updateIndex() {
    // this.$nextTick(e => {
    const { tabPanes } = this.state
    const currentTab = tabPanes.filter(tab => tab.key == this.props.activeKey)[0] || {}
    this.currentIndex = tabPanes.indexOf(currentTab)
    setTimeout(e => {
      this.resetActivePostion()
      this.updateInkBarPosition()
    }, 100)
    // })
  }

  updateInkBarPosition() {
    if (!this.card && !this.sample && this.animated) {
      const nav = this.navRef.current.children[this.currentIndex]
      if (nav) {
        const inkbar = this.$refs.inkbar
        inkbar.style.width = `${nav.offsetWidth}px`
        inkbar.style.transform = `translate3d(${nav.offsetLeft}px, 0px, 0px)`
      }
    }
  }

  updateNav() {
    // this.$nextTick(e => {
    // update inkbar position

    // set pane has scroll arrow
    const navbox = this.navboxRef.current
    if (!navbox) return;
    this.scrollable = navbox.scrollWidth > navbox.clientWidth
    // })
  }

  renderNav() {
    return this.state.tabPanes.map((pane, index) => {
      const { icon, title, closable,disabled } = pane.props
      const prop = {
        key: pane.key,
        className: this.className(['k-tabs-tab', { ['k-tabs-tab-active']: pane.key == this.props.activeKey, ['k-tabs-tab-disabled']: disabled }]),
        onClick: () => this.tabClick(pane, index)
      }
      return <div {...prop}>
        {icon ? <Icon type={icon} /> : null}
        {title}
        {closable && this.card ? <Icon type="close" className="k-tabs-close" onClick={e => this.closeTab(pane.$vnode.key, e)} /> : null}
      </div>
    })
  }

  render() {
    const { children, extra, card, animated, centered, sample, tabPanes } = this.props
    const { scrollable, nextBtnDisabed, prevBtnDisabed } = this.state
    const classes = [
      "k-tabs",
      {
        ["k-tabs-animated"]: animated && !card && !sample,
        ["k-tabs-card"]: card && !sample,
        ["k-tabs-sample"]: sample && !card,
        ["k-tabs-centered"]: centered
      }
    ];

    let scrollStyle = {}, paneStyle = {};


    if (animated && !card && !sample) {
      paneStyle.marginLeft = `-${100 * this.currentIndex}%`
    }

    const navCls = ['k-tabs-nav-container', { ['k-tabs-nav-container-scroll']: scrollable }]
    return (
      <div className={this.className(classes)}>
        <div className="k-tabs-bar">
          {extra ? <div className="k-tabs-extra" ref={this.extraRef}>{extra}</div> : null}
          <div className={this.className(navCls)}>
            {scrollable ? [<span className={this.className(['k-tabs-tab-btn-prev', { 'k-tabs-tab-btn-prev-disabed': prevBtnDisabed }])}
              onClick={e => this.scroll('left')}><Icon type="chevron-back" /></span>,
            <span className={this.className(['k-tabs-tab-btn-next', { 'k-tabs-tab-btn-next-disabed': nextBtnDisabed }])}
              onClick={e => this.scroll('right')}><Icon type="chevron-forward" /></span>] : null}
            <div className="k-tabs-nav-wrap" ref={this.navboxRef}>
              <div className="k-tabs-nav" style={scrollStyle} ref={this.navscrollRef}>
                {!card && animated && !sample ? <div className="k-tabs-ink-bar" ref={this.inkbarRef} /> : null}
                <div className="k-tabs-nav-inner" ref={this.navRef}>{this.renderNav()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="k-tabs-content" style={paneStyle}>
          {
            React.Children.map(children, (child) => {
              return React.cloneElement(child, { eventKey: child.key })
            })
          }
        </div>
      </div>
    )
  }
}
