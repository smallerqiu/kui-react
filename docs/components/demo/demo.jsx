
import React from 'react'
import { Icon, Tooltip, Message } from 'react-kui'
import Transition from '../../../components/base/transition'
import { Kui, PropTypes } from '@/components/kui'
import copyText from 'copy-to-clipboard';
// import Collapse from '@/components/collapse/collapse'
import './demo.less'
// import { CopyToClipboard } from 'react-copy-to-clipboard';



export default class Demo extends Kui {
  state = {
    expand: false,
  }


  static propTypes = {
    component: PropTypes.any,
    description: PropTypes.any,
    code: PropTypes.any,
    sourceCode: PropTypes.string
  }

  static defaultProps = {
  }

  // codeRef = React.createRef()

  copy = () => {

    /*     const range = document.createRange()
        getSelection().removeAllRanges()
        range.selectNode(this.codeRef.current) // range.selectNodeContents(this.codeRef.current)
        getSelection().addRange(range)
        const tag = document.execCommand('Copy')
        getSelection().removeAllRanges()
        
        if (tag) { */

    let code = this.props.sourceCode.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    code = code.slice(1, code.length - 1)
    if (copyText(code)) {
      Message.success('Copied')
    } else {
      Message.success('Copied failed')
    }
  }


  toggle = () => {
    this.setState({ expand: !this.state.expand })
  }
  render() {
    const { expand } = this.state
    let { description, code, children, sourceCode } = this.props
    return (
      <div className="k-demo">
        <div className="k-demo-main">
          {children}
          <div className="k-desc">
            <div className="k-desc-content typo" dangerouslySetInnerHTML={{ __html: description }}>
            </div>
          </div>
          <div className="k-code-actions">
            {/* <CopyToClipboard text={sourceCode} onCopy={() => this.copy()}> */}
            <Tooltip title="Copy code">
              <Icon type="copy-outline" onClick={() => this.copy()} />
            </Tooltip>
            {/* </CopyToClipboard> */}
            <Tooltip title={expand ? 'Hide code' : 'Show code'}>
              <Icon type={'code' + (expand ? '-working' : '')} onClick={() => this.toggle()} />
            </Tooltip>
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