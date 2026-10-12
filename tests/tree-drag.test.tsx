import { createEvent, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tree, type TreeNode } from "react-kui";

const dataTransfer = () => ({
  dropEffect: "none",
  effectAllowed: "all",
  setData: vi.fn(),
});

const rect = (element: Element) =>
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    right: 100,
    bottom: 24,
    left: 0,
    width: 100,
    height: 24,
    toJSON: () => ({}),
  });

describe("Tree drag and drop", () => {
  it("updates the rendered order and reports the exact drop position", () => {
    const data: TreeNode[] = [
      { key: "one", title: "One" },
      { key: "two", title: "Two" },
      { key: "three", title: "Three" },
    ];
    const onDrop = vi.fn();
    const { container } = render(<Tree data={data} draggable onDrop={onDrop} />);
    const titles = container.querySelectorAll(".k-tree-title");
    rect(titles[2]);
    const transfer = dataTransfer();

    fireEvent.dragStart(titles[0], { dataTransfer: transfer });
    const dragOver = createEvent.dragOver(titles[2], { dataTransfer: transfer });
    Object.defineProperty(dragOver, "clientY", { value: 23 });
    fireEvent(titles[2], dragOver);
    fireEvent.drop(titles[2], { clientY: 23, dataTransfer: transfer });

    expect(
      [...container.querySelectorAll(".k-tree-title")].map((item) => item.textContent),
    ).toEqual(["Two", "Three", "One"]);
    expect(onDrop).toHaveBeenCalledWith(
      expect.objectContaining({ dropPosition: "after" }),
      expect.any(Object),
    );
  });

  it("does not advertise a descendant as a valid drop target", () => {
    const data: TreeNode[] = [
      { key: "parent", title: "Parent", children: [{ key: "child", title: "Child" }] },
    ];
    const onDrop = vi.fn();
    const { container } = render(
      <Tree data={data} draggable expandedKeys={["parent"]} onDrop={onDrop} />,
    );
    const parent = container.querySelector<HTMLElement>("[data-tree-key='parent'] .k-tree-title")!;
    const child = container.querySelector<HTMLElement>("[data-tree-key='child'] .k-tree-title")!;
    rect(child);
    const transfer = dataTransfer();

    fireEvent.dragStart(parent, { dataTransfer: transfer });
    // 拖动一开始就被拖节点会收起，后代那一行停在离开动画里、class 不再更新，
    // 所以这里断言的是 `dragover` 有没有被 `preventDefault`（`fireEvent` 返回
    // `!defaultPrevented`）。放行 = false，浏览器就会在这个后代上画出指示线，
    // 而松手时 `moveRawNode` 又静默拒绝。
    expect(fireEvent.dragOver(child, { clientY: 12, dataTransfer: transfer })).toBe(true);
    fireEvent.drop(child, { clientY: 12, dataTransfer: transfer });
    expect(onDrop).not.toHaveBeenCalled();
  });

  it("still accepts a sibling as a valid drop target", () => {
    const data: TreeNode[] = [
      { key: "drag", title: "Drag" },
      { key: "target", title: "Target" },
    ];
    const { container } = render(<Tree data={data} draggable />);
    const titles = container.querySelectorAll<HTMLElement>(".k-tree-title");
    rect(titles[1]);
    const transfer = dataTransfer();

    fireEvent.dragStart(titles[0], { dataTransfer: transfer });

    // 正控：守卫不能顺手把合法的放置目标也拒了。
    expect(fireEvent.dragOver(titles[1], { clientY: 12, dataTransfer: transfer })).toBe(false);
    expect(
      container.querySelector("[data-tree-key='target']")?.classList.contains("k-tree-item-drop"),
    ).toBe(true);
  });

  it("turns an explicit leaf into an expandable parent when dropping inside", () => {
    const data: TreeNode[] = [
      { key: "drag", title: "Drag" },
      { key: "target", title: "Target", isLeaf: true },
    ];
    const { container } = render(<Tree data={data} draggable />);
    const titles = container.querySelectorAll(".k-tree-title");
    rect(titles[1]);
    const transfer = dataTransfer();

    fireEvent.dragStart(titles[0], { dataTransfer: transfer });
    fireEvent.dragOver(titles[1], { dataTransfer: transfer });
    fireEvent.drop(titles[1], { dataTransfer: transfer });

    expect(data[0].key).toBe("target");
    expect(data[0].isLeaf).toBe(false);
    expect(data[0].children?.[0].key).toBe("drag");
    expect(container.querySelector("[data-tree-key='target'] .k-tree-arrow")).not.toBeNull();
    expect(container.querySelector("[data-tree-key='drag']")).not.toBeNull();
  });

  it("does not expand or collapse a directory node when checking it", () => {
    const onExpandedKeysChange = vi.fn();
    const onCheckedKeysChange = vi.fn();
    const data: TreeNode[] = [
      { key: "parent", title: "Parent", children: [{ key: "child", title: "Child" }] },
    ];
    const { container } = render(
      <Tree
        data={data}
        directory
        checkable
        expandedKeys={["parent"]}
        onExpandedKeysChange={onExpandedKeysChange}
        onCheckedKeysChange={onCheckedKeysChange}
      />,
    );
    const checkbox = container.querySelector<HTMLInputElement>(
      "[data-tree-key='parent'] .k-checkbox-input",
    )!;

    fireEvent.click(checkbox);
    fireEvent.keyDown(checkbox, { key: " " });

    expect(onCheckedKeysChange).toHaveBeenCalledTimes(1);
    expect(onExpandedKeysChange).not.toHaveBeenCalled();
    expect(container.querySelector("[data-tree-key='child']")).not.toBeNull();
  });

  it("does not expand a disabled node from either the row or arrow", () => {
    const onExpandedKeysChange = vi.fn();
    const data: TreeNode[] = [
      {
        key: "parent",
        title: "Parent",
        disabled: true,
        children: [{ key: "child", title: "Child" }],
      },
    ];
    const { container } = render(
      <Tree data={data} directory onExpandedKeysChange={onExpandedKeysChange} />,
    );
    const row = container.querySelector<HTMLElement>("[data-tree-key='parent']")!;

    fireEvent.click(row);
    fireEvent.click(row.querySelector(".k-tree-arrow")!);

    expect(onExpandedKeysChange).not.toHaveBeenCalled();
    expect(container.querySelector("[data-tree-key='child']")).toBeNull();
    expect(row.classList.contains("k-tree-item-disabled")).toBe(true);
  });
});
