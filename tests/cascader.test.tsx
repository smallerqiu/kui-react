import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Cascader, type CascaderOption } from "react-kui";

const options: CascaderOption[] = [
  {
    label: "Zhejiang",
    value: "zhejiang",
    children: [{ label: "Hangzhou", value: "hangzhou" }],
  },
  {
    label: "Jiangsu",
    value: "jiangsu",
    children: [{ label: "Nanjing", value: "nanjing" }],
  },
];

describe("Cascader", () => {
  afterEach(() => vi.restoreAllMocks());

  it("supports selecting a complete path with the keyboard", () => {
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);
    const cascader = screen.getByRole("combobox");
    fireEvent.keyDown(cascader, { key: "Enter" });
    fireEvent.keyDown(cascader, { key: "Enter" });
    fireEvent.keyDown(cascader, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(["zhejiang", "hangzhou"]);
  });

  it("renders custom empty text", () => {
    render(<Cascader emptyText="Nothing here" defaultOpen />);
    expect(screen.getByText("Nothing here")).not.toBeNull();
  });

  it("keeps ArrowDown in the current column", () => {
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);
    const cascader = screen.getByRole("combobox");
    fireEvent.keyDown(cascader, { key: "Enter" });
    fireEvent.keyDown(cascader, { key: "ArrowDown" });
    fireEvent.keyDown(cascader, { key: "Enter" });
    fireEvent.keyDown(cascader, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(["jiangsu", "nanjing"]);
  });

  it("loads children once and renders them when resolved", async () => {
    let resolveLoad!: (value: CascaderOption[]) => void;
    const loadData = vi.fn(
      () => new Promise<CascaderOption[]>((resolve) => (resolveLoad = resolve)),
    );
    render(
      <Cascader
        defaultOpen
        options={[{ label: "Async", value: "async", isLeaf: false }]}
        loadData={loadData}
      />,
    );
    const item = screen.getByText("Async");
    fireEvent.click(item);
    fireEvent.click(item);
    expect(loadData).toHaveBeenCalledOnce();
    resolveLoad([{ label: "Loaded child", value: "child", isLeaf: true }]);
    expect(await screen.findByText("Loaded child")).not.toBeNull();
  });
});
