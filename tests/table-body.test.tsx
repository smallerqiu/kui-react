import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Table, type Column, type TableKey } from "react-kui";

interface Row {
  key: number;
  name: string;
  age: number;
  score?: number;
  meta?: object;
  when?: Date;
  list?: number[];
}

// 表体容器是整张表的唯一滚动口：横向能不能滚、固定区阴影画在哪一格、行 key 是否可用，
// 都在这一层汇合。这里的用例与 kui-vue `tests/table-body.test.ts` 一一对应。
describe("Table body", () => {
  it("keeps the horizontal scroller available when there are no rows", () => {
    const { container } = render(
      <Table
        data={[]}
        columns={
          [
            { key: "name", title: "Name", width: 400, fixed: "left" },
            { key: "age", title: "Age", width: 400, fixed: "right" },
          ] as Column<Row>[]
        }
        scroll={{ x: 800 }}
      />,
    );
    const body = container.querySelector(".k-table-body") as HTMLElement;

    // 空表也可能被固定列和列宽下限撑得比容器宽；隐藏溢出会让右侧列永远看不到
    expect(body.style.overflowX).toBe("auto");
  });

  it("ends a fixed-left run at the merged cell's interval end", () => {
    const { container } = render(
      <Table
        data={[{ key: 1, name: "Merged", age: 20, score: 90 }]}
        columns={
          [
            // 合并格盖住两列固定区；区间末尾之后的 `score` 不固定，所以这一格才是固定区末格
            { key: "name", title: "Name", width: 100, fixed: "left", colSpan: 2 },
            { key: "age", title: "Age", width: 100, fixed: "left" },
            { key: "score", title: "Score", width: 100 },
          ] as Column<Row>[]
        }
      />,
    );
    const first = container.querySelector("tbody tr td") as HTMLTableCellElement;

    expect(first.getAttribute("colspan")).toBe("2");
    expect(first.classList.contains("k-table-cell-fix-left")).toBe(true);
    expect(first.classList.contains("k-table-cell-fix-left-last")).toBe(true);
  });

  it("does not end the fixed-left run at the selection cell while the first column is fixed", async () => {
    const { container } = render(
      <Table
        data={[
          { key: 1, name: "Alice", age: 28 },
          { key: 2, name: "Bob", age: 32 },
        ]}
        columns={
          [
            { key: "name", title: "Name", width: 120, fixed: "left" },
            { key: "age", title: "Age", width: 120 },
          ] as Column<Row>[]
        }
        checkable
      />,
    );
    const body = container.querySelector(".k-table-body") as HTMLDivElement;
    for (const [property, value] of Object.entries({
      scrollLeft: 120,
      scrollWidth: 600,
      clientWidth: 200,
    })) {
      Object.defineProperty(body, property, { configurable: true, value });
    }
    fireEvent.scroll(body);
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    const root = container.querySelector(".k-table") as HTMLElement;
    expect(root.classList.contains("k-table-ping-left")).toBe(true);
    const headSelection = container.querySelector("thead th") as HTMLElement;
    const bodySelection = container.querySelector("tbody td") as HTMLElement;
    const firstDataCell = container.querySelector("tbody td:nth-child(2)") as HTMLElement;
    // 勾选列右边还有固定列，冻结区中间不能多画一道阴影
    expect(headSelection.classList.contains("k-table-cell-fix-left")).toBe(true);
    expect(headSelection.classList.contains("k-table-cell-fix-left-last")).toBe(false);
    expect(bodySelection.classList.contains("k-table-cell-fix-left-last")).toBe(false);
    // 真正的固定区末格是紧挨着的第一个数据列
    expect(firstDataCell.classList.contains("k-table-cell-fix-left-last")).toBe(true);
  });

  it("falls back to distinct keys when a rowKey function returns nothing usable", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const selected: TableKey[][] = [];
    const { container } = render(
      <Table
        data={[{ name: "Alice" }, { name: "Bob" }] as unknown as Row[]}
        columns={[{ key: "name", title: "Name" }] as Column<Row>[]}
        checkable
        // 运行时由 JS 调用方传入的取值函数不保证返回值符合类型
        rowKey={(() => undefined) as unknown as (record: Row) => TableKey}
        onSelectedKeysChange={(keys) => selected.push(keys)}
      />,
    );
    const boxes = () =>
      Array.from(container.querySelectorAll<HTMLInputElement>("tbody input[type=checkbox]"));
    fireEvent.click(boxes()[0]);

    // 取值函数路径也要走兜底：否则两行共用一个 `undefined`，勾一行等于勾全部
    expect(boxes().map((box) => box.checked)).toEqual([true, false]);
    expect(selected.at(-1)).toHaveLength(1);
    expect(/^kui-row-/.test(String(selected.at(-1)?.[0]))).toBe(true);
    warn.mockRestore();
  });

  it("renders raw object, Date and array values as text instead of throwing", () => {
    const when = new Date(2020, 0, 2, 3, 4, 5);
    const { container } = render(
      <Table
        data={[{ key: 1, name: "", age: 0, meta: { id: 7 }, when, list: [1, 2] }]}
        columns={
          [
            { key: "meta", title: "Meta" },
            { key: "when", title: "When" },
            { key: "list", title: "List" },
          ] as Column<Row>[]
        }
      />,
    );

    // 对象与 Date 交给 React 会直接抛 "Objects are not valid as a React child"，
    // 渲染兜底按 vue 的规则转成文本：对象 / Date 调 `String()`，数组逐项展开后拼起来
    expect(
      Array.from(container.querySelectorAll("tbody td")).map((cell) => cell.textContent),
    ).toEqual(["[object Object]", String(when), "12"]);
  });
});