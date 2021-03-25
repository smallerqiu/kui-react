import { Kui, PropTypes } from '../kui'
import React from 'react'
// const { Provider, Consumer } = React.createContext('layout')

class Content extends Kui {
  render() {
    const cls = this.className(['k-layout-content'])
    return (<div className={cls} style={this.styles()}>{this.props.children}</div>)
  }
}

class Header extends Kui {
  render() {
    const cls = this.className(['k-layout-header'])
    return (<div className={cls} style={this.styles()}>{this.props.children}</div>)
  }
}

class Footer extends Kui {
  render() {
    const cls = this.className(['k-layout-footer'])
    return (<div className={cls} style={this.styles()}>{this.props.children}</div>)
  }
}

class Sider extends Kui {
  componentDidMount() {
    let parent = this.context.Layout
    if (parent) {
      parent.collectSider(1)
    }
  }

  componentWillUnmount() {
    let parent = this.context.Layout
    if (parent) {
      parent.collectSider(0)
    }
  }

  render() {
    const cls = this.className(['k-layout-sider'])
    return (<div className={cls} style={this.styles()}>{this.props.children}</div>)
  }
}

Sider.contextTypes = {
  Layout: PropTypes.any
};

export default class Layout extends Kui {

  state = {
    siders: 0
  }

  collectSider = (ismount) => {
    let { siders } = this.state
    this.setState({ siders: ismount ? (siders + 1) : (siders - 1) })
  }

  getChildContext() {
    return {
      Layout: this
    };
  }

  render() {
    const cls = this.className(['k-layout', {
      'k-layout-has-sider': this.state.siders > 0
    }])

    return (<div className={cls} style={this.styles()}>{this.props.children}</div>)
  }
}
Layout.childContextTypes = {
  Layout: PropTypes.any
};

Layout.Sider = Sider
Layout.Content = Content
Layout.Header = Header
Layout.Footer = Footer