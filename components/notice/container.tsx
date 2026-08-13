import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Content, { type ContentProps } from "./content";

interface NoticeItem extends ContentProps {
  key: string;
}
export interface NoticeContainerApi {
  show: (options: ContentProps) => () => void;
  clean: () => void;
}
let count = 0;

const Container = forwardRef<NoticeContainerApi, { type: "message" | "notice" }>(function Container(
  { type },
  ref
) {
  const [items, setItems] = useState<NoticeItem[]>([]);
  const itemsRef = useRef<NoticeItem[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const updateItems = (next: NoticeItem[]) => {
    itemsRef.current = next;
    setItems(next);
  };
  const close = (key: string, callback?: () => void) => {
    const timer = timersRef.current.get(key);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(key);
    updateItems(itemsRef.current.filter((item) => item.key !== key));
    callback?.();
  };
  const clean = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
    updateItems([]);
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
    },
    []
  );
  return (
    <div className={`k-${type}`}>
      {items.map(({ key, ...item }) => (
        <div key={key} className={`k-${type}-slide-enter-active`}>
          <Content {...item} />
        </div>
      ))}
    </div>
  );
});
export default Container;
