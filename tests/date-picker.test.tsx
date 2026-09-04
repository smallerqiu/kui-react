import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "react-kui";

describe("DatePicker", () => {
  it("renders a seven-column calendar without legacy class names", () => {
    const { container } = render(<DatePicker panelOnly value="2026-08-21" />);

    expect(container.querySelectorAll(".k-picker-weekday")).toHaveLength(7);
    expect(container.querySelectorAll(".k-picker-date-grid > .k-picker-day")).toHaveLength(42);
    expect(container.querySelector(".v-dp-table")).toBeNull();
    expect(container.querySelector("[role=grid]")).not.toBeNull();
  });

  it("renders timestamp zero instead of treating it as empty", () => {
    const { container } = render(
      <DatePicker value={0} valueType="timestamp" format="YYYY-MM-DD" />,
    );
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("1970-01-01");
  });

  it("opens with Enter and closes with Escape", () => {
    const { container } = render(<DatePicker />);
    const root = container.querySelector<HTMLElement>(".k-datepicker")!;
    vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
      x: 80,
      y: 100,
      top: 100,
      right: 230,
      bottom: 132,
      left: 80,
      width: 150,
      height: 32,
      toJSON: () => ({}),
    });

    fireEvent.keyDown(root, { key: "Enter" });
    expect(root.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.querySelector(".k-date-picker-enter-active")).not.toBeNull();
    expect(
      (document.body.querySelector(".k-datepicker-overlay") as HTMLElement).style.top,
    ).not.toBe("0px");
    fireEvent.keyDown(root, { key: "Escape" });
    expect(root.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps controlled values authoritative and syncs rerenders", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<DatePicker value="2026-08-01" onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2026-08-21" } });

    expect(onChange).toHaveBeenCalledWith("2026-08-21", "2026-08-21");
    expect(input.value).toBe("2026-08-01");

    rerender(<DatePicker value="2026-08-21" onChange={onChange} />);
    expect(input.value).toBe("2026-08-21");
  });

  it("respects disabled state in panel-only mode", () => {
    const onChange = vi.fn();
    const { container } = render(
      <DatePicker panelOnly disabled value="2026-08-21" onChange={onChange} />,
    );
    fireEvent.click(container.querySelector(".k-picker-day:not(.k-picker-day-out)")!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("converts values according to valueType", () => {
    const onChange = vi.fn();
    const { container } = render(
      <DatePicker defaultValue="2026-08-01" valueType="timestamp" onChange={onChange} />,
    );
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2026-08-21" } });

    expect(typeof onChange.mock.calls[0][0]).toBe("number");
    expect(onChange.mock.calls[0][1]).toBe("2026-08-21");
  });

  it("keeps the date header visible while editing date-time values", () => {
    const originalScrollTo = HTMLElement.prototype.scrollTo;
    const scrollTo = vi.fn();
    HTMLElement.prototype.scrollTo = scrollTo;
    const { container } = render(<DatePicker defaultValue="2021-01-20 20:22:20" mode="dateTime" />);
    fireEvent.keyDown(container.querySelector(".k-datepicker")!, { key: "Enter" });
    fireEvent.click(document.body.querySelector(".k-picker-footer-time")!);

    expect(document.body.querySelector(".k-picker-header")).not.toBeNull();
    fireEvent.click(document.body.querySelectorAll(".k-picker-time-col")[0].children[10]);
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
    HTMLElement.prototype.scrollTo = originalScrollTo;
  });

  it("supports independently controlled start and end fields", () => {
    const onStartDateChange = vi.fn();
    const onEndDateChange = vi.fn();
    const { container } = render(
      <DatePicker
        mode="dateRange"
        startDate="2026-08-01"
        endDate="2026-08-05"
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />,
    );
    const inputs = container.querySelectorAll("input");
    expect(inputs[0].value).toBe("2026-08-01");
    expect(inputs[1].value).toBe("2026-08-05");
    fireEvent.change(inputs[0], { target: { value: "2026-08-02" } });

    expect(onStartDateChange).toHaveBeenCalledWith("2026-08-02");
    expect(onEndDateChange).toHaveBeenCalledWith("2026-08-05");
  });
});
