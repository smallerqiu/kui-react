import React from 'react';
import Render from 'react-dom';

import notice from './notice'

let Message = {}
let Notice = {}

let docker = []

let Instance = (props) => {
    docker =  docker || []
    let popup = document.body.querySelector(`.k-${props.noticeType}`)
    if (!popup) {
        popup = document.createElement('div')
        popup.className = `k-${props.noticeType}`
        document.body.appendChild(popup)
    }
    let component = React.createElement(notice, Object.assign(props, {
        key: new Date() * 1,
        onExited: (e) => {
            docker.splice(docker.indexOf(component), 1)
        }
    }))
    docker = [].concat(docker, component)
    Render.render(docker, popup)
}



Message.config = (props) => {
    props.noticeType = 'message'
    Instance(props)
}

['info', 'success', 'warning', 'error'].forEach(type => {
    Message[type] = (content, duration, onClose) => Instance({ noticeType: 'message', type, content, duration, onClose })
});

Notice.open = (props) => {
    Instance(Object.assign({ noticeType: 'notice', type: null, transitionName: 'fadeleft' }, props))
}
['info', 'success', 'warning', 'error'].forEach(type => {
    Notice[type] = (props) => Instance(Object.assign({ noticeType: 'notice', transitionName: 'fadeleft', type }, props))
});



export { Notice, Message }
