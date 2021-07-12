### Tabs API
| 属性       | 说明                                  | 类型                | 默认值 |
|------------|---------------------------------------|---------------------|--------|
| activeKey  | 当前激活 tab 面板的 key               | string              | -      |
| card       | 页签样式是否为卡片样式                | boolean             | false  |
| sample     | 页签样式是否为简洁样式                | boolean             | false  |
| animated   | 是否使用动画切换 Tabs                 | boolean             | true   |
| onTabClose | tab关闭时的回调，返回关闭的tab的key值 | function(activeKey) | -      |
| onChange   | 切换面板的回调                        | function(activeKey) | -      |
| onTabClick | tab点击时的回调                       | function(activeKey) | -      |

### Tabs.TabPane API
| 属性     | 说明                | 类型    | 默认值 |
|----------|---------------------|---------|--------|
| key      | vue需要的key值      | string  | -      |
| title    | 选项卡头显示文字    | string  | -      |
| icon     | 选项卡头显示的图标  | string  | -      |
| disabled | tab是否被禁用       | boolean | false  |
| closable | tab是否显示关闭按钮 | boolean | false  |