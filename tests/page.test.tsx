import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Page } from "react-kui";

describe("Page Vue parity", () => {
  it("renders only previous, current/total, and next in simple mode", () => {
    const { container } = render(<Page simple page={2} total={80} pageSize={10} />);

    expect(container.querySelector(".k-page")?.classList).toContain("k-page-simple");
    expect(container.querySelectorAll(".k-pager > li")).toHaveLength(3);
    expect(container.querySelector(".k-page-simple-number")?.textContent).toBe("2/8");
    expect(container.querySelector(".k-page-number")).toBeNull();
  });

  it("makes the current page editable when simple and showElevator are enabled", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Page simple showElevator page={2} total={1000} pageSize={10} onChange={onChange} />,
    );
    const input = container.querySelector<HTMLInputElement>(".k-page-simple-input input")!;

    expect(input.value).toBe("2");
    fireEvent.change(input, { target: { value: "50" } });
    expect(onChange).toHaveBeenLastCalledWith(50, 10);
  });

  it("clamps elevator values to the available page range", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Page showElevator page={1} total={50} pageSize={10} onChange={onChange} />,
    );
    const input = container.querySelector<HTMLInputElement>(".k-page-options input")!;

    fireEvent.change(input, { target: { value: "99" } });
    expect(onChange).toHaveBeenLastCalledWith(5, 10);
  });
});
