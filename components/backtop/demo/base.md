<cn>
#### 基础用法
默认位置距离页面右部和底部 50px，滚动至距顶端 400px 时显示。
</cn>

```ts
import { BackTop } from 'react-kui';

ReactDOM.render(
  <div>
    <BackTop />
    向下滚动页面，灰色的按钮为默认效果。
  </div>,
  mountNode
)
```