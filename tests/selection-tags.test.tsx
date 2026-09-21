import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderSelectionTags } from "../components/utils/selection-tags";

describe("shared selection tags", () => {
  it.each([0, -2, 0.9, 1.9])(
    "preserves removal indexes with maxTagCount=%s",
    async (maxTagCount) => {
      const onRemove = vi.fn();
      const count = Math.max(0, Math.floor(maxTagCount));
      render(
        <div>{renderSelectionTags({ labels: ["Apple", "Pear"], maxTagCount, onRemove })}</div>,
      );
      fireEvent.mouseEnter(screen.getByText(`+${2 - count}...`));
      await waitFor(() =>
        expect(document.querySelectorAll(".k-tooltip .k-tag").length).toBe(2 - count),
      );
      const hidden = document.querySelectorAll(".k-tooltip .k-tag");
      fireEvent.click(hidden[hidden.length - 1].querySelector(".k-tag-close")!);
      expect(onRemove).toHaveBeenCalledWith(1);
    },
  );
  it.each([undefined, NaN, Infinity])("shows all tags for a non-finite limit %s", (maxTagCount) => {
    const { container } = render(
      <div>
        {renderSelectionTags({ labels: ["Apple", "Pear"], maxTagCount, onRemove: vi.fn() })}
      </div>,
    );
    expect(container.querySelectorAll(".k-tag")).toHaveLength(2);
    expect(container.textContent).toBe("ApplePear");
  });
});
