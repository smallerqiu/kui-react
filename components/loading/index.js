import React from 'react';
import Render from 'react-dom';
import Load from './loading'

let ref = null
let timer = null
let root = null
const mount = props => {
  clearInterval(timer)
  if (!ref) {
    ref = React.createRef()
    let loading = React.createElement(Load, Object.assign({ ref: ref, visible: true, props }))
    root = document.createElement('span')
    document.body.appendChild(root)
    Render.render(loading, root)
  }
}
const loading = () => {
  if (ref.current.state.type != 'line') return;
  timer = setInterval(() => {
    let percent = ref.current.state.percent
    percent += Math.floor(Math.random() * +5)
    ref.current.setState({ percent: percent })
    if (ref.current.state.percent >= 95) {
      ref.current.setState({ percent: 95 })
      clearInterval(timer)
    }
  }, 200)
};

export default {
  start(type, text) {
    setTimeout(() => {
      mount()
      // console.log(ref)
      // return
      ref.current.setState({
        error: false,
        type: type||'line',
        loadingText: text,
        percent: 0,
        visible: true,
        color: ''
      })
      //upload 
      loading()
    });

  },
  finish() {
    if (!ref) return;
    ref.current.setState({ percent: 100, visible: true })
    setTimeout(() => ref.current.setState({ visible: false }), 500)
    setTimeout(() => ref.current.setState({ percent: 0 }), 800)

    clearInterval(timer)
  },
  error() {
    mount()
    ref.current.setState({ error: true, visible: true, type: 'line' })
    this.finish();
  },
  upload(percent) {
    mount();
    ref.current.setState({ percent: percent, visible: true });
  },
  config(props) {
    mount(props);
    ref.current.setState(Object.assign(props, { visible: true, error: false }));
    loading();
  },
  destroy() {
    Render.unmountComponentAtNode(root);
    ref = null;
  }
};