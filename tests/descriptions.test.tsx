import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Descriptions, DescriptionsItem } from "react-kui";

describe("Descriptions", () => {
  it("wraps oversized rows without producing invalid column spans", () => {
    const { container } = render(
      <Descriptions bordered column={3}>
        <DescriptionsItem label="A" span={2}>
          A
        </DescriptionsItem>
        <DescriptionsItem label="B" span={2}>
          B
        </DescriptionsItem>
        <DescriptionsItem label="C">C</DescriptionsItem>
      </Descriptions>,
    );

    const rows = [...container.querySelectorAll("tbody tr")];
    expect(container.textContent).not.toContain("[object Object]");
    expect(rows).toHaveLength(2);
    rows.forEach((row) => {
      const cells = [...row.querySelectorAll<HTMLTableCellElement>("th,td")];
      expect(cells.reduce((sum, cell) => sum + cell.colSpan, 0)).toBe(6);
    });
  });

  it("does not render an empty header", () => {
    const { container } = render(
      <Descriptions>
        <DescriptionsItem label="A">A</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector(".k-descriptions-header")).toBeNull();
  });
});
