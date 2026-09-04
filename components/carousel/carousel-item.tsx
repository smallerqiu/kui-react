import clsx from "clsx";
import { useContext, type HTMLAttributes } from "react";
import { CarouselContext } from "./carousel-context";

export type CarouselItemProps = HTMLAttributes<HTMLDivElement>;

export default function CarouselItem({ className, style, children, ...rest }: CarouselItemProps) {
  const { width, height, vertical } = useContext(CarouselContext);
  return (
    <div
      {...rest}
      className={clsx("k-carousel-item", className)}
      style={{ ...style, width: vertical ? undefined : width || undefined, height }}
    >
      {children}
    </div>
  );
}
