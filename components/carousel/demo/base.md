<cn>
#### 基本用法
最简单的用法
</cn>

```tsx
import { Carousel } from 'react-kui';

// ReactDOM.render(
class Demo extends React.Component {
  render(){
    return(
      <div style={{width:900}}>
        <Carousel value={0}>
          <Carousel.Item>1</Carousel.Item>
          <Carousel.Item>2</Carousel.Item>
          <Carousel.Item>3</Carousel.Item>
          <Carousel.Item>4</Carousel.Item>
        </Carousel>  
      </div>
    )
  }
 } 
ReactDOM.render(<Demo /> , mountNode)
```