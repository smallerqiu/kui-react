import React from 'react'
import { Kui, PropTypes } from '../kui'
export default class Divider extends Kui {
  static propTypes = {
    type: PropTypes.oneOf(['horizontal', 'vertical']),
    text: PropTypes.string,
    dashed: PropTypes.bool,
    orientation: PropTypes.oneOf(['left', 'right', 'center'])
  }

  static defaultProps = {
    type: 'horizontal',
    orientation: 'center'
  }
  render() {
    let { type, text, orientation, dashed, children } = this.props
    let textNode = children || text

    const classes = this.className([
      'k-divider', {
        [`k-divider-${type}`]: type,
        'k-divider-dashed': dashed,
        [`k-divider-with-text-${orientation}`]: orientation && textNode,
      }
    ])

    return <div className={classes}>
      {textNode ? <span className="k-divider-inner-text">{textNode}</span> : null}
    </div>

  }
}