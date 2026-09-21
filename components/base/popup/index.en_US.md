# Popup

A generic anchored popup. Dropdown adds menu semantics on top; Popup can display forms, pickers, or arbitrary content. It does not supply a menu role, selection logic, or a focus trap.

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

| Property            | Description                                                                      | Type                                                   | Default     |
| ------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| open                | Controlled visibility; Vue supports v-model:open                                 | boolean                                                | -           |
| defaultOpen         | Initial uncontrolled visibility                                                  | boolean                                                | false       |
| disabled            | Prevents opening and cancels delayed opening; does not override open             | boolean                                                | false       |
| placement           | Popup placement; supports 12 positions                                           | PlacementsType                                         | bottom-left |
| trigger             | Trigger mode; manual uses open or instance methods                               | PopupTrigger                                           | click       |
| arrow               | Show arrow                                                                       | boolean                                                | false       |
| offset              | Position offset in pixels                                                        | number                                                 | 3           |
| openDelay           | Hover opening delay in milliseconds                                              | number                                                 | 0           |
| closeDelay          | Hover / focus closing delay in milliseconds                                      | number                                                 | 300         |
| closeOnOutsideClick | Close on outside click; nested Popup content counts as inside                    | boolean                                                | true        |
| closeOnEscape       | Escape closes the top Popup and restores trigger focus                           | boolean                                                | true        |
| matchTriggerWidth   | Use trigger width as the minimum popup width                                     | boolean                                                | false       |
| getPopupContainer   | Container; falls back to Config or body                                          | () => HTMLElement                                      | -           |
| destroyOnClose      | Destroy after exit; preserves form state by default                              | boolean                                                | false       |
| target              | Optional external positioning anchor; no event binding, use with manual and open | PopupTarget                                            | -           |
| overlay             | Overlay content; prefer the overlay slot in Vue                                  | PopupContent                                           | -           |
| onOpenChange        | Visibility change request with reason and native event                           | (open: boolean, detail: PopupOpenChangeDetail) => void | -           |
| onAfterOpen         | Called after entering                                                            | () => void                                             | -           |
| onAfterClose        | Called after leaving                                                             | () => void                                             | -           |

children renders the trigger. overlay accepts ReactNode or (popup: PopupRef) => ReactNode.

## Adapter options

Used by Dropdown, Tooltip, Poptip and Popconfirm to preserve existing appearance.

| Property                | Description                                                       | Type                                            | Default   |
| ----------------------- | ----------------------------------------------------------------- | ----------------------------------------------- | --------- |
| prefixCls               | Root CSS prefix                                                   | string                                          | k-popup   |
| transitionName          | Transition CSS prefix                                             | string                                          | prefixCls |
| panelOnly               | Inline content only; no positioning, trigger, or global listeners | boolean                                         | false     |
| respectDefaultPrevented | Honor preventDefault on trigger click                             | boolean                                         | true      |
| contentStyle            | Content container styles                                          | CSSProperties                                   | -         |
| hideWhenDetached        | Hide when the anchor is outside the viewport                      | boolean                                         | false     |
| children                | Trigger; custom components must forward DOM ref and events        | ReactNode                                       | -         |
| triggerProps            | Additional trigger attributes                                     | HTMLAttributes<HTMLElement>                     | -         |
| onTriggerKeyDown        | Business keyboard handler                                         | (event: KeyboardEvent, popup: PopupRef) => void | -         |
| arrowContent            | Custom arrow content                                              | ReactNode                                       | -         |

## Types and instance methods

| Property           | Description                                                              | Type                                   | Default |
| ------------------ | ------------------------------------------------------------------------ | -------------------------------------- | ------- |
| raw                | Reuse the single overlay root and preserve its DOM ref; no extra wrapper | boolean                                | false   |
| outsideEvent       | Outside pointer event used by legacy selector adapters                   | `click` \| `mousedown`                 | click   |
| transitionDuration | Transition duration in milliseconds                                      | number                                 | 300     |
| getAnchorPosition  | Optional viewport point resolver, for caret-anchored Mentions            | () => { x: number; y: number } \| null | -       |

Select, TreeSelect, Cascader, AutoComplete, Mentions, DatePicker and ColorPicker share this positioning and lifecycle implementation. Their selection, search and keyboard logic remains inside the business components.

- PopupTrigger: hover / click / focus / contextmenu / manual.
- PopupOpenChangeDetail: { reason: PopupOpenReason; event?: Event }.
- PopupOpenReason: trigger / hover / focus / contextmenu / outside / escape / programmatic / host.
- PopupRef: open(), close(), updatePosition(), cancelClose(), scheduleClose(), getTriggerElement(), getPopupElement().
- PopupTarget: RefObject<HTMLElement | null>.
- PopupContent: ReactNode or (popup: PopupRef) => ReactNode.

Use explicit open state for controlled behavior. A controlled parent must apply onOpenChange updates. Only hover uses openDelay. External target anchors are position-only. Custom trigger components must forward attributes, events, and the DOM ref.
