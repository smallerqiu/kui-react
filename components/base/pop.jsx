import React from 'react'
import Button from "../button";
import Icon from "../icon";
import Drop from './drop'
import PropTypes from 'prop-types'

export default class BasePop extends React.Component {
  // export default {
  state = {
    showPop: this.props.show,
    showInit: false,
    timer: null,
  }
  overlayRef = React.createRef()
  // watch: {
  //   value(show) {
  //     this.showPop = show
  //   }
  // },
  ok() {
    this.setState({ showPop: false })
    this.props.onOk && this.props.onOk()
  }
  cancel() {
    this.setState({ showPop: false })
    this.props.onCancel && this.props.onCancel()
  }
  setPopShow() {
    // if (!this.showInit) {
    this.setState({ showInit: true })
    setTimeout(() => {
      this.setState({ showPop: true })
      this.props.onOpen && this.props.onOpen()
    }, 300);
  }
  mouseEnter(e) {
    clearTimeout(this.timer)
    let { trigger, confirm } = this.props
    let { showPop } = this.state
    if (trigger == "hover" && !confirm && !showPop) {
      this.setPopShow()
    }
  }
  mouseLeave(e) {
    let { trigger, confirm } = this.props
    let { showPop } = this.state

    if (trigger == 'hover' &&
      !confirm &&
      showPop
    ) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setState({ showPop: false })
      }, 200);
    }
  }
  mouseEvent(e) {
    let { trigger, confirm } = this.props
    let { showInit } = this.state
    if (trigger == 'contextmenu') {
      if (e.which == 3) {
        if (!showInit) {
          showInit = true
          this.$nextTick(() => {
            this.showPop = true
            this.$emit('input', true)
            this.$nextTick(() => {
              this.$refs.overlay.baseContextmenu(e)
            })
          })
        } else {
          this.showPop = true
          this.$emit('input', true)
          this.$nextTick(() => {
            this.$refs.overlay.baseContextmenu(e)
          })
        }
      } else {
        this.showPop = false
      }
      e.preventDefault();
      return false;
    }
    if (trigger == "click" || confirm) {
      this.setPopShow()
    }
  }
  renderPopup() {
    let { placement, title, preCls, content, confirm, transfer, width, trigger, children,
      showPlacementArrow, cancelText, okText } = this.props, childNode;

    if (showPlacementArrow) {
      let titleNode, contentNode, footerNode;
      if (confirm) {
        contentNode = [<Icon type="help-circle" key="icon" />, <div key="title" className={`k-${preCls}-title`}>{title}</div>]

        footerNode = <div key="footer" className={`k-${preCls}-footer`}>
          <Button size="small" onClick={this.cancel}>{cancelText}</Button>
          <Button type="primary" size="small" onClick={this.ok}>{okText}</Button>
        </div>
      } else {
        titleNode = title ? <div key="title" className={`k-${preCls}-title`}>{title}</div> : ''
        contentNode = content
      }
      contentNode = contentNode ? <div key="content" className={`k-${preCls}-inner-content`}>{contentNode}</div> : null;

      childNode = [<div className={`k-${preCls}-arrow`} key="arrow"></div>,
      <div className={`k-${preCls}-inner`} key="inner">{[titleNode, contentNode, footerNode]}</div>]

    } else {
      childNode = content
    }

    const overlayRef = React.createRef()
    childNode = React.cloneElement(childNode, { ref: overlayRef })

    let { showPop, showInit } = this.state
    const props = {
      selectionRef: children.ref,
      key: 'drop',
      transfer,
      show: showPop,
      className: `k-${preCls}-content`,
      width,
      placement,
      unmountOnExit: showInit,
      showInit: showInit,
      trigger,
      transitionName: `k-${preCls}`,
      onMouseEnter: e => {
        if (overlayRef.current.contains(e.target)) {
          clearTimeout(this.timer)
        }
      },
      onMouseLeave: e => {
        let { trigger } = this.props
        if (trigger == 'hover') {
          this.setState({ showPop: false })
        }
      },
      onHide: () => {
        this.setState({ showPop: false })
      }
      // input: (e) => {
      //   this.showPop = e

      //   if (hasProp(this, 'value')) {
      //     console.log(e)
      //     this.$emit('input', e);
      //   }
      // }
    }
    return showInit ? <Drop {...props}>{childNode}</Drop> : null
  }
  render() {
    let { children } = this.props
    let popup = this.renderPopup()
    const props = {
      onContextMenu: e => this.mouseEvent(e),
      onMouseEnter: e => this.mouseEnter(e),
      onMouseLeave: e => this.mouseLeave(e),
      onClick: e => this.mouseEvent(e),
    }
    return React.cloneElement(children, props, [...children.props.children, popup])

  }
}

BasePop.defaultProps = {
  trigger: 'hover',
  showPlacementArrow: true,
  placement: 'top',
  okText: '确定',
  cancelText: '取消',
}

BasePop.propTypes = {
  preCls: PropTypes.string,
  trigger: PropTypes.string,
  confirm: PropTypes.bool,
  dark: PropTypes.bool,
  transfer: PropTypes.bool,
  show: PropTypes.bool,
  title: PropTypes.any,
  content: PropTypes.any,
  showPlacementArrow: PropTypes.bool,
  width: PropTypes.number,
  placement: PropTypes.oneOf(["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "left-bottom", "left-top", "right", "right-top", "right-bottom"]),
  okText: PropTypes.string,
  cancelText: PropTypes.string,
}