
import React from 'react'
import { Icon, ToolTip, Transition, Message } from 'react-kui'

import { Kui, PropTypes } from '@/components/kui'
// import Collapse from '@/components/collapse/collapse'
import './demo.less'
import { CopyToClipboard } from 'react-copy-to-clipboard';



export default class Demo extends Kui {
  state = {
    expand: false,
  }

  copy = () => {
    Message.success('Copied')
  }

  toggle = () => {
    this.setState({ expand: !this.state.expand })
  }
  render() {
    const { expand } = this.state
    const { description, code, children, sourceCode } = this.props
    return (
      <div className="k-demo">
        <div className="k-demo-main">
          {children}
          <div className="k-desc">
            <div className="k-desc-content typo" dangerouslySetInnerHTML={{ __html: description }}>
            </div>
          </div>
          <div className="k-code-actions">
            {/* <ToolTip title="Copy code"> */}
            <CopyToClipboard text={sourceCode} onCopy={() => this.copy()}>
              <Icon type="copy-outline" />
            </CopyToClipboard>
            {/* </ToolTip> */}
            {/* <ToolTip title={expand ? 'Hide code' : 'Show code'}> */}
            <Icon type={'code' + (expand ? '-working' : '')} onClick={() => this.toggle()} />
            {/* </ToolTip> */}
          </div>
        </div>
        <Transition show={expand}>
          <div className="k-code" dangerouslySetInnerHTML={{ __html: code }}>
          </div>
        </Transition>
        {/* <Collapse show={this.state.expand}>
          <div className="k-code">
            {this.props.code}
          </div>
        </Collapse> */}
      </div >
    )
  }
}

Demo.propTypes = {
  component: PropTypes.any,
  description: PropTypes.any,
  code: PropTypes.any,
  sourceCode: PropTypes.string
}

Demo.defaultProps = {
}
