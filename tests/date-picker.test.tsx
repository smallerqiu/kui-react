import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "react-kui";

describe("DatePicker", () => {
  it.each([24, 32, 40])("centers time selections with %i-pixel items", async (itemHeight) => {
    const originalScrollTo = HTMLElement.prototype.scrollTo;
    const scrollTo = vi.fn();
    HTMLElement.prototype.scrollTo = scrollTo;
    try {
      const { container } = render(<DatePicker panelOnly mode="time" value="10:22:33" />);
      const columns = container.querySelectorAll<HTMLElement>(".k-picker-time-col");
      const columnHeight = 240;
      columns.forEach((column) => {
        Object.defineProperty(column, "clientHeight", { value: columnHeight });
        Array.from(column.children).forEach((item, index) => {
          Object.defineProperties(item, {
            offsetTop: { value: (columnHeight - itemHeight) / 2 + index * itemHeight },
            offsetHeight: { value: itemHeight },
          });
        });
      });

      await waitFor(() => expect(scrollTo).toHaveBeenCalledTimes(3));
      [10, 22, 33].forEach((index, column) => {
        expect(scrollTo).toHaveBeenNthCalledWith(column + 1, {
          top: index * itemHeight,
          behavior: "auto",
        });
        expect(scrollTo.mock.contexts[column]).toBe(columns[column]);
      });

      fireEvent.click(columns[0].children[0]);
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });
      fireEvent.click(columns[1].children[59]);
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 59 * itemHeight, behavior: "smooth" });
    } finally {
      HTMLElement.prototype.scrollTo = originalScrollTo;
    }
  });

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

  it("updates local values and synchronizes external changes", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<DatePicker value="2026-08-01" onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2026-08-21" } });

    expect(onChange).toHaveBeenCalledWith("2026-08-21", "2026-08-21");
    expect(input.value).toBe("2026-08-21");

    rerender(<DatePicker value="2026-08-25" onChange={onChange} />);
    expect(input.value).toBe("2026-08-25");
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
      <DatePicker value="2026-08-01" valueType="timestamp" onChange={onChange} />,
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
    const { container } = render(<DatePicker value="2021-01-20 20:22:20" mode="dateTime" />);
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

  it("preserves an independently controlled end value", () => {
    const { container } = render(<DatePicker mode="dateRange" endDate="2026-08-05" />);
    const inputs = container.querySelectorAll("input");
    expect(inputs[0].value).toBe("");
    expect(inputs[1].value).toBe("2026-08-05");
    expect(container.querySelector(".k-icon-clean")).not.toBeNull();
  });

  it("rejects disabled manual values", () => {
    const onChange = vi.fn();
    const { container } = render(
      <DatePicker
        value="2026-08-01"
        disabledDate={(date) => date.getFullYear() === 2027}
        onChange={onChange}
      />,
    );
    fireEvent.change(container.querySelector("input")!, { target: { value: "2027-01-01" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("rejects disabled values from extension content", () => {
    const onChange = vi.fn();
    const disabledDate = (date: Date) => date.getFullYear() === 2027;
    const { container } = render(
      <DatePicker
        panelOnly
        value="2026-08-01"
        disabledDate={disabledDate}
        header={({ emit }) => <button onClick={() => emit("2027-01-01")}>Blocked</button>}
        onChange={onChange}
      />,
    );
    fireEvent.click(container.querySelector("button")!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports selecting calendar cells with the keyboard", () => {
    const onChange = vi.fn();
    const { container } = render(<DatePicker panelOnly value="2026-08-21" onChange={onChange} />);
    fireEvent.keyDown(container.querySelector(".k-picker-day:not(.k-picker-day-disabled)")!, {
      key: "Enter",
    });
    expect(onChange).toHaveBeenCalled();
  });
});
