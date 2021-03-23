import React from 'react'
import { Kui, PropTypes } from '../kui'

export default class CarouselItem extends Kui {

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
// CarouselItem.propTypes = {
// 	width: PropTypes.number,
// 	height: PropTypes.number,
// }

CarouselItem.contextTypes = {
	Carousel: PropTypes.any
};