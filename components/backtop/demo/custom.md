<cn>
#### 基础用法
可以自定义回到顶部按钮的样式 `bottom` 为 `100px` 
</cn>

```ts
import { BackTop } from 'react-kui';

ReactDOM.render(
  <div>
    <BackTop bottom={100}>
      <div style={{ background:'#2d94ff', height: 40, lineHeight: '40px', textAlign: 'center',color: '#fff'}}>UP</div>
    </BackTop>
    自定义按钮为蓝色的按钮
  </div>,
  mountNode
)
```