import { useState } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Form,
  FormItem,
  Upload,
  type UploadChangeEvent,
  type UploadRequestOptions,
} from "react-kui";

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
  it("resets form uploads, aborts pending requests and ignores late callbacks", async () => {
    const requests: UploadRequestOptions[] = [];
    const abort = vi.fn();
    function Demo() {
      const [model, setModel] = useState<Record<string, unknown>>({ files: [] });
      return (
        <Form model={model} onChange={setModel}>
          <FormItem prop="files">
            <Upload
              multiple
              maxConcurrent={1}
              customRequest={(options) => {
                requests.push(options);
                return { abort };
              }}
            />
          </FormItem>
          <button type="reset">Reset</button>
        </Form>
      );
    }
    const { container, getByText } = render(<Demo />);
    selectFile(container);
    await waitFor(() => expect(requests).toHaveLength(1));
    fireEvent.click(getByText("Reset"));
    await waitFor(() =>
      expect(container.querySelectorAll(".k-upload-file-list-item")).toHaveLength(0),
    );
    expect(abort).toHaveBeenCalledTimes(1);
    requests[0].onProgress(90);
    requests[0].onSuccess();
    expect(container.querySelectorAll(".k-upload-file-list-item")).toHaveLength(0);
    selectFile(container, new File(["next"], "b.txt"));
    await waitFor(() => expect(requests).toHaveLength(2));
  });

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

  it("reorders picture files by drag and drop", async () => {
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
    const items = Array.from(
      container.querySelectorAll<HTMLElement>(".k-upload-file-picture-item"),
    );
    items.forEach((item, index) => {
      item.getBoundingClientRect = () =>
        ({
          left: index * 104,
          right: index * 104 + 96,
          top: 0,
          bottom: 96,
          width: 96,
          height: 96,
        }) as DOMRect;
    });
    items[0].parentElement!.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 200, bottom: 96 }) as DOMRect;
    const pointer = (type: string, x: number) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: 40,
        button: 0,
      });
      Object.defineProperty(event, "pointerId", { value: 1 });
      return event;
    };
    items[0].dispatchEvent(pointer("pointerdown", 40));
    document.dispatchEvent(pointer("pointermove", 145));
    document.dispatchEvent(pointer("pointerup", 145));
    await waitFor(() => expect(onSort).toHaveBeenCalled());

    expect(onSort).toHaveBeenCalledWith(
      expect.objectContaining({
        oldIndex: 0,
        newIndex: 1,
        file: expect.objectContaining({ uid: "a" }),
      }),
    );
  });
});
