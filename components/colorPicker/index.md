### API
| 属性          | 说明                                               | 类型     | 默认值 |
|---------------|----------------------------------------------------|----------|--------|
| value         | 当前激活的面板的 `name`                            | string   | -      |
| mode          | 颜色展示类型,提供3种模式(`hex` 、 `rgba` 、`hsla`) | string   | 'hex'  |
| defaultColors | 自定义颜色盘,最多20种                              | array    | [...]  |
| showMode     | 是否展示颜色模式                                   | boolean  | false  |
| change        | 颜色值改变的时候触发,返回颜色的值                  | function | -      |