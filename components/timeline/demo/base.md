<cn>
#### 基本用法
`TimeLine` 内部必须包含 `TimeLine.Item`
</cn>

```tsx
import { TimeLine } from 'react-kui';

ReactDOM.render(
  <div>
    <TimeLine>
      <TimeLine.Item>2019 年 11月 发布3.0版本</TimeLine.Item>
      <TimeLine.Item>2019 年 1月27日 发布2.0版本</TimeLine.Item>
      <TimeLine.Item>2017 年 12月 发布1.0版本</TimeLine.Item>
    </TimeLine>
  </div>
,  mountNode)
```