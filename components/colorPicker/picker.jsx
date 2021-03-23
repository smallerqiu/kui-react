import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class Picker extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      color: props.value, scolor: "", rgb: "", hsl: "",
      wheel: "",
      width: 194,
      circleDrag: false, dragging: false,
      square: 100, radius: 84,
      rx: 0, ry: 0, sx: 0, sy: 0,
    }
    this.wheelRef = React.createRef()
  }
  setColor(newColor) {
    let { color, rgb, hsl } = this.state
    var unpack = this.unpack(newColor);
    if (unpack) {
      color = newColor;
      rgb = unpack;
      hsl = this.RGBToHSL(rgb);
      this.setState({ color, rgb, hsl }, () => this.updateDisplay())
    }

    return this;
  }
  setHSL(newHSL) {
    let { color, rgb, hsl } = this.state
    hsl = newHSL;
    rgb = this.HSLToRGB(newHSL);
    color = this.pack(rgb);
    this.setState({ color, rgb, hsl }, () => this.updateDisplay())
    // return this;
  }
  widgetCoords(event) {
    var x, y;
    var el = event.target || event.srcElement;
    var wheel = this.wheelRef.current; //fb.wheel;
    if (typeof event.offsetX != "undefined") {
      // 使用偏移坐标，找到共同的offsetparent
      var pos = { x: event.offsetX, y: event.offsetY };
      // 向上通过offsetparent链发送坐标。
      var e = el;
      while (e) {
        e.mouseX = pos.x;
        e.mouseY = pos.y;
        pos.x += e.offsetLeft;
        pos.y += e.offsetTop;
        e = e.offsetParent;
      }
      // 寻找从轮子小部件开始的坐标。
      var e = wheel;
      var offset = { x: 0, y: 0 };
      while (e) {
        if (typeof e.mouseX != "undefined") {
          x = e.mouseX - offset.x;
          y = e.mouseY - offset.y;
          break;
        }
        offset.x += e.offsetLeft;
        offset.y += e.offsetTop;
        e = e.offsetParent;
      }
      // 复位存储坐标
      e = el;
      while (e) {
        e.mouseX = undefined;
        e.mouseY = undefined;
        e = e.offsetParent;
      }
    } else {
      // 使用绝对坐标
      var pos = wheel.getBoundingClientRect()
      x = (event.pageX || 0 * (event.clientX + $('html').get(0).scrollLeft)) - pos.x;
      y = (event.pageY || 0 * (event.clientY + $('html').get(0).scrollTop)) - pos.y;
    }
    // 减去中间距离
    let { width } = this.state
    return { x: x - width / 2, y: y - width / 2 };
  }
  onMouseDown(event) {
    let { dragging, square } = this.state
    // 捕获鼠标
    if (!dragging) {
      dragging = true;
      this.setState({ dragging })
    }
    // 检查正在拖动哪个区域
    var pos = this.widgetCoords(event);
    let circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > square;
    this.setState({ circleDrag })
    // Process
    this.onMouseMove(event)
    return false;
  }
  onMouseMove(event) {
    let { dragging, square, circleDrag, hsl } = this.state
    if (dragging) {
      // 获取与颜色选择器中心相对应的坐标
      var pos = this.widgetCoords(event);
      // 设置新的HSL参数
      if (circleDrag) {
        var hue = Math.atan2(pos.x, -pos.y) / 6.28;
        if (hue < 0) hue += 1;
        this.setHSL([hue, hsl[1], hsl[2]]);
      } else {
        var sat = Math.max(0, Math.min(1, -(pos.x / square) + 0.5));
        var lum = Math.max(0, Math.min(1, -(pos.y / square) + 0.5));
        this.setHSL([hsl[0], sat, lum]);
      }
      return false;
    }
  }
  onMouseUp() {
    this.setState({ dragging: false })
  }
  updateDisplay() {
    let { rx, ry, sx, sy, scolor, color, square, hsl, width, radius } = this.state
    // Markers
    var angle = hsl[0] * 6.28;
    rx = Math.round(Math.sin(angle) * radius + width / 2) + "px";
    ry = Math.round(-Math.cos(angle) * radius + width / 2) + "px";
    sx = Math.round(square * (0.5 - hsl[1]) + width / 2) + "px";
    sy = Math.round(square * (0.5 - hsl[2]) + width / 2) + "px";
    scolor = this.pack(this.HSLToRGB([hsl[0], 1, 0.5]));
    this.setState({ rx, ry, sx, sy, scolor, square, hsl, width, radius })
    this.props.onChange && this.props.onChange(color)
    // 假如要设置文字的 颜色 要做匹配  color: this.hsl[2] > 0.5 ? '#000' : '#fff'
  }
  absolutePosition(el) {
    var r = { x: el.offsetLeft, y: el.offsetTop };
    // 解决相对offsetparent
    if (el.offsetParent) {
      var tmp = this.absolutePosition(el.offsetParent);
      r.x += tmp.x;
      r.y += tmp.y;
    }
    return r;
  }
  pack(rgb) {
    var r = Math.round(rgb[0] * 255);
    var g = Math.round(rgb[1] * 255);
    var b = Math.round(rgb[2] * 255);
    return (
      "#" +
      (r < 16 ? "0" : "") +
      r.toString(16) +
      (g < 16 ? "0" : "") +
      g.toString(16) +
      (b < 16 ? "0" : "") +
      b.toString(16)
    );
  }
  unpack(color) {
    if (color.length == 7) {
      return [
        parseInt("0x" + color.substring(1, 3)) / 255,
        parseInt("0x" + color.substring(3, 5)) / 255,
        parseInt("0x" + color.substring(5, 7)) / 255
      ];
    } else if (color.length == 4) {
      return [
        parseInt("0x" + color.substring(1, 2)) / 15,
        parseInt("0x" + color.substring(2, 3)) / 15,
        parseInt("0x" + color.substring(3, 4)) / 15
      ];
    }
  }
  HSLToRGB(hsl) {
    var m1, m2, r, g, b;
    var h = hsl[0], s = hsl[1], l = hsl[2];
    m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
    m1 = l * 2 - m2;
    return [
      this.hueToRGB(m1, m2, h + 0.33333),
      this.hueToRGB(m1, m2, h),
      this.hueToRGB(m1, m2, h - 0.33333)
    ];
  }
  hueToRGB(m1, m2, h) {
    h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
    return m1;
  }
  RGBToHSL(rgb) {
    var min, max, delta, h, s, l;
    var r = rgb[0], g = rgb[1], b = rgb[2];
    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;
    s = 0;
    if (l > 0 && l < 1) {
      s = delta / (l < 0.5 ? 2 * l : 2 - 2 * l);
    }
    h = 0;
    if (delta > 0) {
      if (max == r && max != g) h += (g - b) / delta;
      if (max == g && max != b) h += 2 + (b - r) / delta;
      if (max == b && max != r) h += 4 + (r - g) / delta;
      h /= 6;
    }
    return [h, s, l];
  }
  componentDidMount() {
    this.setColor(this.state.color)
  }
  componentWillReceiveProps(props) {
    if (props.value != this.state.showColor) {
      this.setState({ color: props.value })
    }
  }
  render() {
    let { scolor, rx, ry, sx, sy } = this.state
    return (<div className="k-picker" onMouseDown={this.onMouseDown.bind(this)}
      onMouseMove={this.onMouseMove.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
      <div className="k-picker-color" style={{ backgroundColor: scolor }}></div>
      <div className="k-picker-wheel" ref={this.wheelRef}></div>
      <div className="k-picker-overlay"></div>
      <div className="h-marker marker" style={{ left: rx, top: ry }}></div>
      <div className="sl-marker marker" style={{ left: sx, top: sy }}></div>
    </div>)
  }
}
Picker.defaultProps = {
  value: '#000000'
}
Picker.propTypes = {
  value: PropTypes.string
}