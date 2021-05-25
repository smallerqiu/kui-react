import React from 'react'
import { render } from 'react-dom'
import Group from './group'

const newInstance = (props = {}) => {
  const groupRef = React.createRef()
  let component = React.createElement(Group, { ...props, ref: groupRef })
  let popup = document.body.querySelector(`.k-${props.type}-box`)
  if (!popup) {
    popup = document.createElement('div')
    popup.className = `k-${props.type}-box`
    document.body.appendChild(popup)
  }

  render(component, popup)

  return groupRef.current
}

export default newInstance