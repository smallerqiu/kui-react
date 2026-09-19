import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import FormTemplate from "../ai/templates/form";
import TableTemplate from "../ai/templates/table";
import ModalTemplate from "../ai/templates/modal-editor";

const settle = async (ms = 250) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("React AI business templates", () => {
  it("validates and saves a controlled Form model, then resets", async () => {
    vi.useFakeTimers();
    const view = render(<FormTemplate />);
    await act(async () => {
      fireEvent.submit(view.container.querySelector("form")!);
    });
    expect(screen.getByText("请输入姓名")).toBeTruthy();
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Ada" } });
    fireEvent.change(screen.getAllByRole("textbox")[1], { target: { value: "bad" } });
    await act(async () => {
      fireEvent.submit(view.container.querySelector("form")!);
    });
    expect(screen.getByText("邮箱格式不正确")).toBeTruthy();
    fireEvent.change(screen.getAllByRole("textbox")[1], { target: { value: "ada@example.com" } });
    await act(async () => {
      fireEvent.submit(view.container.querySelector("form")!);
    });
    expect((screen.getAllByRole("textbox")[0] as HTMLInputElement).disabled).toBe(true);
    await settle();
    expect(screen.getByText("已保存：Ada")).toBeTruthy();
    fireEvent.reset(view.container.querySelector("form")!);
    expect((screen.getAllByRole("textbox")[0] as HTMLInputElement).value).toBe("");
  });
  it("loads, paginates and searches a table", async () => {
    vi.useFakeTimers();
    const view = render(<TableTemplate />);
    await settle();
    expect(screen.getByText("用户 1")).toBeTruthy();
    const page2 = [...view.container.querySelectorAll(".k-page li")].find(
      (el) => el.textContent === "2",
    )!;
    fireEvent.click(page2);
    await settle();
    expect(screen.getByText("用户 11")).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("搜索姓名"), { target: { value: "用户 47" } });
    fireEvent.click(screen.getByRole("button", { name: "搜索" }));
    await settle();
    expect(screen.getByText("用户 47")).toBeTruthy();
    expect(screen.queryByText("用户 11")).toBeNull();
  });
  it("cancels an isolated draft and commits a modal save", async () => {
    vi.useFakeTimers();
    render(<ModalTemplate />);
    fireEvent.click(screen.getByRole("button", { name: "编辑" }));
    await settle(1);
    await settle(350);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Canceled" } });
    fireEvent.click(screen.getByRole("button", { name: "取消" }));
    await settle(1);
    await settle(350);
    expect(screen.getByText("示例用户")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "编辑" }));
    await settle(1);
    await settle(350);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("示例用户");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Saved" } });
    await act(async () => {
      fireEvent.submit(document.querySelector("form")!);
    });
    await settle(600);
    expect(screen.getByText("Saved")).toBeTruthy();
  });
});
