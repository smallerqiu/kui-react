import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConfigProvider, Table, TableColumnSetting, type Column } from "react-kui";
import en from "../components/locale/en";
import zhCN from "../components/locale/zh-CN";

interface TreeRow {
  id: string;
  name: string;
  children?: TreeRow[];
}

const rows: TreeRow[] = [{ id: "p1", name: "Parent row", children: [{ id: "c1", name: "Child" }] }];
const treeColumns: Column<TreeRow>[] = [{ key: "name", title: "Name" }];
const plainColumns: Column[] = [{ key: "name", title: "Name" }];

/** 只改 `k.table` 下的若干条文案，用来证明消费的是 table 自己的 key 而不是别处的默认值 */
const withTableText = (locale: typeof en, texts: Partial<typeof en.k.table>) => ({
  ...locale,
  k: { ...locale.k, table: { ...locale.k.table, ...texts } },
});

describe("Table locale", () => {
  it("localizes the tree toggle and the selection checkboxes", () => {
    const { container, rerender } = render(
      <ConfigProvider locale={zhCN}>
        <Table data={rows} columns={treeColumns} rowKey="id" checkable />
      </ConfigProvider>,
    );
    const labels = () => ({
      toggle: container.querySelector(".k-table-tree-toggle")?.getAttribute("aria-label"),
      row: container.querySelector("tbody input[type=checkbox]")?.getAttribute("aria-label"),
      header: container.querySelector("thead input[type=checkbox]")?.getAttribute("aria-label"),
    });

    // 语言包默认就是 zh-CN，表格里不该再留着写死的英文
    expect(labels()).toEqual({ toggle: "展开行", row: "选择该行", header: "全选" });

    rerender(
      <ConfigProvider locale={en}>
        <Table data={rows} columns={treeColumns} rowKey="id" checkable />
      </ConfigProvider>,
    );
    expect(labels()).toEqual({ toggle: "Expand row", row: "Select row", header: "Select all" });

    // 展开之后切换按钮要说"收起"
    fireEvent.click(container.querySelector(".k-table-tree-toggle") as HTMLElement);
    expect(container.querySelector(".k-table-tree-toggle")?.getAttribute("aria-label")).toBe(
      "Collapse row",
    );
  });

  it("keeps explicit aria-labels off the checkbox wrapper while naming the input", () => {
    const { container } = render(<Table data={rows} columns={treeColumns} rowKey="id" checkable />);
    const input = container.querySelector("tbody input[type=checkbox]") as HTMLInputElement;

    // 可访问名必须挂在控件本身，挂在 label 上辅助技术读不到
    expect(input.getAttribute("aria-label")).toBe("选择该行");
    expect(input.closest("label")?.getAttribute("aria-label")).toBeNull();
  });

  it("reads the empty-state text from k.table.emptyText", () => {
    const locale = withTableText(zhCN, { emptyText: "表格专属空态" });
    const { container, rerender } = render(
      <ConfigProvider locale={locale}>
        <Table data={[]} columns={plainColumns} />
      </ConfigProvider>,
    );

    expect(container.querySelector(".k-empty-description")?.textContent).toBe("表格专属空态");

    // 显式 emptyText 仍然优先于语言包
    rerender(
      <ConfigProvider locale={locale}>
        <Table data={[]} columns={plainColumns} emptyText="props 优先" />
      </ConfigProvider>,
    );
    expect(container.querySelector(".k-empty-description")?.textContent).toBe("props 优先");
  });

  it("localizes the column setting title and reset button", () => {
    const locale = withTableText(en, { columnSettings: "PICK COLUMNS", resetColumns: "RESET_ALL" });
    const { container, getByText } = render(
      <ConfigProvider locale={locale}>
        <TableColumnSetting columns={plainColumns} />
      </ConfigProvider>,
    );

    expect(getByText("PICK COLUMNS")).toBeTruthy();

    fireEvent.click(
      container.querySelector(".k-table-column-setting-trigger, button") as HTMLElement,
    );
    expect(getByText("RESET_ALL")).toBeTruthy();
  });

  it("still honours explicit column setting texts over the locale", () => {
    const { getByText } = render(
      <ConfigProvider locale={en}>
        <TableColumnSetting columns={plainColumns} title="Own title" resetText="Own reset" />
      </ConfigProvider>,
    );

    expect(getByText("Own title")).toBeTruthy();
  });
});
