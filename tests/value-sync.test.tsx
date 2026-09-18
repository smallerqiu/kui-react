import { act, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode, createRef, useState, type ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  AutoComplete,
  Calendar,
  Carousel,
  CarouselItem,
  Cascader,
  CheckboxGroup,
  CheckCardGroup,
  ColorPicker,
  Input,
  InputNumber,
  InputOTP,
  InputTag,
  Mentions,
  Menu,
  RadioGroup,
  Rate,
  Segmented,
  Select,
  Slider,
  TextArea,
  TypographyParagraph,
  type CarouselRef,
} from "../components";

type TextValueProps = { value?: string; onChange?: (value: string) => void };
const textControls: [string, ComponentType<TextValueProps>][] = [
  ["Input", Input],
  ["TextArea", TextArea],
  ["AutoComplete", AutoComplete],
  ["Mentions", Mentions],
];

describe("single value API", () => {
  it.each(textControls)(
    "%s supports local edits, passive listeners, external updates and clearing",
    (_name, Control) => {
      const onChange = vi.fn();
      const { container, rerender } = render(
        <StrictMode>
          <Control value="initial" onChange={onChange} />
        </StrictMode>,
      );
      const input = () => container.querySelector("input, textarea") as HTMLInputElement;
      fireEvent.change(input(), { target: { value: "edited" } });
      expect(input().value).toBe("edited");
      expect(onChange).toHaveBeenLastCalledWith("edited");
      rerender(
        <StrictMode>
          <Control value="initial" onChange={onChange} />
        </StrictMode>,
      );
      expect(input().value).toBe("edited");
      rerender(
        <StrictMode>
          <Control value="external" onChange={onChange} />
        </StrictMode>,
      );
      expect(input().value).toBe("external");
      rerender(
        <StrictMode>
          <Control value={undefined} onChange={onChange} />
        </StrictMode>,
      );
      expect(input().value).toBe("");
      expect(onChange).toHaveBeenCalledTimes(1);
    },
  );

  it("accepts a literal value without an onChange handler", () => {
    render(<Input value="initial" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "edited" } });
    expect(input.value).toBe("edited");
  });

  it("synchronizes a parent variable and transformed external values", () => {
    function Demo() {
      const [value, setValue] = useState("start");
      return (
        <>
          <Input value={value} onChange={(next) => setValue(next.toUpperCase())} />
          <output>{value}</output>
        </>
      );
    }
    render(<Demo />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "next" } });
    expect(input.value).toBe("NEXT");
    expect(screen.getByRole("status").textContent).toBe("NEXT");
  });

  it("clears an InputNumber editing buffer when its external value changes", () => {
    const { rerender } = render(<InputNumber value={0} />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("0");
    fireEvent.change(input, { target: { value: "12" } });
    expect(input.value).toBe("12");
    rerender(<InputNumber value={7} />);
    expect(input.value).toBe("7");
    rerender(<InputNumber value={undefined} />);
    expect(input.value).toBe("");
  });

  it("accumulates checkbox selections without mutating the source array", () => {
    const source = ["one"];
    const options = [
      { label: "One", value: "one" },
      { label: "Two", value: "two" },
    ];
    const onChange = vi.fn();
    const { rerender } = render(
      <CheckboxGroup value={source} options={options} onChange={onChange} />,
    );
    fireEvent.click(screen.getByLabelText("Two"));
    expect(onChange).toHaveBeenLastCalledWith(["one", "two"]);
    fireEvent.click(screen.getByLabelText("One"));
    expect(onChange).toHaveBeenLastCalledWith(["two"]);
    expect(source).toEqual(["one"]);
    rerender(<CheckboxGroup value={[]} options={options} onChange={onChange} />);
    expect((screen.getByLabelText("Two") as HTMLInputElement).checked).toBe(false);
  });

  it("updates RadioGroup and CheckCardGroup selections from literal values", () => {
    const { container } = render(
      <>
        <RadioGroup
          value="one"
          options={[
            { label: "One", value: "one" },
            { label: "Two", value: "two" },
          ]}
        />
        <CheckCardGroup
          value="a"
          options={[
            { title: "Card A", value: "a" },
            { title: "Card B", value: "b" },
          ]}
        />
      </>,
    );
    fireEvent.click(screen.getByLabelText("Two"));
    expect((screen.getByLabelText("Two") as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByText("Card B"));
    expect(container.querySelector(".k-check-card.is-checked")?.textContent).toContain("Card B");
  });

  it("updates Segmented and follows external value changes", () => {
    const options = [
      { label: "One", value: 1 },
      { label: "Two", value: 2 },
    ];
    const { container, rerender } = render(<Segmented value={1} options={options} />);
    fireEvent.click(screen.getByText("Two"));
    expect(container.querySelector(".k-segmented-item-active")?.textContent).toBe("Two");
    rerender(<Segmented value={undefined} options={options} />);
    expect(container.querySelector(".k-segmented-item-active")).toBeNull();
  });

  it("updates Select locally and synchronizes a changed array value", () => {
    const options = [
      { label: "One", value: "one" },
      { label: "Two", value: "two" },
    ];
    const source = ["one"];
    const { container, rerender } = render(
      <Select multiple value={source} options={options} defaultOpen />,
    );
    fireEvent.click(document.querySelectorAll(".k-select-item")[1]);
    expect(container.querySelectorAll(".k-select-labels .k-tag")).toHaveLength(2);
    expect(source).toEqual(["one"]);
    rerender(<Select multiple value={[]} options={options} defaultOpen />);
    expect(container.querySelectorAll(".k-select-labels .k-tag")).toHaveLength(0);
  });

  it("keeps InputTag local edits and clears them with an external empty array", () => {
    const source = ["One"];
    const { container, rerender } = render(<InputTag value={source} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Two" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(container.querySelectorAll(".k-tag")).toHaveLength(2);
    expect(source).toEqual(["One"]);
    rerender(<InputTag value={[]} />);
    expect(container.querySelectorAll(".k-tag")).toHaveLength(0);
  });

  it("updates OTP digits and synchronizes an external reset", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<InputOTP value="12" length={4} onChange={onChange} />);
    const inputs = () => Array.from(container.querySelectorAll("input"));
    fireEvent.change(inputs()[2], { target: { value: "3" } });
    expect(
      inputs()
        .map((input) => input.value)
        .join(""),
    ).toBe("123");
    expect(onChange).toHaveBeenLastCalledWith("123");
    rerender(<InputOTP value="" length={4} onChange={onChange} />);
    expect(
      inputs()
        .map((input) => input.value)
        .join(""),
    ).toBe("");
  });

  it("updates Calendar selections and synchronizes an external month", () => {
    const { container, rerender } = render(<Calendar value="2026-08-01" />);
    fireEvent.click(container.querySelector('[data-date="2026-08-02"]')!);
    expect(container.querySelector('[aria-selected="true"]')?.getAttribute("data-date")).toBe(
      "2026-08-02",
    );
    rerender(<Calendar value="2026-09-03" />);
    expect(container.querySelector('[aria-selected="true"]')?.getAttribute("data-date")).toBe(
      "2026-09-03",
    );
  });

  it("updates Slider with a fixed value and synchronizes an external reset", () => {
    const { rerender } = render(<Slider value={0} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("1");
    rerender(<Slider value={20} />);
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("20");
  });

  it("advances and loops Carousel locally and follows external navigation", () => {
    const ref = createRef<CarouselRef>();
    const slides = [
      <CarouselItem key="one">One</CarouselItem>,
      <CarouselItem key="two">Two</CarouselItem>,
    ];
    const { container, rerender } = render(
      <Carousel ref={ref} value={0}>
        {slides}
      </Carousel>,
    );
    const dots = () => container.querySelectorAll(".k-carousel-dots > button");
    act(() => ref.current!.next());
    expect(dots()[1].classList.contains("k-carousel-dots-active")).toBe(true);
    fireEvent.transitionEnd(container.querySelector(".k-carousel-wrapper")!, {
      propertyName: "transform",
    });
    act(() => ref.current!.next());
    expect(dots()[0].classList.contains("k-carousel-dots-active")).toBe(true);
    rerender(
      <Carousel ref={ref} value={1}>
        {slides}
      </Carousel>,
    );
    expect(dots()[1].classList.contains("k-carousel-dots-active")).toBe(true);
  });

  it("retains Typography edits and synchronizes later value changes", () => {
    const { rerender } = render(<TypographyParagraph value="Before" editable />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "After" } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(screen.getByText("After")).not.toBeNull();
    rerender(<TypographyParagraph value="External" editable />);
    expect(screen.getByText("External")).not.toBeNull();
  });

  it("synchronizes ColorPicker colors without requiring a listener", () => {
    const { container, rerender } = render(
      <ColorPicker value="#ff0000" defaultOpen presets={["#00ff00"]} />,
    );
    const color = () =>
      (container.querySelector(".k-color-picker-color-inner") as HTMLElement).style.backgroundColor;
    expect(color()).toBe("rgb(255, 0, 0)");
    fireEvent.click(document.querySelector(".k-color-picker-presets > span")!);
    expect(color()).toBe("rgb(0, 255, 0)");
    rerender(<ColorPicker value="#0000ff" />);
    expect(color()).toBe("rgb(0, 0, 255)");
  });

  it("changes a Rate initialized with value and follows external updates", () => {
    const { container, rerender } = render(<Rate value={1} />);
    fireEvent.click(container.querySelectorAll(".k-star")[2]);
    expect(container.querySelectorAll(".k-star-full")).toHaveLength(3);
    rerender(<Rate value={0} />);
    expect(container.querySelectorAll(".k-star-full")).toHaveLength(0);
  });

  it("selects Cascader paths from an initial value and synchronizes an external clear", () => {
    const options = [
      { label: "One", value: "one" },
      { label: "Two", value: "two" },
    ];
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Cascader value={["one"]} options={options} defaultOpen onChange={onChange} />,
    );
    fireEvent.click(document.querySelectorAll(".k-cascader-dropdown-item")[1]);
    expect(onChange).toHaveBeenLastCalledWith(["two"]);
    expect(container.querySelector(".k-cascader-label")?.textContent).toContain("Two");
    rerender(<Cascader value={[]} options={options} onChange={onChange} />);
    expect(container.querySelector(".k-cascader-label")).toBeNull();
  });

  it("updates Menu value selections without mutating the input array", () => {
    const source = ["one"];
    const onChange = vi.fn();
    render(
      <Menu
        value={source}
        items={[
          { key: "one", title: "One" },
          { key: "two", title: "Two" },
        ]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("Two"));
    expect(onChange).toHaveBeenLastCalledWith(["two"]);
    expect(source).toEqual(["one"]);
    expect(screen.getByText("Two").closest("li")?.className).toContain("selected");
  });

  it("keeps disabled Rate values fixed", () => {
    const onChange = vi.fn();
    const { container } = render(<Rate value={2} disabled onChange={onChange} />);
    fireEvent.click(container.querySelector(".k-star")!);
    expect(onChange).not.toHaveBeenCalled();
  });
});
