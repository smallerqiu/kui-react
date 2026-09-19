import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TreeSelect } from "react-kui";

const treeData = [{ key: "fruit", title: "Fruit", children: [{ key: "apple", title: "Apple" }] }];

describe("TreeSelect", () => {
  it("shows Empty instead of leaving a blank popup when search has no match", () => {
    render(<TreeSelect defaultOpen filterable treeData={treeData} emptyText="No match" />);

    fireEvent.change(document.querySelector(".k-tree-select-search")!, {
      target: { value: "missing" },
    });

    expect(screen.getByText("No match")).not.toBeNull();
    expect(document.querySelector(".k-tree")).toBeNull();
  });

  it("opens from the keyboard and closes with Escape", () => {
    const onOpenChange = vi.fn();
    render(<TreeSelect treeData={treeData} onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("combobox");

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("uses the enter transition on its first opening", () => {
    render(<TreeSelect treeData={treeData} />);
    fireEvent.click(screen.getByRole("combobox"));

    expect(document.querySelector(".k-tree-select-enter-active")).not.toBeNull();
  });
});
