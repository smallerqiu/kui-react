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

  it("rejects disabled times in time mode", () => {
    const onChange = vi.fn();
    const { container } = render(
      <DatePicker
        mode="time"
        disabledTime={(date) => date.getHours() === 10}
        onChange={onChange}
      />,
    );
    fireEvent.change(container.querySelector("input")!, { target: { value: "10:00:00" } });
    expect(onChange, '`mode="time"` 也是带时间的档，disabledTime 得生效').not.toHaveBeenCalled();
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

  // 受控值口径（规则 A）：区间输入框回退的唯一来源是"当前这份值"——
  // 非受控时就是最近一次提交的结果，而不是 props 里那个原始值。
  // 历史上区间的文本恒取 props 那份，于是提交过新值再输错、失焦，
  // 两个框一起被清成初始状态，和内部已提交的值漂移。
  it("reverts a mistyped range box to the committed range instead of the initial props", async () => {
    const onChange = vi.fn();
    const { container } = render(<DatePicker mode="dateRange" open onChange={onChange} />);
    await waitFor(() =>
      expect(
        document.body.querySelector(".k-picker-day:not(.k-picker-day-disabled)"),
      ).not.toBeNull(),
    );
    const days = () =>
      Array.from(
        document.body.querySelectorAll<HTMLElement>(".k-picker-day:not(.k-picker-day-disabled)"),
      );
    // 格子按时间顺序排，头一个是最早的、最后一个是最新的，两点即凑齐一段。
    fireEvent.click(days()[0]);
    fireEvent.click(days().at(-1)!);
    const committed = onChange.mock.calls.at(-1)?.[1] as string[];
    expect(committed[0]).not.toBe("");
    expect(committed[1]).not.toBe("");

    const inputs = container.querySelectorAll<HTMLInputElement>(".k-datepicker-input");
    fireEvent.change(inputs[0], { target: { value: "not-a-date" } });
    fireEvent.blur(inputs[0]);

    expect(inputs[0].value).toBe(committed[0]);
    expect(inputs[1].value).toBe(committed[1]);
  });

  // 规则 A 的另一半：范围只受控单边时，面板要认已有那头。
  // 历史上草稿按"有没有空位"整段作废（文本却还显示着那一个值），
  // 于是下一次点选被当成"第一次点击 = 起点"，把父级给的那一头覆盖掉。
  it.each([
    ["startDate", "2026-08-01"],
    ["endDate", "2026-08-05"],
  ])(
    "keeps the %s already given by the parent when the other end is picked",
    async (prop, date) => {
      const onChange = vi.fn();
      const controlled = { [prop]: date } as { startDate?: string; endDate?: string };
      render(<DatePicker mode="dateRange" open onChange={onChange} {...controlled} />);
      await waitFor(() =>
        expect(
          document.body.querySelector(".k-picker-day:not(.k-picker-day-disabled)"),
        ).not.toBeNull(),
      );
      fireEvent.click(document.body.querySelector(".k-picker-day:not(.k-picker-day-disabled)")!);

      expect(onChange).toHaveBeenCalledTimes(1);
      const strings = onChange.mock.calls[0]?.[1] as string[];
      // 已有的那一头还在结果里，另一头由这次点选补上，两头都得有值。
      expect(strings).toContain(date);
      expect(strings.filter(Boolean)).toHaveLength(2);
    },
  );

  // 规则 C：值没变就不要重复通知。react 的 commit 和 vue 的 emitValue 同一条口径，
  // 父级在 onChange 里发请求，重复点已经选中的日期不该再跑一趟。
  it("does not re-emit when the already selected date is picked again", () => {
    const onChange = vi.fn();
    const { container } = render(<DatePicker panelOnly onChange={onChange} />);
    const day = container.querySelector<HTMLElement>(".k-picker-day:not(.k-picker-day-disabled)")!;
    fireEvent.click(day);
    expect(onChange).toHaveBeenCalledTimes(1);

    fireEvent.click(container.querySelector(".k-picker-day-selected")!);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // "首尾凑齐才算选上"要覆盖时间列这条路：dateTimeRange 只点到起点时，
  // 时间格子改的是草稿里的那一格，另一头还空着——半截区间不该发给 onChange，
  // 但这个时间得留在草稿和输入框里，不然选了等于没选。
  it("keeps a half range out of onChange when the time is picked before the second end", async () => {
    const originalScrollTo = HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollTo = vi.fn();
    try {
      const onChange = vi.fn();
      const { container } = render(<DatePicker mode="dateTimeRange" open onChange={onChange} />);
      await waitFor(() =>
        expect(
          document.body.querySelector(".k-picker-day:not(.k-picker-day-disabled)"),
        ).not.toBeNull(),
      );
      fireEvent.click(document.body.querySelector(".k-picker-day:not(.k-picker-day-disabled)")!);
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.click(document.body.querySelector<HTMLElement>(".k-picker-footer-time")!);
      await waitFor(() => expect(document.body.querySelector(".k-picker-time-item")).not.toBeNull());
      fireEvent.click(document.body.querySelectorAll<HTMLElement>(".k-picker-time-item")[5]);

      expect(
        onChange,
        "时间列也是区间的一条通道，缺另一头时不能把半截区间当结果发出去",
      ).not.toHaveBeenCalled();
      expect(container.querySelectorAll<HTMLElement>(".k-datepicker-input")[0].value).toMatch(
        / 05:00:00$/,
      );
      expect(container.querySelectorAll<HTMLElement>(".k-datepicker-input")[1].value).toBe("");
    } finally {
      HTMLElement.prototype.scrollTo = originalScrollTo;
    }
  });
});
