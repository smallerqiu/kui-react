import newInstance from '../message/instance'

let noticeInstance;

let Notice = {
  name: 'Notice',
  open(options = {}) {
    options = Object.assign({ type: 'default' }, options)
    options.noticeType = 'notice'
    if (!noticeInstance) {
      let on = {
        onEntered: (el) => {
          el.style.height = window.getComputedStyle(el).height
        },
        onExiting: (el) => {
          el.style.height = 0
          el.style.paddingTop = 0
          el.style.paddingBottom = 0
          el.style.marginBottom = 0
        },
      }
      noticeInstance = newInstance({ type: 'notice', on })
    }
    noticeInstance.show(options);
  },
  destroy() {
    if (noticeInstance) {
      noticeInstance.destroy()
      noticeInstance = null;
      document.body.removeChild(document.querySelector('.k-notice'));
    }
  }
};

['info', 'success', 'warning', 'error'].forEach(type => {
  Notice[type] = (options) => {
    return Notice.open({ type, ...options })
  }
});

export default Notice;