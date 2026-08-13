# Spin

Used for loading states of pages and blocks.

## When to Use

When part of the page is waiting for asynchronous data or being rendered, appropriate loading animations can effectively alleviate user anxiety.

## Examples

[Basic Usage](./demo/basic.tsx)

- A simple loading state.

[Card Loading](./demo/container.tsx)

- You can directly embed content into Spin to turn an existing container into a loading state.

[Spin Type](./demo/mode.tsx)

- You can directly embed content into Spin to turn an existing container into a loading state.

## Spin API

| Property   | Description                                                  | Type                        | Default |
| ---------- | ------------------------------------------------------------ | --------------------------- | ------- |
| spinning   | Whether the component is loading                            | boolean                        | true    |
| mode       | Display spin type, provides 4 display methods                | string                      | -       |
| delay      | Delay time to display loading effect (prevent flickering)    | number (milliseconds)       | 500     |
| size       | Set loading effect size                                      | `large`, `default`, `small` | -       |
