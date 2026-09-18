import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table, type Column } from "react-kui";

interface Row {
  key: number;
  name: string;
  age: number;
}

const data: Row[] = [
  { key: 1, name: "Alice", age: 28 },
  { key: 2, name: "Bob", age: 32 },
  { key: 3, name: "Carol", age: 36 },
];

describe("Table Vue parity", () => {
  it("keeps grouped headers consistent when a child column is hidden", () => {
    const columns: Column<Row>[] = [
      {
        key: "profile",
        title: "Profile",
        children: [
          { key: "name", title: "Name" },
          { key: "age", title: "Age" },
        ],
      },
    ];
    const { container } = render(
      <Table data={data} columns={columns} hiddenColumnKeys={["age"]} />,
    );

    expect(container.querySelectorAll("thead tr")).toHaveLength(2);
    expect(container.querySelector("thead")?.textContent).toContain("Profile");
    expect(container.querySelector("thead")?.textContent).toContain("Name");
    expect(container.querySelector("thead")?.textContent).not.toContain("Age");
    expect(container.querySelector("thead th")?.getAttribute("colspan")).toBe("1");
  });

  it("marks virtual rows so striped backgrounds stay aligned", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name" },
      { key: "age", title: "Age", fixed: "right" },
    ];
    const { container } = render(
      <Table virtual striped data={data} columns={columns} scroll={{ y: 200 }} />,
    );

    expect(container.querySelector(".k-table")?.classList.contains("k-table-virtual")).toBe(true);
    expect(container.querySelectorAll("tbody .k-table-row-even")).toHaveLength(1);
  });

  it("does not render cells whose rowSpan or colSpan is zero", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", colSpan: (_, index) => (index === 0 ? 0 : 1) },
      { key: "age", title: "Age" },
    ];
    const { container } = render(<Table data={data} columns={columns} />);
    const firstRow = container.querySelector("tbody tr");

    expect(firstRow?.textContent).not.toContain("Alice");
    expect(firstRow?.textContent).toContain("28");
  });

  it("keeps default fixed column widths aligned with sticky offsets", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", fixed: "left" },
      { key: "age", title: "Age", fixed: "left" },
      { key: "action", title: "Operate", fixed: "right", render: () => "Edit" },
      { key: "action2", title: "More", fixed: "right", render: () => "More" },
    ];
    const { container } = render(<Table data={data} columns={columns} scroll={{ y: 200 }} />);
    const cols = container.querySelectorAll<HTMLTableColElement>(".k-table-body col");
    const headers = container.querySelectorAll<HTMLTableCellElement>(".k-table-thead th");

    expect(cols[0].style.width).toBe("150px");
    expect(cols[1].style.width).toBe("150px");
    expect(headers[0].style.left).toBe("0px");
    expect(headers[1].style.left).toBe("150px");
    expect(container.querySelectorAll(".k-table-thead .k-table-cell-fix-right-first")).toHaveLength(
      1,
    );
  });

  it("does not show the empty state while loading", () => {
    const columns: Column<Row>[] = [{ key: "name", title: "Name" }];
    const { container, rerender } = render(<Table data={[]} columns={columns} loading />);

    expect(container.querySelector(".k-empty")).toBeNull();
    expect(container.querySelector(".k-table-loading-placeholder")).not.toBeNull();

    rerender(<Table data={[]} columns={columns} loading={false} />);
    expect(container.querySelector(".k-empty")).not.toBeNull();
    expect(container.querySelector(".k-table-loading-placeholder")).toBeNull();
  });
});
