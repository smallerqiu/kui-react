import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeatureCard } from "react-kui";

describe("FeatureCard Vue parity", () => {
  it("renders custom icon, extra, and valid falsy content", () => {
    const { container } = render(
      <FeatureCard
        icon={<span data-testid="custom-icon">I</span>}
        title={0}
        desc={0}
        extra="More"
      />,
    );

    expect(screen.getByTestId("custom-icon")).not.toBeNull();
    expect(container.querySelector(".k-feature-card-title")?.textContent).toBe("0");
    expect(container.querySelector(".k-feature-card-desc")?.textContent).toBe("0");
    expect(container.querySelector(".k-feature-card-extra")?.textContent).toBe("More");
  });

  it("uses a click event for keyboard activation", () => {
    const onClick = vi.fn();
    const { container } = render(<FeatureCard clickable title="Projects" onClick={onClick} />);

    fireEvent.keyDown(container.querySelector(".k-feature-card")!, { key: "Enter" });
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0][0].type).toBe("click");
  });

  it("does not activate from nested controls or while disabled", () => {
    const onClick = vi.fn();
    const { container, rerender } = render(
      <FeatureCard clickable onClick={onClick}>
        <button>Action</button>
      </FeatureCard>,
    );

    fireEvent.keyDown(container.querySelector("button")!, { key: "Enter" });
    expect(onClick).not.toHaveBeenCalled();

    rerender(<FeatureCard clickable disabled title="Disabled" onClick={onClick} />);
    fireEvent.click(container.querySelector(".k-feature-card")!);
    expect(onClick).not.toHaveBeenCalled();
  });
});
