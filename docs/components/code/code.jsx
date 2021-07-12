import hljs from './highlight';
hljs.registerLanguage('xml', require('./lang/xml'));
hljs.registerLanguage('javascript', require('./lang/javascript'));
import "./atom-one-light.css";
import React from 'react'
import { Kui, PropTypes } from '@/components/kui'

export default class Code extends Kui {
  static defaultProps = {
    lang: 'js javascript'
  }
  static propTypes = {
    lang: PropTypes.string
  }

  componentDidMount() {
    let code = this.refs.code.innerHTML.trim()
    this.refs.code.innerHTML = code;
    hljs.highlightBlock(this.refs.code);
  }

  render() {
    return (<div className="k-code">
      <pre>
        <code className={this.props.lang} ref="code">
          {this.props.children}
        </code>
      </pre>
    </div>)
  }
}