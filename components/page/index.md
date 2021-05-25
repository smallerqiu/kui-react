## API
| 属性             | 说明                                           | 类型     | 默认值           |
|------------------|------------------------------------------------|----------|------------------|
| current          | 当前页码                                       | Number   | 1                |
| total            | 数据总数                                       | Number   | 0                |
| pageSize         | 每页条数                                       | Number   | 10               |
| showSizer        | 是否显示页码组                                 | Boolean  | false            |
| showTotal        | 是否显示总数                                   | Boolean  | false            |
| showElevator     | 是否显示页码阶梯                               | Boolean  | false            |
| sizeData         | 自定义页码组数据                               | Array    | [10,15,20,30,40] |
| size             | 值为'small' 时，程序小尺寸                     | Sting    | -                |
| onChange         | 页码改变的回调，返回改变后的页码               | Function | -                |
| onPageSizeChange | 切换页码组改变的回调，返回改变后的 `page-size` | Function | -                |