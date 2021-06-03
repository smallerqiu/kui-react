import React from 'react'
import { Kui, PropTypes } from '../kui'
import DateCalendar from './datecalendar'
import Drop from '../base/drop'
import Icon from '../icon'
import { isNotEmpty } from '../_tool/utils'
import moment from 'moment'

export default class DatePicker extends Kui {


  static contextTypes = {
    FormItem: PropTypes.any
  }
  static childContextTypes = {
    DatePicker: PropTypes.any
  }

  static defaultProps = {
    mode: 'date',
    format: 'YYYY-MM-DD',
    size: 'default',
    clearable: true,
    bordered: true,
    transfer: true,
  }
  static propTypes = {
    value: PropTypes.any,
    mode: PropTypes.string,
    showTime: PropTypes.bool,
    disabled: PropTypes.bool,
    format: PropTypes.string,
    clearable: PropTypes.bool,
    bordered: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    placeholder: PropTypes.oneOfType(PropTypes.string, PropTypes.array)
  }
  state = {
    opened: false,
    currentValue: this.props.value,
    leftPicker: null,
    rightPicker: null,
    temp_date_hover: {}, //range hover date
    temp_range_one: null, //range one select
    temp_range_left: null, // range left value
    temp_range_right: null, // range right value
    temp_range_showtime: false, //range showtime
  }

  elRef = React.createRef()

  getChildContext() {
    return {
      DatePicker: this
    }
  }


  componentDidUpdate(prevProps, prevState, snap) {
    let { value } = this.props
    if (value != prevProps.value) {
      this.setState({ currentValue: value })
      this.context.FormItem && this.context.FormItem.testValue(value)
    }
  }

  getDate(value) {
    let { format, mode, showTime } = this.props

    let isDefaultFormat = format == 'YYYY-MM-DD'
    if (mode == 'range') {
      if (isDefaultFormat) {
        if (showTime) {
          format = 'YYYY-MM-DD HH:mm:ss'
        }
      }
      value = value || []
      let label = []

      let [v1, v2] = value
      v1 = v1 ? new Date(v1) : ''
      v2 = v2 ? new Date(v2) : ''


      if (v1) label[0] = moment(v1).format(format)
      if (v2) label[1] = moment(v2).format(format)
      return label
    } else {
      if (isDefaultFormat) {
        if (mode == 'month') {
          format = 'YYYY-MM'
        }
        if (mode == 'year') {
          format = 'YYYY'
        }
        if (showTime) {
          format = 'YYYY-MM-DD HH:mm:ss'
        }
      }
      return value ? moment(value).format(format) : ''
    }
  }

  updateValue(value) {
    let date = this.getDate(value)
    this.props.onChange && this.props.onChange(date)
    this.setState({
      currentValue: value,
      opened: false,
      temp_date_hover: {},
      temp_range_one: null,
      temp_range_left: null,
      temp_range_right: null,
      temp_range_showtime: false,
    })
  }

  clear(e) {
    let { currentValue, temp_range_one } = this.state

    if (Array.isArray(currentValue)) {
      currentValue = []
      temp_range_one = null
    } else {
      currentValue = ''
    }
    this.setState({ currentValue, temp_range_one })
    this.props.onChange && this.props.onChange(currentValue)

    e.stopPropagation()
  }
  toggleDrop() {
    if (this.props.disabled) {
      return false;
    }
    this.setState({ opened: !this.state.opened })
  }

  render() {
    let { placeholder, disabled, clearable,
      size, transfer, showTime, bordered,
      format, mode, disabledTime, disabledDate,
    } = this.props
    let { opened, currentValue } = this.state
    let childNode = [], isRange = mode == 'range';

    const label = this.getDate(currentValue)

    childNode.push(<Icon type="calendar-outline" key="calendarIcon" className="k-icon-calendar" />)
    if (isRange) {
      placeholder = placeholder || []
      if (placeholder && !Array.isArray(placeholder)) {
        console.error('Please set placeholder as array !')
        placeholder = []
      }
      let [p1 = '开始日期', p2 = '结束日期'] = placeholder
      let [v1, v2] = label
      if (v1) {
        childNode.push(<div className="k-datepicker-value" key="leftValue">{v1}</div>)
      } else {
        childNode.push(<div className="k-datepicker-placeholder" key="placeholder1">{p1}</div>)
      }
      childNode.push(<div className="k-datepicker-separator" key="separator">~</div>)
      if (v2) {
        childNode.push(<div className="k-datepicker-value" key="rightValue">{v2}</div>)
      } else {
        childNode.push(<div className="k-datepicker-placeholder" key="placeholder2">{p2}</div>)
      }
    } else {
      placeholder = placeholder || '请选择日期'
      if (label) {
        childNode.push(<div className="k-datepicker-value" key="leftValue">{label}</div>)
      } else if (placeholder) {
        childNode.push(<div className="k-datepicker-placeholder" key="placeholder">{placeholder}</div>)
      }
    }


    let calendar = []
    if (isRange) {
      currentValue = currentValue || []
      let v1 = currentValue[0] || '', v2 = currentValue[1] || '';
      let leftProps = {
        format, mode, disabledTime,
        disabledDate, showTime, float: 'left', value: v1,
        key: 'left',
        onChange: e => this.updateValue(e)
      }
      let rightProps = {
        key: 'right',
        format, mode, disabledTime,
        disabledDate, showTime, float: 'right', value: v2,
        onChange: e => this.updateValue(e)
      };
      calendar.push(<DateCalendar {...leftProps} />, <DateCalendar {...rightProps} />)
    } else {
      const props = {
        key: 'left',
        Context: this.Context,
        format, mode, disabledTime, disabledDate, showTime, value: currentValue,
        onChange: e => {
          this.updateValue(e);
          this.setState({ opened: false })
        }
      }
      calendar.push(<DateCalendar {...props} />)
    }
    const props = {
      className: this.className(['k-datepicker-dropdown', { 'k-datepicker-range-dropdown': isRange }]),
      transfer,
      selectionRef: this.elRef,
      show: opened,
      transitionName: 'k-date-picker',
      onClose: () => {
        this.setState({ opened: false })
        setTimeout(() => this.setState({
          temp_date_hover: {},
          temp_range_one: null,
          temp_range_left: null,
          temp_range_right: null,
          temp_range_showtime: false,
        }), 200);
      },
    }
    let overlay = <Drop {...props}>{calendar}</Drop >

    let showClear = !disabled && clearable && isNotEmpty(label) && label.length > 0
    showClear && childNode.push(<Icon className="k-datepicker-clearable" key="clearableIcon" type="close-circle" onClick={this.clear.bind(this)} />)
    const selectCls = [
      "k-datepicker-selection", {
        "k-datepicker-has-clear": showClear
      }
    ]
    const classes = ['k-datepicker',
      { 'k-datepicker-open': opened },
      { 'k-datepicker-range': isRange },
      { 'k-datepicker-borderless': bordered === false },
      { 'k-datepicker-sm': size == 'small' },
      { 'k-datepicker-lg': size == 'large' },
      { 'k-datepicker-disabled': disabled },
    ]
    return (
      <div tabIndex="0" className={this.className(classes)} style={this.styles()}>
        <div className={this.className(selectCls)} ref={this.elRef} onClick={this.toggleDrop.bind(this)}>
          {childNode}
        </div>
        {overlay}
      </div>
    )
  }
}

