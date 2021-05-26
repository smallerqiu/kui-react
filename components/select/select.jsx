import React from 'react'
import { Kui, PropTypes } from '../kui'
import Transition from '../base/transition'
import Icon from '../icon'
import Option from './option'
import { isNotEmpty } from '../_tool/utils'
import Drop from '../base/drop'
import Empty from '../empty'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default class Select extends Kui {
  static contextTypes = {
    FormItem: PropTypes.any
  }
  static childContextTypes = {
    Select: PropTypes.any
  }
  static defaultProps = {
    placeholder: '请选择',
    size: 'default',
    transfer: true,
  }
  static propTypes = {
    placeholder: PropTypes.string,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    transfer: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.any,
    clearable: PropTypes.bool,
    filterable: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    loading: PropTypes.bool,
    options: PropTypes.array,
    onChange: PropTypes.func,
  }

  state = {
    label: "",
    opened: false,
    currentValue: this.props.value || '',
    showSearch: false,
    queryKey: '',
    selectWidth: this.props.width
  }

  getChildContext() {
    return {
      Select: this
    };
  }

  searchRef = React.createRef();
  elRef = React.createRef()
  overlayRef = React.createRef()
  mirrorRef = React.createRef()

  componentDidUpdate(prevProps, prevState, snap) {
    let { value } = this.props
    if (value !== prevProps.value) {
      if (isNotEmpty(value)) {
        this.setState({ currentValue: value }, () => {
          this.setLabel()
        })
      } else {
        this.setState({ label: '', currentValue: '' })
      }
      this.FormItem && this.FormItem.testValue(value)
    }
  }

  componentDidMount() {
    if (isNotEmpty(this.props.value)) {
      this.setLabel()
    }
  }

  hidedrop() {
    if (this.state.showSearch) {
      this.setState({ queryKey: '' })
      this.searchRef.current.value = ''
      this.searchRef.current.style.width = ''
    }
    this.setState({ showSearch: false })
  }
  getLabel(kid, labelValue) {
    const obj = kid.map(({ props }) => props).filter(({ value }) => value === labelValue)
    return obj.length ? obj[0].label : ''
  }
  setLabel() {
    let { currentValue, label } = this.state
    let { multiple } = this.props
    // if (!isNotEmpty(currentValue) || currentValue.length == 0) return;
    let kid = this.getOptions()
    let currentLabel = label || ''
    if (multiple) {
      currentLabel = currentLabel || []
      currentValue = currentValue || []
      if (currentValue.length) {
        let labels = []
        let index = -1
        currentValue.forEach((value) => {
          let Label = this.getLabel(kid, value)
          labels.push({ label: Label, key: `label_${index++}`, value })
        })
        currentLabel = labels
      } else {
        currentLabel = []
      }

    } else {
      currentLabel = this.getLabel(kid, currentValue)
    }
    this.setState({ label: currentLabel })
    setTimeout(e => { this.setPosition() }, 230);

  }
  clear(e) {
    this.setState({ label: '', currentValue: '' })
    this.props.onChange && this.props.onChange('')
    e.stopPropagation()
  }
  showDrops() {
    let { opened, queryKey } = this.state
    opened = !opened
    this.setState({ opened }, () => {

      if (this.props.filterable || this.props.onSearch) {
        if (!opened) queryKey = ''
        this.setState({ showSearch: opened }, () => {
          const { current } = this.searchRef
          opened ? current.focus() : current.blur()
          clearTimeout(this.clearKeyTimer)
          this.clearKeyTimer = setTimeout(() => {
            this.setState({ queryKey })
          }, 200);
        })
      }
      this.setPosition()
    })
  }
  toggleDrop() {
    if (this.props.disabled) {
      return false;
    }
    if (this.props.onSearch) {
      this.setState({ showSearch: true }, () => {
        this.searchRef.current.focus()
      })
      return;
    }
    this.showDrops()
  }
  setPosition() {
    if (!this.props.width) {
      this.setState({ selectWidth: this.elRef.current.offsetWidth })
    }
    if (this.state.opened) {
      this.overlayRef.current.setPosition()
    }
  }
  change(item) {
    let { multiple, value, onChange, onSearch, filterable } = this.props
    let { currentValue, showSearch, label } = this.state
    if (showSearch) {
      this.setState({ queryKey: '' })
      this.searchRef.current.value = ''
      this.searchRef.current.style.width = ''
    }
    if (!multiple) {
      this.setState({ opened: false, showSearch: false })
    } else if (onSearch != null || filterable) {
      this.searchRef.current.focus()
    }
    let hasValue = isNotEmpty(value)

    //set value
    if (multiple) {
      if (!hasValue) {
        value = currentValue || []
      }
      let index = value.indexOf(item.value)
      if (index === -1) {
        value.push(item.value)
      } else {
        value.splice(index, 1)
      }

    } else {
      value = item.value
    }
    this.setState({ currentValue: value })

    //set label
    if (multiple) {
      let currentLabel = label || []
      let index = currentLabel.findIndex(x => x.value === item.value)//  .map(x => x.label).indexOf(item.label)
      if (index === -1) {
        currentLabel.push({ label: item.label, key: item.label + item.value, value: item.value })
      } else {
        currentLabel.splice(index, 1)
      }
      label = currentLabel
    } else {
      label = item.label
    }
    this.setState({ label }, () => {
      setTimeout(() => { this.setPosition() }, 230);
    })
    onChange && onChange(value)
  }
  removeTag(e, i) {
    let { disabled } = this.props
    if (disabled) return
    let { currentValue, label } = this.state
    let values = currentValue || []
    let labels = label || []
    this.change({ value: values[i], label: labels[i].label })
    e.stopPropagation()
  }
  searchInput(e) {
    const { current } = this.searchRef
    this.setState({ queryKey: current.value }, () => {
      current.style.width = this.mirrorRef.current.offsetWidth + 'px'
      this.setPosition()
    })

    if (this.props.onSearch) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.opened = true;
        this.setState({ opened: true })
        this.props.onSearch(current.value)
      }, 500);
    }
  }
  emptyClick(e) {
    if (this.state.showSearch) {
      this.searchRef.current.focus()
    }
  }
  getOptions() {
    let { options, children, filterable } = this.props
    let { queryKey } = this.state
    let kid = null
    let index = -1
    if (Array.isArray(options)) {
      kid = options.map((k, i) => {
        const key = k.key || `opt_${index++}`
        let prop = {
          ...k,
          eventKey: key,
          key
        }
        return <Option {...prop} />
      })
    } else {
      kid = React.Children.map(children, (child) => {
        return React.cloneElement(child, { eventKey: child.key || `opt_${index++}` })
      })
    }
    if (filterable && queryKey) {
      let parsedQuery = String(queryKey).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, "\\$1");
      let Reg = new RegExp(parsedQuery, 'i')

      kid = kid.filter(({ props }) => {
        return Reg.test(props.label)
      })
    }
    return kid
  }

  render() {
    let { disabled, filterable, width, size, multiple, onSearch,
      placeholder, clearable, loading, transfer } = this.props
    let { opened, label, queryKey, showSearch, selectWidth } = this.state
    let childNode = []

    const classes = [
      "k-select",
      {
        ["k-select-disabled"]: disabled,
        ["k-select-open"]: opened,
        ["k-select-lg"]: size == 'large',
        ["k-select-sm"]: size == 'small'
      }
    ]

    const queryProps = {
      onChange: (e) => this.searchInput(e),
      ref: this.searchRef,
      className: 'k-select-search',
      autoComplete: 'off',
      value: queryKey
    }

    const queryNode = <div key="search"
      className="k-select-search-wrap"
    >
      <input {...queryProps} />
      <span className="k-select-search-mirror" ref={this.mirrorRef}>{queryKey}</span>
    </div>

    let kid = this.getOptions()
    // kid = (
    //   !kid.length
    //     ? <li className="k-select-empty" onClick={this.emptyClick}><Icon type="albums" /><p className="k-empty-desc">暂无数据</p></li>
    //     : kid
    // )
    const loadingNode = <div className="k-select-loading" key="loading"><Icon type="sync" spin /><span>加载中...</span></div>
    const props = {
      ref: this.overlayRef,
      width: selectWidth,
      show: opened,
      selectionRef: this.elRef,
      // transfer: false,
      transfer,
      transitionName: 'k-select',
      className: this.className(['k-select-dropdown', { 'k-select-dropdown-multiple': this.multiple }]),
      onClose: () => {
        this.setState({ opened: false })
        setTimeout(() => {
          this.hidedrop()
        }, 300);
      }
    }
    let overlay = <Drop {...props}>{loading ? loadingNode : (!kid.length ? <Empty onClick={this.emptyClick.bind(this)} /> : <ul>{kid}</ul>)}</Drop>

    label = multiple ? (label || []) : label
    const placeNode = ((placeholder && ((!label || !label.length) && !queryKey))
      ? <div className="k-select-placeholder" key="placeholder">{placeholder}</div>
      : null
    )
    const tags = multiple ?
      label.map((c, i) => {
        return <CSSTransition timeout={200} classNames="k-select-tag" key={c.key}>
          <span className="k-select-tag" >
            {c.label}
            <Icon type="close" onClick={e => this.removeTag(e, i)} />
          </span>
        </CSSTransition>
      })
      : null

    const labelStyle = {
      opacity: showSearch ? .4 : 1,
      display: queryKey.length ? 'none' : ''
    }
    const labelsNode = (multiple
      ? (
        <div className="k-select-labels" key="labels">
          <TransitionGroup>
            {tags}
          </TransitionGroup>
          {queryNode}
        </div>
      )
      : <div className="k-select-label" key="labels" style={labelStyle}>{label}</div>
    )
    let isSearch = onSearch != null
    childNode.push(labelsNode)
    childNode.push(placeNode)

    !isSearch && childNode.push(<Icon className="k-select-arrow" key="arrowIcon" type="chevron-down" />)

    if ((filterable || isSearch) && !multiple) {
      childNode.push(queryNode)
    }

    const styles = { width }
    let showClear = !disabled && clearable && label && !multiple
    const selectCls = [
      "k-select-selection", {
        "k-select-has-clear": showClear
      }
    ]
    showClear && childNode.push(<Icon className="k-select-clearable" key="clearIcon" type="close-circle" onClick={this.clear.bind(this)} />)

    return (
      <div tabIndex="0" className={this.className(classes)} style={styles}>
        <div className={this.className(selectCls)}
          onClick={this.toggleDrop.bind(this)} ref={this.elRef}>
          {childNode}
        </div>
        {overlay}
      </div>
    )
  }
}