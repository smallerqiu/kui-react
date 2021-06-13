
import React, { Component } from 'react'
import icons from 'kui-icons'
import Icon from '../icon'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Message, Affix, Radio, Input } from 'react-kui'

const iconKeys = Object.keys(icons);
let logos = [], outlines = [], filleds = [];
iconKeys.forEach(i => {
  if (i.indexOf('logo') > -1) {
    logos.push(i)
  } else if (i.indexOf('outline') > -1) {
    outlines.push(i)
  } else {
    filleds.push(i)
  }
})

export default class Index extends Component {
  state = {
    key: '',
    type: 'outline',
    logo: logos,
    showIcons: outlines
  }

  switchIcon = (type) => {
    this.setState({ type }, () => {
      this.filter(this.state.key)
    })
  }
  search = (e) => {
    let key = e.target.value
    key = key.replace(/ /g, '')
    this.filter(key)
    this.setState({ key })
  }
  filter = (key) => {
    let { showIcons, logo, type } = this.state
    let origin = type == 'outline' ? outlines : filleds;
    if (key) {
      showIcons = origin.filter(x => {
        return x.indexOf(key) >= 0
      })
      logo = logos.filter(x => {
        return x.indexOf(key) >= 0
      })
    } else {
      showIcons = origin
      logo = logos
    }

    this.setState({ showIcons, logo })
  }

  copy = () => {
    Message.success('代码复制成功！')
  }
  render() {
    const { showIcons, logo, type, key } = this.state
    return (
      <div>
        <h3>图标快速检索</h3>
        <br />
        <Affix offsetTop={52}>
          <div style={{ background: '#fff', padding: '20px 0' }}>
            <div style={{ position: 'relative', width: 800, margin: '0 auto' }}>
              <Radio.Group value={type} onChange={this.switchIcon} style={{ position: 'absolute', right: 4, top: 4, zIndex: 10 }}>
                <Radio.Button value="outline">Outline</Radio.Button>
                <Radio.Button value="filled">Filled</Radio.Button>
              </Radio.Group>
              <Input placeholder="输入英文关键字，搜索图标，点击图标即可复制"
                icon="logo-apple"
                value={key}
                size="large" onChange={this.search} />
            </div>
          </div>
        </Affix>
        <br />
        <br />
        <div className="show-icons">
          {showIcons.length ?
            <>
              <div className="icon-head">
                <h3><span>App icons</span></h3>
              </div>
              <br />
              <div className="icon-item">
                {
                  showIcons.map((x, y) => {
                    return <CopyToClipboard text={`<Icon type="${x}" />`} onCopy={this.copy} key={x}>
                      <span><Icon type={x} /></span>
                    </CopyToClipboard>
                  })
                }
              </div>
            </>
            : null}

          {logo.length ?
            <>
              <h3>Logos</h3>
              <div className="icon-item">
                {
                  logo.map((x, y) => {
                    return <CopyToClipboard text={`<Icon type="${x}" />`} onCopy={this.copy} key={x}>
                      <span><Icon type={x} /></span>
                    </CopyToClipboard>
                  })
                }

              </div>
            </> : null
          }
          {
            !showIcons.length && !logo.length ?
              <h3 style={{ textAlign: 'center', paddingBottom: 50, color: '#888' }}>
                No results for "{key}"
            </h3> : null
          }
        </div >
      </div >
    )
  }
}