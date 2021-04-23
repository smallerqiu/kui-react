<cn>
#### 基本用法
最简单的用法,可以通过 `value(v-model)` 指定初始值
</cn>

```tsx
import { Carousel } from 'react-kui';

ReactDOM.render(
  <>
    <Carousel value={2}>
      <Carousel.Item>1</Carousel.Item>
      <Carousel.Item>2</Carousel.Item>
      <Carousel.Item>3</Carousel.Item>
      <Carousel.Item>4</Carousel.Item>
    </Carousel>  
  </>,
  mountNode
)
```