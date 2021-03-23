<cn>
#### 自动播放
通过设置 `autoplay` ，可实现定时自动播放，通过 `delay` 设置间隔播放时间，默认 `3000` ，单位毫秒 
</cn>

```ts
import { Carousel } from 'react-kui';

ReactDOM.render(
  <div>
    <Carousel autoplay>
      <Carousel.Item>1</Carousel.Item>
      <Carousel.Item>2</Carousel.Item>
      <Carousel.Item>3</Carousel.Item>
      <Carousel.Item>4</Carousel.Item>
    </Carousel>  
  </div>,
  mountNode
)
```