import { fireEvent, render } from "@testing-library/react";
import { expect, it } from "vitest";
import { Slider, Select, DatePicker } from "react-kui";

it("keeps the current Slider value when constraints change and clamps it when needed", () => {
  const { getByRole, rerender } = render(<Slider value={20} />);
  fireEvent.keyDown(getByRole("slider"), { key: "ArrowRight" });
  rerender(<Slider value={20} max={200} />);
  expect(getByRole("slider").getAttribute("aria-valuenow")).toBe("21");
  rerender(<Slider value={20} max={10} />);
  expect(getByRole("slider").getAttribute("aria-valuenow")).toBe("10");
  rerender(<Slider value={5} max={10} />);
  expect(getByRole("slider").getAttribute("aria-valuenow")).toBe("5");
});

it("updates Select tags for immutable array additions, removals, and replacements", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ];
  const { container, rerender } = render(<Select multiple value={["a"]} options={options} />);
  rerender(<Select multiple value={["a", "b"]} options={options} />);
  expect(container.textContent).toContain("Beta");
  rerender(<Select multiple value={["b"]} options={options} />);
  expect(container.textContent).not.toContain("Alpha");
  rerender(<Select multiple value={["a"]} options={options} />);
  expect(container.textContent).toContain("Alpha");
  expect(container.textContent).not.toContain("Beta");
});

it("restores the last committed DatePicker range after cancelling a partial edit", () => {
  const { container } = render(
    <DatePicker value={["2026-08-01", "2026-08-05"]} mode="dateRange" />,
  );
  const inputs = container.querySelectorAll("input");
  const values = () => Array.from(inputs, (input) => input.value);
  fireEvent.change(inputs[1], { target: { value: "2026-08-15" } });
  fireEvent.blur(inputs[1]);
  fireEvent.change(inputs[0], { target: { value: "2026-08-10" } });
  fireEvent.blur(inputs[0]);
  expect(values()).toEqual(["2026-08-10", "2026-08-15"]);
  fireEvent.click(container.querySelector(".k-datepicker-selection")!);
  fireEvent.click(document.body.querySelector(".k-picker-day:not(.k-picker-day-disabled)")!);
  fireEvent.mouseDown(document.body);
  fireEvent.click(document.body);
  expect(values()).toEqual(["2026-08-10", "2026-08-15"]);
});
