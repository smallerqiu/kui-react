import { createContext, useContext, type HTMLAttributes } from "react";

export interface CarouselContextValue {
  width: number;
  height: number;
  vertical: boolean;
}

export const CarouselContext = createContext<CarouselContextValue>({
  width: 0,
  height: 256,
  vertical: false,
});

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {}

export default function CarouselItem({ className, style, children, ...rest }: CarouselItemProps) {
  const { width, height, vertical } = useContext(CarouselContext);
  return (
    <div
      {...rest}
      className={["k-carousel-item", className].filter(Boolean).join(" ")}
      style={{ ...style, width: vertical ? undefined : width || undefined, height }}
    >
      {children}
    </div>
  );
}
