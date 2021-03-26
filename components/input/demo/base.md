<cn>
#### 基础用法
使用 `v-model` 进行数据双向绑定
</cn>

```ts
import { Input } from 'react-kui';

ReactDOM.render(
  <div>
    <Input placeholder="请输入内容..."  />
    <Input placeholder="disabled..." disabled />
  </div>,
  mountNode
)
```