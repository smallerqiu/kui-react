import React from 'react'
import Modal from './modal'
import RDOM from 'react-dom'
import Toast from './toast'




let createInstance = (props = {}) => {

  const toastRef = React.createRef()
  let popup = document.createElement('div')
  const onDestroy = () => {
    modalList.splice(modalList.indexOf(toastRef.current), 1)
    RDOM.unmountComponentAtNode(popup)
    if (document.body.contains(popup))
      document.body.removeChild(popup)
  }
  let component = React.createElement(Toast, { ...props, ref: toastRef, onDestroy })
  document.body.appendChild(popup)

  // Render.render(component, popup)
  RDOM.render(component, popup)

  // return toastRef.current
  return toastRef.current
}

let modalList = [];

let getModal = (props = {}) => {
  let instance = createInstance(props)
    instance.show()
  modalList.push(instance)
  return instance
}

['info', 'success', 'warning', 'error', 'confirm'].forEach(type => {
  Modal[type] = (props = {}) => getModal(Object.assign({ type }, props))
})

Modal.show = (props = {}) => {
  return getModal(props)
}

Modal.destroyAll = e => {
  modalList.forEach(modal => {
    modal.destroy()
  })
}

export default Modal