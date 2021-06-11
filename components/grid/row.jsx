import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Row extends Kui {
  static propTypes = {
    gutter: PropTypes.number,
    type: PropTypes.string,
    justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
    align: PropTypes.oneOf(['top', 'middle', 'bottom'])
  }
  
  static defaultProps = {
  
  }
  
  static childContextTypes = {
    Row: PropTypes.any
  }
  getChildContext() {
    return {
      Row: this
    };
  }
  render() {
    let { children, align, justify, gutter, type } = this.props

    let props = {
      className: this.className(['k-row', {
        'k-row-flex': type == 'flex',
        [`k-row-flex-${justify}`]: justify,
        [`k-row-flex-${align}`]: align,

      }]),
      style: {
        marginLeft: gutter ? gutter / -2 + "px" : null,
        marginRight: gutter ? gutter / -2 + "px" : null,
      }
    }
    return (<div {...props}>{children}</div >)
  }
};

