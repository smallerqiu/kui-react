import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from '@/components/icon'
import Item from './carouselItem'
export default class Carousel extends Kui {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: props.value,
      itemWidth: 0,
      itemHeight: 0,
      listWidth: 0,
      listHeight: 0,

    }
    this.autotimer = null;
    this.autoFn = null;
    this.onResize = this.onResize.bind(this)
    this.domRef = React.createRef()
  }
  classes() {
    return this.className(['k-carousel', {
      [`k-carousel-vertical`]: this.props.vertical
    }])
  }
  dotsClass() {
    return this.className(['k-carousel-dots', {
      [`k-carousel-dots-radius`]: this.props.dotsType == 'radius'
    }])
  }
  listStyles() {
    let posX = 0
    let posY = 0
    let style = {}
    let { listHeight, listWidth, currentIndex, itemHeight, itemWidth } = this.state
    if (this.props.vertical) {
      style.height = `${listHeight}px`
      posY = currentIndex * itemHeight * -1
    } else {
      posX = currentIndex * itemWidth * -1
      style.width = `${listWidth}px`
    }
    style.transform = `translateX(${posX}px) translateY(${posY}px)`
    return style
  }
  setCurrent(type) {
    let { loop, autoplay, speed, children } = this.props
    let { currentIndex } = this.state
    let count = React.Children.toArray(children).length
    if (type == 'left') {
      if (!loop && currentIndex == 0) {
        return;
      }
      if (currentIndex == 0) {
        currentIndex = count - 1
      } else {
        currentIndex = currentIndex - 1
      }
    }
    if (type == 'right') {
      if (autoplay) {
        clearInterval(this.autotimer)
      }
      if (!loop && currentIndex == count - 1 && !autoplay) {
        return;
      }
      if (currentIndex == count - 1) {
        currentIndex = 0
      } else {
        currentIndex = currentIndex + 1
      }
      if (autoplay) {
        this.autotimer = setInterval(this.autoFn, speed);
      }
    }
    this.setState({ currentIndex })
  }
  goTo(index) {
    this.setState({ currentIndex: index })
  }
  onResize() {
    if (!this.props.vertical)
      this.setState({ itemWidth: this.domRef.current.offsetWidth })
  }
  componentDidMount() {
    document.addEventListener('resize', this.onResize)
    let { children, vertical, speed, autoplay } = this.props
    let { itemWidth, listWidth, listHeight, itemHeight } = this.state
    let count = React.Children.toArray(children).length
    if (!vertical) {
      itemWidth = this.domRef.current.offsetWidth
      listWidth = itemWidth * count
    } else {
      listHeight = this.domRef.current.offsetHeight
      itemHeight = listHeight / count
      this.domRef.current.style.height = itemHeight + 'px'
    }
    // this.children.forEach(child => {
    //     child.width = this.itemWidth
    // })
    if (autoplay) {
      this.autoFn = () => { this.setCurrent('right') }
      this.autotimer = setInterval(this.autoFn, speed);
    }
    this.setState({ itemWidth, listWidth, listHeight, itemHeight })

  }
  componentWillMount() {
    document.removeEventListener('resize', this.onResize)
  }
  render() {
    let renderDots = () => {
      let count = React.Children.toArray(this.props.children).length
      let dots = []
      for (let i = 0; i < count; i++) {
        dots.push(<li key={i}
          className={this.className([{ 'k-carousel-dots-active': this.state.currentIndex == i }])}
          onClick={this.goTo.bind(this, i)}></li>)
      }
      return dots
    }
    return (<div className={this.classes()} ref={this.domRef} style={this.styles()}>
      <div className="k-carousel-list" style={this.styles(this.listStyles())}>
        {
          React.Children.map(this.props.children, child => {
            return child.type == Item ? React.cloneElement(child, Object.assign({},
              child.props, { width: this.state.itemWidth })) : null
          })
        }
      </div>
      {!this.props.vertical &&
        <React.Fragment>
          <span className="k-carousel-arrow-left" onClick={this.setCurrent.bind(this, 'left')}>
            <Icon type="ios-arrow-back" />
          </span>
          <span className="k-carousel-arrow-right" onClick={this.setCurrent.bind(this, 'right')} >
            <Icon type="ios-arrow-forward" />
          </span>
        </React.Fragment>
      }
      <ul className={this.dotsClass()}>
        {renderDots()}
      </ul>
    </div>)
  }
}
Carousel.defaultProps = {
  value: 0,
  speed: 2000,
  dotsType: 'rect',
  dots: true
}
Carousel.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  speed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vertical: PropTypes.bool,
  dotsType: PropTypes.string,
  dots: PropTypes.bool
}
 /*    < script >
import resize from '@/directives/winScroll'
export default {
    name: 'Carousel',
    directives: { resize },
    props: {

    },
    data() {
        return {

        }
    },
    watch: {
        value(v) {
            this.currentIndex = v
        },
        itemWidth(w) {
            this.listWidth = w * this.children.length
            this.children.forEach(child => {
                child.width = w
            })
        }
    },
    computed: {

    },
    created() {
        this.$on('carousel-add', this.add)
        this.$on('carousel-remove', this.remove)
    },
    mounted() {
        
    },
    methods: {

    }
}
</script > */

