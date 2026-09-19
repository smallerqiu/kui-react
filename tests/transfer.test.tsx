import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Transfer } from "react-kui";

const dataSource = [
  { key: 1, title: "Alpha" },
  { key: 2, title: "Beta", description: "Second item" },
  { key: 3, title: "Gamma", disabled: true },
];

describe("Transfer Vue parity", () => {
  it("renders operations between the lists and moves selected items", () => {
    const onChange = vi.fn();
    const { container } = render(<Transfer dataSource={dataSource} onChange={onChange} />);
    const transfer = container.querySelector(".k-transfer")!;

    expect(Array.from(transfer.children).map((child) => child.className)).toEqual([
      "k-transfer-list",
      "k-transfer-operations",
      "k-transfer-list",
    ]);

    fireEvent.click(container.querySelectorAll(".k-transfer-item")[0]);
    fireEvent.click(container.querySelectorAll(".k-transfer-operations button")[0]);
    expect(onChange).toHaveBeenLastCalledWith({
      targetKeys: [1],
      direction: "right",
      movedKeys: [1],
    });
  });

  it("selects visible enabled items from the header checkbox", () => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <Transfer dataSource={dataSource} onSelectChange={onSelectChange} />,
    );

    fireEvent.click(container.querySelectorAll(".k-transfer-header input")[0]);
    expect(onSelectChange).toHaveBeenLastCalledWith([1, 2], []);
  });

  it("supports keyboard selection, description search, and empty states", () => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <Transfer searchable dataSource={dataSource} onSelectChange={onSelectChange} />,
    );
    const firstItem = container.querySelectorAll<HTMLElement>(".k-transfer-item")[0];
    fireEvent.keyDown(firstItem, { key: "Enter" });
    expect(onSelectChange).toHaveBeenLastCalledWith([1], []);

    fireEvent.change(container.querySelectorAll(".k-transfer-search input")[0], {
      target: { value: "Second" },
    });
    expect(container.querySelectorAll(".k-transfer-list")[0].textContent).toContain("Beta");
    expect(container.querySelectorAll(".k-transfer-list")[0].textContent).not.toContain("Alpha");
    expect(container.querySelectorAll(".k-empty")).toHaveLength(1);
  });
});
