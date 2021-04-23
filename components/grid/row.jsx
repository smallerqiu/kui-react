import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Row extends Kui {
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
        marginLeft: (gutter / -2) + 'px',
        marginRight: (gutter / -2) + 'px'
      }
    }
    return (<div {...props}>{children}</div >)
  }
};

Row.propTypes = {
  gutter: PropTypes.number,
  type: PropTypes.string,
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  align: PropTypes.oneOf(['top', 'middle', 'bottom'])
}

Row.defaultProps = {

}

Row.childContextTypes = {
  Row: PropTypes.any
};