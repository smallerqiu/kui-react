import React from 'react'
import { Kui, PropTypes } from '../kui'
import { Message } from '../message'
export default class Upload extends Kui {
  static defaultProps = {
    method: 'post',
    type: 'change',
    data: {}
  }
  static propTypes = {
    onChange: PropTypes.func,
    onComplite: PropTypes.func,
    method: PropTypes.string,
    name: PropTypes.string, //提交的 name值
    id: PropTypes.string, //提交的 id值
    action: PropTypes.string.isRequired, //url 要带/rest
    type: PropTypes.string,
    data: PropTypes.object,
    disabled: PropTypes.bool,
  }
  state = {
    file: null,
    span: Math.floor(Math.random() * 99999999)
  }
  uploadFileRef = React.createRef()
  uploadFormRef = React.createRef()
  uploadIframeRef = React.createRef()
  classes() {
    return this.className([
      "k-upload",
      {
        ["k-upload-disabled"]: this.props.disabled
      }
    ])
  }
  changeFile(e) {
    e.cancelBubble = true;
    if (this.props.disabled) return false;

    this.uploadFileRef.current.click();

    return false;
  }
  upload(e) {
    let file = e.target.value
    this.setState({
      file: file
    })
    if (file) {
      let { onChange, type } = this.props
      onChange && onChange(file)
      type == 'change' && this.submit()
    }
  }
  submit() {
    let { type, file } = this.props
    if (type !== "change" && type !== "wait") return false;
    if (!file) {
      return false;
    }
    this.props.onBeforeUpload && this.props.onAfterUpload(data)
    this.uploadFormRef.current.submit();
  }
  complite(fm, e) {
    let doc = fm.contentWindow || fm.contentDocument;
    let data;
    try {
      if (doc.document) {
        doc = doc.document;
        let content = doc.body.textContent;
        if (content) {
          data = eval("(" + content + ")");
          this.props.onComplite && this.props.onComplite(data)
          this.uploadFileRef.current.value = "";
          // this.select = false;
          this.file = null;
          this.setState({ file: null })
        }
      }
    } catch (e) {
      let msg = e.message.indexOf("cross-origin") >= 0 ? "不支持跨域上传!" : "上传文件格式不支持！";
      data = e.message
      Message.error(msg);
    }
    this.props.onAfterUpload && this.props.onAfterUpload(data)
  }
  componentDidMount() {
    const fm = this.uploadIframeRef.current
    if (!fm) return;
    if (fm.attachEvent) {
      fm.attachEvent("onload", e => this.complite(fm, e));
    } else {
      fm.onload = e => this.complite(fm, e);
    }
  }

  render() {
    let { children, action, method, name, id, data } = this.props
    let { span } = this.state
    let renderData = () => {
      let childs = []
      for (let key in data) {
        childs.push(<input type="hidden" name={key} id={key} value={data[key]} key={key} />)
      }
      return childs
    }
    return (<div className={this.classes()} onClick={this.changeFile.bind(this)} style={this.styles()}>
      {children}
      <div className="k-upload-form">
        <iframe frameBorder="0" name={`k-upload-iframe-${span}`} style={{ display: 'none' }} ref={this.uploadIframeRef}></iframe>
        <form action={action} method={method} encType="multipart/form-data"
          style={{ display: 'none' }} ref={this.uploadFormRef}
          target={`k-upload-iframe-${span}`}>
          <input type="file" name={name} id={id} onChange={(e) => this.upload(e)} ref={this.uploadFileRef} />
          {renderData()}
        </form>
      </div>
    </div>)
  }
}