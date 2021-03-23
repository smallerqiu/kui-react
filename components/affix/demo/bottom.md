<cn>
#### 基本 
最简单的用法。
</cn>

```ts
import { Affix , Button } from 'react-kui';

ReactDOM.render(
  <>
    <Affix offsetBottom={10}>
      <Button type="primary">10px to affix bottom</Button>
    </Affix>
    <br/>
    <Affix offsetBottom={90}>
      <Button type="primary">90px to affix bottom</Button>
    </Affix>
  </>,
  mountNode
)
```