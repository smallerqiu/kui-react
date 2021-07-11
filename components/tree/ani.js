export default {
  onEnter: (el) => {
    el.style.overflow = 'hidden';
    el.style.height = 0
    el.style.opacity = 0.1
  },
  onEntering: (el) => {
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px'
      el.style.opacity = 1
    } else {
      el.style.height = ''
      el.style.opacity = ''
    }
  },
  onEntered: (el) => {
    el.style.overflow = ''
    el.style.height = ''
    el.style.opacity = ''
  },

  onExit: (el) => {
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = 1
  },
  onExiting: (el) => {
    if (el.scrollHeight !== 0) {
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
      el.style.marginTop = 0;
      el.style.marginBottom = 0;
      el.style.opacity = 0
      el.style.overflow = 'hidden';
    }
  },
  onExited: (el) => {
    el.style.height = '';
    el.style.paddingTop = '';
    el.style.paddingBottom = '';
    el.style.marginTop = '';
    el.style.marginBottom = '';
    el.style.opacity = ''
    el.style.overflow = ''
  }
}