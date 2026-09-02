import { createRef } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import type { QRCodeRenderersOptions } from "qrcode";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QRCode, type QRCodeRef } from "react-kui";

const { toCanvas } = vi.hoisted(() => ({
  toCanvas: vi.fn(
    async (canvas: HTMLCanvasElement, value: string, options?: QRCodeRenderersOptions) => {
      void canvas;
      void value;
      void options;
    },
  ),
}));
vi.mock("qrcode", () => ({ toCanvas }));

const context = {
  beginPath: vi.fn(),
  clip: vi.fn(),
  drawImage: vi.fn(),
  fill: vi.fn(),
  fillStyle: "",
  restore: vi.fn(),
  roundRect: vi.fn(),
  save: vi.fn(),
};

class DeferredImage {
  crossOrigin = "";
  onerror: (() => void) | null = null;
  onload: (() => void) | null = null;
  set src(_value: string) {
    images.push(this);
  }
}

const images: DeferredImage[] = [];

describe("QRCode", () => {
  beforeEach(() => {
    images.length = 0;
    vi.clearAllMocks();
    vi.stubGlobal("Image", DeferredImage);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
  });

  it("normalizes invalid dimensions and margin", async () => {
    const { container } = render(
      <QRCode value="https://k-ui.cn" size={0} margin={-3} colorDark="#000" colorLight="#fff" />,
    );

    await waitFor(() => expect(toCanvas).toHaveBeenCalledOnce());
    expect(toCanvas.mock.calls[0][2]).toEqual(expect.objectContaining({ width: 160, margin: 0 }));
    expect(container.querySelector<HTMLElement>(".k-qrcode")?.style.width).toBe("160px");
  });

  it("waits for logo composition before downloading", async () => {
    const ref = createRef<QRCodeRef>();
    const toDataURL = vi
      .spyOn(HTMLCanvasElement.prototype, "toDataURL")
      .mockReturnValue("data:image/png;base64,qr");
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    render(
      <QRCode
        ref={ref}
        value="https://k-ui.cn"
        logo="/logo.png"
        colorDark="#000"
        colorLight="#fff"
      />,
    );
    await waitFor(() => expect(images).toHaveLength(1));

    const downloading = ref.current!.download("code.png");
    expect(toDataURL).not.toHaveBeenCalled();
    images[0].onload?.();
    await downloading;

    expect(toDataURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
  });

  it("supports keyboard refresh only for the expired state", () => {
    const onRefresh = vi.fn();
    const { container } = render(<QRCode value="value" status="expired" onRefresh={onRefresh} />);
    const expired = container.querySelector<HTMLElement>(".k-qrcode-expired-wrapper")!;

    fireEvent.keyDown(expired, { key: "Enter" });
    expect(onRefresh).toHaveBeenCalledOnce();
    expect(expired.getAttribute("role")).toBe("button");
  });
});
