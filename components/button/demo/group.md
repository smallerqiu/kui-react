<cn>
#### 按钮组合
将多个 `Button` 放入 `ButtonGroup` 内，可实现按钮组合的效果。
</cn>

```ts
import { Button,Icon } from 'react-kui';

ReactDOM.render(
  <div>
    <Button.Group size="large">
      <Button>待发货</Button>
      <Button>已发货</Button>
      <Button>已签收</Button>
    </Button.Group>
    <Button.Group circle>
      <Button>待发货</Button>
      <Button>已发货</Button>
      <Button>已签收</Button>
    </Button.Group>
    <br />
    <br />
    <Button.Group size="small" circle>
      <Button ><Icon type="chevron-back"/> Backward</Button>
      <Button>Forward <Icon type="chevron-forward"/></Button>
    </Button.Group>
  </div>,
  mountNode
)
```