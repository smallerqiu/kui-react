import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table, type Column } from "react-kui";
import { resolveCellEllipsis } from "../components/table/utils";

/**
 * 单元格省略号：列上 `ellipsis` 与表格级 `ellipsis` 两档，`rows` 多行截断，悬停提示只在格子
 * **真的被截断**时才弹（判定发生在 hover 那一刻，所以这里要桩 `scrollWidth` / `scrollHeight`）。
 * kui-vue 有一份语义相同的镜像用例（`tests/table-ellipsis.test.ts`），改期望请两仓一起改；
 * `components/table/utils.ts` 里的 `resolveCellEllipsis` 是逐字节相同的共享块。
 */
interface Row {
  key: string;
  title: string;
  owner: string;
  note?: string;
  children?: Row[];
}

const data: Row[] = [
  { key: "a", title: "Ship the ellipsis spec", owner: "Ann" },
  { key: "b", title: "Mirror it into kui-vue", owner: "Bob" },
];

const bodyCells = (row: number): HTMLElement[] => [
  ...document.querySelectorAll("tbody tr")[row].querySelectorAll("td"),
];

const ellipsisIn = (row: number, col: number): HTMLElement | null =>
  bodyCells(row)[col].querySelector(".k-table-cell-ellipsis");

/** jsdom 里 `scrollWidth` / `clientWidth` 恒为 0，量不出溢出；想让某一格被判定成"截断了"就按维度桩一个差值。 */
const markClipped = (element: HTMLElement, dimension: "width" | "height" = "width") => {
  const scroll = dimension === "width" ? "scrollWidth" : "scrollHeight";
  const client = dimension === "width" ? "clientWidth" : "clientHeight";
  Object.defineProperty(element, scroll, { configurable: true, value: 320 });
  Object.defineProperty(element, client, { configurable: true, value: 100 });
};

const tipText = () => document.querySelector(".k-tooltip-title")?.textContent;

/** 行数写在行内样式上；直接读样式串，不依赖 jsdom 是否认识 `-webkit-line-clamp` 这个属性。 */
const lineClampOf = (element: HTMLElement): string | null =>
  element
    .getAttribute("style")
    ?.match(/line-clamp:\s*([^;]+)/)?.[1]
    ?.trim() ?? null;

const columns: Column<Row>[] = [
  { title: "Title", key: "title" },
  { title: "Owner", key: "owner" },
];

describe("Table cell ellipsis", () => {
  it("only truncates the columns that ask for it", () => {
    render(
      <Table
        data={data}
        rowKey="key"
        columns={[
          { title: "Title", key: "title", ellipsis: true },
          { title: "Owner", key: "owner" },
        ]}
      />,
    );

    expect(document.querySelectorAll(".k-table-cell-ellipsis")).toHaveLength(2);
    expect(ellipsisIn(0, 0)?.textContent).toBe("Ship the ellipsis spec");
    // 没开省略号的列一格包裹都不加
    expect(ellipsisIn(0, 1)).toBeNull();
    expect(bodyCells(0)[1].textContent).toBe("Ann");
  });

  it("lets the table cover every column and opts a single one back out", () => {
    const { rerender } = render(<Table data={data} rowKey="key" columns={columns} ellipsis />);
    expect(document.querySelectorAll(".k-table-cell-ellipsis")).toHaveLength(4);

    rerender(
      <Table
        data={data}
        rowKey="key"
        ellipsis
        columns={[
          { title: "Title", key: "title" },
          { title: "Owner", key: "owner", ellipsis: false },
        ]}
      />,
    );
    expect(document.querySelectorAll(".k-table-cell-ellipsis")).toHaveLength(2);
    expect(ellipsisIn(0, 1)).toBeNull();
    // 关掉的那一列内容仍然照常显示，只是不再截断
    expect(bodyCells(0)[1].textContent).toBe("Ann");
  });

  it("truncates rendered content as well as plain values", () => {
    render(
      <Table
        data={data}
        rowKey="key"
        ellipsis
        columns={[{ title: "Title", key: "title", render: (value) => <b>{String(value)}</b> }]}
      />,
    );

    const cell = ellipsisIn(0, 0);
    expect(cell?.textContent).toBe("Ship the ellipsis spec");
    expect(cell?.querySelector("b")?.textContent).toBe("Ship the ellipsis spec");
  });

  it("clamps to several lines with rows", () => {
    render(
      <Table
        data={data}
        rowKey="key"
        columns={[
          { title: "Title", key: "title", ellipsis: true },
          { title: "Note", key: "note", ellipsis: 2 },
          { title: "Owner", key: "owner", ellipsis: { rows: 3 } },
        ]}
      />,
    );

    // 单行只有 `k-table-cell-ellipsis`，靠 `text-overflow` 收成一行，不写行内样式
    const single = ellipsisIn(0, 0) as HTMLElement;
    expect(single.classList.contains("k-table-cell-ellipsis-rows")).toBe(false);
    expect(single.getAttribute("style")).toBeNull();

    // 数字就是行数
    const two = ellipsisIn(0, 1) as HTMLElement;
    expect(two.classList.contains("k-table-cell-ellipsis-rows")).toBe(true);
    expect(lineClampOf(two)).toBe("2");

    const three = ellipsisIn(0, 2) as HTMLElement;
    expect(three.classList.contains("k-table-cell-ellipsis-rows")).toBe(true);
    expect(lineClampOf(three)).toBe("3");
  });

  it("keeps the tree cell's own class when it truncates", () => {
    render(
      <Table
        data={[{ key: "a", title: "Parent", children: [{ key: "a1", title: "Child" }] }]}
        rowKey="key"
        expandAllRows
        ellipsis
        columns={[{ title: "Title", key: "title" }]}
      />,
    );

    const cell = ellipsisIn(1, 0);
    expect(cell?.classList.contains("k-table-tree-content")).toBe(true);
    expect(cell?.classList.contains("k-table-cell-ellipsis")).toBe(true);
  });

  it("shows the tip only for a cell that is really clipped", async () => {
    render(<Table data={data} rowKey="key" columns={columns} ellipsis />);

    const clipped = ellipsisIn(0, 0) as HTMLElement;
    const roomy = ellipsisIn(0, 1) as HTMLElement;
    markClipped(clipped);

    fireEvent.mouseEnter(roomy);
    expect(document.querySelector(".k-tooltip")).toBeNull();

    fireEvent.mouseEnter(clipped);
    await waitFor(() => expect(tipText()).toBe("Ship the ellipsis spec"));

    fireEvent.mouseLeave(clipped);
    await waitFor(() => expect(document.querySelector(".k-tooltip")).toBeNull());
  });

  it("measures height instead of width once rows is above one", async () => {
    render(
      <Table
        data={data}
        rowKey="key"
        columns={[{ title: "Title", key: "title", ellipsis: { rows: 2 } }]}
      />,
    );

    const cell = ellipsisIn(0, 0) as HTMLElement;
    // 只桩宽度：多行模式看的是纵向溢出，所以这里不该弹提示
    markClipped(cell, "width");
    fireEvent.mouseEnter(cell);
    await waitFor(() => expect(document.querySelector(".k-tooltip")).toBeNull());

    markClipped(cell, "height");
    fireEvent.mouseEnter(cell);
    await waitFor(() => expect(tipText()).toBe("Ship the ellipsis spec"));
  });

  it("replaces or drops the tip on request", async () => {
    render(
      <Table
        data={data}
        rowKey="key"
        columns={[
          {
            title: "Title",
            key: "title",
            ellipsis: { tooltip: "Open the ticket for the full text" },
          },
          { key: "owner", title: "Owner", ellipsis: { tooltip: false } },
        ]}
      />,
    );

    const custom = ellipsisIn(0, 0) as HTMLElement;
    markClipped(custom);
    // 气泡的宿主就是这一格 span 自己：`Tooltip` 只往它身上挂事件与 `aria-expanded`，不多套一层元素
    expect(custom.getAttribute("aria-expanded")).toBe("false");
    fireEvent.mouseEnter(custom);
    await waitFor(() => expect(tipText()).toBe("Open the ticket for the full text"));

    fireEvent.mouseLeave(custom);
    await waitFor(() => expect(document.querySelector(".k-tooltip")).toBeNull());

    const off = ellipsisIn(0, 1) as HTMLElement;
    markClipped(off);
    fireEvent.mouseEnter(off);
    expect(document.querySelector(".k-tooltip")).toBeNull();
    // `tooltip: false` 连气泡的宿主都不挂，只留一个截断用的 span
    expect(off.hasAttribute("aria-expanded")).toBe(false);
  });
});

describe("resolveCellEllipsis", () => {
  it("falls back to the table switch and lets the column win", () => {
    expect(resolveCellEllipsis(undefined, undefined)).toBeNull();
    expect(resolveCellEllipsis(undefined, true)).toEqual({ rows: 1, tooltip: undefined });
    expect(resolveCellEllipsis(false, true)).toBeNull();
    expect(resolveCellEllipsis(true, false)).toEqual({ rows: 1, tooltip: undefined });
  });

  it("accepts a number as the row count and floors it to at least one line", () => {
    expect(resolveCellEllipsis(3, undefined)).toEqual({ rows: 3, tooltip: undefined });
    expect(resolveCellEllipsis({ rows: 2, tooltip: "tip" }, undefined)).toEqual({
      rows: 2,
      tooltip: "tip",
    });
    expect(resolveCellEllipsis(0, undefined)?.rows).toBe(1);
    expect(resolveCellEllipsis(1.8, undefined)?.rows).toBe(1);
    expect(resolveCellEllipsis({ rows: 2.7 }, undefined)?.rows).toBe(2);
  });
});
