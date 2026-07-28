import clsx from "clsx";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

export interface AnchorContextValue {
  activeLink: string;
  registerLink: (link: string) => void;
  unregisterLink: (link: string) => void;
  scrollTo: (link: string) => void;
}

export const AnchorContext = createContext<AnchorContextValue | null>(null);

export interface AnchorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onClick"> {
  affix?: boolean;
  offsetTop?: number;
  bounds?: number;
  container?: string | HTMLElement | Window;
  onChange?: (activeLink: string) => void;
  onClick?: (link: string) => void;
}

export default function Anchor({
  affix = true,
  offsetTop = 0,
  bounds = 5,
  container,
  onChange,
  onClick,
  className,
  children,
  ...rest
}: AnchorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef(new Set<string>());
  const clickScrollingRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeLink, setActiveLink] = useState("");
  const [inkStyle, setInkStyle] = useState<CSSProperties>({ opacity: 0 });

  const getContainer = useCallback((): HTMLElement | Window => {
    if (typeof window === "undefined" || !container) return window;
    if (typeof container === "string")
      return document.querySelector<HTMLElement>(container) ?? window;
    return container;
  }, [container]);

  const updateInk = useCallback(() => {
    const node = wrapperRef.current?.querySelector<HTMLElement>(
      ".k-anchor-link-active > .k-anchor-link-title"
    );
    setInkStyle(
      node
        ? { top: node.parentElement!.offsetTop + 4, height: node.clientHeight, opacity: 1 }
        : { top: 0, height: 0, opacity: 0 }
    );
  }, []);

  useEffect(updateInk, [activeLink, updateInk]);

  const updateActive = useCallback(() => {
    if (clickScrollingRef.current || typeof window === "undefined") return;
    const scrollContainer = getContainer();
    const containerTop =
      scrollContainer === window ? 0 : (scrollContainer as HTMLElement).getBoundingClientRect().top;
    const targets = [...linksRef.current]
      .map((link) => {
        const element = document.querySelector<HTMLElement>(link);
        return element ? { link, top: element.getBoundingClientRect().top - containerTop } : null;
      })
      .filter((item): item is { link: string; top: number } => item !== null)
      .sort((a, b) => a.top - b.top);
    let next = targets[0]?.link ?? "";
    for (const target of targets) {
      if (target.top <= offsetTop + bounds) next = target.link;
      else break;
    }
    setActiveLink((previous) => {
      if (next && next !== previous) onChange?.(next);
      return next || previous;
    });
  }, [bounds, getContainer, offsetTop, onChange]);

  useEffect(() => {
    const scrollContainer = getContainer();
    scrollContainer.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => {
      scrollContainer.removeEventListener("scroll", updateActive);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, [getContainer, updateActive]);

  const scrollTo = useCallback(
    (link: string) => {
      const target = document.querySelector<HTMLElement>(link);
      if (!target) return;
      clickScrollingRef.current = true;
      setActiveLink(link);
      onClick?.(link);
      const scrollContainer = getContainer();
      if (scrollContainer === window) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offsetTop,
          behavior: "smooth",
        });
      } else {
        const element = scrollContainer as HTMLElement;
        element.scrollTo({
          top:
            target.getBoundingClientRect().top -
            element.getBoundingClientRect().top +
            element.scrollTop -
            offsetTop,
          behavior: "smooth",
        });
      }
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = setTimeout(() => {
        clickScrollingRef.current = false;
        updateInk();
      }, 600);
    },
    [getContainer, offsetTop, onClick, updateInk]
  );

  const context = useMemo<AnchorContextValue>(
    () => ({
      activeLink,
      registerLink: (link) => linksRef.current.add(link),
      unregisterLink: (link) => linksRef.current.delete(link),
      scrollTo,
    }),
    [activeLink, scrollTo]
  );

  return (
    <AnchorContext.Provider value={context}>
      <div
        {...rest}
        ref={wrapperRef}
        className={clsx("k-anchor-wrapper", { "k-anchor-affix": affix }, className)}
      >
        <div className="k-anchor">
          <span className="k-anchor-ink-ball" style={inkStyle} />
          {children}
        </div>
      </div>
    </AnchorContext.Provider>
  );
}
