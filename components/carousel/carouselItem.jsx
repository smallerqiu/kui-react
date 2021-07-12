import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class CarouselItem extends Kui {
	static contextTypes = {
		Carousel: PropTypes.any
	}
	render() {
		let width, height, { state } = this.context.Carousel
		if (state) {
			width = state.width
			height = state.height
		}
		let styles = { width, height }
		return (
			<div className={this.className(["k-carousel-item"])} style={this.styles(styles)}>
				{this.props.children}
			</div>
		)
	}
}
