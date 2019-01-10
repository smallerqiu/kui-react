import React from 'react'
import { Kui, PropTypes } from '../kui'
import { Transition, Transfer, Button } from '@/index'
import Picker from './picker'
export default class ColorPicker extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      left: -1,
      fadeInBottom: false,
      top: 0,
      // 面板打开状态
      visible: false,
      showMore: false,
      // 鼠标经过的颜色块
      hoveColor: null,
      // 主题颜色
      primaryColor: [
        "#000", "#fff", "#eeece1", "#1e497b", "#4e81bb", "#e2534d", "#9aba60", "#8165a0", "#47acc5", "#f9974c"
      ],
      // 颜色面板
      colorConfig: [
        ["#7f7f7f", "#f2f2f2"], ["#0d0d0d", "#808080"],
        ["#1c1a10", "#ddd8c3"], ["#0e243d", "#c6d9f0"],
        ["#233f5e", "#dae5f0"], ["#632623", "#f2dbdb"],
        ["#4d602c", "#eaf1de"], ["#3f3150", "#e6e0ec"],
        ["#1e5867", "#d9eef3"], ["#99490f", "#fee9da"]
      ],
      // 标准颜色
      baseColor: ["#c21401", "#ff1e02", "#ffc12a", "#ffff3a", "#90cf5b", "#00af57", "#00afee", "#0071be", "#00215f", "#72349d"
      ],
      showColor: props.value
    }
    this.domRef = React.createRef();
    this.relRef = React.createRef()
  }
  popupStyle() {
    let style = {};
    let { left, top } = this.state
    style.left = `${left}px`;
    style.top = `${top}px`;
    if (this.fadeInBottom) {
      style.transformOrigin = "center bottom 0px";
    }
    return style;
  }
  classes() {
    return this.className([
      "k-colorPicker",
      {
        ["k-colorPicker-open"]: this.state.visible
      }
    ])
  }

  // 颜色面板
  colorPanel() {
    let colorArr = [];
    for (let color of this.state.colorConfig) {
      colorArr.push(this.gradient(color[1], color[0], 5));
    }
    return colorArr;
  }
  toggleDrop() {
    if (!this.props.disabled) {
      this.setState({ visible: !this.state.visible })
      setTimeout(() => this.setPosition());
    }
  }
  setPosition() {
    if (!this.state.visible) return;
    let m = 3;
    let rel = this.relRef.current;
    let dom = this.domRef.current;
    let relPos = rel.getBoundingClientRect()


    let clientH = window.innerHeight;
    let clientW = window.innerWidth;
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

    let domH = dom.offsetHeight;
    let relH = rel.offsetHeight;

    //set
    let left = 5
    let top = 0
    let fadeInBottom = false

    if (this.props.transfer) left = relPos.left + 1 + scrollLeft;
    //new
    if (clientH - relPos.top - relH - m < domH) {
      //空出来的高度不足以放下dom
      fadeInBottom = true;
      top = this.props.transfer ? relPos.top - m - domH + scrollTop : -(domH + m);
    } else {
      fadeInBottom = false;
      top = this.props.transfer ? relPos.top + relH + m + scrollTop : relH + m;
    }
    let dropdownWith = rel.offsetWidth;
    this.setState({
      left, top, fadeInBottom, dropdownWith
    })
  }
  onClose() {
    let { showColor, visible, showMore } = this.state
    visible = !visible
    showMore = false
    this.setState({ showColor, visible, showMore })
    this.props.onChange && this.props.onChange(showColor)
    this.props.onFormItemChange && this.props.onFormItemChange(showColor)
  }
  // 更新组件的值 value
  updataValue(value) {
    let { showColor } = this.state
    if (value != showColor) {
      this.setState({ showColor: value })
    }
  }
  // 格式化 hex 颜色值
  parseColor(hexStr) {
    if (hexStr.length === 4) {
      hexStr = "#" + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + hexStr[3] + hexStr[3];
    } else {
      return hexStr;
    }
  }
  // RGB 颜色 转 HEX 颜色
  rgbToHex(r, g, b) {
    let hex = ((r << 16) | (g << 8) | b).toString(16);
    return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
  }
  // HEX 转 RGB 颜色
  hexToRgb(hex) {
    hex = this.parseColor(hex);
    let rgb = [];
    for (let i = 1; i < 7; i += 2) {
      rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
    }
    return rgb;
  }
  // 计算渐变过渡颜色
  gradient(startColor, endColor, step) {
    // 讲 hex 转换为 rgb
    let sColor = this.hexToRgb(startColor);
    let eColor = this.hexToRgb(endColor);
    // 计算R\G\B每一步的差值
    let rStep = (eColor[0] - sColor[0]) / step;
    let gStep = (eColor[1] - sColor[1]) / step;
    let bStep = (eColor[2] - sColor[2]) / step;
    let gradientColorArr = [];
    // 计算每一步的hex值
    for (let i = 0; i < step; i++) {
      gradientColorArr.push(
        this.rgbToHex(
          parseInt(rStep * i + sColor[0]),
          parseInt(gStep * i + sColor[1]),
          parseInt(bStep * i + sColor[2])
        )
      );
    }
    return gradientColorArr;
  }
  hidePopup(e) {
    let { showMore, showColor, visible } = this.state

    if (!visible) return

    if (!this.relRef.current.contains(e.target) && !this.domRef.current.contains(e.target)) {
      showMore = false;
      showColor = this.props.value;
      this.setState({ visible: false, showMore, showColor })
      this.props.onChange && this.props.onChange(showColor)
      this.props.onFormItemChange && this.props.onFormItemChange(showColor)
    }

  }
  componentWillReceiveProps(props) {
    if (props.value != this.state.showColor) {
      this.setState({ showColor: props.value })
    }
  }
  render() {
    let { showColor, visible, primaryColor, baseColor, showMore } = this.state
    let { transfer } = this.props
    let renderColorBox = (data) => {
      return data.map((color, index) => {
        return (<li key={index}
          style={{ backgroundColor: color }}
          onMouseOver={() => this.setState({ hoveColor: color })}
          onMouseOut={() => this.setState({ hoveColor: null })}
          onClick={() => this.updataValue(color)}></li>)
      })
    }
    return (<div className={this.classes()} style={this.styles()}>
      {/* 颜色显示小方块  */}
      <div onClick={this.toggleDrop.bind(this)} ref={this.relRef}>
        <div className="k-color-button" style={{ backgroundColor: showColor }}></div>
        < div className="k-color-arrow" ></div>
      </div>
      {/* 用以激活HTML5颜色面板  */}
      {/* 颜色色盘 */}
      <Transfer transfer={transfer}
        onScroll={this.setPosition.bind(this)}
        onResize={this.setPosition.bind(this)}
        docOnClick={(e) => this.hidePopup(e)}
      >
        <Transition name="dropdown" show={visible}>
          <div className="k-colorpicker-popup" ref={this.domRef} style={this.styles(this.popupStyle())}>
            {showMore ?
              <Picker onChange={this.updataValue.bind(this)} value={showColor} />
              :
              <div className="bd">
                <h3>主题颜色</h3>
                <ul className="tColor">
                  {renderColorBox(primaryColor)}
                </ul>
                <ul className="bColor">
                  {
                    this.colorPanel().map((item, index) => {
                      return <li key={index}><ul>{renderColorBox(item)}</ul></li>
                    })
                  }
                </ul>
                <h3>标准颜色</h3>
                <ul className="tColor">
                  {renderColorBox(baseColor)}
                </ul>
              </div>}

            <div className="k-more">
              {/* <input type="text" className="k-value" value={showColor} /> */}
              <Button type="danger" className="k-more-button" onClick={this.onClose.bind(this)}>确定</Button>
              <Button className="k-more-button" onClick={() => this.setState({ showMore: !showMore })} >更多</Button>
            </div>
          </div>
        </Transition>
      </Transfer>
    </div>)
  }
}
ColorPicker.defaultProps = {
  value: '#000000',
  transfer: true
}
ColorPicker.propTypes = {
  // 默认展示面板
  // 当前颜色值
  value: PropTypes.string.isRequired,
  // 禁用状态
  disabled: PropTypes.bool,
  transfer: PropTypes.bool,
  onChange: PropTypes.func
}
