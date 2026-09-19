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
    const { container } = render(<Tree data={data} draggable defaultExpandedKeys={["parent"]} />);
    const parent = container.querySelector<HTMLElement>("[data-tree-key='parent'] .k-tree-title")!;
    const child = container.querySelector<HTMLElement>("[data-tree-key='child'] .k-tree-title")!;
    rect(child);
    const transfer = dataTransfer();

    fireEvent.dragStart(parent, { dataTransfer: transfer });
    fireEvent.dragOver(child, { clientY: 12, dataTransfer: transfer });

    expect(
      container.querySelector("[data-tree-key='child']")?.classList.contains("k-tree-item-drop"),
    ).toBe(false);
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
        defaultExpandedKeys={["parent"]}
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
});
