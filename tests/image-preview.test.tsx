import { act, fireEvent, render } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, it } from "vitest";
import ImagePreview from "../components/image/preview";

describe("ImagePreview drag", () => {
  it.each(["mouse", "touch"])("keeps consecutive %s movements in StrictMode", (input) => {
    const { container } = render(
      <StrictMode><ImagePreview type="media" src="video.mp4" /></StrictMode>,
    );
    const image = container.querySelector("video") as HTMLVideoElement;
    const wrap = container.querySelector(".k-image-preview-img-wrap") as HTMLDivElement;
    if (input === "mouse") {
      fireEvent.mouseDown(image, { button: 0, clientX: 100, clientY: 100 });
    } else {
      fireEvent.touchStart(image, { touches: [{ clientX: 100, clientY: 100 }] });
    }
    const move = (clientX: number, clientY: number) => {
      if (input === "mouse") fireEvent.mouseMove(document, { clientX, clientY });
      else fireEvent.touchMove(document, { touches: [{ clientX, clientY }] });
    };
    move(140, 160);
    move(170, 190);
    expect(wrap.style.transform).toBe("translate3d(70px, 90px, 0)");
    act(() => {
      move(180, 200);
      move(200, 220);
    });
    expect(wrap.style.transform).toBe("translate3d(100px, 120px, 0)");
    if (input === "mouse") fireEvent.mouseUp(document);
    else fireEvent.touchEnd(document);
    expect(wrap.style.transition).toBe("");
    expect(wrap.style.transform).toBe("translate3d(0px, 0px, 0)");
    move(250, 270);
    expect(wrap.style.transform).toBe("translate3d(0px, 0px, 0)");
  });

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
