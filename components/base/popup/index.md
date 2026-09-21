# Popup 弹层基座

通用锚点弹层。Dropdown 在它之上添加菜单行为；Popup 可承载表单、选择器及任意内容，不预设菜单角色、选择逻辑或焦点圈定。

```tsx
<Popup
  placement="bottom-left"
  trigger="click"
  arrow
  overlay={({ close }) => (
    <>
      <Input placeholder="Any content" />
      <Button onClick={close}>Done</Button>
    </>
  )}
>
  <Button>Open</Button>
</Popup>
```

## Popup API

| 属性                | 说明                                                       | 类型                                                   | 默认值      |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| open                | 受控显示状态；Vue 支持 v-model:open                        | boolean                                                | -           |
| defaultOpen         | 非受控初始状态                                             | boolean                                                | false       |
| disabled            | 禁止交互打开并取消待执行的打开操作，不强制覆盖 open        | boolean                                                | false       |
| placement           | 弹层方位，支持 12 个方向                                   | PlacementsType                                         | bottom-left |
| trigger             | 触发方式；manual 仅由 open 或实例方法控制                  | PopupTrigger                                           | click       |
| arrow               | 显示箭头                                                   | boolean                                                | false       |
| offset              | 定位间距（像素）                                           | number                                                 | 3           |
| openDelay           | hover 打开延时（毫秒）                                     | number                                                 | 0           |
| closeDelay          | hover / focus 关闭延时（毫秒）                             | number                                                 | 300         |
| closeOnOutsideClick | 外部点击关闭，包含嵌套 Popup 的内容边界                    | boolean                                                | true        |
| closeOnEscape       | Escape 关闭最上层 Popup 并还原触发器焦点                   | boolean                                                | true        |
| matchTriggerWidth   | 弹层最小宽度不小于触发器                                   | boolean                                                | false       |
| getPopupContainer   | 挂载容器，默认使用 Config 配置或 body                      | () => HTMLElement                                      | -           |
| destroyOnClose      | 退出动画结束后销毁内容；默认保留表单状态                   | boolean                                                | false       |
| target              | 可选外部定位锚点；不自动绑定事件，配合 manual 和 open 使用 | PopupTarget                                            | -           |
| overlay             | 弹层内容；Vue 推荐 overlay 插槽                            | PopupContent                                           | -           |
| onOpenChange        | 请求改变显示状态，参数包含原因和原生事件                   | (open: boolean, detail: PopupOpenChangeDetail) => void | -           |
| onAfterOpen         | 进入动画结束                                               | () => void                                             | -           |
| onAfterClose        | 退出动画结束                                               | () => void                                             | -           |

children renders the trigger. overlay accepts ReactNode or (popup: PopupRef) => ReactNode.

## 包装组件选项

供 Dropdown、Tooltip、Poptip、Popconfirm 适配已有样式和交互。

| 属性                    | 说明                                        | 类型                                            | 默认值    |
| ----------------------- | ------------------------------------------- | ----------------------------------------------- | --------- |
| prefixCls               | 根样式前缀                                  | string                                          | k-popup   |
| transitionName          | 动画类名前缀                                | string                                          | prefixCls |
| panelOnly               | 只渲染内联内容，无定位、触发器或全局事件    | boolean                                         | false     |
| respectDefaultPrevented | 遵循触发器 click 的 preventDefault          | boolean                                         | true      |
| contentStyle            | 内容容器样式                                | CSSProperties                                   | -         |
| hideWhenDetached        | 锚点不在视口时隐藏                          | boolean                                         | false     |
| children                | 触发元素；自定义组件需要转发 DOM ref 和事件 | ReactNode                                       | -         |
| triggerProps            | 触发器附加属性                              | HTMLAttributes<HTMLElement>                     | -         |
| onTriggerKeyDown        | 业务键盘处理                                | (event: KeyboardEvent, popup: PopupRef) => void | -         |
| arrowContent            | 自定义箭头内容                              | ReactNode                                       | -         |

## 类型与实例方法

| 属性               | 说明                                            | 类型                                   | 默认值 |
| ------------------ | ----------------------------------------------- | -------------------------------------- | ------ |
| raw                | 复用唯一弹层根节点及其 DOM 引用，不增加包装元素 | boolean                                | false  |
| outsideEvent       | 外部点击事件，适配选择器原有的关闭时机          | `click` \| `mousedown`                 | click  |
| transitionDuration | 过渡时长（毫秒）                                | number                                 | 300    |
| getAnchorPosition  | 可选视口坐标解析函数，用于 Mentions 光标定位    | () => { x: number; y: number } \| null | -      |

Select、TreeSelect、Cascader、AutoComplete、Mentions、DatePicker、ColorPicker 共用此定位与生命周期实现，搜索、选择和键盘导航仍由各业务组件管理。

- PopupTrigger: hover / click / focus / contextmenu / manual.
- PopupOpenChangeDetail: { reason: PopupOpenReason; event?: Event }.
- PopupOpenReason: trigger / hover / focus / contextmenu / outside / escape / programmatic / host.
- PopupRef: open(), close(), updatePosition(), cancelClose(), scheduleClose(), getTriggerElement(), getPopupElement().
- PopupTarget: RefObject<HTMLElement | null>.
- PopupContent: ReactNode or (popup: PopupRef) => ReactNode.

受控使用时需在父组件响应 onOpenChange 更新 open。只有 hover 使用 openDelay。外部 target 仅用于定位。自定义触发器组件须转发属性、事件与 DOM 引用。
