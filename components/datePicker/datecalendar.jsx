import React from 'react'
import { Kui, PropTypes } from '../kui'
import { DatePicker } from '../..';
export default class DateCalendar extends Kui {
  constructor(props) {
    super(props)
    this.time = this.get(props.value);
    this.state = {
      pre: "k-calendar",
      m: "D",
      showYears: false,
      showMonths: false,
      showHours: false,
      showMinutes: false,
      showSeconds: false,
      year: this.time.year,
      month: this.time.month,
      day: this.time.day,
      hour: this.time.hour,
      minute: this.time.minute,
      second: this.time.second
    }
  }
  years() {
    const arr = [];
    let start = parseInt(this.state.year / 10) * 10 - 1;
    while (arr.length < 12) { arr.push(start++); }
    return arr;
  }
  days() {
    let { year, month } = this.state
    let { local } = this.props
    const days = [];
    const time = new Date(year, month, 1);
    const dow = local.dow || 7;
    time.setDate(0); // switch to the last day of last month
    let lastDay = time.getDate();
    const week = time.getDay() || 7;
    let count = dow <= week ? week - dow + 1 : week + (7 - dow + 1);
    while (count > 0) {
      days.push({
        i: lastDay - count + 1,
        y: month > 0 ? year : year - 1,
        m: month > 0 ? month - 1 : 11,
        p: true
      });
      count--;
    }
    time.setMonth(time.getMonth() + 2, 0); // switch to the last day of the current month
    lastDay = time.getDate();
    let i = 1;
    for (i = 1; i <= lastDay; i++) {
      days.push({ i: i, y: year, m: month });
    }
    for (i = 1; days.length < 42; i++) {
      days.push({
        i: i,
        y: month < 11 ? year : year + 1,
        m: month < 11 ? month + 1 : 0,
        n: true
      });
    }
    return days;
  }
  get(time) {
    if (!time) {
      let d1 = this.props.data[0]
      time = new Date()
      if (this.right && !d1) {
        let d2 = new Date()
        d2.setMonth(d2.getMonth() + 1)
        time = d2
      }
    }
    return {
      year: time.getFullYear(),
      month: time.getMonth(),
      day: time.getDate(),
      hour: time.getHours(),
      minute: time.getMinutes(),
      second: time.getSeconds()
    };
  }
  parse(num) {
    return parseInt(num / 1000);
  }
  format(time, format) {
    if (!time) return '';
    let { local } = this.props
    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDate();
    const hours24 = time.getHours();
    const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    const map = {
      YYYY: year,
      MM: this.slice(month + 1),
      MMM: local.months[month],
      MMMM: local.monthsHead[month],
      M: month + 1,
      DD: this.slice(day),
      D: day,
      HH: this.slice(hours24),
      H: hours24,
      hh: this.slice(hours),
      h: hours,
      mm: this.slice(minutes),
      m: minutes,
      ss: this.slice(seconds),
      s: seconds,
      S: milliseconds
    };
    return (format || this.props.format).replace(
      /Y+|M+|D+|H+|h+|m+|s+|S+/g,
      str => map[str]
    );
  }
  status(_year, _month, day, hour, minute, second, format) {
    let { pre, right, left, year, month } = this.state;
    let { data, value } = this.props;
    let start = this.parse(data[0]);
    let end = this.parse(data[1]);
    const maxDay = new Date(_year, _month + 1, 0).getDate();
    const time = new Date(_year, _month, day > maxDay ? maxDay : day, hour, minute, second);
    const today = new Date();

    const t = this.parse(time);
    const classObj = {};
    let flag = false;
    let istoday = false
    if (format == 'YYYYMMDD') {
      istoday = today.getFullYear() == _year && today.getMonth() == _month && today.getDate() == day
    }
    if (format === "YYYY") {
      flag = _year === year;
    } else if (format === "YYYYMM") {
      flag = _month === month;
    } else {
      flag = this.format(value, format) === this.format(time, format);
    }
    classObj[`${pre}-date`] = true;
    classObj[`${pre}-date-disabled`] = (right && t < start) || (left && t > end) || this.props.disabledDate(time);
    classObj[`${pre}-date-on`] = (left && t > start) || (right && t < end);
    classObj[`${pre}-date-selected`] = flag;
    classObj[`${pre}-date-today`] = istoday;
    return classObj;
  }
  nextMonth() {
    let { month, year } = this.state
    if (month < 11) {
      month++;
    } else {
      month = 0;
      year++;
    }
    this.setState({ month, year })
  }
  prevMonth() {
    let { month, year } = this.state
    if (month > 0) {
      month--;
    } else {
      month = 11;
      year--;
    }
    this.setState({ month, year })
  }
  slice(str) {
    return ("0" + str).slice(-2);
  }
  ok(info) {
    let _year = "";
    let _month = "";
    info && info.n && this.nextMonth();
    info && info.p && this.prevMonth();
    if (info === "h") {
      const time = this.get(this.props.value);
      _year = time.year;
      _month = time.month;
    }
    let { year, month, day, hour, minute, second } = this.state
    let { right,left,data } = this.props
    let d = new Date(_year || year, _month || month, day, hour, minute, second);

    this.props.onChange && this.props.onChange(d)
    if(!right && !left){
      this.props.onOK && this.props.onOK();
    }else if(data[0] && data[1]){
      this.props.onOK && this.props.onOK();
    }
  }
  daysClick(e,j, disabled) {
    e.nativeEvent.stopImmediatePropagation()
    if (!disabled) {
      this.setState({ day: j.i }, () => this.ok(j))
    }
  }
  monthsClick(e, j, disabled) {
    e.nativeEvent.stopImmediatePropagation()
    if (!disabled) {
      let { showMonths, m } = this.state
      showMonths = (m === 'M');
      this.setState({ showMonths, month: j }, () => {
        if (showMonths) this.ok()
      });
    }
  }
  yearsClick(e, i, disabled) {
    e.nativeEvent.stopImmediatePropagation()
    if (!disabled) {
      let { showYears, year, m } = this.state
      showYears = (m === 'Y')
      year = i
      this.setState({ showYears, year }, () => {
        if (showYears) this.ok()
      });
    }
  }
  hoursClick(e, i, disabled) {
    e.nativeEvent.stopImmediatePropagation()
    if (!disabled) {
      this.setState({ showHours: false, hour: i }, () => this.ok('h'))
    }
  }
  minutesClick(e, i, disabled) {
    e.nativeEvent.stopImmediatePropagation()
    if (!disabled) {
      this.setState({ showMinutes: false, minute: i }, () => this.ok('h'))
    }
  }
  secondsClick(e, i, disabled) {
    e.nativeEvent.stopImmediatePropagation()
    if (!disabled) {
      this.setState({ showSeconds: false, second: i }, () => this.ok('h'))
    }
  }
  showYears(e, y) {
    e.nativeEvent.stopImmediatePropagation()
    this.setState({ showYears: !y })
  }
  showMonths(e, y) {
    e.nativeEvent.stopImmediatePropagation()
    this.setState({ showMonths: !y })
  }
  componentWillReceiveProps(props) {
    this.time = this.get(props.value);
  }
  componentDidMount() {
    const is = c => this.props.format.indexOf(c) !== -1;
    let { showYears, m, showMonths } = this.state
    if (is("s") && is("m") && (is("h") || is("H"))) {
      m = "H";
    } else if (is("D")) {
      m = "D";
    } else if (is("M")) {
      m = "M";
      showMonths = true;
    } else if (is("Y")) {
      m = "Y";
      showYears = true;
    }
    this.setState({ showYears, showMonths, m })
  }
  render() {
    let { pre, year, day, hour, month, minute, second, showYears, showHours, showMonths, showSeconds, showMinutes, m } = this.state
    let { local } = this.props
    let ys = parseInt(year / 10) * 10;
    let ye = ys + 10;
    let renderHours = () => {
      let hours = []
      for (var i = 0; i <= 24; i++) {
        let status = this.status(year, month, day, i, minute, second, 'YYYYMMDDHH')
        let disabled = status[`${pre}-date-disabled`]
        let x = i
        hours.push(<span key={i} onClick={(e) => this.hoursClick(e, x, disabled)} className={this.className(status)}>{i}</span>)
      }
      return hours
    }
    let renderMinutes = () => {
      let minutes = []
      for (var i = 0; i < 60; i++) {
        let x = i
        let status = this.status(year, month, day, hour, i, second, 'YYYYMMDDHHmm')
        let disabled = status[`${pre}-date-disabled`]
        minutes.push(<span key={x} onClick={(e) => this.minutesClick(e, x, disabled)} className={this.className(status)}>{i}</span>)
      }
      return minutes
    }
    let renderSeconds = () => {
      let seconds = []
      for (var i = 0; i < 60; i++) {
        let x = i
        let status = this.status(year, month, day, hour, minute, i, 'YYYYMMDDHHmmss')
        let disabled = status[`${pre}-date-disabled`]
        seconds.push(<span key={x} onClick={(e) => this.secondsClick(e, x, disabled)} className={this.className(status)}>{i}</span>)
      }
      return seconds
    }
    return (<div className={`${pre}`}>
      <div className={`${pre}-head`}>
        {showYears && <span className={`${pre}-prev-decade-btn`} onClick={() => this.setState({ year: year - 10 })}>«</span>}
        {!showYears && <span className={`${pre}-prev-year-btn`} onClick={() => this.setState({ year: year - 1 })}>«</span>}
        {!showYears && !showMonths && <span className={`${pre}-prev-month-btn`} onClick={this.prevMonth.bind(this)}>‹</span>}
        {showYears && <span className={`${pre}-year-select`}>{ys + '-' + ye}</span>}
        {local.yearSuffix ?
          <React.Fragment>
            {!showYears && <span className={`${pre}-year-select`} onClick={(e) => this.showYears(e, showYears)}>{year}{local.yearSuffix}</span>}
            {!showYears && !showMonths && <span className={`${pre}-month-select`} onClick={(e) => this.showMonths(e, showMonths)}>{local.monthsHead[month]}</span>}
          </React.Fragment>
          :
          <React.Fragment>
            {!showYears && !showMonths && <span className={`${pre}-month-select`} onClick={(e) => this.showMonths(e, showMonths)}>{local.monthsHead[month]}</span>}
            {!showYears && <span className={`${pre}-year-select`} onClick={(e) => this.showYears(e, showYears)}>{year}</span>}
          </React.Fragment>
        }
        {!showYears && !showMonths && <span className={`${pre}-next-month-btn`} onClick={this.nextMonth.bind(this)}>›</span>}
        {!showYears ?
          <span className={`${pre}-next-year-btn`} onClick={() => this.setState({ year: year + 1 })}>»</span> :
          <span className={`${pre}-next-decade-btn`} onClick={() => this.setState({ year: year + 10 })}>»</span>}
      </div>
      <div className={`${pre}-body`}>
        <div className={`${pre}-days`}>
          {local.weeks.map(i => <span className={`${pre}-week`} key={i}>{i}</span>)}
          {
            this.days().map((j, x) => {
              let status = this.status(j.y, j.m, j.i, hour, minute, second, 'YYYYMMDD');
              let cls = this.className([Object.assign({}, { [`${pre}-date-out`]: (j.p || j.n) }, status)])
              let disabled = status[`${pre}-date-disabled`]
              return <span key={x} onClick={(e) => this.daysClick(e,j, disabled)} className={cls}>{j.i}</span>
            })
          }
        </div>
        {showMonths && <div className={`${pre}-months`}>
          {
            local.months.map((i, j) => {
              let status = this.status(year, j, day, hour, minute, second, 'YYYYMM')
              let disabled = status[`${pre}-date-disabled`]
              return <span key={j} onClick={(e) => this.monthsClick(e, j, disabled)} className={this.className([status])}>{i}</span>
            })
          }

        </div>}
        {showYears && <div className={`${pre}-years`}>
          {
            this.years().map((i, j) => {
              let status = this.status(i, month, day, hour, minute, second, 'YYYY')
              let cls = this.className([Object.assign({}, { [`${pre}-date-out`]: (j === 0 || j === 11) }, status)])
              let disabled = status[`${pre}-date-disabled`]
              return <span key={j} onClick={(e) => { this.yearsClick(e, i, disabled) }} className={cls}>{i}</span>
            })
          }
        </div>}
        {showHours && <div className={`${pre}-hours`}>
          <div className={`${pre}-title`}>{local.hourTip}</div>
          {renderHours()}
        </div>}
        {showMinutes && <div className={`${pre}-minutes`}>
          <div className={`${pre}-title`}>{local.minuteTip}</div>
          {renderMinutes()}
        </div>}
        {showSeconds && <div className={`${pre}-seconds`}>
          <div className={`${pre}-title`}>{local.secondTip}</div>
          {renderSeconds()}
        </div>}
      </div>
      {m === 'H' && <div className={`${pre}-foot`}>
        <div className={`${pre}-hour`}>
          <span title={local.hourTip} onClick={() => this.setState({ showHours: !showHours, showMinutes: false, showSeconds: false })}
            className={showHours ? 'on' : ''}>{this.slice(hour)}</span>
          <span>:</span>
          <span title={local.minuteTip} onClick={() => this.setState({ showMinutes: !showMinutes, showHours: false, showSeconds: false })}
            className={showMinutes ? 'on' : ''}>{this.slice(minute)}</span>
          <span>:</span>
          <span title={local.secondTip} onClick={() => this.setState({ showSeconds: !showSeconds, showHours: false, showMinutes: false })}
            className={showSeconds ? 'on' : ''}>{this.slice(second)}</span>
        </div>

      </div >
      }
    </div >)
  }
}
DateCalendar.defaultProps = {
  format: 'YYYY-MM-DD',
  data: [],
  disabledDate: () => { }
}
DateCalendar.propTypes = {
  data: PropTypes.array,
  format: PropTypes.string,
  local: PropTypes.object,
  value: PropTypes.any,
  left: PropTypes.bool,
  right: PropTypes.bool,
  disabledDate: PropTypes.func,
  onOK: PropTypes.func,
  onChange: PropTypes.func,
} 