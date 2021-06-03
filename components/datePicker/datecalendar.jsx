import React, { useContext } from 'react'
import { Kui, PropTypes } from '../kui'
import moment from 'moment'
import animate from '../_tool/animate'
import Button from '../button'

export default class DateCalendar extends Kui {

  static contextTypes = {
    DatePicker: PropTypes.any
  }

  static defaultProps = {
    mode: 'date',
    format: 'YYYY-MM-DD',
    disabledDate: () => { },
    disabledTime: () => { }
  }
  static propTypes = {
    value: PropTypes.any,
    showTime: PropTypes.bool,
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.func,
    mode: PropTypes.string,
    format: PropTypes.string,
    float: PropTypes.string
  }
  state = {
    showYears: false,
    showMonths: false,
    showTimes: false,
    currentValue: this.props.value ? new Date(this.props.value) : '',
    today: new Date(),
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    second: null,

    monthsHead: "1.2.3.4.5.6.7.8.9.10.11.12".split("."),
    months: "一.二.三.四.五.六.七.八.九.十.十一.十二".split("."), // months of panel
    weeks: "一.二.三.四.五.六.日".split("."), // weeks
    years: [],
  }

  timepickerRef = React.createRef()

  componentDidMount() {
    this.updateStamp()
  }

  componentDidUpdate(prevProps, proveState, snap) {
    let { value, } = this.props
    let { showTimes } = this.state
    if (value !== prevProps.value) {
      this.setState({ currentValue: value }, () => {
        this.updateStamp()
      })
    }
    if (showTimes != proveState.showTimes) {
      if (showTimes) {
        let { hour, minute, second } = this.state
        let d = [hour, minute, second].map(x => x * 24)
        let kid = this.timepickerRef.current.children;
        [0, 1, 2].map((e, i) => kid[i].scrollTop = d[i])
      }
    }
  }
  days() {
    const days = [];
    let { year, month } = this.state
    const time = new Date(year, month, 1);
    const dow = 1 // Monday is the first day of the week
    time.setDate(0); // switch to the last day of last month
    let lastDay = time.getDate();
    const week = time.getDay() || 7;
    let count = dow <= week ? week - dow + 1 : week + (7 - dow + 1);
    while (count > 0) {
      days.push({
        d: lastDay - count + 1,
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
      days.push({ d: i, y: year, m: month });
    }
    for (i = 1; days.length < 42; i++) {
      days.push({
        d: i,
        y: month < 11 ? year : year + 1,
        m: month < 11 ? month + 1 : 0,
        n: true
      });
    }
    return days;
  }
  updateStamp(callback) {
    let { currentValue, today } = this.state
    let { mode, float, showTime } = this.props

    let d = new Date(currentValue || today)

    if (mode == 'range' && float == 'right') {
      let value = this.context.DatePicker.state.currentValue || []
      if (new Date(value[1] - value[0]).getMonth() == 0 || !value[1]) {
        let v = new Date(value[0] || today)
        v.setMonth(v.getMonth() + 1)
        d = v
      }
    }
    const year = d.getFullYear()
    this.setYears(year);

    let date = {
      year,
      month: d.getMonth(),
      day: d.getDate()
    }

    if (showTime && currentValue) {
      date.hour = d.getHours()
      date.minute = d.getMinutes()
      date.second = d.getSeconds()
    }

    this.setState(date, () => {
      callback && callback()
    })
  }
  setYears(year) {
    const arr = [];
    let start = year - 1;
    while (arr.length < 12) {
      arr.push(start++);
    }
    this.setState({
      years: arr
    })
  }
  nextMonth() {
    let { month, year } = this.state
    if (month < 11) {
      month++;
    } else {
      month = 0;
      year++;
      this.setYears(year)
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
      this.setYears(year)
    }
    this.setState({ month, year })
  }
  classes(Y, M, D, out, format) {
    let { today, year } = this.state
    let { mode, float, disabledDate } = this.props
    const time = new Date(Y, M, D), fmtTime = moment(time).format(format)
    // console.log(format, fmtTime)
    let istoday = fmtTime == moment(today).format(format),
      isselected = false,
      on = false;
    if (mode == 'range') {
      let { DatePicker } = this.context
      let { currentValue = [], temp_range_one, temp_range_left, temp_range_right, temp_date_hover } = DatePicker.state
      let isDay = format == 'YYYYMMDD'

      //set on
      //range click selected and out
      if (isDay)
        isselected = (temp_range_left && fmtTime == moment(temp_range_left).format(format)) ||
          (temp_range_right && fmtTime == moment(temp_range_right).format(format))
      else
        isselected = fmtTime == moment(this.state.currentValue).format(format);

      if (temp_range_one) {
        // default and not out
        // isselected = fmtTime == moment(this.currentValue).format(format) || isselected
        // hover selected
        if (!temp_range_left || !temp_range_right) {
          let { y, m, d } = temp_date_hover,
            date = new Date(y, m, d);
          if (!out && isDay) {
            isselected = isselected || (Y == y && M == m && D == d)
          }
          isDay && (on = (time > temp_range_one && time < date) || (time > date && time < temp_range_one))
        }
      } else {
        if (temp_range_left || temp_range_right) {
          isDay && (on = (time > temp_range_left && time < temp_range_right) || (time > temp_range_right && time < temp_range_left))
        } else if (currentValue.length == 2 && isDay) {
          isselected = isselected ||
            (currentValue[0] && fmtTime == moment(currentValue[0]).format(format)) ||
            (currentValue[1] && fmtTime == moment(currentValue[1]).format(format));
          isDay && (on = time > new Date(currentValue[0]) && time < new Date(currentValue[1]))
        }
      }
    } else {
      isselected = fmtTime == moment(this.state.currentValue).format(format)
    }
    let disabled = disabledDate(time)

    let classes = {
      'k-calendar-date': true,
      'k-calendar-date-today': istoday,
      'k-calendar-date-on': on && !out && !disabled,
      'k-calendar-date-selected': isselected && !out,
      'k-calendar-date-disabled': disabled,
      'k-calendar-date-out': out
    }
    return this.className(classes)
  }
  setMonth(e, m) {
    e.stopPropagation();
    if (e.target.className.indexOf('k-calendar-date-disabled') >= 0) {
      return
    }
    this.setState({
      month: m,
      currentValue: new Date(this.state.currentValue).setMonth(m)
    }, () => {
      if (this.props.mode == 'month') {
        this.setDate()
      } else {
        this.setState({
          showMonths: false
        })
      }
    })

  }
  setYear(e, y) {
    e.stopPropagation();
    e.preventDefault()
    if (e.target.className.indexOf('k-calendar-date-disabled') >= 0) {
      return
    }
    this.setState({
      year: y
    })
    let { years, currentValue } = this.state
    if (years.indexOf(y) == 0) {
      this.setYears(y - 10)
      return;
    }
    if (years.indexOf(y) == 11) {
      this.setYears(y)
      return;
    }
    currentValue = new Date(this.currentValue).setYear(y)
    this.setState({
      currentValue,
      showYears: false
    })
    if (this.props.mode == 'year') {
      this.props.onChange && this.props.onChange(currentValue)
    }
  }
  setDay(e, j) {
    e.stopPropagation();
    if (e.target.className.indexOf('k-calendar-date-disabled') >= 0) {
      return
    }
    let { y, m, d, p, n } = j
    let { float, showTime } = this.props
    if (this.props.mode == 'range') {
      // let value = this.DatePicker.currentValue || [];
      let { hour, minute, second } = this.state
      let date = new Date(y, m, d, hour, minute, second)
      let time = [];
      let { DatePicker } = this.context
      let { temp_range_one } = DatePicker.state
      if (!temp_range_one) {
        DatePicker.setState({
          temp_range_left: date,
          temp_range_right: null,
          temp_range_one: date,
        })

        // this.DatePicker.currentValue = []

      } else {
        DatePicker.setState({
          temp_range_right: date,
          temp_range_one: null
        })
        if (!showTime) {
          time = temp_range_one < date ? [temp_range_one, date] : [date, temp_range_one]
          // this.DatePicker.currentValue = time
          this.props.onChange && this.props.onChange(time)
        }
      }
      if ((float == 'right' && n) || (float == 'left' && p)) {
        this.setState({
          currentValue: date,
          year: y,
          month: m,
          day: d,
        })
      }

    } else {
      this.setState({
        year: y,
        month: m,
        day: d,
        currentValue: new Date(y, m, d),
      }, () => {
        if (!showTime) {
          this.setDate()
        }
      })
    }
  }
  fix(v) {
    return ('0' + v).slice(-2)
  }
  timeClass(v, f, d = []) {
    let { hour, minute, second } = this.state
    let date = new Date('', '', '', hour, minute, second)
    let isselected = this.fix(v) == moment(date).format(f)
    let classes = {
      'k-calendar-time-selected': isselected,
      'k-calendar-time-disabled': d.indexOf(v) >= 0,
    }
    return this.className(classes)
  }
  getTime(l, t) {
    let { disabledHours, disabledMinutes, disabledSeconds } = this.props.disabledTime() || {}
    let x = { HH: disabledHours, mm: disabledMinutes, ss: disabledSeconds }
    let d;
    if (typeof x[t] == 'function') {
      d = x[t]()
    }
    return new Array(l).fill('').map((i, j) =>
      <li key={j} onClick={e => this.setTime(j, t, e)} className={this.timeClass(j, t, d)}>{this.fix(j)}</li>)
  }
  setShowTime() {
    this.setState({
      showMonths: false,
      showYears: false,
    })
    let { showTimes } = this.state
    if (this.props.mode == 'range') {
      let { DatePicker } = this.context
      let { temp_range_showtime } = DatePicker.state
      temp_range_showtime = !temp_range_showtime
      DatePicker.setState({
        temp_range_showtime
      })
      showTimes = temp_range_showtime
    } else {
      showTimes = !showTimes
    }
    this.setState({ showTimes })
  }
  setShowYear() {
    let { showTimes, showYears } = this.state
    !showTimes && (this.setState({ showYears: !showYears }))
  }
  setShowMonth(e) {
    let { showTimes, showMonths } = this.state
    !showTimes && (this.setState({ showMonths: !showMonths }))
  }
  setTime(v, t, e) {
    if (e.target.className.indexOf('k-calendar-time-disabled') >= 0) {
      return;
    }
    // let date = new Date();
    // let { mode, float } = this.props
    // if (mode == 'range') {
    //   let { DatePicker } = this.context
    //   let { currentValue, temp_range_left, temp_range_right } = DatePicker.state
    //   date = float == 'left' ? temp_range_left || currentValue[0] : temp_range_right || currentValue[1]
    // }
    let { currentValue, hour, minute, second } = this.state
    switch (t) {
      case 'HH':
        hour = v;
        currentValue = new Date(currentValue).setHours(v)
        break;
      case 'mm':
        minute = v;
        currentValue = new Date(currentValue).setMinutes(v)
        break;
      case 'ss':
        second = v;
        currentValue = new Date(currentValue).setSeconds(v)
        break;
      default: ;
    }
    this.setState({ currentValue, hour, minute, second }, () => {
      this.setTimeScroll()
    })
  }
  setTimeScroll() {
    let { hour, minute, second } = this.state
    let d = [hour, minute, second].map(x => x * 24)
    let kid = this.timepickerRef.current.children;
    animate({
      draw: function (progress) {
        [0, 1, 2].map((e, i) => kid[i].scrollTop += progress * (d[i] - kid[i].scrollTop))
      }
    })
  }
  setDate() {
    if (this.props.mode == 'range') {
      let { DatePicker } = this.context
      let { currentValue, temp_range_left, temp_range_right } = DatePicker.state

      let t1 = temp_range_left || currentValue[0],
        t2 = temp_range_right || currentValue[1];
      let date = t1 > t2 ? [t2, t1] : [t1, t2]
      this.props.onChange && this.props.onChange(date)
    } else {
      let { year, month, day, hour, minute, second } = this.state
      let date = new Date(year, month, day, hour, minute, second)
      this.setState({
        showTimes: false,
        showMonths: false,
        showYears: false,
        currentValue: date,
      })
      this.props.onChange && this.props.onChange(date)
    }
  }
  setToday() {
    this.setState({
      currentValue: new Date()
    }, () => {
      this.updateStamp(() => {
        this.setDate()
      })
    })
  }
  nextYear() {
    let { year, showMonths } = this.state
    year = year + (showMonths ? 1 : 10)
    this.setState({ year })
    this.setYears(year)
  }
  prevYear() {
    let { year, showMonths } = this.state
    year = year - (showMonths ? 1 : 10)
    this.setState({ year })
    this.setYears(year)
  }

  render() {
    let { disabledDate, mode, showTime, float, } = this.props
    let { DatePicker } = this.context

    let { year, month, day, years,
      weeks, months, currentValue, showYears, showMonths,

      showTimes, } = this.state
    const { temp_range_showtime, temp_range_left, temp_range_right } = DatePicker.state

    let isRange = mode == 'range', values = DatePicker.state.currentValue || [];
    let temp_left, temp_right;
    if (isRange) {
      showTimes = temp_range_showtime
      temp_left = temp_range_left || values[0]
      temp_right = temp_range_right || values[1]
    }
    showMonths = showMonths || mode == 'month'
    showYears = showYears || mode == 'year'

    //header
    let headNode = []
    if (!showTimes)
      headNode.push(<span className="k-calendar-prev-year-btn" key="preY" onClick={this.prevYear.bind(this)}>«</span>)
    if ((!showYears && !showMonths && !showTimes))
      headNode.push(<span className="k-calendar-prev-month-btn" key="preM" onClick={this.prevMonth.bind(this)}>‹</span>)
    headNode.push(<span className="k-calendar-year-select" key="yearS" onClick={this.setShowYear.bind(this)}>{year}年</span>)
    if (!showYears && !showMonths) {
      headNode.push(<span className="k-calendar-month-select" key="monthS" onClick={this.setShowMonth.bind(this)}>{month + 1}月</span>)
      if (!showTimes)
        headNode.push(<span className="k-calendar-next-month-btn" key="nextM" onClick={this.nextMonth.bind(this)}>›</span>)
      else
        headNode.push(<span className="k-calendar-day-select" key="dayS">{day}日</span>)
    }
    if (!showTimes)
      headNode.push(<span className="k-calendar-next-year-btn" key="nextY" onClick={this.nextYear.bind(this)}>»</span>)

    //body
    const bodyNode = []
    if (mode == 'date' || isRange) {
      let weekNode = weeks.map(w => <span className="k-calendar-week" key={w}>{w}</span>)
      const getDay = (j, x) => {
        const props = {
          className: this.classes(j.y, j.m, j.d, j.p || j.n, 'YYYYMMDD'),
          onClick: e => this.setDay(e, j),
          onMouseEnter: () => {
            DatePicker.setState({ temp_date_hover: j })
          },
          key: x
        }
        return <span {...props}>{j.d}</span>
      }
      let dayNode = this.days().map((j, x) => getDay(j, x))
      const daysNode = <div className="k-calendar-days" key="days">{weekNode}{dayNode}</div>
      bodyNode.push(daysNode)
    }
    if (showMonths) {
      const m = months.map((i, j) => <span key={i} className={this.classes(year, j, day, null, 'YYYYMM')} onClick={(e) => this.setMonth(e, j)}>{i + '月'}</span >)
      const mouthNode = <div className="k-calendar-months" key="months">{m}</div>
      bodyNode.push(mouthNode)
    }
    if (showYears) {
      const y = years.map((i, j) => <span key={j} className={this.classes(i, month, day, (j == 0 || j == 11), 'YYYY')} onClick={(e) => this.setYear(e, i)}>{i}</span >)
      const yearNode = <div className="k-calendar-years" key="years">{y}</div>
      bodyNode.push(yearNode)
    }
    //footer
    let footerNode = []

    if (showTimes) {
      let time = []
      //hours
      let h = this.getTime(24, 'HH')
      time.push(h)
      //m
      let m = this.getTime(60, 'mm')
      time.push(m)
      //s
      let s = this.getTime(60, 'ss')
      time.push(s)
      let picker = time.map((t, i) => <div className="k-calendar-time-picker-select" key={i}><ul>{t}</ul></div>)

      let timeNode = <div className="k-calendar-time-picker" key="timePicker" ref={this.timepickerRef}>{picker}</div>

      bodyNode.push(timeNode)

    }
    if ((showTime && !isRange) || (showTime && isRange && float == 'right')) {
      //footer
      // let disabled = moment()
      let disabled = disabledDate(new Date())
      let time_disabled = isRange ? !(temp_left && temp_right) : (!currentValue);

      !isRange && footerNode.push(<Button type="link" size='small' key="btntoday" disabled={disabled} className="k-calendar-btn-today" onClick={this.setToday.bind(this)}>此刻</Button>);

      footerNode.push(<Button type="link" key="btnLable" size="small" disabled={time_disabled} onClick={this.setShowTime.bind(this)}>{showTimes ? '选择日期' : '选择时间'}</Button>)
      footerNode.push(<Button type="primary" key="btnOk" size='small' disabled={time_disabled} onClick={this.setDate.bind(this)}>确定</Button>)
    } else if (mode == 'date') {
      let disabled = disabledDate(new Date())
      footerNode.push(<Button type="link" key="btntoday" disabled={disabled} block size='small' onClick={this.setToday.bind(this)}>今天</Button>)
    }
    footerNode = footerNode.length || (isRange && showTime) ? <div className="k-calendar-footer" ket="footer">{footerNode}</div> : null
    return (
      <div className="k-calendar">
        <div className="k-calendar-head">{headNode}</div>
        <div className="k-calendar-body">{bodyNode}</div>
        {footerNode}
      </div>
    )
  }
}
