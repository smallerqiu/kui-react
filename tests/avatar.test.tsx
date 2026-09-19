import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Avatar, AvatarGroup } from "react-kui";

describe("Avatar Vue parity", () => {
  it("falls back to the default icon after an image error", () => {
    const { container } = render(<Avatar src="/missing.png" alt="User" />);

    fireEvent.error(container.querySelector("img")!);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".k-avatar")?.classList.contains("k-avatar-icon")).toBe(true);
    expect(container.querySelector(".k-icon")).not.toBeNull();
  });

  it("keeps the failed image when onError returns false", () => {
    const onError = vi.fn(() => false);
    const { container } = render(<Avatar src="/missing.png" onError={onError} />);

    fireEvent.error(container.querySelector("img")!);

    expect(onError).toHaveBeenCalledOnce();
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("works without ResizeObserver and applies group options", () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    vi.stubGlobal("ResizeObserver", undefined);

    const { container } = render(
      <AvatarGroup shape="round" size="small" spacing={0} maxCount={1}>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </AvatarGroup>,
    );

    const avatars = container.querySelectorAll(".k-avatar");
    expect(avatars).toHaveLength(2);
    expect(avatars[0].classList.contains("k-avatar-round")).toBe(true);
    expect(avatars[0].classList.contains("k-avatar-sm")).toBe(true);
    expect(avatars[1].textContent).toBe("+1");
    expect(
      container
        .querySelector<HTMLElement>(".k-avatar-group")
        ?.style.getPropertyValue("--kui-avatar-group-overlap"),
    ).toBe("-0px");

    vi.stubGlobal("ResizeObserver", originalResizeObserver);
  });
});
