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
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const close = (key: string, callback?: () => void) => {
    const timer = timersRef.current.get(key);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(key);
    setItems((current) => current.filter((item) => item.key !== key));
    callback?.();
  };
  const clean = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
    setItems([]);
  };
  useImperativeHandle(ref, () => ({
    show(options) {
      const key = `k-${type}-${Date.now()}-${count++}`;
      const callback = () => close(key, options.onClose);
      const item = { ...options, noticeType: type, key, onClose: callback };
      setItems((current) => [...current, item]);
      const duration = options.duration ?? 3.5;
      if (duration > 0) timersRef.current.set(key, setTimeout(callback, duration * 1000));
      return callback;
    },
    clean,
  }));
  useEffect(() => clean, []);
  return (
    <div className={`k-${type}`}>
      {items.map((item) => (
        <div key={item.key} className={`k-${type}-slide-enter-active`}>
          <Content {...item} />
        </div>
      ))}
    </div>
  );
});
export default Container;
