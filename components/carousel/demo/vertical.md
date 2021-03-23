<cn>
#### 垂直
通过设置 `vertical` 呈现垂直模式,此时不显示左右箭头
</cn>

```ts
import { Carousel } from 'react-kui';

ReactDOM.render(
  <div>
    <Carousel vertical>
      <Carousel.Item>1</Carousel.Item>
      <Carousel.Item>2</Carousel.Item>
      <Carousel.Item>3</Carousel.Item>
      <Carousel.Item>4</Carousel.Item>
    </Carousel>  
  </div>,
  mountNode
)
```