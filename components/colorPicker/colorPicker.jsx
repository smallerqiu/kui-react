import { canvasHelper, limit, hslToRgb, rgbToHsl, parseColor, rgbToHex, cssColorToRgba } from './canvasHelper'
import { Input } from '../input'
import Button from '../button'
import Icon from '../icon'
import Drop from '../base/drop'
import { Kui, PropTypes } from '../kui'

import React from 'react'

const modes = ['rgba', 'hex', 'hsla']

export default class ColorPicker extends Kui {

  static propTypes = {
    value: PropTypes.string,
    disabled: PropTypes.bool,
    transfer: PropTypes.bool,
    showMode: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    mode: PropTypes.oneOf(modes),
    defalutColors: PropTypes.array
  }

  static defaultProps = {
    mode: 'hex',
    transfer: true,
    defalutColors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b', '#000']
  }
  state = {
    currentMode: this.props.mode,
    currentColor: this.props.value || '#000',
    paintHelper: null,
    hueHelper: null,
    H: 0, S: 0, L: 0, A: 1,
    R: 0, G: 0, B: 0,
    HEX: '',
    huePointer: {
      x: 0
    },
    alphaPointer: {
      x: 0,
    },
    paintPointer: {
      x: 0, y: 0
    },
    opened: false,
    isMouseDown: false
  }
  alphaRef = React.createRef()
  paintRef = React.createRef()
  overlayRef = React.createRef()
  hueRef = React.createRef()
  elRef = React.createRef()
  componentDidUpdate(prevProps, prevState, snap) {
    if (prevProps.value != this.props.value) {
      this.valueChange('COLOR', this.props.value)
    }
  }

  toggleDrop = () => {
    let { opened, currentColor } = this.state
    let { value, disabled } = this.props
    if (disabled) {
      return false;
    }
    this.setState({
      opened: !opened,
      currentColor: value || '#000'
    })
  }
  updatePostion = () => {
    let { alphaPointer, huePointer, paintPointer, A, H, S, L } = this.state
    //alpha
    {
      const x = 170 * A;
      alphaPointer.x = (x - 7);
      this.setState({ alphaPointer })
    }
    //updaet hue pointer
    {
      const x = 170 * H / 360;
      huePointer.x = (x - 7);
      this.setState({ huePointer })
    }
    //paint
    {
      const [r, g, b] = hslToRgb(H, S, L);
      const [x, y] = this.paintHelper.findColor(r, g, b);
      if (x >= 0) {
        paintPointer.x = (x - 7);
        paintPointer.y = (y - 7);
        this.setState({ huePointer })
      }
    }

  }
  valueChange = (prop, value) => {
    let { R, G, B, A, H, S, L } = this.state
    switch (prop) {
      case 'COLOR':
        [R, G, B, A] = parseColor(value, 'rgba') || [0, 0, 0, 1];
        [H, S, L] = rgbToHsl(R, G, B);
        this.setState({ R, G, B, A, H, S, L }, () => {
          this.paintHelper.setHue(H);
          this.updatePostion()
          this.alphaCanvsSetHue(this.alphaRef.current)
          this.setHEX()
        })
        break;
      case 'HUE':
        H = value;
        [R, G, B] = hslToRgb(H, S, L);
        this.setState({ R, G, B, H }, () => {
          this.paintHelper.setHue(value);
          this.alphaCanvsSetHue(this.alphaRef.current);
          this.setHEX()
        })
        break;
      case 'RGB':
        [R, G, B] = value;
        [H, S, L] = rgbToHsl(R, G, B);
        this.setState({ R, G, B, H, S, L }, () => {
          // let colors = rgbToHsl(this.R, this.G, this.B);
          // [this.H, this.S, this.L] = colors
          this.alphaCanvsSetHue(this.alphaRef.current)
          this.setHEX()
        })
        break;
      case 'ALPHA':
        A = value;
        this.setState({ A }, () => {
          this.setHEX()
        })
        break;
    }
  }
  setHEX = () => {
    let { R, G, B, A, HEX, currentColor } = this.state
    if (A != 1) {
      HEX = parseColor([R, G, B, A], 'hexcss4');
    } else {
      HEX = rgbToHex(R, G, B);
    }
    currentColor = HEX
    this.setState({ currentColor, HEX })

  }
  updateValue = () => {
    let { currentMode, R, G, B, A, H, S, L, HEX } = this.state,
      value = null;
    if (currentMode == 'hex') {
      value = HEX
    } else if (currentMode == 'rgba') {
      value = `rgba(${R},${G},${B},${A})`
    } else {
      value = A < 1 ? `hsla(${H},${S}%,${L}%,${A})` : `hsl(${H},${S}%,${L}%)`
    }
    // console.log(value)
    this.props.onChange && this.props.onChange(value)
    this.setState({
      currentColor: value,
      opened: false
    })
  }
  setMode = () => {
    let { currentMode } = this.state

    let i = modes.indexOf(currentMode) + 1
    i = i > 2 ? 0 : i
    this.setState({
      currentMode: modes[i]
    })
  }
  initHueCanvas = (canvas) => {
    const ctx = canvas.getContext('2d'),
      setp = 1 / 360,
      width = canvas.width,
      height = canvas.height,
      gradient = ctx.createLinearGradient(0, 0, width, 0);

    for (let i = 0; i <= 1; i += setp) {
      gradient.addColorStop(i, `hsl(${360 * i},100%,50%)`)
    }
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    const onMouseMove = e => {
      const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, width),
        hue = Math.round(x * 360 / width)
      let { huePointer } = this.state
      huePointer.x = x - 7
      this.setState({ huePointer })
      this.valueChange('HUE', hue)
    }

    const onMouseUp = () => {
      setTimeout(() => {
        this.setState({ isMouseDown: false })
      }, 300);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp)
    }

    canvas.addEventListener('mousedown', e => {
      this.setState({ isMouseDown: true })
      onMouseMove(e)
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      e.preventDefault()
    })
  }
  alphaCanvsSetHue = (canvas) => {
    const ctx = canvas.getContext('2d'),
      { width, height } = canvas,
      gradient = ctx.createLinearGradient(0, 0, width - 1, 0);
    let { H, S, L } = this.state
    ctx.clearRect(0, 0, width, height)
    gradient.addColorStop(0, `hsla(${H},${S}%,${L}%,0)`)
    gradient.addColorStop(1, `hsla(${H},${S}%,${L}%,1)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  initAlphaCanvas = (canvas) => {
    this.alphaCanvsSetHue(canvas)
    const { width, height } = canvas;
    const onMouseMove = (e) => {
      const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, width),
        alpha = +(x / width).toFixed(2);
      let { alphaPointer } = this.state
      alphaPointer.x = (x - 7)
      this.setState({ alphaPointer }, () => {
        this.valueChange('ALPHA', alpha)
      })
    }

    const onMouseUp = () => {
      setTimeout(() => {
        this.isMouseDown = false
      }, 300);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp)
    }

    canvas.addEventListener('mousedown', e => {
      this.setState({ isMouseDown: false })
      onMouseMove(e);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp)
      e.preventDefault()

    })

  }
  initPaintCanvas = (canvas) => {
    const { width, height } = canvas;
    const onMouseMove = e => {
      const x = limit(e.clientX - canvas.getBoundingClientRect().left, 0, width - 1),
        y = limit(e.clientY - canvas.getBoundingClientRect().top, 0, height - 1),
        color = this.paintHelper.grabColor(x, y)
      let { paintPointer } = this.state
      paintPointer.x = x - 7
      paintPointer.y = y - 7
      this.setState({ paintPointer })
      this.valueChange('RGB', color)

    }
    const onMouseUp = () => {
      setTimeout(() => {
        this.setState({ isMouseDown: false })
      }, 300);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp)
    }

    canvas.addEventListener('mousedown', e => {
      this.setState({ isMouseDown: true })
      onMouseMove(e)
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      e.preventDefault()
    })
  }
  renderPaint = () => {
    let prop = {
      className: 'k-color-picker-paint',
      width: 254, height: 136,
      key: 'paint',
      ref: this.paintRef
    }
    return <canvas {...prop} />
  }
  renderAlpha = () => {
    let prop = {
      className: 'k-color-picker-alpha',
      width: 170, height: 13,
      key: 'alpha',
      ref: this.alphaRef
    }
    return <canvas {...prop} />
  }
  renderHue = () => {
    let prop = {
      className: 'k-color-picker-hue',
      width: 170, height: 13,
      ref: this.hueRef,
      key: 'hue'
    }
    return <canvas {...prop} />
  }
  renderValueInput = (key) => {
    let prop = {
      maxLength: key == 'HEX' ? 9 : 4,
      value: this.state[key] + ('SL'.indexOf(key) >= 0 ? '%' : ''),
      key,
      size: "small",
      onChange: e => {
        let value = e.target.value.replace('%', '')
        if (!value) return;
        let { R, G, B, A, H, S, L } = this.state
        if (key == 'HEX') {
          value = value.toString().toLowerCase()
          if (/^#([0-9A-F]{6}|[0-9A-F]{3}|[0-9A-F]{8})$/i.test(value)) {
            [R, G, B, A] = cssColorToRgba(value) || [R, G, B, A];
            [H, S, L] = rgbToHsl(R, G, B);
            this.setState({ R, G, B, A, H, S, L })
          } else {
            return;
          }
        } else if (key == 'A') {
          if (!/^\d(.)\d*$/.test(value) || value > 1) return;
        } else {
          if (!/^\d*$/.test(value)) return;
        }
        let data = {}
        data[key] = value
        // console.log(e,key)
        if ('RGB'.indexOf(key) >= 0) {
          [H, S, L] = rgbToHsl(R, G, B);
        }
        this.setState({ H, S, L, ...data }, () => {
          this.updatePostion()
          this.paintHelper.setHue(H)
          this.alphaCanvsSetHue(this.alphaRef.current)
        })
      }
    }
    return <Input {...prop} />
  }
  renderValue = () => {
    if (this.props.showMode) {
      let { currentMode } = this.state, node = []
      if (currentMode == 'rgba') {
        let keys = ['R', 'G', 'B', 'A']
        let v = <div className="k-color-picker-val" key="rgbapickerval">{keys.map(k => this.renderValueInput(k))}</div>
        let k = <div className="k-color-picker-key" key='rgbapickerkey'>{keys.map(k => <span key={k}>{k}</span>)}</div>
        node.push(v, k)
      } else if (currentMode == 'hsla') {
        let keys = ['H', 'S', 'L', 'A']
        let v = <div className="k-color-picker-val" key='hslapickerval'>{keys.map(k => this.renderValueInput(k))}</div>
        let k = <div className="k-color-picker-key" key='hslapickerkey'>{keys.map(k => <span key={k}>{k}</span>)}</div>
        node.push(v, k)
      } else { //hex
        let v = <div className="k-color-picker-val" key='hexpickerval'>{this.renderValueInput('HEX')}</div>
        let k = <div className="k-color-picker-key" key='hexpickerkey'><span key={k}>HEX</span></div>
        node.push(v, k)
      }
      let btn = <Button icon="flash" size="small" key="btn" circle onClick={this.setMode} />
      node.push(btn)
      return <div className={`k-color-picker-mode k-color-picker-${currentMode}`}>{node}</div>
    }
  }
  renderDefaultColor = () => {
    let color = this.props.defalutColors.map((c, i) => <span key={i} style={{ backgroundColor: c }} onClick={e => this.valueChange('COLOR', c)}></span>)
    let okBtn = <Button icon="color-fill" key="btnfill" circle onClick={this.updateValue} />
    return <div className="k-coclor-picker-defaults">{[color, okBtn]}</div>
  }
  renderDrop = () => {
    let paint = this.renderPaint()
    let alpha = this.renderAlpha()
    let hue = this.renderHue()
    // let colors = this.renderDefaultColor()
    let valueNode = this.renderValue()

    let { paintPointer, alphaPointer, huePointer, R, G, B, A, opened, currentColor } = this.state

    let { value, transfer } = this.props
    const props = {
      ref: this.overlayRef,
      transfer: transfer,
      show: opened,
      selectionRef: this.elRef,
      className: 'k-color-picker-dropdown',
      transitionName: 'k-color-picker',

      onClose: () => {
        this.setState({ opened: false }, () => {
          this.setState({
            opened: false,
            currentColor: value || '#000'
          })
        })
      },
      onRender: () => {
        this.paintHelper = canvasHelper(this.paintRef.current)

        this.initHueCanvas(this.hueRef.current)
        this.initAlphaCanvas(this.alphaRef.current)
        this.initPaintCanvas(this.paintRef.current)
        this.valueChange('COLOR', currentColor)
      },
    }
    return (<Drop {...props}>
      {paint}
      < span className="k-color-picker-paint-dot" style={{ left: paintPointer.x, top: paintPointer.y }} ></span >
      <div className="k-color-picker-bar">
        <div className="k-color-picker-avatar">
          <div className="k-color-picker-avatar-inner" style={{ backgroundColor: `rgba(${R}, ${G}, ${B}, ${A})` }}></div>
        </div>
        <div className="k-color-picker-bar-box">
          {[hue, alpha]}
          <span className="k-color-picker-hue-dot" style={{ left: huePointer.x }}></span>
          <span className="k-color-picker-alpha-dot" style={{ left: alphaPointer.x }}></span>
        </div>
      </div>
      {valueNode}
      {this.renderDefaultColor()}
    </Drop>
    )
  }


  render() {
    let drop = this.renderDrop()
    let { size, disabled } = this.props
    let { currentColor } = this.state
    let cls = [
      'k-color-picker',
      {
        'k-color-picker-disabled': disabled,
        'k-color-picker-sm': size == 'small',
        'k-color-picker-lg': size == 'large'
      },
    ]
    return (<div className={this.className(cls)} style={this.styles()}>
      <div className="k-color-picker-selection" onClick={this.toggleDrop} ref={this.elRef}>
        <div className="k-color-picker-color">
          <div className="k-color-picker-color-inner" style={{ backgroundColor: currentColor }}></div>
        </div>
        <Icon type="chevron-down" />
      </div>
      {drop}
    </div >)
  }
}

