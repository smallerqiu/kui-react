
import React, { Component } from 'react'
import icons from 'kui-icons'
import Icon from '../icon'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Message } from 'react-kui'
export default class Index extends Component {
  state = {
    key: '',
    type: 'outline',
    logos: [],
    applist: [],
    filled: [],
    outline: [],
    logo: []
  }
  componentDidMount() {
    let all = Object.keys(icons), logos;
    let logo = logos = all.filter(x => x.indexOf('logo') >= 0)
    let applist = all.filter(x => x.indexOf('outline') >= 0)
    let outline = all.filter(x => x.indexOf('outline') >= 0)
    let filled = all.filter(x => x.indexOf('logo') < 0 && x.indexOf('outline') < 0)
    this.setState({
      logo, logos, applist, outline, filled
    })
  }

  switchIcon() {
    this.filter(this.key)
  }
  search(e) {
    let key = this.key//e.target.value
    key = key.replace(/ /g, '')
    this.filter(key)
  }
  filter(key) {
    let { outline, filled, logo } = this
    if (key) {
      let oriapp = this.type == 'outline' ? outline : filled;
      this.applist = oriapp.filter(x => {
        return x.indexOf(key) >= 0
      })
      let orilogo = logo
      this.logos = orilogo.filter(x => {
        return x.indexOf(key) >= 0
      })
    } else {
      this.applist = this.type == 'outline' ? outline : filled;
      this.logos = logo
    }
  }

  copy() {
    Message.success('代码复制成功！')
  }
  render() {
    const { applist, logos, key } = this.state
    return (
      <div>
        <h3>图标快速检索</h3>
        <br />
        <br />
        <br />
        <div className="show-icons">
          {applist.length ?
            <>
              <div className="icon-head">
                <h3><span>App icons</span></h3>
              </div>
              <br />
              <div className="icon-item">
                {
                  applist.map((x, y) => {
                    return <span key={x}>
                      <CopyToClipboard text={`<Icon type="${x}" />`} onCopy={this.copy}><Icon type={x} /></CopyToClipboard>
                    </span>
                  })
                }
              </div>
            </>
            : null}

          {logos.length ?
            <>
              <h3>Logos</h3>
              <div className="icon-item">
                {
                  logos.map((x, y) => {
                    return <span key={x}>
                      <CopyToClipboard text={`<Icon type="${x}" />`} onCopy={this.copy}><Icon type={x} /></CopyToClipboard>
                    </span>
                  })
                }

              </div>
            </> : null
          }
          {
            !applist.length && !logos.length ?
              <h3 style={{ textAlign: 'center', paddingBottom: 50, color: '#888' }}>
                No results for "{key}"
            </h3> : null
          }
        </div >
      </div >
    )
  }

}