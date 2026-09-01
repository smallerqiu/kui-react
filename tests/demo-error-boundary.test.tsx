import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DemoErrorBoundary } from "../src/components/demo/demo";

describe("Demo error isolation", () => {
  it("keeps the documentation mounted when edited demo code throws", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const onError = vi.fn();
    const BrokenDemo = () => {
      throw new Error("Edited demo failed");
    };

    render(
      <div>
        <span>Documentation remains visible</span>
        <DemoErrorBoundary onError={onError}>
          <BrokenDemo />
        </DemoErrorBoundary>
      </div>,
    );

    expect(screen.getByText("Documentation remains visible")).not.toBeNull();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Edited demo failed" }),
    );
    consoleError.mockRestore();
  });
});
