import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AutoComplete, InputTag, Mentions, Select, Steps } from "../components";

describe("new input and navigation components", () => {
  it("creates unique Select options and clears the query", () => {
    const onChange = vi.fn();
    render(
      <Select
        multiple
        allowCreate
        filterable
        defaultOpen
        defaultValue={[]}
        options={[{ label: "React", value: "React" }]}
        onChange={onChange}
      />,
    );
    const root = screen.getByRole("combobox");
    const input = root.querySelector("input")!;
    fireEvent.change(input, { target: { value: "Vue" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(["Vue"]);
    expect(input.value).toBe("");
    fireEvent.change(input, { target: { value: "vue" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("keeps Select keyboard navigation anchored after selecting", () => {
    const onChange = vi.fn();
    render(
      <Select
        multiple
        defaultOpen
        options={[
          { label: "One", value: 1 },
          { label: "Two", value: 2 },
          { label: "Three", value: 3 },
        ]}
        onChange={onChange}
      />,
    );
    const root = screen.getByRole("combobox");
    fireEvent.keyDown(root, { key: "ArrowDown" });
    fireEvent.keyDown(root, { key: "Enter" });
    fireEvent.keyDown(root, { key: "ArrowDown" });
    fireEvent.keyDown(root, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith([1, 2]);
  });

  it("supports AutoComplete keyboard selection", () => {
    const onSelect = vi.fn();
    render(<AutoComplete options={["React", "Vue"]} onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("React", expect.objectContaining({ value: "React" }));
  });

  it("adds and removes InputTag values", () => {
    const onChange = vi.fn();
    render(<InputTag defaultValue={["React"]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Vue" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(["React", "Vue"]);
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenLastCalledWith(["React"]);
  });

  it("inserts mentions and changes steps", () => {
    const mentionChange = vi.fn();
    const stepChange = vi.fn();
    render(
      <>
        <Mentions options={["team"]} onChange={mentionChange} />
        <Steps current={0} items={[{ title: "One" }, { title: "Two" }]} onChange={stepChange} />
      </>,
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello @t", selectionStart: 8 } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(mentionChange).toHaveBeenLastCalledWith("Hello @team ");
    fireEvent.click(screen.getByText("Two"));
    expect(stepChange).toHaveBeenCalledWith(1);
  });
});
