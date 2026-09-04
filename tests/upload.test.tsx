import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Upload, type UploadChangeEvent, type UploadRequestOptions } from "react-kui";

class MockXHR {
  static instances: MockXHR[] = [];
  readyState = 0;
  status = 200;
  responseText = "";
  upload = {
    onloadstart: null as (() => void) | null,
    onprogress: null as ((event: ProgressEvent) => void) | null,
  };
  onreadystatechange: (() => void) | null = null;
  onerror: (() => void) | null = null;
  abort = vi.fn();
  open = vi.fn();
  setRequestHeader = vi.fn();
  send = vi.fn();

  constructor() {
    MockXHR.instances.push(this);
  }
}

const selectFile = (container: HTMLElement, file = new File(["content"], "a.txt")) => {
  fireEvent.change(container.querySelector("input[type=file]")!, {
    target: { files: [file] },
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
  MockXHR.instances = [];
});

describe("Upload", () => {
  it("handles transform errors without starting a request", async () => {
    vi.stubGlobal("XMLHttpRequest", MockXHR as unknown as typeof XMLHttpRequest);
    const onChange = vi.fn<(event: UploadChangeEvent) => void>();
    const { container } = render(
      <Upload
        action="/upload"
        transformFile={() => Promise.reject(new Error("transform failed"))}
        onChange={onChange}
      >
        Upload
      </Upload>,
    );

    selectFile(container);

    await waitFor(() => expect(container.textContent).toContain("transform failed"));
    expect(MockXHR.instances).toHaveLength(0);
    expect(onChange.mock.calls.at(-1)?.[0].file.status).toBe("error");
  });

  it("settles a failed request only once", async () => {
    vi.stubGlobal("XMLHttpRequest", MockXHR as unknown as typeof XMLHttpRequest);
    const onChange = vi.fn<(event: UploadChangeEvent) => void>();
    const { container } = render(
      <Upload action="/upload" onChange={onChange}>
        Upload
      </Upload>,
    );
    selectFile(container);
    await waitFor(() => expect(MockXHR.instances).toHaveLength(1));
    const xhr = MockXHR.instances[0];
    const changesBeforeFailure = onChange.mock.calls.length;

    xhr.onerror?.();
    xhr.status = 500;
    xhr.readyState = 4;
    xhr.onreadystatechange?.();

    expect(onChange).toHaveBeenCalledTimes(changesBeforeFailure + 1);
  });

  it("does not revoke externally owned preview URLs", () => {
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, revokeObjectURL });
    const { unmount } = render(
      <Upload
        action="/upload"
        fileList={[{ uid: "external", filename: "photo", preview: "https://img.test/a.png" }]}
      />,
    );

    unmount();

    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it("honors zero limits and ignores extra dropped files when multiple is false", () => {
    const { container, rerender } = render(<Upload action="/upload" type="picture" limit={0} />);
    expect(container.querySelector("input[type=file]")).toBeNull();

    const onSelectFiles = vi.fn();
    rerender(
      <Upload action="/upload" autoTrigger={false} onSelectFiles={onSelectFiles}>
        Upload
      </Upload>,
    );
    fireEvent.change(container.querySelector("input[type=file]")!, {
      target: { files: [new File(["a"], "a.txt"), new File(["b"], "b.txt")] },
    });

    expect(onSelectFiles.mock.calls[0][0]).toHaveLength(1);
  });

  it("limits custom request concurrency", async () => {
    const requests: UploadRequestOptions[] = [];
    const { container } = render(
      <Upload
        multiple
        maxConcurrent={1}
        customRequest={(options) => {
          requests.push(options);
        }}
      >
        Upload
      </Upload>,
    );
    fireEvent.change(container.querySelector("input[type=file]")!, {
      target: { files: [new File(["a"], "a.txt"), new File(["b"], "b.txt")] },
    });

    await waitFor(() => expect(requests).toHaveLength(1));
    requests[0].onSuccess();
    await waitFor(() => expect(requests).toHaveLength(2));
  });

  it("reorders picture files by drag and drop", () => {
    const onSort = vi.fn();
    const { container } = render(
      <Upload
        type="picture"
        sortable
        onSort={onSort}
        fileList={[
          { uid: "a", filename: "A", url: "/a.png", status: "success" },
          { uid: "b", filename: "B", url: "/b.png", status: "success" },
        ]}
      />,
    );
    const items = container.querySelectorAll(".k-upload-file-picture-item");
    fireEvent.dragStart(items[0]);
    fireEvent.drop(items[1]);

    expect(onSort).toHaveBeenCalledWith(
      expect.objectContaining({
        oldIndex: 0,
        newIndex: 1,
        file: expect.objectContaining({ uid: "a" }),
      }),
    );
  });
});
