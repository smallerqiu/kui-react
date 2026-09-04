import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "kui-icons";
import {
  Children,
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
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
    loop = true,
    autoplay = false,
    delay = 3000,
    height = 256,
    vertical = false,
    dots = true,
    onChange,
    onMouseEnter,
    onMouseLeave,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const items = Children.toArray(children);
  const controlled = value;
  const [innerIndex, setInnerIndex] = useState(controlled ?? defaultValue ?? 0);
  const looping = loop && items.length > 1;
  const initialIndex = Math.max(0, Math.min(items.length - 1, controlled ?? defaultValue ?? 0));
  const [position, setPosition] = useState(looping ? initialIndex + 1 : initialIndex);
  const [animate, setAnimate] = useState(false);
  const [width, setWidth] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const current = Math.max(0, Math.min(items.length - 1, controlled ?? innerIndex));

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const update = () => setWidth(element.offsetWidth);
    update();
    setAnimate(true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const next = Math.max(0, Math.min(items.length - 1, controlled ?? innerIndex));
    if (controlled === undefined) {
      if (next !== innerIndex) setInnerIndex(next);
      if (innerIndex >= items.length) setPosition(looping ? next + 1 : next);
      return;
    }
    setPosition(looping ? next + 1 : next);
  }, [controlled, innerIndex, items.length, looping]);

  const goTo = useCallback(
    (index: number) => {
      if (!items.length) return;
      const next = loop
        ? ((index % items.length) + items.length) % items.length
        : Math.max(0, Math.min(items.length - 1, index));
      if (next === current) return;
      if (controlled === undefined) {
        setInnerIndex(next);
        setPosition(looping ? next + 1 : next);
      }
      onChange?.(next);
    },
    [controlled, current, items.length, loop, looping, onChange],
  );

  const move = useCallback(
    (step: -1 | 1) => {
      if (!items.length) return;
      const next = loop
        ? (current + step + items.length) % items.length
        : Math.max(0, Math.min(items.length - 1, current + step));
      if (next === current) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        return;
      }
      if (controlled === undefined) {
        setInnerIndex(next);
        setPosition((previous) => (looping ? previous + step : next));
      }
      onChange?.(next);
    },
    [controlled, current, items.length, loop, looping, onChange],
  );

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);
  const play = useCallback(() => {
    stop();
    if (autoplay && items.length > 1) timerRef.current = setInterval(() => move(1), delay);
  }, [autoplay, delay, items.length, move, stop]);

  useEffect(() => {
    play();
    return stop;
  }, [play, stop]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => move(1),
      prev: () => move(-1),
      goTo,
    }),
    [goTo, move],
  );

  if (!items.length) return null;
  const trackItems = looping
    ? [
        <Fragment key="clone-last">{items[items.length - 1]}</Fragment>,
        ...items,
        <Fragment key="clone-first">{items[0]}</Fragment>,
      ]
    : items;
  const wrapperStyle: CSSProperties = {
    transform: vertical
      ? `translate3d(0, -${position * height}px, 0)`
      : `translate3d(-${position * width}px, 0, 0)`,
    width: vertical ? undefined : trackItems.length * width,
    height: vertical ? trackItems.length * height : height,
    transitionDuration: animate ? undefined : "0s",
  };

  const handleTransitionEnd = () => {
    if (!looping || (position !== 0 && position !== items.length + 1)) return;
    setAnimate(false);
    setPosition(position === 0 ? items.length : 1);
    requestAnimationFrame(() => setAnimate(true));
  };

  return (
    <CarouselContext.Provider value={{ width, height, vertical }}>
      <div
        {...rest}
        ref={rootRef}
        className={clsx("k-carousel", { "k-carousel-vertical": vertical }, className)}
        style={{ ...style, height }}
        onMouseEnter={(event) => {
          stop();
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          play();
          onMouseLeave?.(event);
        }}
      >
        <div
          className="k-carousel-wrapper"
          style={wrapperStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {trackItems}
        </div>
        {!vertical && items.length > 1 && (
          <>
            <button
              type="button"
              className="k-carousel-arrow-left"
              aria-label="Previous slide"
              disabled={!loop && current === 0}
              onClick={() => move(-1)}
            >
              <Icon type={ArrowLeft} />
            </button>
            <button
              type="button"
              className="k-carousel-arrow-right"
              aria-label="Next slide"
              disabled={!loop && current === items.length - 1}
              onClick={() => move(1)}
            >
              <Icon type={ArrowRight} />
            </button>
          </>
        )}
        {dots && items.length > 1 && (
          <div className="k-carousel-dots" role="tablist" aria-label="Slides">
            {items.map((_, index) => (
              <button
                type="button"
                key={index}
                className={current === index ? "k-carousel-dots-active" : undefined}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={current === index}
                role="tab"
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        )}
      </div>
    </CarouselContext.Provider>
  );
});

export default Carousel;
