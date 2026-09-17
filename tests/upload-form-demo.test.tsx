import { StrictMode } from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { message } from "react-kui";
import Demo from "../components/upload/demo/forms";
class MockXHR {
  static instances: MockXHR[] = [];
  readyState = 0;
  status = 200;
  responseText = "{}";
  upload = { onloadstart: null as (() => void) | null, onprogress: null };
  onreadystatechange: (() => void) | null = null;
  abort = vi.fn();
  open = vi.fn();
  setRequestHeader = vi.fn();
  send() {
    this.upload.onloadstart?.();
  }
  constructor() {
    MockXHR.instances.push(this);
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  MockXHR.instances = [];
});
describe("upload form demo", () => {
  it.each(["uploading", "error", "success"])(
    "validates %s files without submitting",
    async (status) => {
      vi.stubGlobal("XMLHttpRequest", MockXHR);
      vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:demo");
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
      const success = vi.spyOn(message, "success").mockImplementation(() => "");
      const error = vi.spyOn(message, "error").mockImplementation(() => "");
      const { container } = render(
        <StrictMode>
          <Demo />
        </StrictMode>,
      );
      fireEvent.submit(container.querySelector("form")!);
      await waitFor(() => expect(error).toHaveBeenCalled());
      expect(container.textContent).toContain("Please select an avatar");
      error.mockClear();
      for (const input of container.querySelectorAll("input[type=file]")) {
        fireEvent.change(input, {
          target: { files: [new File(["a"], "a.png", { type: "image/png" })] },
        });
        await waitFor(() => expect(MockXHR.instances.length).toBeGreaterThan(0));
      }
      await waitFor(() => expect(MockXHR.instances).toHaveLength(3));
      await waitFor(() => expect(container.querySelectorAll(".k-form-item-error")).toHaveLength(0));
      expect(container.textContent).not.toContain("Please wait for all files to finish uploading");
      // Existing required tips remain mounted until their exit animation finishes.
      await waitFor(() => expect(container.textContent).not.toContain("Please select an avatar"));
      if (status !== "uploading") {
        for (const xhr of [...MockXHR.instances].reverse()) {
          await act(async () => {
            xhr.readyState = 4;
            xhr.status = status === "success" ? 200 : 500;
            xhr.onreadystatechange?.();
          });
        }
      }
      fireEvent.submit(container.querySelector("form")!);
      await waitFor(() => {
        if (status === "success")
          expect(success).toHaveBeenCalledWith("Validation passed (demo only)");
        else expect(error).toHaveBeenCalledWith("Please check the upload fields");
      });
      if (status !== "success") expect(success).not.toHaveBeenCalled();
      expect(container.textContent).not.toContain("Please select an avatar");
      expect(container.textContent).not.toContain("Please select a file");
      expect(container.textContent).not.toContain("Please select at least one file");
      expect(MockXHR.instances).toHaveLength(3);
    },
  );
});
