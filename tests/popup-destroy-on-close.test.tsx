import { act, render } from "@testing-library/react";
import { type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Dropdown, DropdownButton } from "../components/dropdown";
import Popconfirm from "../components/popconfirm";
import Poptip from "../components/poptip";
import Tooltip from "../components/tooltip";

/**
 * 弹层生命周期契约：这些组件的 destroyOnClose 默认为 true —— 关闭动画跑完后面板节点从 DOM 移除，
 * 重复打开要重新挂载（实测约 14ms 固定开销）；传 false 才保留隐藏节点，换面板内表单状态。
 * 两个仓库必须断言同一件事，见 kui-vue/tests/popup-destroy-on-close.test.ts。
 */

const overlay = <div>面板内容</div>;

const cases: Array<{
  name: string;
  node: (props: Record<string, unknown>) => ReactNode;
  sel: string;
}> = [
  {
    name: "Dropdown",
    node: (props) => (
      <Dropdown overlay={overlay} trigger="click" {...props}>
        <button type="button">触发</button>
      </Dropdown>
    ),
    sel: ".k-dropdown",
  },
  {
    name: "Tooltip",
    node: (props) => (
      <Tooltip title="提示" {...props}>
        <button type="button">触发</button>
      </Tooltip>
    ),
    sel: ".k-tooltip",
  },
  {
    name: "Poptip",
    node: (props) => (
      <Poptip content="内容" trigger="click" {...props}>
        <button type="button">触发</button>
      </Poptip>
    ),
    sel: ".k-poptip",
  },
  {
    name: "Popconfirm",
    node: (props) => (
      <Popconfirm title="确定？" {...props}>
        <button type="button">触发</button>
      </Popconfirm>
    ),
    sel: ".k-popconfirm",
  },
  {
    name: "DropdownButton",
    node: (props) => (
      <DropdownButton overlay={overlay} {...props}>
        主操作
      </DropdownButton>
    ),
    sel: ".k-dropdown",
  },
];

const settle = () => act(async () => void (await vi.advanceTimersByTimeAsync(600)));

afterEach(() => {
  vi.useRealTimers();
});

describe.each(cases)("$name 面板生命周期", ({ node, sel }) => {
  it("默认在关闭动画结束后销毁面板节点", async () => {
    vi.useFakeTimers();
    const { rerender } = render(node({ open: true }));
    expect(document.querySelector(sel)).not.toBeNull();

    rerender(node({ open: false }));
    await settle();

    expect(document.querySelector(sel)).toBeNull();
  });

  it("destroyOnClose=false 时保留面板节点", async () => {
    vi.useFakeTimers();
    const props = { open: true, destroyOnClose: false };
    const { rerender } = render(node(props));
    expect(document.querySelector(sel)).not.toBeNull();

    rerender(node({ ...props, open: false }));
    await settle();

    expect(document.querySelector(sel)).not.toBeNull();
  });
});
