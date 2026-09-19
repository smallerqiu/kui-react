# 更新日志

![react-kui](https://img.shields.io/npm/v/react-kui.svg?style=flat-square)

3.x 版本支持 `React 19` ,遇到问题,请在 [Github](https://github.com/smallerqiu/kui-react/issues) 提issue

```bash
npm install react-kui@latest --registry=http://registry.npmjs.org
```

vite 好像有缓存, 可手动清除

```bash
rm -rf node_modules/.vite
```

### 3.0.0

`2026-09-19`

#### 升级说明

- 基于 React 19 重构，组件功能与 API 尽量与 `kui-vue` 保持一致；需要 `react`、`react-dom` 19.2 或更高的 19.x 版本。
- 输入值接口统一使用 `value`，移除对应的 `defaultValue`；通过 `onChange` 同步业务数据。选中状态、弹窗显隐和上传列表仍使用各自的 `checked`、`open`、`fileList` 等接口，请按组件 API 迁移。

#### 组件增强与修复

- `ConfigProvider` 修复 `size`、`shape`、`theme` 对子组件未生效的问题，支持嵌套配置及组件自身属性覆盖。
- `Form` 完善字段值同步、校验、重置，以及子控件尺寸、主题、形状、禁用和只读状态的继承。
- `Upload` 优化图片墙拖拽排序：拖动时保留卡片边框和圆角，其他图片实时让位；修复上传文件后表单仍提示未上传、重置后文件状态不同步等问题。
- `Image` 优化预览图片的拖动交互。
- `DatePicker` 修复时间面板打开后选中项未居中显示的问题。
- `Menu` 优化多级折叠与展开动画、状态同步及键盘交互，统一子菜单向左、向右展开时的间距。
- `Switch` 修复按压、松开及切换时滑块位置跳动；禁用、只读状态下不再出现按压变形。
- `Select` 修复值为空字符串时占位文字不显示的问题。
- `Collapse` 完善数字 key 支持，统一数字与对应字符串 key 的关闭行为。
- 完善组件类型声明，修复 TypeScript NodeNext 模式下通过 ESM / CommonJS 导入组件时的类型解析问题。

### 2.0.0

`2021-07-10`

- 整体重构
- 修复若干bug，完善若干体验
- 整体对标 `kui-vue`

### 1.0.8

`2018-8-8`

- 图标库升级到4.3.0，使用更加规范，有效区分了ios和安卓粗细线条
- 修复`Message`，`Notice`组件关闭时卡顿的问题
- 修复 `Row`，`Col`组件`gutter`的bug
- 完善部分组件的动画切换，更加流畅
- `Input` 组件新增`iconAlign`属性，可以控制图标显示位置
- 修复`TimeLine`组件图标不显示问题
- 修复`Poptip`组件位置显示问题
- 修复`Tooltip`组件位置显示问题
- 修复`Tabs`组件滚动问题
- `Tabs`新增`animated`属性控制切换动画
- 去调了一部分组件多余的事件绑定
- 文档可以搜索组件

### 1.0.7

`2018-7-15`

- 完善所有组件自定义style和className的问题
- 优化`Row` 和 `Col` 子组件

### 1.0.6

`2018-7-14`

- 修复组件引用的问题

### 1.0.5

`2018-7-13`

- 修复编译问题

### 1.0.4

`2018-7-12`

- Menu组件细节优化和一些调整

### 1.0.3

`2018-7-11`

- 编译优化

### 1.0.2

`2018-7-11`

- 修复Breadcrumb组件自定义style的问题
- 新增Layout一系列布局组件

### 1.0.1

`2018-7-10`

- 修复React 16.x 版本下部分组件ref传递错误的问题
- 修复DatePicker特定情况下换行的bug

### 1.0.0

`2018-7-1 `

- 1.0发布，转入公测

### 0.0.1

`2018-5-27`

👏 🚩着手开发
