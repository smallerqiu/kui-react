import React from 'react'
import { Kui, PropTypes } from '../kui'
import icons from 'kui-icons'

export default class Icon extends Kui {
  procss(str) {
    if (str) {
      //string to json
      let o = str.split(';')
      let obj = o.reduce((n, m) => {
        if (m) {
          let x = m.split(':')
          if (x[0] && !(x[0] in n)) {
            n[x[0]] = x[1]
          }
        }
        return n
      }, {})
      //替换驼峰
      for (let o in obj) {
        let i = o.indexOf('-')
        if (i >= 0) {
          let key = o.replace('-', '').replace(o[i + 1], o[i + 1].toUpperCase())
          obj[key] = obj[o]
          delete obj[o]
        }
      }
      return obj
    }
    return null
  }
  render() {
    const { size, color, onClick, type, spin } = this.props
    const props = {
      className: this.className(['k-icon', { 'k-load-loop': spin }]),
      style: this.styles({
        fontSize: size ? Number(size) : null,
        color
      }),
      onClick
    }

    const pathNode = (icons[type] || []).map((i, x) => {
      return <path key={x} d={i.d} style={this.procss(i.s || 'fill:currentColor;')} />
    })
    return <i {...props}><svg id={type} viewBox='0 0 512 512' width="1em" height="1em">{pathNode}</svg></i>
  }
}

Icon.propTypes = {
  spin: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string
}

Icon.defaultProps = {

}
