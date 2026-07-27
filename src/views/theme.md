# 定制主题

KUI React 使用 CSS 变量描述主色、圆角、边框与背景等设计令牌。可在应用样式中覆盖变量：

```css
:root {
  --kui-color-primary: #3a95ff;
  --kui-border-radius: 6px;
}

[theme-mode="dark"] {
  --kui-color-bg: #141414;
}
```

在 React 入口引入组件库样式与自定义样式：

```tsx
import "react-kui/style/index.css";
import "./styles/custom.css";
```

运行时明暗主题切换请参阅“暗色模式”指南。
