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

`2026-10-12`

#### 不兼容变更

- **组件内置文案默认改为英文。** 没有挂 `ConfigProvider` 时，`DatePicker`、`Select`、`Table`、`Modal`、`Page` 等组件的内置文案显示英文；需要简体中文请在应用根部挂 `ConfigProvider` 并传入 `locale`（`import zhCN from "react-kui/locale/zh-CN"`）。
- **`theme` 不再接受 `default`。** 想要组件自己的默认外观就不要写 `theme`，`ConfigProvider` 也不再传这个值；可选的是 `fill` / `outline` / `plain` / `solid` / `dashed` / `underlined` 六档。此前 `Button` 上写 `theme="default"` 会被当成 `type="default"`，让 `type="link"` / `type="text"` 的按钮多出一块底色。
- **不再导出 `CheckCardTheme`。** `theme` 一律使用库统一的 `ThemeType`。
- **`theme` 的类型只列组件画得出的档位。** 表面型组件（`Card` / `FeatureCard` / `StatCard` / `Collapse` / `FeedbackPanel` / `CheckCard` / `Alert` / `Image` / `QRCode` / `Page` / `Kanban` / `Transfer` / `ListPanel` / `Tag` / `Button` / `DropdownButton` / `RadioGroup` / `RadioButton`）只接受 `fill` / `outline` / `plain` / `solid` / `dashed`（`SurfaceThemeType`）；`Checkbox` / `Radio` / `CheckboxGroup` 只接受 `fill` / `outline`（`MarkThemeType`）；`ConfigProvider` 与 `Form` 仍然六档全收。给这些组件写它画不出的档位（例如给卡片写 `theme="underlined"`）现在 TypeScript 会报错，运行时组件仍按自己的外观呈现。
- **`shape` 对表面型组件收窄为 `square` / `round`。** `Card` / `ListPanel` / `FeatureCard` / `FeedbackPanel` / `Table` / `Descriptions` / `Collapse` 写 `shape="circle"` 现在 TypeScript 会报错；从 `ConfigProvider` 继承到 `circle` 时按 `round` 呈现。`Collapse` 与 `FeedbackPanel` 碰到 `circle` 时原本留下的大外角也一并收成圆角。

#### 控件外观

- `Select` / `Cascader` / `TreeSelect` / `DatePicker` 新增 `outline`、`solid`、`dashed`、`underlined` 四档外观：描边框、主色实底（文字与图标反白）、虚线框、只留一条下划线（聚焦时变主色）。
- 这四个组件的 `plain` 与 `bordered={false}` 现在各管各的：`plain` 去掉边框和底色，`bordered={false}` 只去边框，可以同时使用，禁用时 `plain` 仍显示禁用态。去掉边框后，悬停不再描出一圈主色边框和光晕，`fill` 下也不会抹掉你用 `--kui-theme-fill-border` 画的边框；`DatePicker` 无边框时聚焦不再出现焦点环，`Cascader` 关掉边框后各档也不会残留边框或底色。
- `Select` / `TreeSelect` 在 `solid` 下已选标签改为半透明反白底，`dashed` 下标签仍是实线，与 `InputTag` 一致；收起多余标签后，悬停「+N...」弹出的预览标签改为与控件同尺寸。
- `TreeSelect` 展开面板时不再多出一圈光晕，`fill` / `plain` / `solid` / `underlined`、无边框与禁用状态下都只留焦点环，`outline` / `dashed` 仍带原来的浅光。
- `Input` / `TextArea` / `InputNumber` / `InputTag` / `InputOTP` / `ColorPicker` 也补齐 `outline` / `solid` / `dashed` / `underlined` 四档。`solid` 下输入的文字、占位提示、前后缀图标、已添加的标签、验证码格子与清除图标一起反白；`plain` 与 `underlined` 聚焦时不再出现焦点环，`solid` 聚焦时也不再叠一层浅色光晕；禁用的输入框聚焦、`ColorPicker` 手动展开面板时都不再发光。`ColorPicker` 在 `fill` / `plain` 下禁用时仍显示禁用态。
- 放进验证失败的表单项时，`Cascader`、`ColorPicker`、`InputTag`、`InputOTP` 现在也会描红（此前只有 `Input` / `Select` 一类），`InputOTP` 是每一格一起变红；鼠标悬停、聚焦或展开面板都不会让红边和红色浅光消失，焦点光晕也一起变红，六档 `theme` 下都一样（`solid` 保留反白光晕，红色在实底上看不清）。

#### 表面与标记外观

- `Tag` 新增 `outline` / `solid` / `dashed` 三档，不写 `theme` 或写 `underlined` 都按 `fill` 呈现；设置 `color` 时以颜色为准，预设色与自定义色都保留自己的边框和文字颜色，不再被 `theme` 的底色盖掉。
- `Checkbox` / `Radio` 只有 `fill`（浅底）与 `outline`（描边）两种外观，`outline` 现在会真的画出边框；两种外观的边框色分别可以用 `--kui-theme-fill-border`、`--kui-theme-outline-border` 覆盖。不写 `theme` 就是 `fill`，写其它档位也按 `fill` 呈现。`CheckboxGroup` / `RadioGroup` 会把 `theme` 传给组内每一项，从 `ConfigProvider` 继承的值同样生效，选中与禁用状态始终优先。
- `Card` / `FeatureCard` / `StatCard` 新增 `solid` / `dashed`：`solid` 是主色实底，标题、描述、图标与头部分割线一起反白，`StatCard` 里带 `success` / `danger` / `warning` 的趋势项仍保留自己的颜色；`dashed` 是虚线框。卡片上写 `underlined`（包括从 `ConfigProvider` 继承）按 `fill` 呈现。
- `Collapse` / `FeedbackPanel` 新增 `solid` / `dashed`；`Collapse` 简洁模式下主色落在每块面板自己身上；`FeedbackPanel` 的 `outline` 不再自带页面底色，左侧状态色带不受 `theme` 影响。
- `CheckCard` / `CheckCardGroup` 新增 `solid` / `dashed`，组上的 `theme` 会传给每张卡片，卡片自己写的优先；写 `underlined` 按 `outline` 呈现；禁用时标题、描述和图标一起变灰。
- `Alert` 新增 `solid` / `dashed`：`solid` 用提示自己的颜色铺底（错误红、成功绿、警告橙、信息主色），不会被统一成主色；`outline` 的边框改用库统一边框色，可用 `--kui-theme-outline-border` 改。
- `Image` 新增 `solid` / `dashed`，`outline` 现在真的画出边框，写 `underlined` 按 `plain` 呈现；`QRCode` 新增 `solid` / `dashed`，写 `underlined` 按 `outline` 呈现，`plain` 只去掉底色、保留 12px 内边距和透明边框，要连边框一起去掉请用 `bordered={false}`。
- `Page` 新增 `solid` / `dashed`，写 `underlined` 按 `fill` 呈现；`plain` 现在真的生效，当前页改用当前外观的状态色；分页条把外观传给每页条数选择器与跳转输入框时，会先换算成它自己画得出的档位，不会再出现分页条扁平、里面的输入框却带下划线。
- `Kanban` 新增 `plain` / `solid` / `dashed`，写 `underlined` 按 `fill` 呈现，外观落在每一列上；拖动卡片经过某列时的提示不再被列背景盖住；`solid` 下列内卡片的键盘焦点环改为浅白；列外观接受 `--kui-theme-fill-bg`、`--kui-theme-outline-border` 等局部变量。
- `Transfer` 新增 `plain` / `solid` / `dashed`，写 `underlined` 按 `outline` 呈现，外观落在左右两个列表上；`solid` 下两侧搜索框改为浅底，禁用时列表文字、条目描述和底部回到禁用色。
- `ListPanel` 新增 `solid` / `dashed`，写 `underlined` 按自己的 `outline` 呈现，外观落在面板底下的卡片上，`bordered={false}` 只去掉外框；`solid` 下摘要行与批量操作栏改为主色上的浅色。
- `Form` 的 `size` / `shape` / `theme` 只作用于表单控件，不再连带缩小或铺色表单里的 `Card`、`Collapse`、`FeedbackPanel`、`Alert`、`Table`、`Page`、`Tag`、`Button` 等区块；要让整块页面跟着改，请写在 `ConfigProvider` 或组件本身。

#### 颜色与色板

- 预设色值名里不再有 `default`：不写 `color` 用的就是组件自己的表面；`Tag` 与数字气泡上写 `color="default"` 现在等同不写，按钮请改用 `type`。
- `Tag` 与 `Badge` 现在认全部 17 个预设色值名（`olive`、`teal`、`violet`、`brown`、`gray` 等）；`Badge` 写了浏览器认不出的颜色时回到灰色状态点，而不是画出一颗透明点；不写 `status` 也不写 `color` 时不再自动出现状态点。
- `Button` 的 `color` 只认这 17 个名字，写了别的值（`tomato`、`#f00`）按没写处理，`type` 照常生效。只写 `color` 时现在就是一颗实心彩色按钮；写 `theme="fill"` 时文字上色、底色保留；写 `outline` / `dashed` / `plain` 时文字在哪儿都是同一个颜色；浅色底（`yellow`、`orange`、`lime`、`gold`）上的文字改用黑色；`solid` 档改为饱满的实色面。
- 用色值名当文字时，文字色改为按名字加深（深色主题下变浅）的一档，`yellow`、`lime`、`cyan`、`gold` 等浅色也读得清。这一族文字随主题一起生成，运行时只改 `--kui-color-primary` 不会带着它们走，需要时声明 `--kui-color-<名>-text`（见「主题」文档）。

#### 组件更新

- `Menu` 支持方向键与 `Enter` 操作，`Escape` 只收起当前一层；展开纵向子菜单时不再出现外层先开、内容后伸缩的错位；读屏软件能识别菜单层级与展开状态。
- `Table` 同时使用分组表头、固定列与 `scroll.y` 时，表头边框、吸顶接缝、圆角和右下角不再缺口，固定列位置与 Vue 版一致；列宽不足时整表横向滚动，不再压瘪列或把表头文字竖排，窗口宽度卡在临界值时固定列阴影也不再闪。
- `Table` 新增 `ellipsis`：单元格内容超出列宽时收成省略号。写在列上只管那一列，写在 `Table` 上一次管住所有列（`render` 或插槽出来的内容同样管），某一列要显示完整内容就在列上写 `ellipsis: false` 单独关掉。默认只截一行，`rows` 可以截到多行；悬停提示默认打开，且只在格子真的被截断时才出现，`tooltip` 能换成指定内容或设 `false` 关掉。
- `Table` 的行数据缺少 `rowKey` 指定的字段时，不再丢行或把状态串到别的行上；`dataIndex` 支持 `a.b.c` 取嵌套字段；`expandAllRows` 在异步数据下不再重复展开父行，虚拟滚动不会因窗口起点越界而空白；排序按钮补齐无障碍语义，空数据与筛选文案接入语言包。
- `Tree` 的 `loadData` 对同一节点只请求一次，虚拟滚动的行高、悬停与选中背景恢复正常；缺 `key` 的节点不会再让展开与勾选状态串到别的节点上；展开箭头不再进入 `Tab` 序列，方向键不会把焦点停在箭头上。
- `DatePicker` 修复区间只选一头时的收尾：按 `Esc` 关闭、只在结束框里输了一个日期、或在时间列上挑时间，都不再把半截区间当成结果发出去，关掉面板后退回上一次选好的区间；手输被拒绝时退回当前值，不再弹回最初传入的日期；只受控 `startDate` 或 `endDate` 时，下一次点选只补空着的那一头；重复选择同一个日期不再重复触发 `onChange`。
- `DatePicker` 的年 / 月面板开始遵守 `disabledDate`：整年或整月都选不出一天时置灰、点不进去，`Tab` 也会跳过；高亮跟着当前值走；可以用键盘选择年份、月份并切换面板。
- 弹层组件开放 `destroyOnClose`（`Select`、`Cascader`、`TreeSelect`、`AutoComplete`、`Mentions`、`DatePicker`、`ColorPicker`、`Dropdown`、`DropdownButton`、`Tooltip`、`Poptip`、`Popconfirm`），默认 `true`，关闭后销毁面板内容；设为 `false` 可以留住面板里没提交完的表单，代价是每个打开过的实例多一份隐藏内容。
- `Modal` 打开期间页面不再跟着滚动，`Tab` 在窗口内循环；多个窗口叠开时 `Escape` 只关最上面一层，下拉菜单开在窗口之上时第一下先收下拉；关闭窗口会一起收起里面打开的下拉、级联与子菜单。
- `Modal` / `Drawer` / `ModalPanel` 支持 `destroyOnClose`（默认 `true`）；确认弹窗的 `onOk` 返回 Promise 时，成功才关窗，失败只结束按钮的 loading 并保留窗口；关闭动画还没播完就重新打开时，窗口不会再过一会儿自己消失。
- `Modal` 修复 `centered` 不生效、`width` 传字符串时丢失单位（`Drawer` 的 `width` / `height` 同样）、没传 `title` 却多出一条空标题栏的问题；内容区贴边的控件聚焦时，焦点高亮不再被裁掉一半。
- 命令式弹窗（`modal.confirm()` 等）的 `title` / `content` 可以传任意节点，实例统一提供 `show` / `hide` / `destroy`，并沿用调用处的主题、语言与弹层挂载设置。
- `Modal` / `Drawer` 统一关闭回调顺序：先 `onOpenChange(false)`，再 `onCancel` / `onClose`，回调里读到的已经是结算后的开合值；`Drawer` 不再默认显示 "Title"。
- `StatCard` 的 `title` / `desc` / `trend` 与 `StatNumber` 的 `prefix` / `suffix` 传 `false` 或空字符串时不再占位，`0` 仍按内容显示；数据项没写 `key` 时，数字动画也不会再串到别的项上；`countup` 遵循系统的「减少动态效果」偏好；`shape` 收窄为 `square` / `round`。
- `DropdownButton` 右侧「三点」按钮现在能正常打开菜单，点击、右键与方向键都可以，读屏软件能识别它是菜单按钮以及当前是否展开；`trigger` 可选 `hover` / `click` / `contextmenu`。
- `Select` 的选中值或选项标签是 `NaN` 时不再崩溃，按普通数字显示。
- `Tooltip` 气泡与箭头指示器补回 1px 描边，深色背景上也能看清边界。
- `InputGroup` 包住输入框时，该输入框仍算表单项的控件：表单的值会填进它，点 label 会聚焦到它，校验提示与外观档位也跟随它。`Form` 竖排时，写了 `block` 的控件真正占满整行。
- `Cascader` 不传 `placeholder` 时跟随语言包，英文界面不再显示「请选择」。
- `Ripple` 与 `FlameWrap` 修复 Chrome 155 中包裹内容点击无响应、也不出现波纹的问题；Chrome 156 下同样正常，浅色与深色页面上的波纹都清晰可见。
- 库内滚动条样式统一，横向与纵向粗细一致，暗色主题下悬停滑块不再和背景混在一起。

#### 主题的着色方式

- 使用 Win7 的旧版 Electron（Chromium 108）时，`Result` 的状态码、`FeatureCard` 的图标底板和 `Calendar` 的日程底色此前不显示，现在正常显示。主题里的浅底、描边、悬停与按下的明暗、聚焦光晕改为随主题一起生成，不再依赖浏览器现场混色；代价是运行时只改基色（如 `--kui-color-primary`）只会影响静止的面，派生浅色需要显式声明对应 token（见「主题」文档）。
- 个别档位的悬停 / 按下明暗与之前相差一个色阶，肉眼基本看不出来；`FeatureCard` 与 `Calendar` 的底板改为按你写的 `color` 现算，`color` 是 `currentColor` 或 CSS 变量时退回主色淡化。

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
