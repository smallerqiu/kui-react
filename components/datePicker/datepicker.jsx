import React from 'react'
import { Kui, PropTypes } from '@/components/kui'
import { Transition, Transfer } from '../index'
import DateCalendar from './datecalendar'
export default class DatePicker extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      text: "",
      visible: false,
      left: 0,
      fadeInBottom: false,
      top: 0,
      dates: this.vi(props.value),
      local: require(`./lang/${props.lang}.js`),
      value: props.value
    }
    this.domRef = React.createRef()
    this.relRef = React.createRef()
  }
  relStyles() {
    let { width } = this.props
    return { width: `${width}px` }
  }
  classes() {
    let { rangeSeparator, clearable, disabled, mini } = this.props
    return this.className([
      "k-datepicker",
      {
        ["k-datepicker-range"]: rangeSeparator,
        ["k-datepicker-clearable"]: clearable && !disabled,
        ["k-datepicker-mini"]: mini
      }
    ])
  }
  inputClass() {
    return this.className([
      "k-datepicker-input",
      {
        ["focus"]: this.state.visible
      }
    ])
  }
  popupStyle() {
    let { left, top, fadeInBottom } = this.state
    let style = {};
    Array.isArray(this.props.value) && (style.width = "415px");
    style.left = `${left}px`;
    style.top = `${top}px`;
    if (fadeInBottom) {
      style.transformOrigin = "center bottom 0px";
    }
    return style;
  }
  hidePopup(e) {
    if (this.state.visible &&
      !this.relRef.current.contains(e.target) &&
      !this.domRef.current.contains(e.target)) {
      this.setState({ visible: false })
    }

  }
  toggleDrop() {
    if (!this.props.disabled) {
      this.setState({ visible: !this.state.visible })
    }
  }
  handleScroll() {
    setTimeout(() => {
      this.setPosition()
    });
  }
  setPosition() {
    // if (!this.state.visible) return;
    let m = 3;
    let rel = this.relRef.current;
    let dom = this.domRef.current;
    if (!dom) return;
    let relPos = rel.getBoundingClientRect()


    let clientH = window.innerHeight;
    let clientW = window.innerWidth;
    // console.log(relPos)
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

    let domH = dom.offsetHeight;
    let relH = rel.offsetHeight;

    //set
    let left = 0
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
      left, top, dropdownWith, fadeInBottom
    })
  }
  setText() {
    let { dates, text, value } = this.state
    let date = dates.map(date => this.format(date));
    let txt = date.join(` ${this.props.rangeSeparator} `);
    text = value ? (date.length == 1 ? date[0] : txt) : "";
    this.setState({ text })
  }
  onClear() {
    let { dates, value } = this.state
    dates = []
    value = Array.isArray(value) ? [] : ""
    this.setState({ dates, value }, () => this.setText())
    this.props.onChange && this.props.onChange(value)
    this.props.onFormItemChange && this.props.onFormItemChange(value)
  }
  vi(val) {
    //在ie浏览器里面new Date() 格式必须为yyy/MM/dd 其他格式均不识别
    if (Array.isArray(val)) {
      return val.length > 1
        ? val.map((item, i) => item ? new Date(item.toString().replace(/-/g, "/")) : '')
        : [];
    } else {
      return val
        ? new Array(new Date(val.toString().replace(/-/g, "/")))
        : [];
    }
  }
  ok() {
    let { dates, text, value, visible } = this.state
    let date = dates.map(date => this.format(date));
    let txt = date.join(` ${this.props.rangeSeparator} `);
    text = date.length == 1 ? date[0] : txt;
    visible = false

    value = date.length == 1 ? date[0] : date
    this.setState({ text, value, visible })
    this.props.onChange && this.props.onChange(value)
    this.props.onFormItemChange && this.props.onFormItemChange(value)
  }
  setDates(d, i) {
    let dates = this.state.dates
    dates[i] = d
    this.setState({ dates })
  }
  format(time, format) {
    if (!time) return '';
    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDate();
    const hours24 = time.getHours();
    const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();
    const dd = t => ("0" + t).slice(-2);
    const map = {
      YYYY: year,
      MM: dd(month + 1),
      MMM: this.state.local.months[month],
      MMMM: this.state.local.monthsHead[month],
      M: month + 1,
      DD: dd(day),
      D: day,
      HH: dd(hours24),
      H: hours24,
      hh: dd(hours),
      h: hours,
      mm: dd(minutes),
      m: minutes,
      ss: dd(seconds),
      s: seconds,
      S: milliseconds
    };
    return (format || this.props.format).replace(
      /Y+|M+|D+|H+|h+|m+|s+|S+/g,
      str => map[str]
    );
  }
  componentWillReceiveProps(props) {
    if (props.value != this.state.value) {
      this.setState({ value: props.value, dates: this.vi(props.value) }, () => this.ok())
    }
  }
  render() {
    let { visible, text, dates, local } = this.state
    let { placeholder, disabled, name, clearable, transfer, value, format, disabledDate } = this.props
    return (<div className={this.classes()} style={this.styles(this.relStyles())}>
      <input readOnly value={text} type="text" className={this.inputClass()}
        onClick={this.toggleDrop.bind(this)} disabled={disabled} placeholder={placeholder} name={name} ref={this.relRef} />
      {(clearable && !disabled) && <a className="k-datepicker-close" onClick={this.onClear.bind(this)}></a>}
      <Transfer transfer={transfer}
        onScroll={this.setPosition.bind(this)}
        onResize={this.setPosition.bind(this)}
        docOnClick={(e) => this.hidePopup(e)}>
        <Transition name="dropdown" show={visible} onEnter={() => this.setPosition()}>
          <div className="k-datepicker-popup" style={this.popupStyle()} tabIndex="-1" ref={this.domRef} >
            {
              Array.isArray(value) ?
                <React.Fragment>
                  <DateCalendar value={dates[0]} left={true} className="k-calendar-left"
                    local={local} format={format} data={dates} onOK={this.ok.bind(this)} onChange={(date) => this.setDates(date, 0)} />
                  <DateCalendar value={dates[1]} right={true} className="k-calendar-right" onChange={(date) => this.setDates(date, 1)}
                    local={local} format={format} data={dates} onOK={this.ok.bind(this)} />
                </React.Fragment>
                :
                <DateCalendar value={dates[0]} local={local} format={format} data={dates} onChange={(date) => this.setDates(date, 0)}
                  disabledDate={disabledDate} onOK={this.ok.bind(this)} />
            }
          </div>
        </Transition>
      </Transfer>
    </div>)
  }
}
DatePicker.defaultProps = {
  DatePicker: true,
  rangeSeparator: '~',
  placeholder: '清选择',
  lang: 'zh',
  format: 'YYYY-MM-DD',
  transfer: true,
  disabledDate: () => { }
}
DatePicker.propTypes = {
  transfer: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mini: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  disabled: PropTypes.bool,
  rangeSeparator: PropTypes.string,
  clearable: PropTypes.bool,
  placeholder: PropTypes.string,
  lang: PropTypes.oneOf(['zh', 'en']),
  disabledDate: PropTypes.func,
  format: PropTypes.string,
}
