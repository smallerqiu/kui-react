import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '../icon'
import Collapse from './collapse.js'

export default class Panel extends Kui {
    constructor(props) {
        super(props)
        this.state = {
            actived: props.actived
        }
    }
    classes() {
        return this.className(['k-collapse-item', {
            ['k-collapse-item-active']: this.state.actived
        }])
    }
    handelClick() {
        if (this.props.onClick) {
            this.props.onClick()
        } else {
            this.setState({ actived: !this.state.actived })
        }
    }
    componentWillReceiveProps(props) {
        if (props.actived != this.state.actived) {
            this.setState({ actived: props.actived })
        }
    }
    render() {
        return (<div className={this.classes()} style={this.styles()}>
            <div className="k-collapse-header" onClick={this.handelClick.bind(this)}>
                <Icon type="ios-arrow-forward" />{this.props.title}</div>
            <Collapse show={this.state.actived}>
                <div className="k-collapse-content">
                    <div className="k-collapse-content-box">
                        {this.props.children}
                    </div>
                </div>
            </Collapse>
        </div>)
    }
}

Panel.propTypes = {
    onClick: PropTypes.any,
    title: PropTypes.string.isRequired,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    actived: PropTypes.bool,
}
