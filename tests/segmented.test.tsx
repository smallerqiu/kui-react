import { fireEvent, render } from "@testing-library/react";
import { List, LayoutGrid } from "kui-icons";
import { describe, expect, it, vi } from "vitest";
import { Segmented } from "../components";

const radios = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
];
const tabStops = (container: HTMLElement) =>
  radios(container).map((radio) => radio.getAttribute("tabindex"));

describe("Segmented", () => {
  it("renders icon-only options without value text and still selects by value", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Segmented
        value="list"
        options={[
          { value: "list", icon: List },
          { value: "grid", icon: LayoutGrid },
        ]}
        onChange={onChange}
      />,
    );
    const items = radios(container);
    expect(items.map((item) => item.textContent)).toEqual(["", ""]);
    expect(items.every((item) => item.querySelector(".k-icon"))).toBe(true);
    expect(items.map((item) => item.getAttribute("aria-label"))).toEqual(["list", "grid"]);
    expect(items[0].children).toHaveLength(1);
    fireEvent.click(items[1]);
    expect(onChange).toHaveBeenLastCalledWith("grid");
    fireEvent.keyDown(container.querySelector('[role="radiogroup"]')!, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("list");
  });
  it("preserves explicit labels, numeric zero, value fallbacks and custom labels", () => {
    const { container, rerender } = render(
      <Segmented
        options={[
          { value: "list", icon: List, label: "List" },
          { value: 1, icon: List, label: 0 },
          { value: "plain" },
        ]}
      />,
    );
    expect(radios(container).map((item) => item.textContent)).toEqual(["List", "0", "plain"]);
    rerender(
      <Segmented options={[{ value: "list", icon: List }]} renderLabel={() => <b>Custom</b>} />,
    );
    expect(radios(container)[0].querySelector("b")?.textContent).toBe("Custom");
  });
  it("treats bare strings as value and label", () => {
    const { container } = render(<Segmented options={["daily", "weekly"]} />);
    expect(radios(container).map((radio) => radio.textContent)).toEqual(["daily", "weekly"]);
    // No value is defined yet, so nothing may present itself as checked.
    expect(radios(container).map((radio) => radio.getAttribute("aria-checked"))).toEqual([
      "false",
      "false",
    ]);
    expect(tabStops(container)).toEqual(["0", "-1"]);
  });

  it("keeps the group reachable when the checked option is disabled", () => {
    const { container } = render(
      <Segmented
        value="b"
        options={[
          { label: "Alpha", value: "a" },
          { label: "Beta", value: "b", disabled: true },
        ]}
      />,
    );
    expect(tabStops(container)).toEqual(["0", "-1"]);
  });

  it("falls back to the first enabled option for the tab stop", () => {
    const { container } = render(
      <Segmented
        options={[
          { label: "Alpha", value: "a", disabled: true },
          { label: "Beta", value: "b" },
        ]}
      />,
    );
    expect(tabStops(container)).toEqual(["-1", "0"]);
  });

  it("declares the group orientation", () => {
    const { container, rerender } = render(<Segmented options={["a", "b"]} />);
    expect(container.querySelector('[role="radiogroup"]')?.getAttribute("aria-orientation")).toBe(
      "horizontal",
    );
    rerender(<Segmented options={["a", "b"]} direction="vertical" />);
    expect(container.querySelector('[role="radiogroup"]')?.getAttribute("aria-orientation")).toBe(
      "vertical",
    );
  });

  it("walks bare options with the arrow keys", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Segmented value="a" options={["a", "b", "c"]} onChange={onChange} />,
    );
    fireEvent.keyDown(container.querySelector('[role="radiogroup"]')!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("b");
  });
});
