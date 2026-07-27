import { useCallback, useRef } from "react";
import { Button, Affix } from "react-kui";
export default function Container() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useCallback(() => ref.current, []);
  return (
    <div
      ref={ref}
      style={{
        height: 300,
        overflowY: "auto",
        background: "repeating-linear-gradient(45deg,#ddd 0 20px,#f5f5f5 20px 40px)",
      }}
    >
      <div style={{ height: 800, paddingTop: 50 }}>
        <Affix target={target} offsetTop={50}>
          <Button type="primary">Affix at container top</Button>
        </Affix>
        <div style={{ height: 500 }} />
        <Affix target={target} offsetBottom={50}>
          <Button type="primary">Affix at container bottom</Button>
        </Affix>
      </div>
    </div>
  );
}
