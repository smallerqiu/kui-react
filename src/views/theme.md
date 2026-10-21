# 定制主题

KUI 使用 CSS Variables 作为公开主题接口，可以在运行时修改颜色、圆角、密度、字号和组件表面，无需重新编译组件库。

## 样式入口

默认入口包含主题变量、基础样式和全部组件样式：

```ts
import "react-kui/style/index.css";
```

需要自行控制全局基础样式时，可以按需组合：

```ts
import "react-kui/style/theme.css";
import "react-kui/style/components.css";
// 可选：链接、placeholder 和 selection 等全局基础样式
import "react-kui/style/base.css";
```

## 品牌主题

主色的 hover、active、outline 和透明层级会从 `--kui-color-primary` 自动派生：

```css
:root {
  --kui-color-primary: #6d5dfc;
  --kui-border-radius: 8px;
  --kui-border-radius-card: 14px;
}
```

## 密度与排版

```css
:root {
  --kui-control-height-sm: 26px;
  --kui-control-height: 36px;
  --kui-control-height-lg: 44px;
  --kui-font-size-sm: 12px;
  --kui-font-size: 14px;
  --kui-font-size-lg: 16px;
  --kui-spacing-4: 18px;
}
```

## 组件级定制

组件 Token 会回退到语义 Token，既可以统一换肤，也可以只修改某类组件：

```css
:root {
  --kui-control-bg: #fff;
  --kui-control-border: #d8dbe2;
  --kui-control-radius: 10px;
  --kui-card-bg: #fff;
  --kui-card-radius: 16px;
  --kui-card-padding: 20px;
  --kui-popup-bg: #fff;
  --kui-popup-shadow: 0 12px 36px rgb(0 0 0 / 12%);
}
```

## 外观与形状

通用控件使用 `round`、`circle`、`square` 三种形状。未传 `shape` 时等同于 `round`；旧的 `default` 值仍兼容。`theme` 有 `fill`、`outline`、`plain`、`solid`、`dashed`、`underlined` 六档，不写 `theme` 时各组件落回自己的默认档，其中 `plain` 是无边框也没有底色，与只去掉边框的 `bordered=false` 是两件事，两者可以同时使用。

外观也可以整体下发：`ConfigProvider` 的 `size`、`theme`、`shape` 作用于所有兼容组件，`Form` 的同名属性只作用于表单内的控件。三个键各自解析，组件只呈现自身支持的档位，传入画不出的档位不会报错。

如果需要整套界面（包括弹层容器）切换为方形，可在根节点设置 `shape-mode="square"`。它会统一覆盖控件、卡片和弹层的圆角令牌；组件自身的 `shape` 仍用于局部覆盖。滑块手柄、状态点等具有圆形语义的元素不会被改成方形。

```html
<html shape-mode="square">
```

```css
:root {
  --kui-shape-round: 6px;
  --kui-shape-circle: 9999px;
  --kui-shape-square: 2px;
  --kui-theme-fill-bg: rgb(53 58 65 / 10%);
}
```

`fill` 使用半透明叠加面，在 Table、Card 等容器内部仍能保留层级；控件内部的原生 input 保持透明，避免内外层重复叠色。

## 明暗主题

在根节点或局部容器设置 `theme-mode`：

```html
<div theme-mode="dark">...</div>
```

Select、DatePicker、Poptip 等带触发元素的弹层即使 Portal 到 `body`，也会自动跟随最近的 `theme-mode`。Modal 等没有触发元素的独立覆盖层，或需要继承局部自定义 Token 时，可通过 `ConfigProvider` 指定弹层容器：

```tsx
const themeRoot = useRef<HTMLDivElement>(null);

return (
  <div ref={themeRoot} theme-mode="dark">
    <ConfigProvider getPopupContainer={() => themeRoot.current}>
      <Select options={options} />
    </ConfigProvider>
  </div>
);
```

## 主要 Token 分类

- 品牌及状态：`--kui-color-primary`、`success`、`warning`、`danger`
- 文字：`--kui-color-text`、`text-title`、`text-description`、`text-placeholder`
- 背景：`--kui-color-bg`、`bg-layout`、`bg-container`、`bg-component`、`bg-pop`
- 交互项：`--kui-color-item-hover`、`item-active`、`item-selected`、`item-disabled`
- 组件：`--kui-control-*`、`--kui-card-*`、`--kui-popup-*`
- 尺寸：`--kui-control-height-*`、`--kui-font-size-*`、`--kui-spacing-*`
- 动效：`--kui-motion-duration-*`、`--kui-motion-easing`

派生 Token（例如 `--kui-control-bg`、`--kui-control-radius`、`--kui-color-primary-hover`）作为可选覆盖项使用；默认值在组件属性使用处计算，不在根节点预先固定。这样局部基础颜色、圆角变化和嵌套明暗模式也能生效，显式设置的组件 Token 则继续向下继承。

着色相关的派生 Token 也在同一批可选覆盖项里：`--kui-color-primary-hover`、`--kui-color-primary-active`、焦点光晕 `--kui-color-outline`、透明层级 `--kui-color-<色名>-3`/`-6`/`-9`，色板名字的 hover/active 是 `--kui-color-<色名>-hover`/`-active`。库内不给它们定死默认值，要单独改某一档时显式声明即可；`plain` 档的按压底色读 `--kui-theme-plain-hover`、`--kui-theme-plain-active`，语义类型和色板名字会各自在按钮上重声明这两个。

这些着色档位由构建期从基色算好后写进样式表，浏览器不再参与混色，所以只改基色不会带着它们走：覆盖 `--kui-color-primary` 只会挪动静置面，hover 与洗色仍停在构建时那一级。要让某一片走，就显式声明它对应的那一档。`solid` 档面上较淡的那几笔（焦点环 `--kui-theme-solid-outline`、前后缀图标 `--kui-theme-solid-muted`、占位符 `--kui-theme-solid-placeholder`、面上的小标签 `--kui-theme-solid-chip`）读的是同一条反白墨色，明暗两套都给了默认值，整体换一套墨色时改 `--kui-color-text-on-solid` 之外还要把这四个一起重声明。

在自定义 CSS 中直接使用这些可选 Token 时，也应提供基础变量作为回退，例如 `background: var(--kui-control-bg, var(--kui-color-bg))`。读取默认主题颜色时优先使用基础 Token。
