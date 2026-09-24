import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input, InputNumber } from "../components";
import { createRef } from "react";
import type { InputRef } from "../components/input";

describe("internal Input style prefix", () => {
  it("keeps internal controls private and forwards focus and blur", () => {
    const ref = createRef<InputRef>();
    const { container } = render(
      <Input {...{ controls: <span data-testid="private-controls" /> }} ref={ref} />,
    );
    expect(screen.queryByTestId("private-controls")).toBeNull();
    ref.current?.focus();
    expect(document.activeElement).toBe(container.querySelector("input"));
    ref.current?.blur();
    expect(document.activeElement).not.toBe(container.querySelector("input"));
  });
  it("preserves native type and independent InputNumber styles and input events", () => {
    const onChange = vi.fn();
    const { container } = render(
      <>
        <Input type="password" aria-label="password" />
        <InputNumber value={2} onChange={onChange} />
      </>,
    );
    expect(screen.getByLabelText("password").getAttribute("type")).toBe("password");
    expect(container.querySelector(".k-input-text")).not.toBeNull();
    expect(container.querySelector(".k-input-number-text")).not.toBeNull();
    const number = screen.getByRole("spinbutton");
    expect(number.hasAttribute("inputType")).toBe(false);
    fireEvent.keyDown(number, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(3);
  });
});
