import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InputTag, TreeSelect } from "../components";

const values = ["apple", "pear"];
const treeData = [
  { key: "apple", title: "Apple" },
  { key: "pear", title: "Pear" },
];

describe.each(["InputTag", "TreeSelect"])("%s overflow preview", (name) => {
  it.each(["disabled", "readonly", "editable"])(
    "keeps a readable preview in %s state",
    async (mode) => {
      const onChange = vi.fn();
      const props = {
        value: values,
        maxTagCount: 1,
        disabled: mode === "disabled",
        readOnly: mode === "readonly",
        onChange,
      };
      render(
        name === "InputTag" ? (
          <InputTag {...props} />
        ) : (
          <TreeSelect {...props} multiple treeData={treeData} />
        ),
      );
      fireEvent.mouseEnter(screen.getByText("+1..."));
      await waitFor(() =>
        expect(document.querySelector(".k-tooltip .k-tag")?.textContent?.toLowerCase()).toContain(
          "pear",
        ),
      );
      const tag = document.querySelector(".k-tooltip .k-tag")!;
      expect(tag.closest('[theme-mode="dark"]')).not.toBeNull();
      const close = tag.querySelector(".k-tag-close");
      if (mode === "editable") {
        expect(close).not.toBeNull();
        fireEvent.click(close!);
        expect(onChange).toHaveBeenLastCalledWith(["apple"]);
      } else {
        expect(close).toBeNull();
        fireEvent.click(tag);
        expect(onChange).not.toHaveBeenCalled();
      }
    },
  );
});
