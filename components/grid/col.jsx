import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Col extends Kui {
  static propTypes = {
    span: PropTypes.number,
    offset: PropTypes.number,
    flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static contextTypes = {
    Row: PropTypes.any
  }
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
    const gutter = this.context.Row ? this.context.Row.props.gutter : 0
    const props = {
      className: this.className([`k-col`, {
        [`k-col-${span}`]: span,
        [`k-col-offset-${offset}`]: offset > 0 && offset <= 24
      }]),
      style: {
        paddingLeft: gutter ? `${gutter / 2}px` : null,
        paddingRight: gutter ? `${gutter / 2}px` : null,
        flex: flex ? this.parseFlex(flex) : null
      }
    }
    return (<div {...props}>{children}</div>)
  }
};

