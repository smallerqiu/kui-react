import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ImagePreview from "../components/image/preview";

describe("ImagePreview drag", () => {
  it("moves a zoomed preview with document mouse events", () => {
    const { container } = render(<ImagePreview type="media" src="video.mp4" />);
    const image = container.querySelector("video") as HTMLVideoElement;
    const getWrap = () => container.querySelector(".k-image-preview-img-wrap") as HTMLDivElement;

    act(() => {
      fireEvent.mouseDown(image, { button: 0, clientX: 100, clientY: 100 });
    });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 140, clientY: 160 });
    });

    expect(getWrap().style.transition).toBe("none");
    expect(getWrap().style.transform).toBe("translate3d(40px, 60px, 0)");

    act(() => fireEvent.mouseUp(document));
  });
});
