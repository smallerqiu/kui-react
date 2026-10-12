import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tree, type TreeExpose, type TreeNode } from "react-kui";
import { createRef } from "react";

const arrowsOf = (container: HTMLElement) => Array.from(container.querySelectorAll(".k-tree-arrow"));

describe("Tree async loading", () => {
  it("loads a node once and turns an empty result into a leaf", async () => {
    const loadData = vi.fn(async () => undefined);
    const { container } = render(
      <Tree data={[{ key: "root", title: "Root" }]} loadData={loadData} />,
    );

    fireEvent.click(arrowsOf(container)[0]);
    await waitFor(() => expect(loadData).toHaveBeenCalledTimes(1));

    // 加载回来没有子节点：箭头必须消失，否则这个节点会永远挂着一个空展开，
    // 而且每次点开都再发一次请求。
    await waitFor(() => expect(container.querySelector(".k-tree-arrow")).toBeNull());
    expect(container.querySelector(".k-tree-arrow-placeholder")).not.toBeNull();
    expect(loadData).toHaveBeenCalledTimes(1);
  });

  it("re-expanding a loaded node does not request it again", async () => {
    const data: TreeNode[] = [{ key: "root", title: "Root" }];
    const loadData = vi.fn(async () => {
      // 约定就是 `loadData` 原地往 `data` 上挂子节点，靠 version 失效快照。
      (data[0]!.children as TreeNode[]) = [{ key: "child", title: "Child" }];
    });
    const { container } = render(<Tree data={data} loadData={loadData} />);

    fireEvent.click(arrowsOf(container)[0]);
    await waitFor(() => expect(loadData).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByText("Child")).not.toBeNull());

    fireEvent.click(arrowsOf(container)[0]);
    await waitFor(() => expect(screen.queryByText("Child")).toBeNull());
    fireEvent.click(arrowsOf(container)[0]);
    await waitFor(() => expect(screen.queryByText("Child")).not.toBeNull());
    expect(loadData).toHaveBeenCalledTimes(1);
  });

  it("keeps a forced parent expandable after an empty load", async () => {
    // 文档口径：`isLeaf=false` 强制作为父节点，一次空结果不能把它改成叶子。
    // 重复请求由 `loadedKeys` 拦住，不靠抹掉箭头。
    const loadData = vi.fn(async () => undefined);
    const { container } = render(
      <Tree data={[{ key: "root", title: "Root", isLeaf: false }]} loadData={loadData} />,
    );

    fireEvent.click(arrowsOf(container)[0]);
    await waitFor(() => expect(loadData).toHaveBeenCalledTimes(1));
    expect(container.querySelector(".k-tree-arrow-open")).not.toBeNull();

    fireEvent.click(arrowsOf(container)[0]);
    await waitFor(() => expect(container.querySelector(".k-tree-arrow-open")).toBeNull());
    fireEvent.click(arrowsOf(container)[0]);
    await waitFor(() => expect(container.querySelector(".k-tree-arrow-open")).not.toBeNull());
    expect(loadData).toHaveBeenCalledTimes(1);
  });

  it("keeps concurrent expansions from swallowing each other", async () => {
    const onExpandedKeysChange = vi.fn();
    const data: TreeNode[] = [
      { key: "slow", title: "Slow" },
      { key: "fast", title: "Fast" },
    ];
    // `slow` 后回来，用的却是两次点击那一刻的展开快照——不修正就会把 `fast` 的展开吞掉。
    const loadData = (node: TreeNode) =>
      new Promise<void>((resolve) => setTimeout(resolve, node.key === "slow" ? 20 : 5));
    const { container } = render(
      <Tree data={data} loadData={loadData} onExpandedKeysChange={onExpandedKeysChange} />,
    );
    const arrows = arrowsOf(container);

    fireEvent.click(arrows[0]);
    fireEvent.click(arrows[1]);

    await waitFor(() =>
      expect(onExpandedKeysChange).toHaveBeenCalledWith(expect.arrayContaining(["slow", "fast"])),
    );
  });
});

describe("Tree node identity", () => {
  it("synthesizes distinct stable keys for keyless nodes", async () => {
    const onExpandedKeysChange = vi.fn();
    const data = [
      { title: "One" },
      { title: "Two", children: [{ title: "Two-a" }, { title: "Two-b" }] },
    ] as TreeNode[];
    const ref = createRef<TreeExpose>();
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { container } = render(
      <Tree ref={ref} data={data} onExpandedKeysChange={onExpandedKeysChange} />,
    );

    const keys = Array.from(container.querySelectorAll("[data-tree-key]")).map(
      (element) => element.getAttribute("data-tree-key") ?? "",
    );
    expect(new Set(keys).size).toBe(keys.length);
    expect(error).not.toHaveBeenCalled();

    // 只有 “Two” 有子节点，所以整棵树只有一个箭头；点它只应展开 “Two” 一个键。
    expect(arrowsOf(container)).toHaveLength(1);
    fireEvent.click(arrowsOf(container)[0]);
    await waitFor(() => expect(onExpandedKeysChange).toHaveBeenCalled());
    expect(onExpandedKeysChange.mock.calls.at(-1)?.[0]).toHaveLength(1);
    const expandedKey = onExpandedKeysChange.mock.calls.at(-1)![0]![0]!;
    expect(ref.current?.getNode(expandedKey)?.title).toBe("Two");
    expect(screen.getAllByRole("treeitem")).toHaveLength(4);
  });
});

describe("Tree keyboard model", () => {
  it("keeps the twisty button out of the tab order", () => {
    const { container } = render(
      <Tree
        data={[{ key: "root", title: "Root", children: [{ key: "one", title: "One" }] }]}
        expandedKeys={["root"]}
        checkable
      />,
    );
    const twisty = container.querySelector<HTMLButtonElement>(".k-tree-arrow button")!;

    // roving tabindex：整棵树只留一个可 Tab 命中的 treeitem，箭头是纯点击控件。
    expect(twisty.tabIndex).toBe(-1);
    expect(container.querySelectorAll('[role="treeitem"][tabindex="0"]')).toHaveLength(1);
  });

  it("gives the virtual list the row-height class", () => {
    const { container } = render(
      <Tree
        virtual
        height={100}
        data={[{ key: "root", title: "Root", children: [{ key: "one", title: "One" }] }]}
        expandedKeys={["root"]}
      />,
    );
    // 少了 `k-tree-virtual-list`，`.k-tree-item` 保留 4px 下边距、内容只有 24px，
    // hover/选中背景条带不满 `itemHeight`，和 vue 版对不上。
    expect(container.querySelector(".k-tree-node-list.k-tree-virtual-list")).not.toBeNull();
  });
});

describe("Tree DOM shape", () => {
  it("renders items directly inside the node list without an extra wrapper", () => {
    const { container } = render(<Tree data={[{ key: "root", title: "Root" }]} />);
    const list = container.querySelector<HTMLElement>(".k-tree-node-list")!;

    // vue 版曾经多落一层匿名 div（`TransitionGroup tag="div"`），两边 DOM 对不上；
    // react 这边 `component={null}` 不该有 wrapper，条目直接挂在节点列表下。
    expect(list.firstElementChild?.classList.contains("k-tree-item")).toBe(true);
    expect(list.querySelectorAll(":scope > div:not(.k-tree-item)")).toHaveLength(0);
  });
});
