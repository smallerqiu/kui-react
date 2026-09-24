import { useValue } from "../utils/use-value";
import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "kui-icons";
import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import Icon from "../icon";
import { CarouselContext } from "./carousel-context";
import { bindCarouselDrag, readCarouselOffset, retargetCarousel } from "./drag";

export interface CarouselRef {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

export interface CarouselProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "defaultChecked"
> {
  value?: number;
  loop?: boolean;
  autoplay?: boolean;
  delay?: number;
  height?: number;
  vertical?: boolean;
  dots?: boolean;
  swipeable?: boolean;
  draggable?: boolean;
  onChange?: (index: number) => void;
}

function flattenItems(children: ReactNode, parents: string[] = []): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [child];
    const keys = [...parents, String(child.key)];
    if (child.type === Fragment) return flattenItems(child.props.children, keys);
    return [cloneElement(child, { key: JSON.stringify(keys) })];
  });
}

const Carousel = forwardRef<CarouselRef, CarouselProps>(function Carousel(
  {
    value,
    loop = true,
    autoplay = false,
    delay = 3000,
    height = 256,
    vertical = false,
    dots = true,
    swipeable = true,
    draggable = true,
    onChange,
    onMouseEnter,
    onMouseLeave,
    onPointerEnter,
    onPointerLeave,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const items = flattenItems(children);
  const [innerIndex, setInnerIndex] = useValue(value, (next) => next ?? 0);
  const looping = loop && items.length > 1;
  const initialIndex = Math.max(0, Math.min(items.length - 1, value ?? 0));
  const [position, setPosition] = useState(looping ? initialIndex + 1 : initialIndex);
  const [animate, setAnimate] = useState(false);
  const [reportedIndex, setReportedIndex] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [settleDuration, setSettleDuration] = useState<number | null>(null);
  const draggingRef = useRef(false);
  const hoveredRef = useRef(false);
  const dragCallbacks = useRef<Parameters<typeof bindCarouselDrag>[1] | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitioningRef = useRef(false);
  const hasItems = items.length > 0;
  const current = Math.max(0, Math.min(items.length - 1, innerIndex));
  const navigationIndex = useRef(current);
  useLayoutEffect(() => {
    navigationIndex.current = current;
  }, [current]);

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    let measuredWidth = -1;
    const update = () => {
      const next = element.offsetWidth;
      if (next === measuredWidth) return;
      measuredWidth = next;
      setAnimate(false);
      setWidth(next);
    };
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [hasItems]);

  useLayoutEffect(() => {
    if (!width) return;
    // Commit the measured starting position with transitions disabled before
    // enabling animation. A DOM commit alone does not flush browser styles.
    rootRef.current?.querySelector(".k-carousel-wrapper")?.getBoundingClientRect();
    setAnimate(true);
  }, [width, hasItems]);

  const [positionRevision, setPositionRevision] = useState(0);
  useLayoutEffect(() => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = null;
    transitioningRef.current = false;
    setSettleDuration(null);
  }, [positionRevision]);

  const [syncedPosition, setSyncedPosition] = useState({ value, count: items.length, looping });
  if (
    syncedPosition.value !== value ||
    syncedPosition.count !== items.length ||
    syncedPosition.looping !== looping
  ) {
    setSyncedPosition({ value, count: items.length, looping });
    const next = Math.max(0, Math.min(items.length - 1, innerIndex));
    if (next !== innerIndex) setInnerIndex(next);
    if (
      value !== reportedIndex ||
      syncedPosition.count !== items.length ||
      syncedPosition.looping !== looping
    ) {
      setPosition(looping ? next + 1 : next);
      // Invalidate pending navigation only for a new position, not a parent echo.
      setPositionRevision((revision) => revision + 1);
    }
    setReportedIndex(null);
  }

  const goTo = useCallback(
    (index: number) => {
      setSettleDuration(null);
      if (!items.length) return;
      const next = loop
        ? ((index % items.length) + items.length) % items.length
        : Math.max(0, Math.min(items.length - 1, index));
      if (next === navigationIndex.current) return;
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
      transitioningRef.current = false;
      navigationIndex.current = next;
      setInnerIndex(next);
      setReportedIndex(next);
      setPosition(looping ? next + 1 : next);
      onChange?.(next);
    },
    [items.length, loop, looping, onChange, setInnerIndex],
  );

  const move = useCallback(
    (step: -1 | 1) => {
      if (!items.length || draggingRef.current) return;
      const from = navigationIndex.current;
      const next = loop
        ? (from + step + items.length) % items.length
        : Math.max(0, Math.min(items.length - 1, from + step));
      if (next === from) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        return;
      }
      const interrupted = transitioningRef.current;
      const target =
        interrupted && looping && rootRef.current
          ? retargetCarousel(
              rootRef.current,
              vertical,
              vertical ? height : width,
              items.length,
              next,
              step,
            )
          : null;
      if (interrupted) setSettleDuration(280);
      setAnimate(true);
      transitioningRef.current = true;
      navigationIndex.current = next;
      setInnerIndex(next);
      setReportedIndex(next);
      setPosition((previous) => target ?? (looping ? previous + step : next));
      onChange?.(next);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        transitioningRef.current = false;
        transitionTimerRef.current = null;
        if (looping) {
          setAnimate(false);
          setPosition(next + 1);
          requestAnimationFrame(() => setAnimate(true));
        }
      }, 501);
    },
    [items.length, loop, looping, onChange, setInnerIndex, vertical, height, width],
  );

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);
  const play = useCallback(() => {
    stop();
    if (autoplay && items.length > 1 && !draggingRef.current && !hoveredRef.current)
      timerRef.current = setInterval(() => move(1), delay);
  }, [autoplay, delay, items.length, move, stop]);

  useEffect(() => {
    play();
    return stop;
  }, [play, stop]);

  useLayoutEffect(() => {
    dragCallbacks.current = {
      options: () => ({
        swipeable,
        draggable,
        vertical,
        size: vertical ? height : width,
        count: items.length,
        index: current,
        loop,
      }),
      start: () => {
        const offset = rootRef.current
          ? readCarouselOffset(rootRef.current, vertical, position, vertical ? height : width)
          : 0;
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
        transitioningRef.current = false;
        setPosition(looping ? current + 1 : current);
        setSettleDuration(null);
        draggingRef.current = true;
        setIsDragging(true);
        stop();
        return offset;
      },
      offset: setDragOffset,
      settle: setSettleDuration,
      finish: (step) => {
        draggingRef.current = false;
        setIsDragging(false);
        setAnimate(true);
        if (step) move(step);
        play();
      },
    };
  }, [
    swipeable,
    draggable,
    vertical,
    height,
    width,
    items.length,
    current,
    position,
    looping,
    loop,
    stop,
    move,
    play,
  ]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const dispose = bindCarouselDrag(root, {
      options: () => dragCallbacks.current!.options(),
      start: () => dragCallbacks.current!.start(),
      offset: (offset) => dragCallbacks.current!.offset(offset),
      settle: (duration) => dragCallbacks.current!.settle?.(duration),
      finish: (step) => dragCallbacks.current!.finish(step),
    });
    return () => {
      dispose();
      draggingRef.current = false;
    };
  }, [hasItems]);

  useEffect(
    () => () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    },
    [],
  );

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
    position: "relative",
    transform: vertical
      ? `translate3d(0, ${-position * height + dragOffset}px, 0)`
      : `translate3d(${-position * width + dragOffset}px, 0, 0)`,
    width: vertical ? undefined : trackItems.length * width,
    height: vertical ? trackItems.length * height : height,
    transitionDuration:
      animate && !isDragging ? (settleDuration === null ? undefined : `${settleDuration}ms`) : "0s",
    transitionTimingFunction:
      settleDuration === null ? undefined : "cubic-bezier(0.22, 1, 0.36, 1)",
    touchAction: swipeable && items.length > 1 ? (vertical ? "pan-x" : "pan-y") : undefined,
    userSelect: isDragging ? "none" : undefined,
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (draggingRef.current) return;
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    setSettleDuration(null);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = null;
    transitioningRef.current = false;
    if (!looping || position === current + 1) return;
    setAnimate(false);
    setPosition(current + 1);
    requestAnimationFrame(() => setAnimate(true));
  };

  return (
    <CarouselContext.Provider value={{ width, height, vertical }}>
      <div
        {...rest}
        ref={rootRef}
        className={clsx("k-carousel", { "k-carousel-vertical": vertical }, className)}
        style={{ ...style, height }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            hoveredRef.current = true;
            stop();
          }
          onPointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            hoveredRef.current = false;
            play();
          }
          onPointerLeave?.(event);
        }}
      >
        <div
          className="k-carousel-wrapper"
          style={wrapperStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {trackItems}
          {looping &&
            [-1, 1].map((side) => (
              <div
                key={side}
                aria-hidden="true"
                inert
                style={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: vertical ? "column" : "row",
                  left: vertical ? 0 : (side < 0 ? -items.length : items.length + 2) * width,
                  top: vertical ? (side < 0 ? -items.length : items.length + 2) * height : 0,
                  width: vertical ? "100%" : items.length * width,
                  pointerEvents: "none",
                }}
              >
                {items.map((_, i) => (
                  <Fragment key={i}>
                    {items[(i + (side < 0 ? items.length - 1 : 1)) % items.length]}
                  </Fragment>
                ))}
              </div>
            ))}
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
