## API
| 属性             | 说明                                           | 类型                       | 默认值           |
|------------------|------------------------------------------------|----------------------------|------------------|
| current          | 当前页码                                       | number                     | 1                |
| total            | 数据总数                                       | number                     | 0                |
| pageSize         | 每页条数                                       | number                     | 10               |
| showSizer        | 是否显示页码组                                 | boolean                    | false            |
| showTotal        | 是否显示总数                                   | boolean                    | false            |
| showElevator     | 是否显示页码阶梯                               | boolean                    | false            |
| sizeData         | 自定义页码组数据                               | array                      | [10,15,20,30,40] |
| size             | 值为'small' 时，程序小尺寸                     | string                      | -                |
| onChange         | 页码改变的回调，返回改变后的页码               | function(page)             | -                |
| onPageSizeChange | 切换页码组改变的回调，返回改变后的 `page-size` | function(current,pageSize) | -                |