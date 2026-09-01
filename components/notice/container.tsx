import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Transition from "../base/transition";
import Content, { type ContentProps } from "./content";

interface NoticeItem extends ContentProps {
  key: string;
  closing?: boolean;
  afterClose?: () => void;
}
export interface NoticeContainerApi {
  show: (options: ContentProps) => () => void;
  clean: (afterClean?: () => void) => void;
}
let count = 0;

const Container = forwardRef<NoticeContainerApi, { type: "message" | "notice" }>(function Container(
  { type },
  ref,
) {
  const [items, setItems] = useState<NoticeItem[]>([]);
  const itemsRef = useRef<NoticeItem[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const afterCleanRef = useRef<(() => void) | null>(null);
  const updateItems = (next: NoticeItem[]) => {
    itemsRef.current = next;
    setItems(next);
  };
  const close = (key: string, callback?: () => void) => {
    const timer = timersRef.current.get(key);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(key);
    const item = itemsRef.current.find((current) => current.key === key);
    if (!item || item.closing) return;
    updateItems(
      itemsRef.current.map((current) =>
        current.key === key ? { ...current, closing: true, afterClose: callback } : current,
      ),
    );
  };
  const finishClose = (key: string) => {
    const item = itemsRef.current.find((current) => current.key === key);
    if (!item?.closing) return;
    const next = itemsRef.current.filter((current) => current.key !== key);
    updateItems(next);
    item.afterClose?.();
    if (next.length === 0 && afterCleanRef.current) {
      const afterClean = afterCleanRef.current;
      afterCleanRef.current = null;
      afterClean();
    }
  };
  const clean = (afterClean?: () => void) => {
    if (afterClean) afterCleanRef.current = afterClean;
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
    if (itemsRef.current.length === 0) {
      const callback = afterCleanRef.current;
      afterCleanRef.current = null;
      callback?.();
      return;
    }
    itemsRef.current.forEach((item) => item.onClose?.());
  };
  useImperativeHandle(ref, () => ({
    show(options) {
      const existing = options.grouping
        ? itemsRef.current.find((item) => item.grouping === options.grouping)
        : undefined;
      if (existing) {
        const callback = existing.onClose ?? (() => undefined);
        const updated = {
          ...existing,
          ...options,
          key: existing.key,
          onClose: callback,
          noticeType: type,
        };
        updateItems(itemsRef.current.map((item) => (item.key === existing.key ? updated : item)));
        const timer = timersRef.current.get(existing.key);
        if (timer) clearTimeout(timer);
        const duration = options.duration ?? 3.5;
        if (duration > 0) {
          timersRef.current.set(existing.key, setTimeout(callback, duration * 1000));
        } else {
          timersRef.current.delete(existing.key);
        }
        return callback;
      }
      const key = `k-${type}-${Date.now()}-${count++}`;
      const callback = () => close(key, options.onClose);
      const item = { ...options, noticeType: type, key, onClose: callback };
      updateItems([...itemsRef.current, item]);
      const duration = options.duration ?? 3.5;
      if (duration > 0) timersRef.current.set(key, setTimeout(callback, duration * 1000));
      return callback;
    },
    clean,
  }));
  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
      afterCleanRef.current = null;
    },
    [],
  );
  return (
    <div className={`k-${type}`}>
      {items.map(({ key, closing, ...item }) => (
        <Transition
          key={key}
          show={!closing}
          name={`k-${type}-slide`}
          appear
          timeout={300}
          onAfterLeave={() => finishClose(key)}
        >
          <div>
            <Content {...item} />
          </div>
        </Transition>
      ))}
    </div>
  );
});
export default Container;
