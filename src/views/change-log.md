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

### 3.1.0

- 统一状态 API：移除 `defaultOpen`、`defaultChecked`、`defaultCurrent`、`defaultFileList`、`default*Keys`，改用对应的不带 default 前缀的属性；Table 的 `defaultExpandAllRows` 改为 `expandAllRows`。属性负责初始化及外部变化同步，交互仍更新内部状态；升级时需调整旧属性用法。

`2026-09-21`

- Badge 数字更新时支持滚动动画；Badge 与 StatNumber 的 rollup 模式统一为数值增大向上、减小向下，支持进位、退位，并遵循系统减少动态效果的偏好。

- Alert、Tag 在退出动画结束后移除内容，新增 `afterClose`（React 为 `onAfterClose`）事件，支持在动画结束后更新父级显隐状态或标签列表。

#### 弹层基础能力

- 新增 `Popup` 基础组件及配套类型，统一触发方式、方位、箭头、挂载容器、外部点击关闭、Esc 关闭和嵌套弹层管理。
- `Dropdown`、`Tooltip`、`Poptip`、`Popconfirm` 及 `Select`、`TreeSelect`、`Cascader`、`AutoComplete`、`Mentions`、`DatePicker`、`ColorPicker` 接入统一弹层基础能力。
- 修复 `ColorPicker` 切换 HEX / RGB / HSL 时误关闭外层面板的问题。
- 修复内部 `Teleport` 在目标节点后续出现、被替换，或容器回调返回新节点时未更新挂载位置的问题。

#### 组件交互与样式

- 完善组件及子项的 disabled / readonly 交互，修复禁用状态仍响应点击、hover、active 或显示错误鼠标指针的问题。
- 修复 `Carousel` 快速连续切换、`Collapse` 内容与外层收缩不同步，以及 `Notice` 关闭后外层仍占据高度的问题。
- 完善 `Cascader` 下拉动画及宽度；调整 `QRCode` 状态遮罩表现，与 Vue 版本保持一致。
- 修复 `Table` 固定列与表头对齐、行 hover 背景不一致及操作按钮背景混淆的问题；空数据加载期间不再同时显示 Empty。
- 完善 `Tree` 拖拽与复选框交互，避免勾选触发展开收起；调整 directory 模式下复选框与节点的 hover 层次，兼顾浅色和暗色主题。
- 完善 `ColorPicker` 的 theme / shape、`Input` 前后缀布局和 `DatePicker` 范围选择、禁用限制及状态同步；同步 `VirtualList` 示例。

#### 类型与维护

- 补全组件事件回调与相关公共类型导出；复用多选标签及弹层公共逻辑，减少重复实现。
- 增加嵌套弹层、Teleport 生命周期、禁用交互及组件行为的回归测试。

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
