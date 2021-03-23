import React from 'react'
import { Kui, PropTypes } from '../kui'
import Panel from './panel'
export default class Collapse extends Kui {
    constructor(props) {
        super(props)
        this.state = {
            activeName: props.value === undefined ? '' : props.value
        }
    }
    classes() {
        return this.className(['k-collapse', {
            ['k-collaplse-sample']: this.props.sample
        }])
    }
    onClick(name, actived) {
        this.setState({ activeName: !actived ? name : '' })
        this.props.onChange && this.props.onChange(actived)
    }

    render() {
        let { activeName } = this.state
        let renderPanel = () => {
            return React.Children.map(this.props.children, (child, index) => {
                if (child.type != Panel) return null
                let props = {}
                let name = child.props.name === undefined ? index : child.props.name
                props.name = name
                let actived = Array.isArray(activeName) ? activeName.indexOf(name) >= 0 : activeName === name
                props.actived = actived
                if (this.props.accrodion) {
                    props.onClick = this.onClick.bind(this, name, actived)
                }

                return React.cloneElement(child, Object.assign({}, child.props, props))
            })
        }
        return (<div className={this.classes()} style={this.styles()}>
            {renderPanel()}
        </div>)
    }
}
Collapse.propTypes = {
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    accrodion: PropTypes.bool,
    sample: PropTypes.bool
} 
