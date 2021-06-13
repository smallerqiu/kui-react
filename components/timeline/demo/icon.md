<cn>
#### 图标
给 `TimeLine.Item` 设置 `icon` 和 `color` 可以改变图标展示
</cn>

```tsx
import { TimeLine } from 'react-kui';

ReactDOM.render(
  <div>
    <TimeLine>
      <TimeLine.Item color="green">优化成吨的改善和体验</TimeLine.Item>
      <TimeLine.Item color="orange">
        <p>新增一些很友好的功能</p>
        <p>新增一些很友好的功能</p>
        <p>新增一些很友好的功能</p>
      </TimeLine.Item>
      <TimeLine.Item icon="ribbon">发布2.0版本</TimeLine.Item>
      <TimeLine.Item icon="bug" color="red">修复bug</TimeLine.Item>
      <TimeLine.Item>发布1.0版本</TimeLine.Item>
    </TimeLine>
  </div>
,  mountNode)
```