//利用react-transition-group@2.x 的状态管理 结合 vue transition 和 css3 的 transition 实现 Jqeury toggle
//给需要的 元素加上 css  transition: height .2s ease-in-out;
//by chuchur
import React from 'react'
import { Kui, PropTypes } from '../kui'
import { Transition } from 'react-transition-group';

export default class Collapse extends Kui {
    onEnter(el) {
        el.style.height = 0
        el.style.opacity = 0.1
    }
    onEntering(el) {
        if (el.scrollHeight !== 0) {
            el.style.height = el.scrollHeight + 'px'
            el.style.opacity = 1
        } else {
            el.style.height = ''
            el.style.opacity = ''
        }
    }
    onEntered(el) {
        el.style.height = ''
        el.style.opacity = ''
    }

    onExit(el) {
        el.style.height = el.scrollHeight + 'px'
        el.style.opacity = 1
    }
    onExiting(el) {
        if (el.scrollHeight !== 0) { el.style.height = 0; el.style.opacity = 0 }
    }
    onExited(el) {
        el.style.height = ''
        el.style.opacity = ''
    }

    render() {
        return React.createElement(Transition, {
            onEnter: this.onEnter,
            onEntering: this.onEntering,
            onEntered: this.onEntered,
            onExit: this.onExit,
            onExiting: this.onExiting,
            onExited: this.onExited,
            timeout: 300,
            unmountOnExit:true,
            in: this.props.show,
            // classNames: this.props.classNames
        }, this.props.children)
    }
}
// Collapse.defaultProps={
//     classNames:''
// }

Collapse.propTypes = {
    show: PropTypes.bool,
    // classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}
