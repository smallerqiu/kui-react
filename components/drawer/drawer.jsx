import Button from "../button";
import Icon from "../icon";
import transfer from "../_tool/transfer";
import { measureScrollBar } from '../_tool/utils'
import { Kui, PropTypes } from '../kui'
import React from 'react'

let cacheBodyOverflow = {};

export default class Drawer extends Kui {
  static propTypes = {
    value: PropTypes.bool,
    title: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    placement: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
    closable: PropTypes.bool,
    footer: PropTypes.bool,
    maskClosable: PropTypes.bool,
  }

  static defaultProps = {
    title: 'Title',
    width: 520,
    height: 256,
    okText: '确定',
    cancelText: '取消',
    placement: 'right',
    closable: true,
    maskClosable: true,
  }
  // name: "Drawer",
  // directives: { transfer },
  // props: {

  // },
  // watch: {
  //   value(v) {
  //     this.init = true
  //     this.$nextTick(e => {
  //       this.visible = v
  //       this.resetBodyStyle(v)
  //     })
  //   },
  // },
  state = {
    visible: this.value,
    init: false
  }
  beforDestory() {
    this.resetBodyStyle(false)
  }
  ok() {
    this.$emit("ok");
  }
  onKeyUp(e) {
    if (this.visible) {
      if (e.keyCode == 27) this.close();
    }
  }
  cancel() {
    this.$emit("cancel");
    this.close();
  }
  close() {
    this.visible = false;
    this.$emit("input", false);
    this.$emit("close");
  }
  maskToClose() {
    if (this.maskClosable) {
      this.close()
    }
  }
  resetBodyStyle(opened) {
    if (!this.visible && !cacheBodyOverflow.hasOwnProperty('overflow')) {
      cacheBodyOverflow = {
        width: document.body.width,
        overflow: document.body.overflow,
        overflowX: document.body.overflowX,
        overflowY: document.body.overflowY,
      }
    }
    if (opened) {
      let barWidth = measureScrollBar(true)
      if (barWidth) {
        document.body.style.width = `calc(100% - ${barWidth}px)`
        document.body.style.overflow = `hidden`
      }
    } else {
      setTimeout(() => {
        Object.keys(cacheBodyOverflow).forEach(key => {
          document.body.style[key] = cacheBodyOverflow[key] || ''
          delete cacheBodyOverflow[key]
        })
      }, 300)
    }
  }
  render() {
    const { title, visible, cancelText, okText, ok,
      placement, cancel, $slots,
      closable, close, } = this
    const hasFooter = this.footer || $slots.footer
    const canelBtn = <Button onClick={cancel}>{cancelText}</Button>
    const okBtn = <Button type="primary" onClick={ok}>{okText}</Button>
    const footNode = (
      hasFooter ? <div className="k-drawer-footer">
        {$slots.footer}
        {!$slots.footer && canelBtn}
        {!$slots.footer && okBtn}
      </div> : null
    )
    const closeNode = closable
      ? <span className="k-drawer-close" onClick={close}><Icon type="close" /></span>
      : null
    const transitionName = `k-drawer-${placement}`

    const classes = ['k-drawer', `k-drawer-${placement}`,
      { 'k-drawer-open': visible },
      { 'k-drawer-has-footer': hasFooter },
    ]
    let styles = {}
    if (placement == 'left' || placement == 'right') styles.width = this.width + 'px'
    if (placement == 'top' || placement == 'bottom') styles.height = this.height + 'px'
    // const wrapCls =
    return (
      this.init ? <div className={classes} v-transfer={true}>
        <transition name="fade">
          <div className="k-drawer-mask" ref="mask" v-show={visible} onClick={this.maskToClose}></div>
        </transition>
        <transition name={transitionName}>
          <div className="k-drawer-box" ref="drawer" v-show={visible} style={styles}>
            <div className="k-drawer-content">
              {closeNode}
              <div className="k-drawer-header"><div className="k-drawer-header-inner">{title}</div></div>
              <div className="k-drawer-body">
                {$slots.default}
              </div>
              {footNode}
            </div>
          </div>
        </transition>
      </div> : ''
    )
  }
};
