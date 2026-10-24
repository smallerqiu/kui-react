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

### 3.2.0

`2026-10-24`

#### 不兼容变更

- **组件内置文案默认改为英文**：没挂 `ConfigProvider` 时，`DatePicker`、`Select`、`Table`、`Modal`、`Page` 等组件的内置文案都是英文；需要中文请在应用根部挂 `ConfigProvider` 并传入 `locale`（`import zhCN from "react-kui/locale/zh-CN"`）。
- **移除 `theme="default"`**：想要组件自己的默认外观就不要写 `theme`；可选的是 `fill`、`outline`、`plain`、`solid`、`dashed`、`underlined`。此前 `Button` 上写 `theme="default"` 会被当成 `type="default"`，让 `type="link"` / `type="text"` 的按钮多出一块底色。
- **主题类型收紧**：不再导出 `CheckCardTheme`，`theme` 一律使用 `ThemeType`；不同组件只接受自己画得出的档位，写错档位 TypeScript 会报错（运行时组件仍按自己的外观呈现）。
- **`shape` 收窄**：表面型组件（`Card`、`ListPanel`、`FeatureCard`、`FeedbackPanel`、`Table`、`Descriptions`、`Collapse` 等）只接受 `square` / `round`，写 `circle` 会报错；从 `ConfigProvider` 继承到 `circle` 时按 `round` 呈现。
- **`Modal` / `Drawer` 不再上报打开**：挂载时就是打开状态、或把 `open` 翻成 `true`，不再回传一次 `onOpenChange(true)`。关闭仍会通知，且先 `onOpenChange(false)` 再 `onCancel` / `onClose`，这两个回调里读到的已经是结算后的开合值。

#### 主题与外观

- 输入类控件、选择器、颜色选择器等补齐 `outline`、`solid`、`dashed`、`underlined` 四档，并统一悬停、聚焦、禁用和校验失败时的表现；`plain` 与 `bordered={false}` 现在各管各的。
- `Card`、`FeatureCard`、`StatCard`、`Alert`、`Tag`、`CheckCard`、`Collapse`、`FeedbackPanel`、`Image`、`QRCode`、`Page`、`Kanban`、`Transfer`、`ListPanel` 等组件补齐适用的 `solid` / `dashed` / `plain` 外观。
- `Checkbox` / `Radio` 仅支持 `fill`、`outline`；`CheckboxGroup` / `RadioGroup` 会把主题传给组内每一项，子项显式设置优先。
- 统一 `color` 预设值及文字对比度；修正 `Button`、`Tag`、`Badge` 的颜色应用与默认状态点行为。
- `Form` 的 `size` / `shape` / `theme` 只作用于表单控件，不再连带改变表单里的卡片、表格等区块；要让整块页面跟着改，请写在 `ConfigProvider` 或组件本身。
- 主题浅色、描边、悬停及聚焦颜色改为构建时生成，兼容旧版 Chromium（包括 Win7 适配版 Electron）。运行时修改基色不再自动重算派生色，需要时应显式覆盖对应 CSS 变量。

#### 组件修复与增强

- **Menu**：支持方向键与 `Enter` 操作，`Escape` 只收起当前一层；修复纵向子菜单展开时的错位；读屏软件能识别菜单层级与展开状态。
- **Table**：修复分组表头、固定列与 `scroll.y` 的表头接缝、圆角和右下角缺口，列宽不足时整表横向滚动；支持嵌套 `dataIndex`、稳定兜底 `rowKey` 和单元格省略显示（`ellipsis`）；内置文案接入语言包。
- **Tree**：`loadData` 对同一节点只请求一次；修复虚拟滚动的行高与背景、缺 `key` 节点的展开与勾选串台；展开箭头不再进入 `Tab` 序列。
- **DatePicker**：修复半截区间、手输、年 / 月面板、键盘操作与重复 `onChange` 等问题；年 / 月面板开始遵守 `disabledDate`。
- **Modal / Drawer**：支持 `destroyOnClose`；修复多层叠开时的 `Escape`、`centered`、`width`、空标题栏及焦点高亮被裁切的问题；命令式弹窗的 `title` / `content` 可以传节点。
- **弹层组件**：统一支持 `destroyOnClose`（默认 `true`）；确认弹窗的 `onOk` 返回 Promise 时，成功才关窗。
- **Form**：`InputGroup` 内的输入框仍算表单项控件；竖排表单中写了 `block` 的控件占满整行。
- **InputNumber / AutoComplete**：支持 `addonBefore` / `addonAfter`，把单位或固定文字贴在输入框外面；`prefix` / `suffix` 则贴在框内。
- **其他组件**：修复 `DropdownButton` 的菜单触发、`Cascader` 的占位文案、`StatCard` / `StatNumber` 的渲染、`Select` 遇到 `NaN` 时的崩溃、`Tooltip` 的描边，以及 `Ripple` / `FlameWrap` 在新版 Chrome 中的点击问题。
- **无障碍与样式**：补齐菜单、表格等组件的无障碍语义；统一库内滚动条样式。

#### 其他说明

- `Page`、`Kanban`、`Transfer` 等组件的主题仅在各自支持的档位内生效；不支持的档位会回退到组件对应的默认外观。
- 用色值名当文字时，文字色按名字加深（深色主题下变浅）的一档；这一族颜色随主题一起生成，运行时只改基色不会带着它们走，需要时声明 `--kui-color-<名>-text`。

### 3.1.2

`2026-09-26`

- `Select` 修复远程搜索结果为空、加载中或不包含已选项时，已选标签消失或名称变为原始值的问题；单选远程搜索再次聚焦时，已选文本变淡，与本地搜索保持一致；修复连续输入时搜索框宽度未及时更新的问题。

### 3.1.1

`2026-09-25`

- `Carousel` 新增鼠标拖动和触屏滑动，支持横向、纵向及松手归位，通过 `swipeable` 统一控制；修复动态内容和连续切换时的显示与状态同步问题。
- `Page` 新增容器自适应布局：空间不足时减少页码并自动切换简洁模式，保留每页条数选择器，变宽后自动恢复；可通过 `responsive` 关闭。
- `Input` / `InputNumber` 优化内部实现，分离样式和控制区域；移除原供内部使用的 `inputType`、`controls` 接口。
- AI 辅助增强：支持命令行查询组件 API、示例和模板，以及源码校验；支持更新项目中的 AI 使用约定。增加图标参数误用检查。

### 3.1.0

`2026-09-23`

- 统一状态 API：移除 `defaultOpen`、`defaultChecked`、`defaultCurrent`、`defaultFileList`、`default*Keys`，改用对应的不带 default 前缀的属性；Table 的 `defaultExpandAllRows` 改为 `expandAllRows`。属性负责初始化及外部变化同步，交互仍更新内部状态；升级时需调整旧属性用法。
- `Badge` 数字更新时支持滚动动画，数值增大向上、减小向下，支持进位与退位；修正数字垂直对齐。
- `StatNumber` 的 rollup 动画改为逐位判断方向：当前位增大向上、减小向下，未变化的数字保持静止；优化大幅数值变化的过渡，并遵循系统减少动态效果的偏好。
- `StatNumber` 拆分独立文档与示例，展示数字格式化、动画时长和动态更新，不再与 `StatCard` 的卡片示例混排。
- 修复 `Slider` 拖动期间鼠标离开滑块后 Tooltip 提前隐藏的问题。
- 修复浅色主题下 `DatePicker` 选中日期的 hover 对比度，移除 fill 外观控件交互时意外出现的边框。
- 完善局部主题色、圆角、嵌套明暗主题及显式 CSS 变量覆盖，增加浏览器主题回归检查。
- 补充公共 API 与事件文档，完善回调参数说明和使用示例。
- 仓库构建及校验脚本统一为 TypeScript，增加 Node 脚本类型检查；贡献者运行工具链需使用 Node.js 24 或更高版本，发布包继续支持 ESM / CommonJS。
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

#### 新增能力与布局

- 新增 `Segmented` 分段控制器，替代 RadioGroup 的卡片式选择场景。
- `Tabs` 增加浏览器风格页签；`InputTag` 完善清除、禁用及标签数量限制。
- `BackTop` 支持自定义滚动容器；`Splitter` 完善拖拽调整和无障碍交互。
- `Grid`、`Row`、`Col` 完善布局属性及样式传递；修复 Layout.Sider 在 Flex 容器中被压缩及重复注册的问题。
- `Form` 完善字段校验与无障碍关联；清除按钮、菜单、分页、步骤条和面包屑补充键盘操作及相关语义。
- 修复链接按钮的属性传递，补充 `Input` 的 `onInput` 事件及图标映射类型。

#### AI 支持与发布校验

- 提供组件 metadata、AI 开发指南、示例模板、CLI 与 MCP 工具，支持组件查询和使用校验。
- 新增 AI 评测及资源一致性检查，并接入发布验证流程。
- 完善包导出检查和临时消费者安装验证，覆盖 ESM / CommonJS、类型声明、样式与工具入口。

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
