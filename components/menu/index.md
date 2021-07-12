## API

### Menu 

| 属性            | 说明                                     | 类型                                              | 默认值   |
|-----------------|------------------------------------------|---------------------------------------------------|----------|
| theme           | 主题颜色                                 | string: light dark                                | light    |
| openKeys        | 当前展开的 SubMenu 菜单项 key 数组       | string[]                                          | -        |
| selectedKeys    | 当前选中的菜单项                         | string[]                                          | -        |
| mode            | 菜单类型，支持垂直、水平、和内嵌模式三种 | string: vertical vertical-right horizontal inline | vertical |
| onClick         | 点击 MenuItem 调用此函数                 | function({key, keyPath, item })                        | -        |
| onAffixed       | 点击 MenuItem 收藏调用此函数             | function({key, keyPath, item },affixed)                | -        |
| onOpenChange    | SubMenu 展开/关闭的回调                  | function(openKeys: string[])                           | -        |
| accordion       | 是否只允许菜单展开一项                   | boolean                                           | false    |
| inlineCollapsed | inline 时菜单是否收起状态                | boolean                                           | false    |
| verticalAffixed | 菜单是否支持收藏 (vertical模式有效)      | boolean                                           | false    |

### Menu.Item

| 属性     | 说明                     | 类型    | 默认值 |
|----------|--------------------------|---------|--------|
| icon     | item的图标               | string  | -      |
| disabled | 是否禁用                 | boolean | false  |
| affixed  | 是否收藏                 | boolean | false  |
| key      | item 的唯一标志          | string  | -      |
| title    | 设置收缩时展示的悬浮标题 | string  | -      |
 
### Menu.SubMenu

| 属性     | 说明            | 类型         | 默认值 |
|----------|-----------------|--------------|--------|
| disabled | 是否禁用        | boolean      | false  |
| key      | item 的唯一标志 | string       | -      |
| title    | 子菜单项值      | string,ReactNode | -      |

### Menu.MenuGroup

| 属性  | 说明     | 类型         | 默认值 |
|-------|----------|--------------|--------|
| title | 分组标题 | string,ReactNode | -      |