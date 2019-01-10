let code = {}

code.base = `import { Carousel } from 'react-kui';
ReactDOM.render() {
  return (
    <Carousel>
      <Carousel.Item className="k-carousel-demo">1</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">2</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">3</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">4</Carousel.Item>
    </Carousel>
  )
}`

code.vertical = `import { Carousel } from 'react-kui';
ReactDOM.render() {
  return (
    <Carousel vertical>
      <Carousel.Item className="k-carousel-demo">1</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">2</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">3</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">4</Carousel.Item>
    </Carousel>
  )
}`

code.autoplay = `import { Carousel } from 'react-kui';
ReactDOM.render() {
  return (
    <Carousel autoplay>
      <Carousel.Item className="k-carousel-demo">1</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">2</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">3</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">4</Carousel.Item>
    </Carousel>
  )
}`

code.radius = `import { Carousel } from 'react-kui';
ReactDOM.render() {
  return (
    <Carousel dotsType="radius">
      <Carousel.Item className="k-carousel-demo">1</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">2</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">3</Carousel.Item>
      <Carousel.Item className="k-carousel-demo">4</Carousel.Item>
    </Carousel>
  )
}`

export default code