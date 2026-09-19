import { createContext } from "react";

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
