import clsx from "clsx";
import { useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from "react";

export interface LoadingProps {
  height?: number | string;
}

export interface LoadingHandle {
  start: () => void;
  finish: () => void;
  error: () => void;
  update: (percent: number) => void;
}

export default function LoadingBar({
  ref,
  height = 2,
}: LoadingProps & { ref?: React.Ref<LoadingHandle> }) {
  const [visible, setVisible] = useState(false);
  const [percent, setPercent] = useState(0);
  const [isError, setIsError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
  };

  useImperativeHandle(ref, () => ({
    start() {
      clearTimers();
      setPercent(0);
      setIsError(false);
      setVisible(true);
      intervalRef.current = setInterval(() => {
        setPercent((current) => {
          const step = current < 80 ? Math.random() * 5 + 2 : Math.random();
          const next = Math.min(current + step, 95);
          if (next >= 95 && intervalRef.current) clearInterval(intervalRef.current);
          return next;
        });
      }, 200);
    },
    finish() {
      clearTimers();
      setPercent(100);
      timeoutRef.current = setTimeout(() => setVisible(false), 500);
    },
    error() {
      clearTimers();
      setIsError(true);
      setPercent(100);
      setVisible(true);
      timeoutRef.current = setTimeout(() => setVisible(false), 500);
    },
    update(value) {
      setIsError(false);
      setVisible(true);
      setPercent(Math.max(0, Math.min(100, value)));
    },
  }));

  useEffect(() => clearTimers, []);
  if (!visible) return null;
  const lineStyle: CSSProperties = { width: `${percent}%`, height };
  return (
    <div className="k-loading-container" style={{ height }}>
      <div
        className={clsx("k-loading-line", { "k-loading-line-error": isError })}
        style={lineStyle}
      />
    </div>
  );
}
