import React from 'react'
import { Kui, PropTypes } from '../kui'
import Checkbox from './checkbox'
export default class CheckboxGroup extends Kui {

  constructor(props) {
    super(props)
    this.state = {
      options: this.props.value || []
    }
  }
  getChildContext() {
    return {
      CheckboxGroup: this
    };
  }

  componentWillReceiveProps(props) {
    if (props.value != this.props.value) {
      this.setState({
        options: props.value
      })
    }
  }

  onChange(value, checked) {
    let index = this.state.options.indexOf(value)
    let options = this.state.options
    if (checked) {
      index < 0 && options.push(value)
    } else {
      options.splice(index, 1)
    }
    this.setState({options:options})
    //this.forceUpdate();
    this.props.onChange && this.props.onChange(options)
    this.props.onFormItemChange && this.props.onFormItemChange(options)
  }

  render() {

    return (<div className={this.className('k-checkbox-group')} style={this.styles()}>
      {
        React.Children.map(this.props.children, child => {
          if (!child || child.type !== Checkbox) {
            return null
          }
          return React.cloneElement(child, Object.assign({}, child.props, {
            checked: child.props.checked || this.state.options.indexOf(child.props.label || child.props.children)>=0,
            onChange: this.onChange.bind(this, child.props.label || child.props.children)
          }))
        })
      }
    </div>)
  }
}
CheckboxGroup.childContextTypes = {
  CheckboxGroup: PropTypes.any
};
CheckboxGroup.defaultProps = {
  value: []
}
CheckboxGroup.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func
}
