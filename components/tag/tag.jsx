import React from 'react'
import { Kui, PropTypes } from '../kui'
import Transition from '../transition'
export default class Tag extends Kui {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            isDefaultColor: ['blue', 'red', 'orange', 'gray', 'green'].indexOf(props.color) >= 0
        }
    }
    classes() {
        return this.className(['k-tag', {
            [`k-tag-${this.props.color}`]: this.state.isDefaultColor,
            ['k-tag-has-color']: this.props.color
        }])
    }
    tagStyles() {
        return this.state.isDefaultColor ? {} : { backgroundColor: this.props.color }
    }
    handle(e) {
        this.props.onClick && this.props.onClick(e)
    }
    onClose(e) {
        this.props.onClose && this.props.onClose(e)
        this.setState({ visible: false })
    }
    componentDidMount() {
        this.setState({ visible: true })
    }
    render() {
        let { children, closeable } = this.props
        return (<Transition name="fade" show={this.state.visible}>
            <div className={this.classes()} style={this.styles(this.tagStyles())} onClick={this.handle.bind(this)}>
                <span className="k-tag-text">
                    {children}
                </span>
                {closeable && <i className="k-ion-md-close" onClick={this.onClose.bind(this)} />}
            </div>
        </Transition>)
    }
}
Tag.propTypes = {
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    color: PropTypes.string
}
