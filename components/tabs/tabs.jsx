
import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
export default class Tabs extends Kui {
  static childContextTypes = {
    Tabs: PropTypes.any,
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

  componentDidUpdate(prevProps, prevState, snap) {
    let { activeKey, children } = this.props
    if (prevProps.activeKey != activeKey) {
      this.setState({ activeKey }, () => {
        this.updateIndex()
      })
    } else if (prevProps.children.length != children.length) {
      setTimeout(() => {
        this.resetNavPosition()
      }, 100);
    }
  }

  getChildContext() {
    return {
      Tabs: this,
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
    let { navOffsetLeft, currentIndex } = this.state
    const target = this.navRef.current.children[currentIndex]
    if (!target) return;
    // show active tab in client
    const pane = this.navscrollRef.current
    // let totalWidth = pane.offsetWidth
    let clientWidth = this.navboxRef.current.clientWidth
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
    this.setState({ navOffsetLeft })
    pane.style.transform = `translate3d(${navOffsetLeft}px,0,0)`
  }

  resetNavPosition() {
    // when one tab removed or append
    // this.$nextTick(e => {
    const pane = this.navscrollRef.current
    if (!pane) return;
    let totalWidth = pane.offsetWidth
    let clientWidth = this.navboxRef.current.clientWidth
    let { navOffsetLeft } = this.state
    if (clientWidth + navOffsetLeft < clientWidth) {
      navOffsetLeft = clientWidth - totalWidth
    }
    if (navOffsetLeft > 0) navOffsetLeft = 0


    const nextBtnDisabed = navOffsetLeft == clientWidth - totalWidth
    const prevBtnDisabed = navOffsetLeft == 0

    this.setState({ navOffsetLeft, nextBtnDisabed, prevBtnDisabed })

    pane.style.transform = `translate3d(${navOffsetLeft}px,0,0)`


    this.resetActivePostion()

    this.updateControlArrow()
    // })

  }

  scroll(direction) {
    //control left or right

    const pane = this.navscrollRef.current
    let totalWidth = pane.offsetWidth
    let clientWidth = this.navboxRef.current.clientWidth
    let { navOffsetLeft } = this.state
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
    const nextBtnDisabed = navOffsetLeft == clientWidth - totalWidth
    const prevBtnDisabed = navOffsetLeft == 0

    this.setState({ navOffsetLeft, nextBtnDisabed, prevBtnDisabed })

    pane.style.transform = `translate3d(${navOffsetLeft}px,0,0)`
  }

  tabClick(pane, currentIndex) {
    if (!pane.props.disabled) {
      let activeKey = pane.key
      let { onChange, onTabClick } = this.props
      onChange && onChange(activeKey)
      onTabClick && onTabClick(activeKey)
      this.setState({ activeKey, currentIndex }, () => {
        this.updateInkBarPosition()
      })
    }
  }

  updateIndex() {
    const currentIndex = this.props.children.map(pane => pane.key).indexOf(this.state.activeKey)
    this.setState({ currentIndex }, () => {
      this.resetNavPosition()
      this.updateInkBarPosition()
    })
  }
  // update bar
  updateInkBarPosition() {
    const { card, sample, animated } = this.props
    if (!card && !sample && animated) {
      const nav = this.navRef.current.children[this.state.currentIndex]
      if (nav) {
        const inkbar = this.inkbarRef.current
        inkbar.style.width = `${nav.offsetWidth}px`
        inkbar.style.transform = `translate3d(${nav.offsetLeft}px, 0px, 0px)`
      }
    }
  }

  updateControlArrow() {
    // update inkbar position
    // set pane has scroll arrow
    const navbox = this.navboxRef.current
    if (!navbox) return;
    const scrollable = navbox.scrollWidth > navbox.clientWidth
    this.setState({ scrollable })
  }

  renderNav() {
    return React.Children.map(this.props.children, (pane, index) => {
      const { icon, title, closable, disabled } = pane.props
      const prop = {
        key: pane.key,
        className: this.className(['k-tabs-tab', { ['k-tabs-tab-active']: pane.key == this.state.activeKey, ['k-tabs-tab-disabled']: disabled }]),
        onClick: () => this.tabClick(pane, index)
      }
      return <div {...prop}>
        {icon ? <Icon type={icon} /> : null}
        {title}
        {closable && this.props.card ? <Icon type="close" className="k-tabs-close" onClick={e => this.closeTab(pane.key, e)} /> : null}
      </div>
    })
  }

  render() {
    const { children, extra, card, animated, centered, sample, tabPanes } = this.props
    const { scrollable, nextBtnDisabed, prevBtnDisabed, currentIndex } = this.state
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
      paneStyle.marginLeft = `-${100 * currentIndex}%`
    }

    const navCls = ['k-tabs-nav-container', { ['k-tabs-nav-container-scroll']: scrollable }]
    const index = -1
    return (
      <div className={this.className(classes)} style={this.styles()}>
        <div className="k-tabs-bar">
          <div className={this.className(navCls)}>
            {scrollable ?
              <span key="btnprev" className={this.className(['k-tabs-tab-btn-prev', { 'k-tabs-tab-btn-prev-disabed': prevBtnDisabed }])}
                onClick={e => this.scroll('left')}><Icon type="chevron-back" /></span> : null}
            <div className="k-tabs-nav-wrap" ref={this.navboxRef}>
              <div className="k-tabs-nav" style={scrollStyle} ref={this.navscrollRef}>
                {!card && animated && !sample ? <div className="k-tabs-ink-bar" ref={this.inkbarRef} /> : null}
                <div className="k-tabs-nav-inner" ref={this.navRef}>{this.renderNav()}</div>
              </div>
            </div>
            {scrollable ?
              <span key="btnnext" className={this.className(['k-tabs-tab-btn-next', { 'k-tabs-tab-btn-next-disabed': nextBtnDisabed }])}
                onClick={e => this.scroll('right')}><Icon type="chevron-forward" /></span> : null}
          </div>
          {extra ? <div className="k-tabs-extra" ref={this.extraRef}>{extra}</div> : null}
        </div>
        <div className="k-tabs-content" style={paneStyle}>
          {
            React.Children.map(children, (child) => {
              const key = child.key || `pane_${index++}`
              return React.cloneElement(child, { eventKey: key, key })
            })
          }
        </div>
      </div>
    )
  }
}
