import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "kui-icons";
import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import Icon from "../icon";
import { CarouselContext } from "./carousel-context";

export interface CarouselRef {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number;
  defaultValue?: number;
  modelValue?: number;
  loop?: boolean;
  autoplay?: boolean;
  delay?: number;
  height?: number;
  vertical?: boolean;
  dots?: boolean;
  onChange?: (index: number) => void;
}

const Carousel = forwardRef<CarouselRef, CarouselProps>(function Carousel(
  {
    value,
    defaultValue,
    modelValue,
    loop = true,
    autoplay = false,
    delay = 3000,
    height = 256,
    vertical = false,
    dots = true,
    onChange,
    className,
    style,
    children,
    ...rest
  },
  ref
) {
  const items = Children.toArray(children);
  const controlled = value ?? modelValue;
  const [innerIndex, setInnerIndex] = useState(controlled ?? defaultValue ?? 0);
  const [width, setWidth] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const current = Math.max(0, Math.min(items.length - 1, controlled ?? innerIndex));

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const update = () => setWidth(element.offsetWidth);
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    if (!items.length) return;
    const next = loop
      ? ((index % items.length) + items.length) % items.length
      : Math.max(0, Math.min(items.length - 1, index));
    if (controlled === undefined) setInnerIndex(next);
    onChange?.(next);
  }, [controlled, items.length, loop, onChange]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);
  const play = useCallback(() => {
    stop();
    if (autoplay && items.length > 1)
      timerRef.current = setInterval(() => goTo(current + 1), delay);
  }, [autoplay, current, delay, goTo, items.length, stop]);

  useEffect(() => {
    play();
    return stop;
  }, [play, stop]);

  useImperativeHandle(ref, () => ({
    next: () => goTo(current + 1),
    prev: () => goTo(current - 1),
    goTo,
  }));

  if (!items.length) return null;
  const wrapperStyle: CSSProperties = {
    transform: vertical
      ? `translate3d(0, -${current * height}px, 0)`
      : `translate3d(-${current * width}px, 0, 0)`,
    width: vertical ? undefined : items.length * width,
    height: vertical ? items.length * height : height,
  };

  return (
    <CarouselContext.Provider value={{ width, height, vertical }}>
      <div
        {...rest}
        ref={rootRef}
        className={clsx("k-carousel", { "k-carousel-vertical": vertical }, className)}
        style={{ ...style, height }}
        onMouseEnter={stop}
        onMouseLeave={play}
      >
        <div className="k-carousel-wrapper" style={wrapperStyle}>
          {items}
        </div>
        {!vertical && items.length > 1 && (
          <>
            <span className="k-carousel-arrow-left" onClick={() => goTo(current - 1)}>
              <Icon type={ArrowLeft} />
            </span>
            <span className="k-carousel-arrow-right" onClick={() => goTo(current + 1)}>
              <Icon type={ArrowRight} />
            </span>
          </>
        )}
        {dots && (
          <ul className="k-carousel-dots">
            {items.map((_, index) => (
              <li
                key={index}
                className={current === index ? "k-carousel-dots-active" : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </ul>
        )}
      </div>
    </CarouselContext.Provider>
  );
});

export default Carousel;
