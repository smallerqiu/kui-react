import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListPanel } from "react-kui";

describe("ListPanel Vue parity", () => {
  it("does not render empty toolbar regions", () => {
    const { container, rerender } = render(<ListPanel summary="12 records">Results</ListPanel>);

    expect(container.querySelector(".k-list-panel-toolbar")).not.toBeNull();
    expect(container.querySelector(".k-list-panel-filters")).toBeNull();
    expect(container.querySelector(".k-list-panel-summary")?.textContent).toBe("12 records");

    rerender(<ListPanel summary={null}>Results</ListPanel>);
    expect(container.querySelector(".k-list-panel-toolbar")).toBeNull();
  });

  it("renders valid falsy React nodes", () => {
    const { container } = render(
      <ListPanel summary={0} footer={0}>
        Results
      </ListPanel>,
    );

    expect(container.querySelector(".k-list-panel-summary")?.textContent).toBe("0");
    expect(container.querySelector(".k-list-panel-footer")?.textContent).toBe("0");
  });

  it("replaces regular controls with the selection toolbar", () => {
    const { container } = render(
      <ListPanel
        summary="12 records"
        filters="Filters"
        actions="Actions"
        selectedCount={2}
        selection={(count) => `${count} selected`}
      />,
    );

    expect(container.querySelector(".k-list-panel-selection")?.textContent).toBe("2 selected");
    expect(container.querySelector(".k-list-panel-filters")).toBeNull();
    expect(container.querySelector(".k-list-panel-toolbar-extra")).toBeNull();
  });
});
