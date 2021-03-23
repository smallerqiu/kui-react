import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Col extends Kui {

  parseFlex = (flex) => {
    if (typeof flex === 'number') {
      return `${flex} ${flex} auto`;
    }
    if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
      return `0 0 ${flex}`;
    }
    return flex;
  }

  render() {
    let { offset, span, children, flex } = this.props
    const gutter = this.context.Row ? this.context.Row.gutter : 0
    const props = {
      className: this.className([`k-col`, {
        [`k-col-${span}`]: span,
        [`k-col-offset-${offset}`]: offset > 0 && offset <= 24
      }]),
      style: {
        paddingLeft: gutter / 2,
        paddingRight: gutter / 2,
        flex: flex ? this.parseFlex(flex) : null
      }
    }
    return (<div {...props}>{children}</div>)
  }
};

Col.propTypes = {
  span: PropTypes.number,
  offset: PropTypes.number,
  flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Col.contextTypes = {
  Row: PropTypes.any
};