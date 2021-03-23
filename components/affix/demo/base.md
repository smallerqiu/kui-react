<cn>
#### 基本 
最简单的用法。
</cn>

```ts
import { Affix , Button } from 'react-kui';

ReactDOM.render(
  <Affix offsetTop={100}>
    <Button type="primary">Affix top</Button>
  </Affix>,
  mountNode
)
```