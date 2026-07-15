// App context management for React
let __mousePoint: Point | null = null;
interface Point {
  x: number;
  y: number;
}

export const recordMousePoint = () => {
  if (typeof window !== "undefined") {
    document.addEventListener("mousedown", (e) => {
      __mousePoint = { x: e.clientX, y: e.clientY };
    });
  }
};

export const getMousePoint = () => {
  return __mousePoint || { x: 0, y: 0 };
};
