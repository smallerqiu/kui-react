
import React from 'react'
import Code from '../code'
import { Icon } from '@/index'

import { Kui, PropTypes } from '@/components/kui'
import Collapse from '@/components/collapse/collapse'
export default class Demo extends Kui {
    constructor(props) {
        super(props)
        this.state = {
            domHeight: 0,
            demoHeight: 0,
            codeHeight: 0,
            expand: false,
        }
        this.toggle = this.toggle.bind(this)
    }
    icons() {
        return this.state.expand ? 'ios-code-working' : 'ios-code'
    }
    classes() {
        return this.className(['k-demo', {
            [`k-demo-${this.props.layout}`]: this.props.layout
        }])
    }
    demoStyles() {
        return this.props.layout == 'horizontal' ? { height: this.state.expand ? `${this.state.domHeight}px` : `${this.state.demoHeight}px` } : {}
    }
    codeStyles() {
        return this.props.layout == 'horizontal' ? {} : { height: `${this.state.codeHeight}` }
    }
    toggle() {
        let expand = this.state.expand
        this.setState({ expand: !this.state.expand })
        // this.expand = !expand
        if (this.props.layout == 'vertical') {
            this.setState({ codeHeight: !this.state.expand ? 0 : 'auto' })
            // this.codeHeight = !this.expand ? 0 : 'auto';
        }
        // console.log(this.$refs.code.$el.scrollHeight)
    }
    setHeight() {
        if (this.props.layout == 'horizontal') {
            this.setState({
                domHeight: this.refs.dom.scrollHeight,
                demoHeight: this.refs.demo.scrollHeight
            });
            // this.domHeight = this.refs.dom.scrollHeight
            // this.demoHeight = this.refs.demo.scrollHeight
        }

    }
    componentDidMount() {
        this.setHeight()
    }
    render() {
        return <div className={this.classes()} style={this.styles(this.demoStyles())} ref="dom">
            <div className="k-demo-main" ref="demo">
                <div className="k-content">
                    {this.props.children[0]}
                </div>
                <div className="k-desc">
                    <a className="k-desc-title">{this.props.title}</a>
                    <div className="k-desc-content">
                        {this.props.children[1]}
                    </div>
                    <a className="k-code-expan" onClick={this.toggle}>
                        <Icon type={this.icons()} />
                    </a>
                </div>
            </div>
            <div className="k-demo-line"></div>
            <Collapse show={this.state.expand}>
                <Code style={this.styles(this.codeStyles())} ref="code" lang={this.props.lang}>
                    {this.props.children[2]}
                </Code>
            </Collapse>
        </div >
    }
}
Demo.propTypes = {
    layout: PropTypes.string,
    title: PropTypes.string,
    lang: PropTypes.string
}
Demo.defaultProps = {
    layout: 'vertical'
}
