import { act, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Col, Grid, GridItem, Row, Tree, type TreeExpose } from "react-kui";

describe("kui-vue 6.0 layout parity", () => {
  it("uses native row gaps without negative margins or column padding", () => {
    const { container } = render(
      <Row gutter={[16, 8]} justify="center" align="middle">
        <Col span={12}>Content</Col>
      </Row>,
    );
    const row = container.querySelector<HTMLElement>(".k-row")!;
    const col = container.querySelector<HTMLElement>(".k-col")!;
    expect(row.classList.contains("k-row-center")).toBe(true);
    expect(row.classList.contains("k-row-middle")).toBe(true);
    expect(row.style.columnGap).toBe("16px");
    expect(row.style.rowGap).toBe("8px");
    expect(row.style.margin).toBe("");
    expect(col.style.padding).toBe("");
  });

  it("supports explicit grid row and column starts", () => {
    const { container } = render(
      <Grid cols={4} itemMinWidth="12rem">
        <GridItem span={2} rowSpan={3} columnStart={2} rowStart={4}>Item</GridItem>
      </Grid>,
    );
    const grid = container.querySelector<HTMLElement>(".k-grid")!;
    const item = container.querySelector<HTMLElement>(".k-grid-item")!;
    expect(grid.style.gridTemplateColumns).toContain("min(100%, 12rem)");
    expect(item.style.gridColumn).toBe("2 / span 2");
    expect(item.style.gridRow).toBe("4 / span 3");
  });
});

describe("kui-vue 6.0 Tree parity", () => {
  it("supports field mapping, accessibility, and instance methods", async () => {
    const ref = createRef<TreeExpose>();
    render(
      <Tree
        ref={ref}
        fieldNames={{ key: "id", title: "name", children: "items" }}
        data={[{ id: "root", name: "Root", items: [{ id: "child", name: "Child" }] }]}
      />,
    );
    expect(screen.getByRole("tree")).not.toBeNull();
    expect(screen.getByText("Root")).not.toBeNull();
    expect(ref.current?.getNode("child")?.title).toBe("Child");
    act(() => ref.current?.expandAll());
    expect(screen.getByText("Child")).not.toBeNull();
    act(() => ref.current?.collapseAll());
    await waitFor(() => expect(screen.queryByText("Child")).toBeNull());
  });
});
