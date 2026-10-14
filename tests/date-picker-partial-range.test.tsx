import { fireEvent, render, waitFor, type RenderResult } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DatePicker } from "../components";
/**
 * 区间选到一半就关闭：草稿必须回到上次提交的那份，输入框不能留着半截文本。
 * 关闭有两条路——按 Esc 和点外面，两条走的是同一个 closePopup，
 * 所以每种半选都对这两条各断一次（历史上 Esc 分支直接 setOpen(false)，绕开了回滚）。
 * 半选也有两种形状——日历只点一下是长度 1 的草稿，手输只填一个框是"文本有值、草稿没动"，
 * 历史上回滚只认长度 1，后者整个漏掉。
 * 两仓断同一件事，见 kui-vue/tests/date-picker.test.ts。
 */

const views: RenderResult[] = [];

// 面板挂在 body 上，同名节点可能同时存在好几份（关到一半的那个还在），
// 要查就查最后打开的那一份。
const latestPanel = () => {
  const panels = document.body.querySelectorAll<HTMLElement>(".k-datepicker-overlay");
  return panels[panels.length - 1] ?? null;
};

const closes = [
  ["Escape", (root: HTMLElement) => fireEvent.keyDown(root, { key: "Escape" })],
  ["a click outside", () => fireEvent.mouseDown(document.body)],
] as const;

describe.each(closes)("%s closes a half range", (_label, close) => {
  it("restores the committed range after picking only a start date", async () => {
    const view = render(
      <DatePicker open mode="dateRange" startDate="2026-08-01" endDate="2026-08-05" />,
    );
    views.push(view);
    const root = view.container.querySelector<HTMLElement>(".k-datepicker")!;
    await waitFor(() =>
      expect(
        document.body.querySelector(".k-picker-day:not(.k-picker-day-disabled)"),
      ).not.toBeNull(),
    );

    fireEvent.click(document.body.querySelector(".k-picker-day:not(.k-picker-day-disabled)")!);
    close(root);

    const inputs = view.container.querySelectorAll<HTMLInputElement>(".k-datepicker-input");
    expect(inputs[0].value).toBe("2026-08-01");
    expect(inputs[1].value).toBe("2026-08-05");

    // 重开面板亮着的应该是已提交的那一头尾，而不是上次没提交的半截。
    fireEvent.keyDown(root, { key: "Enter" });
    await waitFor(() => expect(latestPanel()?.querySelector(".k-picker-day")).not.toBeNull());
    expect(latestPanel()!.querySelectorAll(".k-picker-day-selected")).toHaveLength(2);
  });

  it("discards a date typed into only the end box", async () => {
    const onChange = vi.fn();
    const view = render(<DatePicker open mode="dateRange" onChange={onChange} />);
    views.push(view);
    const root = view.container.querySelector<HTMLElement>(".k-datepicker")!;
    await waitFor(() => expect(document.body.querySelector(".k-picker-day")).not.toBeNull());

    const inputs = view.container.querySelectorAll<HTMLInputElement>(".k-datepicker-input");
    fireEvent.change(inputs[1], { target: { value: "2026-08-21" } });
    expect(inputs[1].value, "输入过程中先按字面显示").toBe("2026-08-21");

    close(root);

    expect(inputs[0].value).toBe("");
    expect(inputs[1].value, "凑不齐首尾就不算选上，文本跟着清掉").toBe("");
    expect(onChange, "半截区间不往外提交").not.toHaveBeenCalled();
  });
});

afterEach(() => {
  views.forEach((view) => view.unmount());
  views.length = 0;
  document.body.innerHTML = "";
});
