import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "../components";

const options = [
  { label: "Zero", value: 0 },
  { label: "One", value: 1 },
];

describe("Select placeholder", () => {
  it.each([undefined, "", "   "])("shows the placeholder for an empty single value %j", (value) => {
    const { container } = render(
      <Select filterable clearable value={value} options={options} placeholder="Choose" />,
    );
    expect(container.querySelector(".k-select-placeholder")?.textContent).toBe("Choose");
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "One" } });
    expect(container.querySelector(".k-select-placeholder")).toBeNull();
    fireEvent.change(input, { target: { value: "" } });
    expect(container.querySelector(".k-select-placeholder")?.textContent).toBe("Choose");
  });

  it("preserves numeric zero and restores the placeholder after an external reset", () => {
    const { container, rerender } = render(
      <Select filterable value={0} options={options} placeholder="Choose" />,
    );
    expect(container.querySelector(".k-select-label")?.textContent).toBe("Zero");
    expect(container.querySelector(".k-select-placeholder")).toBeNull();
    rerender(<Select filterable value="" options={options} placeholder="Choose" />);
    expect(container.querySelector(".k-select-placeholder")?.textContent).toBe("Choose");
  });
});
