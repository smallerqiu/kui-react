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

- `Menu` 补齐方向键 / Enter / Esc 键盘导航，`Escape` 只收回当前一层。
- `Menu` 弹出浮层通过 `aria-controls` / `aria-labelledby` 与触发项关联，`horizontal` 根节点声明 `role="menubar"`。
- `Menu` 修复纵向子菜单展开时外层先开、内容后伸缩的错位。
- `Table` 修复分组表头与固定列、`scroll.y`、`bordered` 同时使用时表头边框丢失、吸顶行间露缝、圆角不饱满和右下角空白块的问题。
- `Table` 分组表头改为按列分栏，补充 `aria-labelledby` 关联；固定列宽度与 sticky 偏移基准与 Vue 版一致。
- `Table` `rowKey` 取不到值时使用稳定兜底 key；`dataIndex` 支持 `a.b.c` 点路径嵌套取值。
- `Table` 修复 `expandAllRows` 在异步数据下重复展开父行、虚拟滚动窗口起点越界的问题。
- `Table` 表头排序按钮补齐无障碍语义；空数据、筛选等内置文案接入语言包。
- 统一库内滚动条样式，横向与纵向粗细一致；修复暗色主题下 hover 滑块与背景融为一体。
- `Ripple` 修复 Chrome 155 中包裹内容点击无响应且不产生涟漪的问题。
- `Ripple` 适配 Chrome 156 的 `content="drawable"`，Edge 与更早的 Chromium 保持原有路径。
- `Ripple` 降级波纹叠层改为波峰提亮、波谷压暗，浅色与深色页面都清晰可见。
- `FlameWrap` 修复 Chrome 155 中包裹内容点击无响应的问题，并适配 Chrome 156 的 `content="drawable"`。
- `StatCard` 的 `title` / `desc` / `trend` 与 `StatNumber` 的 `prefix` / `suffix` 在传 `false` 或空字符串时不再渲染占位的空节点，`0` 仍按内容显示。
- `StatCard` 修复 `items[].key` 与数组下标撞 key、数字动画状态串到别的数据项的问题。
- `StatNumber` 的 `countup` 模式同样遵循系统的"减少动态效果"偏好，命中时直接显示目标值。
- `StatCard` 的 `shape` 收窄为 `square` / `round`，与 Vue 版一致；卡片是切角的表面，`circle` 会裁掉内容，继承到 `circle` 时按 `round` 处理。
- `Table` 未设 `width` 的列按 150 作为宽度基准，整表按各列宽度合计设最小宽度；容器变窄时改为横向滚动，不再把列压瘪、让表头文字竖排换行。
- `Table` 修复窗口宽度卡在临界值时，固定列阴影和横向滚动条来回闪现的问题：只有真的还能往那一侧滚动，才会出现阴影。
- `Tree` 异步 `loadData` 对同一节点只请求一次；虚拟滚动修复行高不对、hover 与选中背景不满行高的问题。
- `Tree` 缺 `key` 的节点按树路径合成稳定兜底 key，展开与勾选状态不再串台。
- `Tree` 展开箭头按钮不再参与 Tab（`tabIndex={-1}`），整棵树仍只有一个 `treeitem` 走 roving tabindex，方向键不会把焦点丢在箭头上。
- `DropdownButton` 修复右侧"三点"按钮点不开菜单：点击、右键与方向键都能驱动开合，触发按钮带 `aria-haspopup="menu"` 和 `aria-expanded`，并可用 `trigger` 指定 `hover` / `click` / `contextmenu`。
- 弹层组件开放 `destroyOnClose`（`Select`、`Cascader`、`TreeSelect`、`AutoComplete`、`Mentions`、`DatePicker`、`ColorPicker`、`Dropdown`、`DropdownButton`、`Tooltip`、`Poptip`、`Popconfirm`），默认 `true`，即关闭后销毁面板内容。之前这个行为固定、无法覆盖；现在设为 `false` 就能留住面板里没提交完的表单，代价是每个打开过的实例留一份隐藏内容。
- `Modal` 打开期间页面不再跟着滚动，`Tab` 在窗口里循环，不会跳到后面的内容上；窗口关闭或组件销毁后页面滚动自动恢复。
- `Modal` / `Drawer` 叠着开时，`Escape` 只关最上面那一层；下拉菜单开在窗口之上时，第一下 `Escape` 先收下拉，不会把整个窗口一起关掉。
- `Modal` / `Drawer` / `ModalPanel` 支持 `destroyOnClose`（默认 `true`）：关闭后销毁面板内容，下次打开是干净的。设为 `false` 可以留住填了一半的表单，代价是页面里留一份隐藏内容。常开面板（`panelOnly`）不受这个开关影响。
- 关闭 `Modal` / `Drawer` 时，窗口里打开着的下拉、级联、子菜单等浮层会一起收起，不会在窗口关掉后孤零零地留在页面上。
- 确认弹窗的 `onOk` 返回 Promise 时，关闭时机交给组件：保存成功才关窗，失败只结束按钮的 loading 状态并把窗口留着，用户改完可以直接重试。
- 关闭动画还没播完就重新打开时，窗口不会再过一会儿自己消失。
- `Modal` 修复 `centered` 设置了却不居中、`width` 传字符串时单位丢失（`Drawer` 的 `width` / `height` 同样）、没传 `title` 却多出一条空标题栏的问题。
- 命令式弹窗（`modal.confirm()` 等）的 `title` / `content` 不再限字符串，可以传任意节点；弹窗实例统一提供 `show` / `hide` / `destroy`，并沿用调用处 `ConfigProvider` 的主题、语言和弹层挂载设置。
- `Modal` 内容区贴边的控件（如 `Input`）聚焦时，那圈焦点高亮不再被裁掉一半；内容宽度、位置与页脚间距都没有变化。
- `Tooltip` 气泡和箭头指示器补回 1px 描边，深色背景上也能看清边界。
- `Table` 新增 `ellipsis`：单元格内容超出列宽时收成省略号。写在列上只管那一列，写在 `Table` 上一次管住所有列（`render` 或插槽出来的内容同样管），某一列想显示完整内容就在列上写 `ellipsis: false` 单独关掉。默认只截一行，`rows` 可以截到多行；悬停提示默认打开，且只在格子真的被截断时才出现，`tooltip` 能换成指定内容或设 `false` 关掉。
- `Select` 修复选中值或选项标签是 `NaN` 时整个组件崩掉的问题：之前 React 会一直重渲染到上限、抛 "Too many re-renders"，页面交给错误边界；现在它和其它数字一样正常显示。
- `Modal` / `Drawer` 统一了关闭时的回调顺序：先 `onOpenChange(false)` 把开合状态结掉，再 `onCancel` / `onClose` 说这次是哪条通道关的。在这两个回调里读到的开合值已经是结算后的，不用再自己补一次关闭。
- `Drawer` 的 `title` 不再有默认的 "Title"，不写就没有标题文本。标题栏仍会给右上角关闭按钮留着位置，只有 `closable: false` 且没有标题时才整条不显示。
- `DatePicker` 修复区间只选了一半时的收尾：按 `Esc` 关掉面板不再把半截日期留在输入框里，和点面板外面一样退回上一次选好的区间。
- `DatePicker` 修复只在结束框里手输了一个日期时的错觉：输入框显示着日期、`onChange` 却没收到值。现在首尾凑不齐就不算选上，关掉面板时一并清掉。
- `DatePicker` 修好了手输没被接受时输入框的退法：退回当前这份值，未受控时退回最近一次选好的结果，不再弹回最初传进来的那个日期。
- `DatePicker` 修复范围只传了 `startDate` 或只传了 `endDate` 时，再点一次日历会把父级给的那一头覆盖掉：现在面板认已有的那头，下一次点选只补空出来的那一头。
- `DatePicker` 重复点已经选中的日期、重复提交同一个值，不再多触发一次 `onChange`。
- `DatePicker` 修复区间只选了一头、就在时间列上挑时间：那个时间不再被当成结果发给 `onChange`，而是留在输入框里，等另一头补齐。
- `DatePicker` 修复年 / 月面板不认 `disabledDate`：一整年或一整月里一天都选不出来时，那一格置灰、点不进去，`Tab` 也会跳过它；格里还能选出一天的，照常能点。
- `DatePicker` 年 / 月面板的高亮改为跟着当前值走：翻年、翻月只改浏览位置，选中样式不再跑到正看着的那一格上。
- `DatePicker` 年 / 月格子可以用键盘选了：`Tab` 到格子按 `Enter` 或空格即可，头部的年份、月份标签同样能用键盘切面板。
- **不兼容变更**：组件内置文案的默认语言从简体中文改为英语。没有挂 `ConfigProvider` 时，`DatePicker`、`Select`、`Table`、`Modal`、`Page` 等组件的内置文案现在显示英文；需要简体中文请在应用根部挂 `ConfigProvider` 并传入 `locale`（`import zhCN from "react-kui/locale/zh-CN"`）。
- **不兼容变更**：`theme` 不再接受 `default`。想要组件自己的默认外观就不要写 `theme`，`ConfigProvider` 也不再传这个值；可选的是 `fill` / `outline` / `plain` / `solid` / `dashed` / `underlined` 六档。此前 `Button` 上写 `theme="default"` 会被认成 `type="default"` 的那种外观，让 `type="link"` / `type="text"` 的按钮凭空多出一块底色。
- `DatePicker` / `Select` / `Cascader` / `TreeSelect` 的 `theme="plain"` 与 `bordered={false}` 各管各的：`plain` 是无边框也没有底色，`bordered={false}` 只去掉边框，两者可以同时使用；控件禁用时 `plain` 照样显示禁用态。
- `Select` / `Cascader` / `TreeSelect` 去掉边框后，鼠标悬停不再突然描出一圈主色边框和光晕。
- `Select` / `Cascader` / `TreeSelect` / `DatePicker` 的 `theme` 补齐 `outline` / `solid` / `dashed` / `underlined` 四档：描边框、主色实底（文字与图标跟着反白）、虚线描边、只留一条下划线（聚焦时下划线变主色）。
- `Cascader` 用 `theme="fill"` 时，鼠标悬停不再突然描出一圈边框。
- `Select` / `TreeSelect` 用 `theme="fill"` 时，鼠标悬停不再抹掉应用用 `--kui-theme-fill-border` 描的那圈边框，与 `Cascader` 一致。
- `Select` / `TreeSelect` 的 `theme="plain"` 放进报错的表单项时，鼠标悬停、聚焦、打开面板不再让那圈红色描边消失。
- `DatePicker` 去掉边框（`bordered={false}` 或 `theme="plain"`）后聚焦不再出现一圈焦点环，与 `Select` 系列一致。
- `Input` / `TextArea` / `InputNumber` 的 `theme` 补齐 `outline` / `solid` / `dashed` / `underlined` 四档：描边框、主色实底（输入的文字、占位提示与前后缀图标一起反白）、虚线描边、只留一条下划线（悬停、聚焦时变主色）。
- `Input` / `TextArea` / `InputNumber` 的 `theme="plain"` 悬停时不再突然描出一圈边框，禁用时仍显示禁用态；`plain` 与 `underlined` 聚焦时不再出现焦点环，与 `Select` 系列一致。
- `InputTag` / `InputOTP` 的 `theme` 补齐 `outline` / `solid` / `dashed` / `underlined` 四档：描边框、主色实底、虚线描边、只留一条下划线（悬停、聚焦时下划线变主色）。
- `InputTag` 用 `theme="solid"` 时，已添加的标签、输入的文字、占位提示和清除图标一起反白；`InputOTP` 的每一格都跟着 `theme` 走，实底时格子里的字也反白，禁用时仍显示禁用态。
- `InputTag` / `InputOTP` 的 `theme="plain"` 悬停时不再突然描出一圈边框；`plain` 与 `underlined` 聚焦时不再出现焦点环，与 `Select` 系列一致。
- `ColorPicker` 的 `theme` 补齐 `outline` / `solid` / `dashed` / `underlined` 四档：描边框、主色实底、虚线描边、只留一条下划线（悬停、打开面板时下划线变主色）。
- `ColorPicker` 用 `theme="solid"` 时，色块旁边的颜色文字一起反白，悬停、打开面板时底色加深；色块本身仍显示当前颜色。
- `ColorPicker` 用 `theme="fill"` 或 `theme="plain"` 且禁用时，仍显示禁用态的背景与描边。
- `Tag` 的 `theme` 补齐 `outline` / `solid` / `dashed` 三档：描边框、主色实底（文字和关闭图标一起反白）、虚线描边；不写 `theme` 就是标签自己的 `fill` 外观，`theme="underlined"` 对它没有意义，同样按 `fill` 呈现。
- `Tag` 设置了 `color` 时以颜色为准：预设色值和自定义色值都保留自己的边框与文字颜色，不再被 `theme` 的底色盖掉。此前带预设色值的标签会被默认外观铺上一层灰底，色值只剩文字还在。
- `Select` / `TreeSelect` 用 `theme="solid"` 时，框里已选的标签改为半透明反白底，不再和控件一样填成主色；用 `theme="dashed"` 时标签仍是实线描边，不会跟控件一起变虚线。`InputTag` 早就是这个做法，现在三处一致。
- `Checkbox` / `Radio` 的方框和圆点只有 `fill`（浅底填充）与 `outline`（描边）两种外观。`outline` 现在真的会把边框描出来，颜色可以和其它描边控件一样用 `--kui-theme-outline-border` 改；`fill` 的边框色也能用 `--kui-theme-fill-border` 覆盖，此前这两个变量在复选框、单选框上都不生效。
- `Checkbox` / `Radio` 不写 `theme` 就是浅底的 `fill`；此前写了 `default` 反而会落到描边的基础外观，等于换了个 `theme`。`solid` / `plain` / `dashed` / `underlined` 对一个不能输入的方框或圆点没有意义，同样按 `fill` 呈现。
- `CheckboxGroup` / `RadioGroup` 的 `theme` 会传到组内每一个方框和圆点上，从 `ConfigProvider` 继承的 `theme` 走同一条路；`type="button"` 的按钮组只有 `fill` 一档改用一条分隔线拼接按钮，其余档位保持按钮自身相邻边框的排布。选中与禁用状态始终优先于 `theme`。
- `Card` / `FeatureCard` / `StatCard` 的 `theme` 补齐 `solid` / `dashed` 两档：`solid` 是主色实底，标题、描述、图标和头部那条分割线一起反白，`StatCard` 里带 `success` / `danger` / `warning` 状态的趋势项仍保留自己的颜色；`dashed` 是虚线描边。`StatCard` 的 `theme` 也补到和另两张卡片一样，不再只认 `fill` / `outline` / `plain` 三档。
- 卡片上写 `theme="underlined"`（包括 `ConfigProvider` 传下来的）不再让卡片既没有底色也没有边框：下划线只属于能输入的控件，卡片碰到它按自己的 `fill` 外观呈现。
- `Collapse` / `FeedbackPanel` 的 `theme` 补齐 `solid` / `dashed` 两档：`solid` 是主色实底，面板标题、描述、详情块和图标一起反白，`Collapse` 里禁用的面板仍保持禁用态；`dashed` 是虚线描边，内部的行分割线仍是实线。`FeedbackPanel` 左边那条状态色带不受 `theme` 影响。
- `Collapse` 的简洁模式（`sample`）配上 `theme="solid"` 时，主色落在每一块面板自己身上，外层不再铺一整块底色。
- `FeedbackPanel` 的 `theme="outline"` 不再自带一层页面底色：面板放进卡片或带底色的容器里时，露出的是容器自己的背景，与其它描边表面一致。
- `CheckCard` / `CheckCardGroup` 的 `theme` 补齐 `solid` / `dashed` 两档，`CheckCard` 也不再只认 `fill` / `outline`：`solid` 是主色实底，标题、描述、左侧图标和右上角的选中标记一起反白，选中时圆点转成浅色、勾用主色；`dashed` 是虚线描边。卡片上写 `theme="underlined"` 按 `outline` 呈现。
- `CheckCardGroup` 的 `theme` 会传给组内每一张卡片，从 `ConfigProvider` 继承的 `theme` 也走同一条路；卡片自己写了的 `theme` 优先。
- `CheckCard` 禁用时，标题、描述和图标一起变灰，不再只把外框和选中标记变灰。
- **不兼容变更**：不再导出 `CheckCardTheme`，`theme` 一律使用库统一的 `ThemeType`。
- `Alert` 的 `theme` 补齐 `solid` / `dashed` 两档：`solid` 用这条提示自己的颜色铺满整块（`error` 红、`success` 绿、`warning` 橙、`info` 主色），文字、图标和关闭按钮一起反白，错误和成功仍是两种颜色、不会一起变成主色；`dashed` 是虚线描边。提示条上写 `theme="underlined"` 按 `fill` 呈现。
- `Alert` 的 `theme="outline"` 不再用正文颜色描边：外框改用库统一的边框色，和其它描边表面一致，也能用 `--kui-theme-outline-border` 一并改掉。
- `Image` 的 `theme` 补齐 `solid` / `dashed` 两档：`solid` 用主色铺满图片底下那层板，加载中、加载失败的占位和自定义内容跟着反白；`dashed` 是虚线描边。图片上写 `theme="underlined"` 按 `plain` 呈现。
- `Image` 的 `theme="outline"` 现在真的描出一圈边框：此前只给了边框颜色、没给边框宽度，什么也看不出来，`--kui-theme-outline-border` 在图片上也不生效。
- `QRCode` 的 `theme` 补齐 `solid` / `dashed` 两档：`solid` 用主色铺满二维码的底，“已过期”这类遮罩文字跟着反白；`dashed` 是虚线描边。二维码上写 `theme="underlined"` 按 `outline` 呈现。
- `QRCode` 的 `theme="plain"` 只去掉表面：不再顺手删掉边框内的 12px 内边距，边框也是改成透明而不是抹掉；要连边框和内边距一起去掉，仍然写 `bordered={false}`。
- `Page` 的 `theme` 补齐 `solid` / `dashed` 两档：`solid` 用主色铺满页码格子，格子里的数字和省略号一起反白，当前页换成白底主色字，悬停是主色上的一层浅白；总条数那一行和左右翻页箭头仍在分页栏自己的底色上。`dashed` 是虚线描边，省略号那一格不描边。分页条上写 `theme="underlined"` 按 `fill` 呈现。
- `Page` 的 `theme="plain"` 现在真的能用：此前分页条只把 `fill` / `outline` 写进类名，写 `plain` 什么也不会发生。
- `Page` 选中页码的状态色现在真的落到格子上：此前 `theme="fill"` 的选中格只有数字变主色、底色还是悬停那层灰，`theme="outline"` 的选中格边框也没变成主色。
- `Page` 的 `theme` 传给条内每页条数选择器和跳转输入框时，先换算成分页条自己画得到的那几档：写 `theme="underlined"` 不再出现分页条是扁平的、里面的输入框却带一条下划线。
- `Kanban` 的 `theme` 补齐 `plain` / `solid` / `dashed` 三档，并能从 `ConfigProvider` 继承：外观落在每一列上，`plain` 既不铺底也不描边，`solid` 用主色铺满整列、列标题、计数和列里的卡片一起反白，`dashed` 是虚线描边。看板上写 `theme="underlined"` 按 `fill` 呈现。
- `Kanban` 拖动卡片经过某一列时的提示现在真的会出现：此前这层提示被那一列自己的外观盖住，连看板默认的 `fill` 也一样看不见。
- `Kanban` 用 `theme="solid"` 时，列里卡片的键盘焦点环改成主色上的一层浅白，不再是主色上叠主色；列头那颗状态圆点仍显示 `column.color` 给的颜色，五种外观都不改它。
- 看板列的外观现在也吃局部变量：`--kui-theme-fill-bg` / `--kui-control-bg-fill` 改 `fill` 的底色，`--kui-theme-outline-border` / `--kui-control-border` 改描边色，此前这些变量在看板上都不生效。
- `Transfer` 的 `theme` 补齐 `plain` / `solid` / `dashed` 三档，并能从 `ConfigProvider` / `Form` 继承：外观落在左右两个列表上，`plain` 既不铺底也不描边，`solid` 用主色铺满两个列表，列表标题、条目描述、头部与底部的分割线跟着反白，悬停、选中的条目是主色上的一层浅白，键盘焦点环也一样；`dashed` 是虚线描边。此前 `theme` 只认 `outline` / `fill`。穿梭框上写 `theme="underlined"` 按 `outline` 呈现。
- `Transfer` 用 `theme="solid"` 时，两侧的搜索框换成浅底填充，不会在主色上再叠一层主色；禁用整个穿梭框或其中一行时，列表文字、条目描述和底部都回到禁用色。
- `ListPanel` 的 `theme` 补齐 `solid` / `dashed` 两档：此前只认 `fill` / `outline` / `plain`。`solid` 用主色铺满整块面板，`dashed` 是虚线描边；外观落在面板身下那张卡片上，`bordered={false}` 只去掉外框、不改这一档。
- `ListPanel` 用 `theme="solid"` 时，结果摘要那一行换成主色上的浅色文字，批量操作栏那一格也从灰底改成主色上的一层浅白，不再是一行暗字和一块外来的灰底；面板里的其它内容跟着面板字色走，不受影响。
- 列表面板上写 `theme="underlined"` 按面板自己的 `outline` 呈现，不再落到卡片的 `fill`；`ConfigProvider` 传下来的这一档同样如此。
- `Form` 的 `size` / `shape` / `theme` 只管表单里的控件：写在 `Form` 上的外观不再传给同一个表单里的 `Card`、`Collapse`、`FeedbackPanel`、`Alert`、`Table`、`Page`、`Tag`、`Button` 这些不是控件的区块，它们继续从 `ConfigProvider` 继承。此前 `<Form size="small">` 会顺手把表单里的卡片、面板、分页条一起缩小，`<Form theme="solid">` 会把它们一起铺成主色。要让整块页面跟着变外观，请把外观写在 `ConfigProvider` 上或直接写在组件上。
- **不兼容变更**：`theme` 的类型改成只列组件画得出的档位。表面型组件——`Card` / `FeatureCard` / `StatCard` / `Collapse` / `FeedbackPanel` / `CheckCard` / `Alert` / `Image` / `QRCode` / `Page` / `Kanban` / `Transfer` / `ListPanel` / `Tag` / `Button` / `DropdownButton`，以及 `RadioGroup` / `RadioButton`——只收 `fill` / `outline` / `plain` / `solid` / `dashed` 五档（`SurfaceThemeType`）；`Checkbox` / `Radio` / `CheckboxGroup` 只收 `fill` / `outline` 两档（`MarkThemeType`）；`ConfigProvider` 与 `Form` 仍然六档全收。在这类组件上写过它画不到的档位（比如给卡片写 `theme="underlined"`）现在 TypeScript 会报错，运行时没有变化，组件仍旧按自己的外观呈现。
- `TreeSelect` 展开面板时不再多出一圈光晕：`fill` / `plain` / `solid` / `underlined`、无边框与禁用这几种外观下，展开只剩那一圈焦点环，和 `Select`、`Cascader` 一致；`outline` 与 `dashed` 仍带原来的浅光。
- `Input` / `Textarea` 用 `theme="solid"` 时聚焦不再多出一圈浅色光晕：主色实底上那层淡光本来就看不出来，现在和 `InputNumber` / `InputOTP` / `InputTag` / `ColorPicker` 一致，只留那一圈焦点环。
- 禁用的输入框聚焦时不再发光；`ColorPicker` 禁用时，哪怕面板是用 `open` 手动展开的也不再发光。`outline` / `dashed` 这些留着描边的外观，聚焦与展开时的那层浅光照旧。

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
