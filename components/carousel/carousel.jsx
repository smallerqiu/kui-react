import Icon from "../icon";
import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class Carousel extends Kui {

	static propTypes = {
		value: PropTypes.number,
		loop: PropTypes.bool,
		autoplay: PropTypes.bool,
		delay: PropTypes.number,
		vertical: PropTypes.bool,
		dots: PropTypes.bool
	}

	static defaultProps = {
		value: 0,
		delay: 3000,
		dots: true
	}

	static childContextTypes = {
		Carousel: PropTypes.any
	};
	state = {
		currentIndex: this.props.value,
		autotimer: null,
		width: 0,
		height: 0,
		animate: this.props.value > 0 ? false : true,
		resizing: false,
		playing: false,
		onMouseIn: false,
	}
	carouselRef = React.createRef()

	next = () => {
		this.change('right')
	}
	prev = () => {
		this.change('left')
	}
	autoTimer = null

	autoToPlay = () => {
		clearInterval(this.autotimer)
		this.autotimer = setInterval(() => {
			if (this.state.onMouseIn) return;
			this.change('right')
		}, parseInt(this.props.delay));
	}
	change = (type) => {
		let { playing, currentIndex } = this.state
		let length = this.props.children.length
		if (playing) return;
		this.setState({ animate: true })
		let index = currentIndex
		if (type == 'left') {
			index -= 1
			index = Math.max(0, index)
		} else if (type == 'right') {
			if (!this.props.loop) {
				if (index == length - 1) {
					index = 0
				} else
					index += 1
				index = Math.min(length - 1, index)
			}
		} else {
			index = type
		}
		this.setState({ currentIndex: index, playing: true })

		setTimeout(() => {
			this.setState({ playing: false })
		}, 600);
	}

	resize = () => {
		let carousel = this.carouselRef
		if (carousel) {
			this.setState({
				animate: false,
				width: carousel.current.offsetWidth,
				height: carousel.current.offsetHeight
			})
		}
	}

	getChildContext() {
		return {
			Carousel: this
		};
	}
	componentWillUnmount() {
		clearInterval(this.autotimer)
		window.removeEventListener('resize', this.resize)
	}
	componentDidMount() {
		this.resize();

		let { autoplay } = this.props
		autoplay && (this.autoToPlay())

		window.addEventListener('resize', this.resize)
	}

	render() {
		let { change, vertical, children, dots } = this.props
		let { currentIndex, width, height, animate } = this.state

		currentIndex = Math.min(children.length - 1, currentIndex)
		currentIndex = Math.max(0, currentIndex)
		const classes = ['k-carousel', {
			'k-carousel-vertical': vertical
		}]

		const dotsNode = (
			<ul className="k-carousel-dots">
				{
					React.Children.map(children, (child, i) => {
						return <li key={i} className={this.className({ 'k-carousel-dots-active': currentIndex == i })} onClick={() => this.change(i)}></li>
					})
				}
			</ul>
		)

		let offsetX = 0, offsetY = 0;
		if (!vertical) {
			offsetX = currentIndex * width
		} else {
			offsetY = currentIndex * height
		}
		const warpperCls = {
			className: 'k-carousel-warpper',
			style: {
				transform: `translate3D(-${offsetX}px,-${offsetY}px,0)`,
				width: !vertical ? children.length * width : '',
				height: vertical ? children.length * height : '',
				transitionDuration: !animate ? '0s' : ''
			}
		}
		const arrowLeft = <span className="k-carousel-arrow-left" onClick={() => this.change('left')} key="left">
			<Icon type="chevron-back" />
		</span>
		const arrowRight = <span className="k-carousel-arrow-right" onClick={() => this.change('right')} key="right">
			<Icon type="chevron-forward" />
		</span>
		const props = {
			className: this.className(classes),
			ref: this.carouselRef,
			onMouseEnter: () => this.setState({ onMouseIn: true }),
			onMouseLeave: () => this.setState({ onMouseIn: false }),
		}
		return (
			<div {...props}>
				<div {...warpperCls}>
					{children}
				</div>
				{!vertical ? [arrowLeft, arrowRight] : null}
				{dots ? dotsNode : null}
			</div >
		)
	}
}
